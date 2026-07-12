"use client";

import { useState } from "react";
import LegalPanel from "./LegalPanel";

export default function Footer() {
  const [legalOpen, setLegalOpen] = useState(false);
  const year = new Date().getFullYear();

  return (
    <>
      <footer className="footer">
        <div className="paint-pool" aria-hidden="true">
          <span className="paint-pool__feed" />
          <span className="paint-pool__blob" />
        </div>
        <div className="container footer__inner">
          <div className="footer__copy">
            © {year} Fonseca EURL — Peintre en bâtiment haut de gamme,
            Pontault-Combault.
          </div>
          <ul className="footer__links">
            <li>
              <a
                role="button"
                tabIndex={0}
                onClick={() => setLegalOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setLegalOpen(true);
                  }
                }}
              >
                Mentions légales
              </a>
            </li>
            <li>
              <a
                role="button"
                tabIndex={0}
                onClick={() => setLegalOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setLegalOpen(true);
                  }
                }}
              >
                Confidentialité
              </a>
            </li>
          </ul>
        </div>
      </footer>
      <LegalPanel open={legalOpen} onClose={() => setLegalOpen(false)} />
    </>
  );
}
