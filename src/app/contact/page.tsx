import styles from "./Contact.module.css";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container" style={{ padding: "60px 20px" }}>
      <div className={styles.header}>
        <h1 className="gradient-text" style={{ fontSize: "3rem", marginBottom: "20px" }}>Get in Touch</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto" }}>
          Have questions about our wellness products or want to visit our clinic? We're here to help you achieve your natural glow.
        </p>
      </div>

      <div className={styles.contactGrid}>
        {/* Information Panel */}
        <div className={`glass-panel animate-fade-up ${styles.infoPanel}`}>
          <h2>Contact Information</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "30px" }}>
            Reach out to our team at EL Health and Wellness (EL Glamorous Face and Body Clinic).
          </p>

          <div className={styles.infoItem}>
            <div className={styles.iconBox}><MapPin size={24} /></div>
            <div>
              <strong>Visit Us</strong>
              <p>6014 H. Abellana St, Paradise Garden Events Pavilion<br/>Mandaue, Cebu, Philippines</p>
            </div>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.iconBox}><Phone size={24} /></div>
            <div>
              <strong>Call Us</strong>
              <p>(032) 326 4014<br/>+1 318 200 0899</p>
            </div>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.iconBox}><Mail size={24} /></div>
            <div>
              <strong>Email Us</strong>
              <p>el.onlinepharmacy@elbpo.com</p>
            </div>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.iconBox}><Clock size={24} /></div>
            <div>
              <strong>Working Hours</strong>
              <p>Tuesday - Sunday: 11:00 AM – 8:00 PM<br/>Monday: Closed</p>
            </div>
          </div>
        </div>

        {/* Map Embed Panel */}
        <div className={`glass-panel animate-fade-up delay-200 ${styles.mapPanel}`}>
          <iframe 
            src="https://maps.google.com/maps?q=EL+Glamorous+Face+and+Body+Clinic+-+Mandaue+Branch&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%" 
            height="100%" 
            style={{ border: 0 }}
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps Location for EL Health and Wellness"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
