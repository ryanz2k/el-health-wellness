"use client";

import { ShieldCheck } from "lucide-react";
import styles from "./Admin.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <ShieldCheck size={28} className={styles.sidebarIcon} />
        <h2>Admin Panel</h2>
      </div>
      <nav className={styles.sidebarNav}>
        <Link 
          href="/admin" 
          className={`${styles.navLink} ${pathname === "/admin" ? styles.activeNavLink : ""}`}
        >
          Dashboard
        </Link>
        <Link 
          href="/admin/orders" 
          className={`${styles.navLink} ${pathname === "/admin/orders" ? styles.activeNavLink : ""}`}
        >
          Orders
        </Link>
        <Link 
          href="/admin/products" 
          className={`${styles.navLink} ${pathname === "/admin/products" ? styles.activeNavLink : ""}`}
        >
          Products
        </Link>
      </nav>
    </aside>
  );
}
