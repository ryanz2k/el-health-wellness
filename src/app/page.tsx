import Hero from "@/components/home/Hero";
import ProductGrid from "@/components/home/ProductGrid";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const featuredProducts = await prisma.product.findMany({
    take: 6,
    orderBy: {
      name: 'desc'
    }
  });

  return (
    <>
      <Hero />
      <div className="container" id="store">
        <h2 style={{ fontSize: "2.5rem", marginBottom: "30px", fontWeight: 700 }}>
          Featured <span className="gradient-text">Products</span>
        </h2>
        <ProductGrid products={featuredProducts} />
      </div>
    </>
  );
}
