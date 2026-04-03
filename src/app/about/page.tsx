import { Sparkles, Award, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container" style={{ padding: "60px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: "60px", maxWidth: "800px", margin: "0 auto 60px" }}>
        <h1 className="gradient-text" style={{ fontSize: "3rem", marginBottom: "20px" }}>About EL Glamorous</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.2rem", lineHeight: "1.8" }}>
          Founded in 2017, EL Glamorous Face and Body Clinic has grown from a single branch into a trusted beauty destination with four locations.
        </p>
      </div>

      <div className="grid-3">
        <div className="glass-panel animate-fade-up" style={{ padding: "40px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px", color: "var(--primary-color)" }}>
            <Sparkles size={48} />
          </div>
          <h3 style={{ textAlign: "center", marginBottom: "15px", color: "var(--text-dark)", fontSize: "1.3rem" }}>Expert Services</h3>
          <p style={{ color: "var(--text-muted)", textAlign: "center", lineHeight: "1.6" }}>
            We offer expert facial care, slimming treatments, massage, hair, and nail services—all designed to enhance your natural beauty.
          </p>
        </div>

        <div className="glass-panel animate-fade-up delay-100" style={{ padding: "40px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px", color: "var(--primary-color)" }}>
            <Award size={48} />
          </div>
          <h3 style={{ textAlign: "center", marginBottom: "15px", color: "var(--text-dark)", fontSize: "1.3rem" }}>Quality & Value</h3>
          <p style={{ color: "var(--text-muted)", textAlign: "center", lineHeight: "1.6" }}>
            With a perfect balance of quality, affordability, and personalized care, we ensure our clients always receive the best.
          </p>
        </div>

        <div className="glass-panel animate-fade-up delay-200" style={{ padding: "40px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px", color: "var(--primary-color)" }}>
            <Heart size={48} />
          </div>
          <h3 style={{ textAlign: "center", marginBottom: "15px", color: "var(--text-dark)", fontSize: "1.3rem" }}>Our Commitment</h3>
          <p style={{ color: "var(--text-muted)", textAlign: "center", lineHeight: "1.6" }}>
            We are committed to helping you look and feel your best—confident, radiant, and truly glamorous.
          </p>
        </div>
      </div>
      
      <div style={{ marginTop: "80px", textAlign: "center", padding: "40px", background: "white", borderRadius: "var(--border-radius)", boxShadow: "var(--shadow-sm)" }}>
        <h2 style={{ color: "var(--text-dark)", marginBottom: "20px" }}>Experience the Difference</h2>
        <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto 30px", lineHeight: "1.6" }}>
          We invite you to explore our internationally available product catalog dropshipped right to your door, or visit our physical clinic locations locally.
        </p>
        <a href="/products" className="btn btn-primary">Browse Catalog</a>
      </div>
    </div>
  );
}
