"use client";

import { useState } from "react";
import Image from "next/image";
import { galleryImages } from "@/lib/data";
import Lightbox from "./Lightbox";

// Delays de révélation alternés (1→d1, 2→d2, 3→d1, 4→d2) comme sur l'original.
const DELAYS = ["", " rv-d1", " rv-d2", " rv-d1", " rv-d2"];

export default function Gallery() {
  const [idx, setIdx] = useState<number | null>(null);

  return (
    <section className="gallery" id="realisations">
      <div className="container">
        <div className="gallery__header">
          <div>
            <div className="sl rv">Réalisations</div>
            <h2 className="st st--light rv rv-d1">L&apos;Éloge du Détail</h2>
          </div>
          <div className="gallery__counter rv rv-d2">
            <span>05</span> projets sélectionnés
          </div>
        </div>
        <div className="gallery__grid">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className={`gallery__item rv-s${DELAYS[i] ?? ""}`}
              onClick={() => setIdx(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setIdx(i);
                }
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 45vw"
              />
              <div className="gallery__item-over">
                <div>
                  <h4>{img.title}</h4>
                  <span>{img.category}</span>
                </div>
              </div>
              <div className="gallery__item-zoom">
                <i className="ph ph-arrows-out" />
              </div>
            </div>
          ))}
        </div>
      </div>
      {idx !== null && (
        <Lightbox
          images={galleryImages}
          index={idx}
          onClose={() => setIdx(null)}
          onIndexChange={setIdx}
        />
      )}
    </section>
  );
}
