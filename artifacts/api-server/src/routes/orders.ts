import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { ordersTable, productsTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";

const router: IRouter = Router();

function orderToResponse(order: any) {
  return {
    id: order.id,
    customerName: order.customerName,
    phone: order.phone,
    location: order.location,
    paymentMethod: order.paymentMethod,
    status: order.status,
    items: order.items,
    totalAmount: parseFloat(order.totalAmount),
    notes: order.notes ?? null,
    createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : order.createdAt,
  };
}

router.get("/", async (req, res) => {
  try {
    const orders = await db
      .select()
      .from(ordersTable)
      .orderBy(desc(ordersTable.createdAt));

    res.json(orders.map(orderToResponse));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { customerName, phone, location, paymentMethod, items, notes } = req.body;

    if (!customerName || !phone || !location || !paymentMethod || !items?.length) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const productIds = items.map((i: any) => i.productId);
    const products = await db
      .select()
      .from(productsTable)
      .where(sql`${productsTable.id} = ANY(ARRAY[${sql.join(productIds.map((id: number) => sql`${id}`), sql`, `)}]::int[])`);

    const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = productMap[item.productId];
      if (!product) {
        return res.status(400).json({ error: `Product ${item.productId} not found` });
      }
      const price = parseFloat(product.discountPrice ?? product.price);
      const subtotal = price * item.quantity;
      totalAmount += subtotal;
      orderItems.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        price,
        subtotal,
      });
    }

    const [order] = await db
      .insert(ordersTable)
      .values({
        customerName,
        phone,
        location,
        paymentMethod,
        status: "pending",
        items: orderItems,
        totalAmount: String(totalAmount),
        notes: notes ?? null,
      })
      .returning();

    res.status(201).json(orderToResponse(order));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id)).limit(1);

    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(orderToResponse(order));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    const { status } = req.body;
    const validStatuses = ["pending", "confirmed", "processing", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const [order] = await db
      .update(ordersTable)
      .set({ status })
      .where(eq(ordersTable.id, id))
      .returning();

    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(orderToResponse(order));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
