"use client";

import { useEffect, useRef } from "react";

// Séparateur de section : trace de peinture ondulée pleine largeur.
// La trace est VISIBLE par défaut (robuste sans JS / avant hydratation).
// Pour les séparateurs hors viewport, on déclenche au scroll une révélation
// "coup de pinceau" de gauche à droite (clip-path).
export default function PaintDivider() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") return; // reste visible

    const rect = el.getBoundingClientRect();
    const inInitialView =
      rect.top < (window.innerHeight || 800) && rect.bottom > 0;
    if (inInitialView) return; // déjà visible à l'écran : on laisse tel quel

    // Hors viewport : on masque la trace, puis on la révèle à l'arrivée au scroll.
    el.classList.add("pending");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("painted");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="paint-div" aria-hidden="true" ref={ref}>
      <div className="paint-div__stroke" />
    </div>
  );
}
