import ProductCatalog from "@/components/products/ProductCatalog";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  // Fetch real database records from SQLite
  const products = await prisma.product.findMany({
    orderBy: {
      name: 'asc'
    }
  });

  return (
    <>
      <div style={{ background: "var(--secondary-color)", padding: "60px 0", marginTop: "20px" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h1 className="gradient-text" style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "15px" }}>
            Shop Our Products
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
            Browse the full EL Health and Wellness catalog. Carefully selected beauty and personal care items designed for your well-being.
          </p>
        </div>
      </div>

      <ProductCatalog products={products} />
    </>
  );
}
