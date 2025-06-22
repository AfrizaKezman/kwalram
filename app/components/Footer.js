import React from "react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-blue-100 bg-white text-center py-4 text-sm text-blue-700 mt-8 tracking-wide">
      © {new Date().getFullYear()} <strong>PT Kwalram</strong> – Textile & Manufacturing Solutions
    </footer>
  );
}