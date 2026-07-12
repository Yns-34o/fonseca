"use client";

import { useCallback, useEffect } from "react";
import type { GalleryItem } from "@/lib/data";

// Visionneuse plein écran. Navigation clavier (←/→/Esc) + scroll-lock.
// On utilise ici un <img> natif plutôt que next/image : le CSS .lb__img
// repose sur max-width/max-height + object-fit:contain, incompatibles avec
// le dimensionnement fixe de next/image. L'image est déjà en cache (galerie).
export default function Lightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: {
  images: GalleryItem[];
  index: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}) {
  const n = images.length;
  const go = useCallback(
    (dir: number) => onIndexChange((index + dir + n) % n),
    [index, n, onIndexChange]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [go, onClose]);

  const cur = images[index];

  return (
    <div className="lb open" role="dialog" aria-modal="true" aria-label={cur.title}>
      <button type="button" className="lb__close" onClick={onClose} aria-label="Fermer">
        <i className="ph ph-x" />
      </button>
      <button type="button" className="lb__nav lb__prev" onClick={() => go(-1)} aria-label="Précédent">
        <i className="ph ph-caret-left" />
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="lb__img" src={cur.src} alt={cur.alt} />
      <button type="button" className="lb__nav lb__next" onClick={() => go(1)} aria-label="Suivant">
        <i className="ph ph-caret-right" />
      </button>
      <div className="lb__counter">
        {String(index + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
      </div>
    </div>
  );
}
