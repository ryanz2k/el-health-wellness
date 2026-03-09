import { Building, Award, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container" style={{ padding: "60px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: "60px", maxWidth: "800px", margin: "0 auto 60px" }}>
        <h1 className="gradient-text" style={{ fontSize: "3rem", marginBottom: "20px" }}>About Us</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.2rem", lineHeight: "1.8" }}>
          Located at the heart of Mandaue, Cebu, EL Health and Wellness (operating as EL Glamorous Face and Body Clinic) is your premier destination for holistic skin care, pharmaceutical needs, and rejuvenating beauty therapies.
        </p>
      </div>

      <div className="grid-3">
        <div className="glass-panel animate-fade-up" style={{ padding: "40px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px", color: "var(--primary-color)" }}>
            <Building size={48} />
          </div>
          <h3 style={{ textAlign: "center", marginBottom: "15px", color: "var(--text-dark)", fontSize: "1.3rem" }}>Our Facility</h3>
          <p style={{ color: "var(--text-muted)", textAlign: "center", lineHeight: "1.6" }}>
            We operate out of the Paradise Garden Events Pavilion, bringing a serene, welcoming environment to all our clients and patients.
          </p>
        </div>

        <div className="glass-panel animate-fade-up delay-100" style={{ padding: "40px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px", color: "var(--primary-color)" }}>
            <Award size={48} />
          </div>
          <h3 style={{ textAlign: "center", marginBottom: "15px", color: "var(--text-dark)", fontSize: "1.3rem" }}>Our Standards</h3>
          <p style={{ color: "var(--text-muted)", textAlign: "center", lineHeight: "1.6" }}>
            We provide a vast range of carefully vetted products—from essential daily vitamins to specialized treatments—ensuring top-tier quality control and affordability.
          </p>
        </div>

        <div className="glass-panel animate-fade-up delay-200" style={{ padding: "40px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px", color: "var(--primary-color)" }}>
            <Heart size={48} />
          </div>
          <h3 style={{ textAlign: "center", marginBottom: "15px", color: "var(--text-dark)", fontSize: "1.3rem" }}>Our Mission</h3>
          <p style={{ color: "var(--text-muted)", textAlign: "center", lineHeight: "1.6" }}>
            To foster physical and emotional well-being by delivering exceptional health resources, skin care clinic treatments, and transparent pharmaceutical care.
          </p>
        </div>
      </div>
      
      <div style={{ marginTop: "80px", textAlign: "center", padding: "40px", background: "white", borderRadius: "var(--border-radius)", boxShadow: "var(--shadow-sm)" }}>
        <h2 style={{ color: "var(--text-dark)", marginBottom: "20px" }}>Experience the Difference</h2>
        <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto 30px", lineHeight: "1.6" }}>
          We invite you to explore our carefully crafted catalog online or visit our physical storefront at 6014 H. Abellana St. Our expert staff represents a commitment to excellence, supporting your journey to lasting health.
        </p>
        <a href="/products" className="btn btn-primary">Browse Catalog</a>
      </div>
    </div>
  );
}
