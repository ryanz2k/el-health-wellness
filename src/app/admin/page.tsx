import styles from "./Admin.module.css";
import { TrendingUp, Package, Users, Banknote } from "lucide-react";

// Mock Data
const MOCK_ORDERS = [
  { id: "cm02kxa", customer: "Alice Johnson", date: "2026-03-09", status: "PAID", total: 114.99 },
  { id: "cm03pzb", customer: "Mark Stevenson", date: "2026-03-08", status: "PENDING", total: 45.00 },
  { id: "cm04tlc", customer: "Sarah Miller", date: "2026-03-08", status: "PAID", total: 63.50 },
  { id: "cm05uyx", customer: "David Rossi", date: "2026-03-07", status: "PAID", total: 120.00 }
];

export default function AdminPage() {
  return (
    <div className="animate-fade-up">
      <h1 style={{ fontSize: "2rem", marginBottom: "30px", fontWeight: 700, color: "var(--text-dark)" }}>
        Business Overview
      </h1>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className="flex-between">
            <h3 className={styles.statTitle}>Total Revenue</h3>
            <Banknote size={20} color="var(--primary-color)" />
          </div>
          <p className={styles.statValue}>₱1,245.50</p>
          <span className={styles.statTrend}><TrendingUp size={14} /> +12.5% from last week</span>
        </div>
        
        <div className={styles.statCard}>
          <div className="flex-between">
            <h3 className={styles.statTitle}>Active Orders</h3>
            <Package size={20} color="var(--primary-color)" />
          </div>
          <p className={styles.statValue}>18</p>
          <span className={styles.statTrend}><TrendingUp size={14} /> +4% from last week</span>
        </div>

        <div className={styles.statCard}>
          <div className="flex-between">
            <h3 className={styles.statTitle}>Total Customers</h3>
            <Users size={20} color="var(--primary-color)" />
          </div>
          <p className={styles.statValue}>142</p>
        </div>
      </div>

      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <h3>Recent Orders</h3>
          <button className="btn btn-outline" style={{ padding: "8px 16px", fontSize: "0.9rem" }}>View All</button>
        </div>
        
        <table className={styles.ordersTable}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_ORDERS.map((order) => (
              <tr key={order.id}>
                <td style={{ fontWeight: 600, color: "var(--primary-color)" }}>#{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.date}</td>
                <td>
                  <span className={`${styles.statusBadge} ${order.status === 'PAID' ? styles['status-paid'] : styles['status-pending']}`}>
                    {order.status}
                  </span>
                </td>
                <td style={{ fontWeight: 600 }}>₱{order.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
