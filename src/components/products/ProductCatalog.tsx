"use client";

import { useState } from "react";
import styles from "./Products.module.css";
import ProductCard from "@/components/home/ProductCard";
import { Filter, X } from "lucide-react";

interface dbProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
}

export default function ProductCatalog({ products }: { products: dbProduct[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [sortBy, setSortBy] = useState("featured"); // featured, price-low, price-high
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const itemsPerPage = 12;

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category))).sort()];
  const brands = ["All", ...Array.from(new Set(products.map(p => p.brand || "Generic"))).filter(b => b !== "All").sort()];

  let filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesBrand = selectedBrand === "All" || (product.brand === selectedBrand);
    return matchesSearch && matchesCategory && matchesBrand;
  });

  // Apply Sorting
  if (sortBy === "price-low") {
    filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
  }

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={`container ${styles.productsContainer}`}>
      
      {/* Mobile Filter Toggle Button */}
      <button 
        className={`${styles.mobileFilterToggle} btn btn-outline`}
        onClick={() => setShowMobileFilters(true)}
      >
        <Filter size={20} /> Show Filters
      </button>

      {/* Sidebar Filters */}
      <aside className={`${styles.filtersPane} ${showMobileFilters ? styles.filtersPaneOpen : ''}`}>
        <div className={styles.mobileFilterHeader}>
          <h2>Filters</h2>
          <button className={styles.closeBtn} onClick={() => setShowMobileFilters(false)}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.filterGroup}>
          <h3>Search Products</h3>
          <input 
            type="text" 
            placeholder="Search wellness, beauty..." 
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset page on search
            }}
          />
        </div>

        <div className={styles.filterGroup}>
          <h3>Categories</h3>
          <ul className={styles.categoryList}>
            {categories.map(cat => (
              <li 
                key={cat}
                style={{ textTransform: "uppercase" }}
                className={`${styles.categoryItem} ${selectedCategory === cat ? styles.categoryActive : ''}`}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1); // Reset page on category change
                }}
              >
                {cat}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.filterGroup}>
          <h3>Brands</h3>
          <select 
            className={styles.selectInput}
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setCurrentPage(1);
            }}
          >
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>
        
        <div className={styles.filterGroup}>
          <h3>Sort By</h3>
          <select 
            className={styles.selectInput}
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </aside>

      {/* Main Grid */}
      <main className={styles.resultsArea}>
        <div className={styles.resultsHeader}>
          <h2>Catalog</h2>
          <span>Showing {paginatedProducts.length} of {filteredProducts.length} results</span>
        </div>

        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", backgroundColor: "white", borderRadius: "12px" }}>
            <h3 style={{ color: "var(--text-muted)" }}>No products match your search criteria.</h3>
            <button className="btn btn-outline" style={{ marginTop: "20px" }} onClick={() => { setSearchTerm(""); setSelectedCategory("All"); setCurrentPage(1); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "30px" }}>
              {paginatedProducts.map((p, i) => (
                <div key={p.id} className={`animate-fade-up delay-${Math.min((i + 1) * 50, 500)}`}>
                  <ProductCard 
                    product={{
                      id: p.id,
                      name: p.name,
                      price: p.price,
                      category: p.category,
                      description: p.description,
                      image: p.imageUrl || "/placeholder-1.jpg"
                    }} 
                  />
                </div>
              ))}
            </div>
            
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: "10px", margin: "40px 0 20px 0" }}>
                <button 
                  className="btn btn-outline" 
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(prev => prev - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{ minWidth: "100px" }}
                >
                  Previous
                </button>
                <span style={{ display: "flex", alignItems: "center", color: "var(--text-muted)", fontWeight: 500, margin: "0 10px" }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  className="btn btn-outline" 
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(prev => prev + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{ minWidth: "100px" }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
