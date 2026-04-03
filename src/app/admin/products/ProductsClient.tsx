"use client";

import { useState, useEffect } from "react";
import styles from "../Admin.module.css";
import { Pencil, Trash2, X, Check, Search } from "lucide-react";
import { updateProduct, deleteProduct } from "@/app/actions/orders";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string | null;
  price: number;
  stock: number;
}

interface Props {
  products: Product[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  searchQuery: string;
  categoryFilter: string;
  brandFilter: string;
  categories: string[];
  brands: string[];
  itemsPerPage: number;
}

export default function ProductsClient({
  products: initialProducts,
  totalItems,
  currentPage,
  totalPages,
  searchQuery,
  categoryFilter,
  brandFilter,
  categories,
  brands,
  itemsPerPage,
}: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => { setProducts(initialProducts); }, [initialProducts]);

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setEditData({
      name: product.name,
      description: product.description,
      category: product.category,
      brand: product.brand || "",
      price: product.price,
      stock: product.stock,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    const result = await updateProduct(editingId, editData);
    if (result.success) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? { ...p, ...editData, price: parseFloat(editData.price), stock: parseInt(editData.stock) }
            : p
        )
      );
      setEditingId(null);
    } else {
      alert(result.error || "Failed to save");
    }
    setSaving(false);
  };

  const handleDelete = async (productId: string) => {
    setSaving(true);
    setErrorMsg(null);
    const result = await deleteProduct(productId);
    if (result.success) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setDeleteConfirmId(null);
    } else {
      setErrorMsg(result.error || "Failed to delete");
      setDeleteConfirmId(null);
    }
    setSaving(false);
  };

  const handleEditChange = (field: string, value: any) => {
    setEditData((prev: any) => ({ ...prev, [field]: value }));
  };

  const buildUrl = (overrides: Record<string, string | number> = {}) => {
    const params = new URLSearchParams();
    const page = overrides.page ?? currentPage;
    const q = overrides.q ?? searchQuery;
    const cat = overrides.category ?? categoryFilter;
    const brn = overrides.brand ?? brandFilter;
    if (q) params.set("q", String(q));
    if (cat && cat !== "All") params.set("category", String(cat));
    if (brn && brn !== "All") params.set("brand", String(brn));
    if (Number(page) > 1) params.set("page", String(page));
    return `/admin/products?${params.toString()}`;
  };

  return (
    <div className="animate-fade-up">
      <div className="flex-between" style={{ marginBottom: "30px", flexWrap: "wrap", gap: "15px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-dark)" }}>
          Manage Products
        </h1>

        <form action="/admin/products" method="GET" style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder="Search products..."
              style={{ padding: "10px 10px 10px 40px", borderRadius: "var(--border-radius)", border: "1px solid #e2e8f0", outline: "none", width: "220px", fontFamily: "inherit" }}
            />
          </div>
          <select name="category" defaultValue={categoryFilter || "All"} style={{ padding: "10px", borderRadius: "var(--border-radius)", border: "1px solid #e2e8f0", outline: "none", backgroundColor: "white", fontFamily: "inherit" }}>
            {categories.map((c) => (
              <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>
            ))}
          </select>
          <select name="brand" defaultValue={brandFilter || "All"} style={{ padding: "10px", borderRadius: "var(--border-radius)", border: "1px solid #e2e8f0", outline: "none", backgroundColor: "white", maxWidth: "200px", fontFamily: "inherit" }}>
            {brands.map((b) => (
              <option key={b} value={b}>{b === "All" ? "All Brands" : b}</option>
            ))}
          </select>
          <button type="submit" className="btn btn-primary" style={{ padding: "10px 20px" }}>Filter</button>
        </form>
      </div>

      {errorMsg && (
        <div style={{ padding: "12px 20px", background: "#fee2e2", color: "#991b1b", borderRadius: "8px", marginBottom: "20px", fontSize: "0.9rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {errorMsg}
          <button onClick={() => setErrorMsg(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={16} /></button>
        </div>
      )}

      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <h3>Active Inventory ({totalItems})</h3>
        </div>

        {products.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
            No products found matching your search.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className={styles.ordersTable}>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td style={{ maxWidth: "300px" }}>
                      {editingId === product.id ? (
                        <input value={editData.name} onChange={(e) => handleEditChange("name", e.target.value)} style={{ ...inputStyle, width: "100%" }} />
                      ) : (
                        <span style={{ fontWeight: 600, color: "var(--text-dark)" }} title={product.name}>{product.name}</span>
                      )}
                    </td>
                    <td>
                      {editingId === product.id ? (
                        <input value={editData.category} onChange={(e) => handleEditChange("category", e.target.value)} style={{ ...inputStyle, width: "120px" }} />
                      ) : (
                        <span style={{ color: "var(--text-muted)" }}>{product.category}</span>
                      )}
                    </td>
                    <td>
                      {editingId === product.id ? (
                        <input value={editData.brand} onChange={(e) => handleEditChange("brand", e.target.value)} style={{ ...inputStyle, width: "120px" }} />
                      ) : (
                        product.brand
                      )}
                    </td>
                    <td>
                      {editingId === product.id ? (
                        <input type="number" step="0.01" value={editData.price} onChange={(e) => handleEditChange("price", e.target.value)} style={{ ...inputStyle, width: "90px" }} />
                      ) : (
                        <span style={{ fontWeight: 600 }}>₱{product.price.toFixed(2)}</span>
                      )}
                    </td>
                    <td>
                      {editingId === product.id ? (
                        <input type="number" value={editData.stock} onChange={(e) => handleEditChange("stock", e.target.value)} style={{ ...inputStyle, width: "70px" }} />
                      ) : (
                        <span style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          background: product.stock > 10 ? "#dcfce7" : "#fee2e2",
                          color: product.stock > 10 ? "#166534" : "#991b1b",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                        }}>
                          {product.stock} in stock
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                        {editingId === product.id ? (
                          <>
                            <button onClick={saveEdit} disabled={saving} style={actionBtnStyle} title="Save">
                              <Check size={16} color="#10b981" />
                            </button>
                            <button onClick={cancelEdit} style={actionBtnStyle} title="Cancel">
                              <X size={16} color="#ef4444" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(product)} style={actionBtnStyle} title="Edit">
                              <Pencil size={16} color="var(--primary-color)" />
                            </button>
                            {deleteConfirmId === product.id ? (
                              <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                                <button onClick={() => handleDelete(product.id)} disabled={saving} style={{ ...actionBtnStyle, background: "#fee2e2" }} title="Confirm Delete">
                                  <Check size={14} color="#ef4444" />
                                </button>
                                <button onClick={() => setDeleteConfirmId(null)} style={actionBtnStyle} title="Cancel">
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <button onClick={() => setDeleteConfirmId(product.id)} style={actionBtnStyle} title="Delete">
                                <Trash2 size={16} color="#ef4444" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #e2e8f0" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
            </span>
            <div style={{ display: "flex", gap: "10px" }}>
              {currentPage > 1 && (
                <a href={buildUrl({ page: currentPage - 1 })} className="btn btn-outline" style={{ padding: "6px 16px" }}>
                  Previous
                </a>
              )}
              {currentPage < totalPages && (
                <a href={buildUrl({ page: currentPage + 1 })} className="btn btn-outline" style={{ padding: "6px 16px" }}>
                  Next
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "5px 8px",
  border: "1px solid #d9d9d9",
  borderRadius: "4px",
  fontSize: "0.85rem",
  outline: "none",
  fontFamily: "inherit",
};

const actionBtnStyle: React.CSSProperties = {
  background: "none",
  border: "1px solid #e2e8f0",
  borderRadius: "6px",
  padding: "5px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
