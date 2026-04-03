import styles from "./Admin.module.css";
import { TrendingUp, Package, Users, Banknote } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Fetch real data from database
  const [orders, totalProducts, totalRevenue] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { items: { include: { product: true } } },
    }),
    prisma.product.count(),
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
  ]);

  const activeOrders = await prisma.order.count({
    where: { status: { in: ["PENDING", "PAID", "SHIPPED"] } },
  });

  const uniqueCustomers = await prisma.order.findMany({
    select: { customerEmail: true },
    distinct: ["customerEmail"],
  });

  const revenue = totalRevenue._sum.totalAmount || 0;

  return (
    <div className="animate-fade-up">
      <h1
        style={{
          fontSize: "2rem",
          marginBottom: "30px",
          fontWeight: 700,
          color: "var(--text-dark)",
        }}
      >
        Business Overview
      </h1>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className="flex-between">
            <h3 className={styles.statTitle}>Total Revenue</h3>
            <Banknote size={20} color="var(--primary-color)" />
          </div>
          <p className={styles.statValue}>₱{revenue.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</p>
        </div>

        <div className={styles.statCard}>
          <div className="flex-between">
            <h3 className={styles.statTitle}>Active Orders</h3>
            <Package size={20} color="var(--primary-color)" />
          </div>
          <p className={styles.statValue}>{activeOrders}</p>
        </div>

        <div className={styles.statCard}>
          <div className="flex-between">
            <h3 className={styles.statTitle}>Total Customers</h3>
            <Users size={20} color="var(--primary-color)" />
          </div>
          <p className={styles.statValue}>{uniqueCustomers.length}</p>
        </div>
      </div>

      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <h3>Recent Orders</h3>
          <Link
            href="/admin/orders"
            className="btn btn-outline"
            style={{ padding: "8px 16px", fontSize: "0.9rem" }}
          >
            View All
          </Link>
        </div>

        {orders.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "var(--text-muted)",
            }}
          >
            <p>No orders have been placed yet.</p>
          </div>
        ) : (
          <table className={styles.ordersTable}>
            <thead>
              <tr>
                <th>Order No.</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Shipment</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => (
                <tr key={order.id}>
                  <td
                    style={{
                      fontWeight: 600,
                      color: "var(--primary-color)",
                    }}
                  >
                    #{order.id.slice(-6).toUpperCase()}
                  </td>
                  <td>
                    {order.firstName} {order.lastName}
                    <br />
                    <small style={{ color: "var(--text-muted)" }}>
                      {order.customerEmail}
                    </small>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        order.shipmentStatus === "DELIVERED"
                          ? styles["status-paid"]
                          : styles["status-pending"]
                      }`}
                    >
                      {order.shipmentStatus}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        order.status === "PAID"
                          ? styles["status-paid"]
                          : styles["status-pending"]
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    ₱{order.totalAmount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
