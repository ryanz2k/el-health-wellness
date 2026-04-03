import Image from "next/image";
import { ShoppingCart, Check, Minus, Plus } from "lucide-react";
import styles from "./ProductGrid.module.css";
import { useCartStore } from "@/store/useCartStore";
import { useState } from "react";

interface ProductProps {
  product: {
    id: string;
    name: string;
    price: number;
    category: string;
    description: string;
    image: string;
  };
}

export default function ProductCard({ product }: ProductProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: `/stock/${(product.id.charCodeAt(0) + product.id.charCodeAt(product.id.length - 1)) % 4 + 1}.png`
    });
    
    setIsAdded(true);
    setQuantity(1); // Reset after adding
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(prev => prev + 1);
  };

  return (
    <div className={`${styles.card} glass-panel`}>
      <div className={styles.imageWrapper} style={{ position: "relative", overflow: "hidden" }}>
        <Image 
          src={`/stock/${(product.id.charCodeAt(0) + product.id.charCodeAt(product.id.length - 1)) % 4 + 1}.png`} 
          alt={product.name} 
          fill 
          style={{ objectFit: 'cover' }} 
        />
        <div className={styles.imgLabel} style={{ position: "absolute", bottom: "10px", right: "10px", background: "rgba(255,255,255,0.9)", zIndex: 2, padding: "2px 8px", borderRadius: "10px", fontSize: "0.7rem", fontWeight: "bold" }}>
          {product.category}
        </div>
      </div>
      <div className={styles.productInfo}>
        <span className={styles.category}>{product.category}</span>
        <h3 className={styles.productName}>{product.name}</h3>
        <div className={styles.priceRow}>
          <p className={styles.price}>₱{product.price.toFixed(2)}</p>
          
          <div className={styles.quantitySelector}>
            <button 
              onClick={handleDecrease} 
              className={styles.qtyBtn} 
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className={styles.qtyLabel}>{quantity}</span>
            <button 
              onClick={handleIncrease} 
              className={styles.qtyBtn}
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <button 
          className={`btn ${isAdded ? styles.addedBtn : 'btn-primary'} ${styles.addToCartBtn}`}
          onClick={handleAddToCart}
          disabled={isAdded}
        >
          {isAdded ? (
            <><Check size={18} /> Added to Cart</>
          ) : (
            <><ShoppingCart size={18} /> Add to Cart</>
          )}
        </button>
      </div>
    </div>
  );
}
