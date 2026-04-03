import { prisma } from "@/lib/prisma";
import ProductsClient from "./ProductsClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const currentPage = typeof params.page === "string" ? Number(params.page) : 1;
  const searchQuery = typeof params.q === "string" ? params.q : "";
  const categoryFilter = typeof params.category === "string" ? params.category : "";
  const brandFilter = typeof params.brand === "string" ? params.brand : "";
  const itemsPerPage = 20;

  const where: any = {};
  if (searchQuery) {
    where.OR = [
      { name: { contains: searchQuery } },
      { brand: { contains: searchQuery } },
      { category: { contains: searchQuery } },
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
    prisma.product.findMany({ select: { category: true }, distinct: ["category"] as any }),
    prisma.product.findMany({ select: { brand: true }, distinct: ["brand"] as any }),
  ]);

  const categories = ["All", ...categoriesRaw.map((c: any) => c.category).filter(Boolean).sort()];
  const brands = ["All", ...brandsRaw.map((b: any) => b.brand).filter(Boolean).sort()];
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  return (
    <ProductsClient
      products={products.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category,
        brand: p.brand,
        price: p.price,
        stock: p.stock,
      }))}
      totalItems={totalItems}
      currentPage={currentPage}
      totalPages={totalPages}
      searchQuery={searchQuery}
      categoryFilter={categoryFilter}
      brandFilter={brandFilter}
      categories={categories}
      brands={brands}
      itemsPerPage={itemsPerPage}
    />
  );
}
