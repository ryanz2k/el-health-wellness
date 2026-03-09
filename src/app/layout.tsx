import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cookies } from "next/headers";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "EL Health and Wellness",
  description: "Premium health, wellness, and beauty products.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.has("admin_session");

  return (
    <html lang="en">
      <body className={outfit.className} style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar isAdmin={isAdmin} />
        <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
