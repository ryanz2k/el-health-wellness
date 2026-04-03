"use client";

import { useCartStore } from "@/store/useCartStore";
import styles from "./Cart.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, updateQuantity, removeItem, getTotals } = useCartStore();
  const { total } = getTotals();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className={`container ${styles.emptyState} animate-fade-up`}>
        <h2>Your cart is empty</h2>
        <p style={{ marginBottom: "30px", color: "var(--text-muted)" }}>
          Looks like you haven&apos;t added any health or wellness products yet.
        </p>
        <Link href="/" className="btn btn-primary">
          <ArrowLeft size={18} /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container animate-fade-up">
      <h1 className="gradient-text" style={{ fontSize: "2.5rem", marginTop: "40px" }}>
        Review Your Cart
      </h1>
      
      <div className={styles.cartContainer}>
        <div className={styles.cartItems}>
          {items.map((item) => (
            <div key={item.id} className={styles.itemCard}>
              <div className={styles.itemImage} style={{ position: "relative", overflow: "hidden" }}>
                <Image src={`/stock/${(item.id.charCodeAt(0) + item.id.charCodeAt(item.id.length - 1)) % 4 + 1}.png`} alt={item.name} fill style={{ objectFit: 'cover' }} />
              </div>
              <div className={styles.itemDetails}>
                <h3 className={styles.itemName}>{item.name}</h3>
                <p className={styles.itemPrice}>₱{item.price.toFixed(2)}</p>
                <div className={styles.quantityControl}>
                  <button 
                    className={styles.qtyBtn}
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >-</button>
                  <span>{item.quantity}</span>
                  <button 
                    className={styles.qtyBtn}
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >+</button>
                </div>
                <button 
                  className={styles.removeBtn}
                  onClick={() => removeItem(item.id)}
                >
                  Remove item
                </button>
              </div>
              <div style={{ fontWeight: 700, fontSize: "1.2rem" }}>
                ₱{(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>₱{total.toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>₱{total.toFixed(2)}</span>
          </div>

          <div style={{ marginTop: "30px" }}>
            <Link 
              href="/checkout" 
              className="btn btn-primary" 
              style={{ width: "100%", padding: "15px", fontSize: "1.1rem" }}
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
