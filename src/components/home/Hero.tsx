import styles from "./Hero.module.css";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className={`container animate-fade-up`}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Discover Your <span className="gradient-text">Natural Glow</span>
          </h1>
          <p className={styles.subtitle}>
            Premium beauty and health products curated to elevate your daily routine and nourish your wellness journey.
          </p>
          <Link href="/products" className={`btn btn-primary ${styles.shopNowBtn}`}>
            Shop Now <ArrowRight size={20} />
          </Link>
        </div>
        <div className={styles.heroGraphic}></div>
      </div>
    </section>
  );
}
