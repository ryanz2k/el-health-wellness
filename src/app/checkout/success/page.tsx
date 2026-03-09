"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Home, ShoppingBag } from "lucide-react";
import styles from "./Success.module.css";
import { useCartStore } from "@/store/useCartStore";

export default function CheckoutSuccessPage() {
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const userName = searchParams.get("name") || "Customer";
  const orderId = searchParams.get("orderId") || "N/A";
  const { clearCart } = useCartStore();

  useEffect(() => {
    setMounted(true);
    // Clear the cart when they land on the success page
    clearCart();
  }, [clearCart]);

  if (!mounted) return null;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconContainer}>
          <CheckCircle size={40} strokeWidth={2.5} />
        </div>
        
        <h1 className={styles.title}>Payment Successful!</h1>
        <p className={styles.message}>
          Thank you, {userName}. Your order has been placed and is being processed. 
          We&apos;ve sent a confirmation email to you.
        </p>

        {orderId !== "N/A" && (
          <div className={styles.details}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Order Number</span>
              <span className={styles.detailValue}>{orderId}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Status</span>
              <span className={styles.detailValue} style={{ color: "var(--primary)" }}>Confirmed</span>
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <Link href="/products" className="btn btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            <ShoppingBag size={18} /> Continue Shopping
          </Link>
          <Link href="/" className="btn btn-outline" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            <Home size={18} /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
