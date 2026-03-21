import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { categoriesTable, productsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import slugify from "slugify";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const categories = await db
      .select({
        id: categoriesTable.id,
        name: categoriesTable.name,
        slug: categoriesTable.slug,
        description: categoriesTable.description,
        imageUrl: categoriesTable.imageUrl,
        productCount: sql<number>`count(${productsTable.id})`,
      })
      .from(categoriesTable)
      .leftJoin(productsTable, eq(categoriesTable.id, productsTable.categoryId))
      .groupBy(categoriesTable.id)
      .orderBy(categoriesTable.name);

    res.json(
      categories.map((c) => ({
        ...c,
        productCount: Number(c.productCount),
        description: c.description ?? null,
        imageUrl: c.imageUrl ?? null,
      }))
    );
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const slug = slugify(name, { lower: true, strict: true });

    const [cat] = await db
      .insert(categoriesTable)
      .values({ name, slug, description: description ?? null, imageUrl: imageUrl ?? null })
      .returning();

    res.status(201).json({ ...cat, productCount: 0 });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
