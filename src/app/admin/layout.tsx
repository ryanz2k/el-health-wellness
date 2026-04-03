import { ShieldCheck } from "lucide-react";
import styles from "./Admin.module.css";
import Link from "next/link";
import { cookies } from "next/headers";
import AdminSidebar from "./AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.has("admin_session");

  return (
    <div className={styles.adminContainer}>
      {/* Hide the site footer on admin pages */}
      <style>{`footer { display: none !important; }`}</style>
      {isAdmin && <AdminSidebar />}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
