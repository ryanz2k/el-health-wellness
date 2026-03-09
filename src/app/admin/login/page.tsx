"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction } from "@/app/actions/auth";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const initialState = {
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary" disabled={pending} style={{ width: "100%", marginTop: "20px" }}>
      {pending ? "Authenticating..." : "Sign In to Dashboard"}
    </button>
  );
}

export default function LoginPage() {
  // @ts-ignore
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <div className="container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <div className="glass-panel animate-fade-up" style={{ padding: "40px", width: "100%", maxWidth: "450px" }}>
        
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "5px", color: "var(--text-muted)", textDecoration: "none", marginBottom: "30px", fontSize: "0.9rem" }}>
          <ArrowLeft size={16} /> Back to Store
        </Link>
        
        <h1 className="gradient-text" style={{ fontSize: "2rem", marginBottom: "10px", textAlign: "center" }}>Admin Portal</h1>
        <p style={{ color: "var(--text-muted)", textAlign: "center", marginBottom: "30px" }}>Enter credentials to access the dashboard.</p>
        
        <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div>
            <label htmlFor="email" style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--text-dark)" }}>Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required 
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none" }}
              placeholder="admin@gmail.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--text-dark)" }}>Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              required 
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none" }}
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <div style={{ color: "#ef4444", backgroundColor: "#fef2f2", padding: "10px", borderRadius: "6px", fontSize: "0.9rem", textAlign: "center" }}>
              {state.error}
            </div>
          )}
          
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
