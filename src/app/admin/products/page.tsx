import styles from "../Admin.module.css";
import { prisma } from "@/lib/prisma";
import { Product } from "@prisma/client";
import { Search } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const currentPage = typeof params.page === 'string' ? Number(params.page) : 1;
  const searchQuery = typeof params.q === 'string' ? params.q : "";
  const categoryFilter = typeof params.category === 'string' ? params.category : "";
  const brandFilter = typeof params.brand === 'string' ? params.brand : "";
  const itemsPerPage = 20;

  const where: any = {};
  if (searchQuery) {
    where.OR = [
      { name: { contains: searchQuery } },
      { brand: { contains: searchQuery } },
      { category: { contains: searchQuery } }
    ];
  }
  if (categoryFilter && categoryFilter !== "All") {
    where.category = categoryFilter;
  }
  if (brandFilter && brandFilter !== "All") {
    where.brand = brandFilter;
  }

  const [products, totalItems, categoriesRaw, brandsRaw] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { name: "asc" },
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
    }),
    prisma.product.count({ where }),
    prisma.product.findMany({ select: { category: true }, distinct: ['category'] as any }),
    prisma.product.findMany({ select: { brand: true }, distinct: ['brand'] as any }),
  ]);

  const categories = ["All", ...categoriesRaw.map((c: any) => c.category).filter(Boolean).sort()];
  const brands = ["All", ...brandsRaw.map((b: any) => b.brand).filter(Boolean).sort()];

  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  async function searchAction(formData: FormData) {
    "use server";
    const q = formData.get("q") as string;
    const cat = formData.get("category") as string;
    const brn = formData.get("brand") as string;
    
    const queryParams = new URLSearchParams();
    if (q) queryParams.set("q", q);
    if (cat && cat !== "All") queryParams.set("category", cat);
    if (brn && brn !== "All") queryParams.set("brand", brn);

    redirect(`/admin/products?${queryParams.toString()}`);
  }

  return (
    <div className="animate-fade-up">
      <div className="flex-between" style={{ marginBottom: "30px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-dark)" }}>
          Manage Products
        </h1>
        
        <form action={searchAction} style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input 
              type="text" 
              name="q"
              defaultValue={searchQuery}
              placeholder="Search products..." 
              style={{ padding: "10px 10px 10px 40px", borderRadius: "var(--border-radius)", border: "1px solid #e2e8f0", outline: "none", width: "220px" }}
            />
          </div>
          
          <select name="category" defaultValue={categoryFilter || "All"} style={{ padding: "10px", borderRadius: "var(--border-radius)", border: "1px solid #e2e8f0", outline: "none", backgroundColor: "white" }}>
            {categories.map(c => (
              <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>
            ))}
          </select>
          
          <select name="brand" defaultValue={brandFilter || "All"} style={{ padding: "10px", borderRadius: "var(--border-radius)", border: "1px solid #e2e8f0", outline: "none", backgroundColor: "white", maxWidth: "200px" }}>
            {brands.map(b => (
              <option key={b} value={b}>{b === "All" ? "All Brands" : b}</option>
            ))}
          </select>

          <button type="submit" className="btn btn-primary" style={{ padding: "10px 20px" }}>Filter</button>
        </form>
      </div>

      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <h3>Active Inventory ({totalItems})</h3>
        </div>
        
        {products.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
            No products found matching your search.
          </div>
        ) : (
          <table className={styles.ordersTable}>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: Product) => (
                <tr key={product.id}>
                  <td title={product.name} style={{ fontWeight: 600, color: "var(--text-dark)", maxWidth: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {product.name}
                  </td>
                  <td style={{ color: "var(--text-muted)" }}>{product.category}</td>
                  <td>{product.brand}</td>
                  <td style={{ fontWeight: 600 }}>₱{product.price.toFixed(2)}</td>
                  <td>
                    <span style={{ 
                      padding: "4px 8px", 
                      borderRadius: "4px", 
                      background: product.stock > 10 ? "#dcfce7" : "#fee2e2", 
                      color: product.stock > 10 ? "#166534" : "#991b1b",
                      fontSize: "0.85rem",
                      fontWeight: 600
                    }}>
                      {product.stock} in stock
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {totalPages > 1 && (
          <div style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #e2e8f0" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
            </span>
            <div style={{ display: "flex", gap: "10px" }}>
              {currentPage > 1 && (
                <Link 
                  href={`/admin/products?page=${currentPage - 1}${searchQuery ?  "&q=" + encodeURIComponent(searchQuery) : ""}${categoryFilter ? "&category=" + encodeURIComponent(categoryFilter) : ""}${brandFilter ? "&brand=" + encodeURIComponent(brandFilter) : ""}`} 
                  className="btn btn-secondary" 
                  style={{ padding: "6px 16px" }}
                >
                  Previous
                </Link>
              )}
              {currentPage < totalPages && (
                <Link 
                  href={`/admin/products?page=${currentPage + 1}${searchQuery ? "&q=" + encodeURIComponent(searchQuery) : ""}${categoryFilter ? "&category=" + encodeURIComponent(categoryFilter) : ""}${brandFilter ? "&brand=" + encodeURIComponent(brandFilter) : ""}`} 
                  className="btn btn-secondary" 
                  style={{ padding: "6px 16px" }}
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
