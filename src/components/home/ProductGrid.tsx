"use client";

import ProductCard from "./ProductCard";
import styles from "./ProductGrid.module.css";

interface dbProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string | null;
}

export default function ProductGrid({ products }: { products: dbProduct[] }) {
  return (
    <div className={styles.grid}>
      {products.map((product, i) => (
        <div key={product.id} className={`animate-fade-up delay-${Math.min((i + 1) * 100, 500)}`}>
          <ProductCard 
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              category: product.category,
              description: product.description,
              image: product.imageUrl || "/placeholder-1.jpg"
            }} 
          />
        </div>
      ))}
    </div>
  );
}
