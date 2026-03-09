"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import styles from "./Navbar.module.css";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/admin/LogoutButton";

import { useCartStore } from "@/store/useCartStore";

export default function Navbar({ isAdmin = false }: { isAdmin?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const items = useCartStore((state) => state.items);
  const count = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logoArea}>
          <Image 
            src="/logo.jpg" 
            alt="EL Health and Wellness Logo" 
            width={50} 
            height={50} 
            className={styles.logoImage}
          />
          <span className={`${styles.logoText} gradient-text`}>EL Health and Wellness</span>
        </Link>
        
        <button 
          className={styles.hamburger} 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ""}`}>
          <Link href="/" className={`${styles.link} ${pathname === '/' ? styles.activeLink : ''}`} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/products" className={`${styles.link} ${pathname === '/products' || pathname.startsWith('/products/') ? styles.activeLink : ''}`} onClick={() => setMenuOpen(false)}>Products</Link>
          <Link href="/about" className={`${styles.link} ${pathname === '/about' ? styles.activeLink : ''}`} onClick={() => setMenuOpen(false)}>About Us</Link>
          <Link href="/contact" className={`${styles.link} ${pathname === '/contact' ? styles.activeLink : ''}`} onClick={() => setMenuOpen(false)}>Contact</Link>
        </nav>

        <div className={styles.actions}>
          <Link href="/admin" className={styles.iconBtn} aria-label="Admin Access">
            <User size={20} />
          </Link>
          <Link href="/cart" className={styles.iconBtn} aria-label="Cart">
            <ShoppingCart size={20} />
            {mounted && count > 0 && <span className={styles.badge}>{count}</span>}
          </Link>
          {isAdmin && (
            <LogoutButton />
          )}
        </div>
      </div>
    </header>
  );
}
