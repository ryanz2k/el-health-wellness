import { ShieldCheck } from "lucide-react";
import styles from "./Admin.module.css";
import Link from "next/link";
import { cookies } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.has("admin_session");

  return (
    <div className={styles.adminContainer}>
      {isAdmin && (
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <ShieldCheck size={28} className={styles.sidebarIcon} />
            <h2>Admin Panel</h2>
          </div>
          <nav className={styles.sidebarNav}>
            <Link href="/admin" className={styles.navLink}>Dashboard</Link>
            <Link href="/admin/orders" className={styles.navLink}>Orders</Link>
            <Link href="/admin/products" className={styles.navLink}>Products</Link>
          </nav>
        </aside>
      )}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
