import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { productsTable, ordersTable } from "@workspace/db";
import { eq, sql, lt } from "drizzle-orm";

const router: IRouter = Router();

router.get("/stats", async (req, res) => {
  try {
    const [
      productsCount,
      ordersCount,
      pendingCount,
      revenueResult,
      lowStockCount,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(productsTable),
      db.select({ count: sql<number>`count(*)` }).from(ordersTable),
      db
        .select({ count: sql<number>`count(*)` })
        .from(ordersTable)
        .where(eq(ordersTable.status, "pending")),
      db
        .select({ total: sql<number>`coalesce(sum(total_amount::numeric), 0)` })
        .from(ordersTable)
        .where(sql`status != 'cancelled'`),
      db
        .select({ count: sql<number>`count(*)` })
        .from(productsTable)
        .where(lt(productsTable.stock, 5)),
    ]);

    res.json({
      totalProducts: Number(productsCount[0]?.count ?? 0),
      totalOrders: Number(ordersCount[0]?.count ?? 0),
      pendingOrders: Number(pendingCount[0]?.count ?? 0),
      totalRevenue: Number(revenueResult[0]?.total ?? 0),
      lowStockProducts: Number(lowStockCount[0]?.count ?? 0),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
