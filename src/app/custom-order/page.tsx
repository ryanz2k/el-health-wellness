import { prisma } from "@/lib/prisma";
import CustomOrderClient from "./CustomOrderClient";

export const dynamic = "force-dynamic";

export default async function CustomOrderPage() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, price: true, category: true, imageUrl: true },
    orderBy: { name: "asc" },
  });

  return (
    <div style={{ padding: "40px 20px", background: "#fdfdfd", minHeight: "80vh" }}>
      <div className="container" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 700, textAlign: "center", marginBottom: "10px", color: "var(--text-dark)" }}>
          Create a Custom Order
        </h1>
        <p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: "40px" }}>
          Need a specific quantity or packaging? Configure your custom request below.
        </p>
        
        <CustomOrderClient products={products} />
      </div>
    </div>
  );
}
