"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Observe les éléments porteurs des classes de révélation (.rv / .rv-l / .rv-s)
// et leur ajoute `.vis` quand ils entrent dans le viewport.
//
// IMPORTANT : ce composant vit dans le layout, donc il ne REMONTE pas lors d'une
// navigation client (clic dans la navbar). Avec un effet `[]` il n'observait les
// éléments qu'au premier chargement (l'accueil) → les autres pages restaient à
// opacity:0 (invisibles). On relance donc l'observation à chaque changement de
// route (dépendance `pathname`), en ignorant ceux déjà révélés (`.rv:not(.vis)`).
export default function RevealOnScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  entry.target.classList.add("vis");
                  io!.unobserve(entry.target);
                }
              });
            },
            { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
          )
        : null;

    const tick = () => {
      const els = document.querySelectorAll<HTMLElement>(
        ".rv:not(.vis), .rv-l:not(.vis), .rv-s:not(.vis)"
      );
      els.forEach((el) => {
        if (io) io.observe(el);
        else el.classList.add("vis"); // repli sans IntersectionObserver
      });
    };

    // Observe maintenant + une fois après le paint (éléments montés juste après
    // le changement de route).
    tick();
    const raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, [pathname]);

  return null;
}
