import styles from "../Admin.module.css";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="animate-fade-up">
      <h1 style={{ fontSize: "2rem", marginBottom: "30px", fontWeight: 700, color: "var(--text-dark)" }}>
        Manage Orders
      </h1>

      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <h3>All Orders</h3>
        </div>
        
        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
            <p>No orders have been placed yet.</p>
          </div>
        ) : (
          <table className={styles.ordersTable}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Items</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 600, color: "var(--primary-color)" }}>#{order.id.slice(-6).toUpperCase()}</td>
                  <td>{order.customerName}<br/><small style={{ color: "var(--text-muted)" }}>{order.customerEmail}</small></td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${order.status === 'PAID' ? styles['status-paid'] : styles['status-pending']}`}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>₱{order.totalAmount.toFixed(2)}</td>
                  <td>{order.items.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
