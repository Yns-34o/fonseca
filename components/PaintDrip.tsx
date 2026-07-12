"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

// Pinceau fixe en haut à droite + fil de peinture vertical dont la longueur
// est liée à la progression du scroll : plus on défile, plus la peinture coule.
export default function PaintDrip() {
  const dripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const drip = dripRef.current;
    const brush = document.querySelector<HTMLElement>(".paint-fx__brush");
    if (!drip) return;

    let raf = 0;

    const apply = () => {
      const docEl = document.documentElement;
      const max = docEl.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

      // Le pinceau est fixe mais sa marge dépend du vh : on re-mesure à chaque fois
      // (getBoundingClientRect sur un élément fixe est peu coûteux) pour rester juste au resize.
      const brushBottom = brush?.getBoundingClientRect().bottom ?? 220;
      const avail = Math.max(40, window.innerHeight - brushBottom - 24);

      // Hauteur de coulure = progression × espace disponible (min 14px : une goutte toujours présente).
      const h = 14 + progress * avail;
      drip.style.setProperty("--drip-h", `${h}px`);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="paint-fx" aria-hidden="true">
      <div className="paint-fx__brush">
        <Image
          src="/paint-brush.png"
          alt=""
          fill
          sizes="130px"
          className="paint-fx__brush-img"
        />
      </div>
      <div className="paint-fx__drip" ref={dripRef}>
        <span className="paint-fx__drip-tip" />
        <span className="paint-fx__drop paint-fx__drop--1" />
      </div>
    </div>
  );
}
