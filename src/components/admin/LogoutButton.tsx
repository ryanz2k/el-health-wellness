"use client";

import { logoutAction } from "@/app/actions/auth";
import { LogOut } from "lucide-react";

export default function LogoutButton({ className }: { className?: string }) {
  return (
    <form 
      action={logoutAction} 
      style={{ margin: 0, padding: 0 }} 
      className={className}
    >
      <button 
        type="submit" 
        style={{ background: "none", border: "none", cursor: "pointer", color: "#f87171", fontWeight: 600, fontSize: "1rem", display: "flex", alignItems: "center" }}
        onClick={(e) => {
          if (!window.confirm("Are you sure you want to log out of the Admin panel?")) {
            e.preventDefault();
          }
        }}
        title="Log Out"
      >
        Log Out
      </button>
    </form>
  );
}
