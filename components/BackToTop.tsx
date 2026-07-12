"use client";

import { useScrolled } from "@/hooks/useScrolled";

export default function BackToTop() {
  const visible = useScrolled(600);
  return (
    <button
      type="button"
      className={`btt${visible ? " vis" : ""}`}
      aria-label="Remonter en haut de page"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <i className="ph ph-arrow-up" />
    </button>
  );
}
