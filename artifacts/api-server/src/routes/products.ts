import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { productsTable, categoriesTable } from "@workspace/db";
import { eq, ilike, and, gte, lte, or, desc, asc, sql } from "drizzle-orm";
import slugify from "slugify";

const router: IRouter = Router();

function productToResponse(product: any, categoryName?: string | null) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    shortDescription: product.shortDescription,
    price: parseFloat(product.price),
    discountPrice: product.discountPrice ? parseFloat(product.discountPrice) : null,
    categoryId: product.categoryId ?? null,
    categoryName: categoryName ?? null,
    imageUrl: product.imageUrl ?? null,
    stock: product.stock,
    inStock: product.stock > 0,
    weeklyOffer: product.weeklyOffer,
    featured: product.featured,
    specifications: product.specifications ?? null,
    deliveryInfo: product.deliveryInfo ?? "Free delivery within Nairobi CBD. Nationwide delivery via courier of your choice.",
    createdAt: product.createdAt instanceof Date ? product.createdAt.toISOString() : product.createdAt,
  };
}

router.get("/", async (req, res) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      inStock,
      weeklyOffer,
      sort,
      limit = "20",
      offset = "0",
    } = req.query as Record<string, string>;

    const conditions: any[] = [];

    if (search) {
      conditions.push(
        or(
          ilike(productsTable.name, `%${search}%`),
          ilike(productsTable.description, `%${search}%`)
        )
      );
    }

    if (category) {
      const cat = await db
        .select()
        .from(categoriesTable)
        .where(eq(categoriesTable.slug, category))
        .limit(1);
      if (cat.length > 0) {
        conditions.push(eq(productsTable.categoryId, cat[0].id));
      }
    }

    if (minPrice) {
      conditions.push(gte(productsTable.price, minPrice));
    }
    if (maxPrice) {
      conditions.push(lte(productsTable.price, maxPrice));
    }
    if (inStock === "true") {
      conditions.push(gte(productsTable.stock, 1));
    }
    if (weeklyOffer === "true") {
      conditions.push(eq(productsTable.weeklyOffer, true));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    let orderBy;
    switch (sort) {
      case "price_asc":
        orderBy = asc(productsTable.price);
        break;
      case "price_desc":
        orderBy = desc(productsTable.price);
        break;
      case "newest":
        orderBy = desc(productsTable.createdAt);
        break;
      default:
        orderBy = desc(productsTable.featured);
    }

    const [products, categories, countResult] = await Promise.all([
      db
        .select()
        .from(productsTable)
        .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
        .where(whereClause)
        .orderBy(orderBy)
        .limit(parseInt(limit))
        .offset(parseInt(offset)),
      db.select().from(categoriesTable),
      db
        .select({ count: sql<number>`count(*)` })
        .from(productsTable)
        .where(whereClause),
    ]);

    const catMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

    res.json({
      products: products.map((row) =>
        productToResponse(row.products, catMap[row.products.categoryId ?? -1] ?? null)
      ),
      total: Number(countResult[0]?.count ?? 0),
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/featured", async (req, res) => {
  try {
    const products = await db
      .select()
      .from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(or(eq(productsTable.weeklyOffer, true), eq(productsTable.featured, true)))
      .orderBy(desc(productsTable.weeklyOffer), desc(productsTable.featured))
      .limit(8);

    const catMap: Record<number, string> = {};
    for (const row of products) {
      if (row.categories) catMap[row.categories.id] = row.categories.name;
    }

    res.json(
      products.map((row) =>
        productToResponse(row.products, catMap[row.products.categoryId ?? -1] ?? null)
      )
    );
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const result = await db
      .select()
      .from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(eq(productsTable.id, id))
      .limit(1);

    if (result.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const row = result[0];
    res.json(productToResponse(row.products, row.categories?.name ?? null));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      shortDescription,
      price,
      discountPrice,
      categoryId,
      imageUrl,
      stock,
      weeklyOffer,
      featured,
      specifications,
      deliveryInfo,
    } = req.body;

    if (!name || !description || !shortDescription || price === undefined || stock === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const slug = slugify(name, { lower: true, strict: true });
    const [product] = await db
      .insert(productsTable)
      .values({
        name,
        slug,
        description,
        shortDescription,
        price: String(price),
        discountPrice: discountPrice ? String(discountPrice) : null,
        categoryId: categoryId ?? null,
        imageUrl: imageUrl ?? null,
        stock: stock ?? 0,
        weeklyOffer: weeklyOffer ?? false,
        featured: featured ?? false,
        specifications: specifications ?? null,
        deliveryInfo: deliveryInfo ?? null,
      })
      .returning();

    let catName: string | null = null;
    if (product.categoryId) {
      const cat = await db.select().from(categoriesTable).where(eq(categoriesTable.id, product.categoryId)).limit(1);
      catName = cat[0]?.name ?? null;
    }

    res.status(201).json(productToResponse(product, catName));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    const updates: any = {};
    const allowed = [
      "name", "description", "shortDescription", "price", "discountPrice",
      "categoryId", "imageUrl", "stock", "weeklyOffer", "featured",
      "specifications", "deliveryInfo",
    ];

    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        if (key === "price" || key === "discountPrice") {
          updates[key] = req.body[key] !== null ? String(req.body[key]) : null;
        } else {
          updates[key] = req.body[key];
        }
      }
    }

    if (updates.name) {
      updates.slug = slugify(updates.name, { lower: true, strict: true });
    }

    const [product] = await db.update(productsTable).set(updates).where(eq(productsTable.id, id)).returning();

    if (!product) return res.status(404).json({ error: "Product not found" });

    let catName: string | null = null;
    if (product.categoryId) {
      const cat = await db.select().from(categoriesTable).where(eq(categoriesTable.id, product.categoryId)).limit(1);
      catName = cat[0]?.name ?? null;
    }

    res.json(productToResponse(product, catName));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    await db.delete(productsTable).where(eq(productsTable.id, id));
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
