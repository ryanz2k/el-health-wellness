"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, Send, CheckCircle, Plus, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { sendCustomOrder } from "@/app/actions/sendCustomOrder";

type Product = { id: string; name: string; price: number; category: string; imageUrl: string };
type UploadedFile = { file: File; preview: string };

export default function CustomOrderClient({ products }: { products: Product[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(50);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [senderPreviewUrl, setSenderPreviewUrl] = useState<string | null>(null);

  const [uploadedImages, setUploadedImages] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = useMemo(() => {
    const baseList = searchTerm
      ? products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category?.toLowerCase().includes(searchTerm.toLowerCase()))
      : products;
    return baseList.slice(0, visibleCount);
  }, [searchTerm, products, visibleCount]);

  useEffect(() => {
    setVisibleCount(50);
  }, [searchTerm]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      setVisibleCount(prev => prev + 50);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setUploadedImages(prev => [...prev, ...newFiles]);
    }
    // reset input value so the same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (indexToRemove: number) => {
    setUploadedImages(prev => {
      // revoke URL to prevent memory leaks
      URL.revokeObjectURL(prev[indexToRemove].preview);
      return prev.filter((_, idx) => idx !== indexToRemove);
    });
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedProducts.length === 0) {
      alert("Please select at least one base product.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    // Append multiple product names
    selectedProducts.forEach(product => {
      formData.append("productName", product.name);
    });

    // Append multiple files natively
    uploadedImages.forEach(img => {
      formData.append("image", img.file);
    });

    const result = await sendCustomOrder(formData);

    setIsSubmitting(false);

    if (result.success) {
      setSuccess(true);
      if (result.previewUrl) setPreviewUrl(result.previewUrl);
      if (result.senderPreviewUrl) setSenderPreviewUrl(result.senderPreviewUrl);
    } else {
      alert(result.error);
    }
  };

  if (success) {
    return (
      <div style={{ background: "white", padding: "50px 30px", borderRadius: "16px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)", textAlign: "center", animation: "fadeIn 0.5s ease-out" }}>
        <CheckCircle size={64} color="#10b981" style={{ margin: "0 auto 20px" }} />
        <h2 style={{ fontSize: "2rem", marginBottom: "15px", color: "var(--text-dark)" }}>Inquiry Sent Successfully!</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginBottom: "30px", maxWidth: "600px", margin: "0 auto 30px" }}>
          Thank you for reaching out with your custom request. Our administrative team will review your requirements and get back to you via email shortly.
        </p>

        {previewUrl && (
          <div style={{ background: "#f8fafc", padding: "15px", borderRadius: "8px", border: "1px dashed #cbd5e1", marginTop: "20px" }}>
            <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "10px" }}>Testing Mode - View the sent email previews here:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <a href={previewUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-color)", fontWeight: "500", textDecoration: "underline" }}>
                Open Admin Email Preview
              </a>
              {senderPreviewUrl && (
                <a href={senderPreviewUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-color)", fontWeight: "500", textDecoration: "underline" }}>
                  Open Sender Confirmation Preview
                </a>
              )}
            </div>
          </div>
        )}

        <button
          onClick={() => {
            setSuccess(false);
            setSelectedProducts([]);
            setSearchTerm("");
            setPreviewUrl(null);
            setSenderPreviewUrl(null);
            setUploadedImages([]);
          }}
          style={{ padding: "12px 24px", background: "white", color: "var(--text-dark)", border: "1px solid #ddd", borderRadius: "8px", fontWeight: "600", cursor: "pointer", marginTop: "30px" }}
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: "white", padding: "40px", borderRadius: "16px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
      <form onSubmit={handleSubmit}>

        {/* 1. Select Products */}
        <div style={{ marginBottom: "30px" }}>
          <label style={{ display: "block", fontSize: "1.1rem", fontWeight: 600, marginBottom: "10px", color: "var(--text-dark)" }}>
            1. Select Products
          </label>
          <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "10px" }}>Choose the products or chemical compounds you are inquiring about. You can add multiple products.</p>

          {/* Selected Products Area */}
          {selectedProducts.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "15px" }}>
              {selectedProducts.map(product => (
                <div key={product.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px", background: "var(--primary-light)", color: "var(--text-dark)", border: "1px solid var(--primary-color)", borderRadius: "20px", fontSize: "0.9rem", fontWeight: 500 }}>
                  {product.name}
                  <X
                    size={16}
                    style={{ cursor: "pointer", color: "var(--primary-color)" }}
                    onClick={() => removeProduct(product.id)}
                  />
                </div>
              ))}
            </div>
          )}

          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              style={{ width: "100%", padding: "14px", border: "2px dashed #cbd5e1", borderRadius: "8px", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", background: "#f8fafc", color: "var(--primary-color)", fontWeight: 600, transition: "0.2s" }}
            >
              <Plus size={20} />
              Add Product
            </button>

            {isOpen && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "white", border: "1px solid #ddd", borderRadius: "8px", zIndex: 50, marginTop: "4px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", maxHeight: "300px", display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "10px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <input
                    autoFocus
                    type="text"
                    placeholder="Type to search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "6px" }}
                  />
                  <X size={24} style={{ cursor: "pointer", color: "#888", marginLeft: "10px" }} onClick={() => setIsOpen(false)} />
                </div>
                <div style={{ overflowY: "auto", flex: 1 }} onScroll={handleScroll}>
                  {filteredProducts.map(product => {
                    const isSelected = selectedProducts.some(p => p.id === product.id);
                    return (
                      <div
                        key={product.id}
                        onClick={() => {
                          if (!isSelected) {
                            setSelectedProducts([...selectedProducts, product]);
                          }
                          setIsOpen(false);
                          setSearchTerm("");
                        }}
                        style={{ padding: "12px 16px", borderBottom: "1px solid #f5f5f5", cursor: isSelected ? "default" : "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: isSelected ? 0.5 : 1 }}
                      >
                        <div>
                          <div style={{ fontWeight: 500 }}>{product.name}</div>
                          <div style={{ fontSize: "0.85rem", color: "#888" }}>{product.category}</div>
                        </div>
                        {isSelected && <span style={{ fontSize: "0.8rem", color: "var(--primary-color)", fontWeight: "bold" }}>Added</span>}
                      </div>
                    );
                  })}
                  {filteredProducts.length === 0 && <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>No products found.</div>}
                </div>
              </div>
            )}
          </div>
        </div>

        {selectedProducts.length > 0 && (
          <div style={{ animation: "fadeIn 0.3s ease-out" }}>

            {/* 2. Contact Details */}
            <div style={{ marginBottom: "30px" }}>
              <label style={{ display: "block", fontSize: "1.1rem", fontWeight: 600, marginBottom: "10px", color: "var(--text-dark)" }}>
                2. Your Contact Email
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="Where should we send our response?"
                style={{ width: "100%", padding: "14px", border: "2px solid #eaeaea", borderRadius: "8px", fontSize: "1rem" }}
              />
            </div>

            {/* 3. Custom Request & Description */}
            <div style={{ marginBottom: "30px" }}>
              <label style={{ display: "block", fontSize: "1.1rem", fontWeight: 600, marginBottom: "10px", color: "var(--text-dark)" }}>
                3. Describe Your Custom Request
              </label>
              <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "10px" }}>Let us know the quantities, specific packaging variations, or any other requirements you need.</p>
              <textarea
                name="description"
                required
                rows={6}
                style={{ width: "100%", padding: "14px", border: "2px solid #eaeaea", borderRadius: "8px", fontSize: "1rem", resize: "vertical", fontFamily: "inherit" }}
              />
            </div>

            {/* 4. File Upload (Multi) */}
            <div style={{ marginBottom: "40px" }}>
              <label style={{ display: "block", fontSize: "1.1rem", fontWeight: 600, marginBottom: "10px", color: "var(--text-dark)" }}>
                4. Image References (Optional)
              </label>
              <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "10px" }}>Upload pictures of packaging styles or specific looks you are aiming for.</p>

              {/* Added Images Previews */}
              {uploadedImages.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", marginBottom: "15px" }}>
                  {uploadedImages.map((img, idx) => (
                    <div key={idx} style={{ position: "relative", width: "100px", height: "100px", borderRadius: "8px", overflow: "hidden", border: "1px solid #ddd" }}>
                      <Image src={img.preview} alt="Upload preview" fill style={{ objectFit: "cover" }} />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        style={{ position: "absolute", top: "5px", right: "5px", background: "rgba(0,0,0,0.6)", color: "white", border: "none", borderRadius: "50%", padding: "4px", cursor: "pointer", display: "flex" }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Hidden File Input */}
              <input
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", background: "#f8fafc", border: "2px dashed #cbd5e1", borderRadius: "8px", color: "#64748b", fontWeight: 500, cursor: "pointer", transition: "0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--primary-color)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#cbd5e1")}
              >
                <Plus size={20} />
                Add Image
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "18px",
                background: isSubmitting ? "#ccc" : "var(--primary-color)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1.2rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                boxShadow: isSubmitting ? "none" : "0 4px 15px rgba(255,105,180,0.3)",
                transition: "0.2s"
              }}
            >
              {isSubmitting ? (
                <span>Sending...</span>
              ) : (
                <>
                  <Send size={24} />
                  Send Custom Order
                </>
              )}
            </button>
          </div>
        )}
      </form>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
