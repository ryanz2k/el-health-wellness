import styles from "./Footer.module.css";
import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        <div className={styles.column}>
          <h3>EL Health and Wellness</h3>
          <p>
            Your trusted provider of premium beauty and health products. We believe
            in natural wellness and bringing out your inner glow.
          </p>
        </div>

        <div className={styles.column}>
          <h3>Quick Links</h3>
          <ul className={styles.linkList}>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/products">Shop Products</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div className={styles.column}>
          <h3>Contact Us</h3>
          <p>
            <a href="tel:+13182000899" style={{ color: "inherit", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
              <Phone size={18} /> +1 318 200 0899
            </a>
          </p>
          <p>
            <a href="mailto:el.onlinepharmacy@elbpo.com" style={{ color: "inherit", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
              <Mail size={18} /> el.onlinepharmacy@elbpo.com
            </a>
          </p>
        </div>
      </div>

      <div className={`container ${styles.bottomBar}`}>
        <p>&copy; {new Date().getFullYear()} EL Health and Wellness. All rights reserved.</p>
      </div>
    </footer>
  );
}
