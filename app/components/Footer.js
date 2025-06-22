import React from "react";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#fff",
        borderTop: "1px solid #f3f4f6",
        padding: "1rem 0 0.5rem 0",
        textAlign: "center",
        fontSize: "0.95rem",
        color: "#a21caf",
        marginTop: "2rem",
        letterSpacing: 0,
      }}
    >
      © {new Date().getFullYear()} <strong>racare.glow</strong>
    </footer>
  );
}