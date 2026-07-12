"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScrolled } from "@/hooks/useScrolled";
import { navLinks } from "@/lib/data";

export default function Navbar() {
  const scrolled = useScrolled(50);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Nav solide (fond + texte sombre) dès qu'on défile OU sur toute page interne
  // (où le texte blanc serait invisible sur les fonds clairs).
  const isHome = pathname === "/";
  const solid = scrolled || !isHome;

  // Verrouille le défilement du body quand le menu mobile est ouvert.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <nav className={`nav${solid ? " scrolled" : ""}`} id="nav">
      <div className="container nav__inner">
        <Link href="/" className="nav__logo">
          Fonseca EURL
        </Link>
        <ul className="nav__links">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`nav__link${pathname === l.href ? " active" : ""}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/contact" className="nav__cta">
              Confiez-nous votre projet
            </Link>
          </li>
        </ul>
        <button
          type="button"
          className={`nav__burger${open ? " active" : ""}`}
          id="burger"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <div className={`nav__mobile${open ? " open" : ""}`} id="mobileMenu">
        {navLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="mob-link"
            onClick={() => setOpen(false)}
          >
            {l.label}
          </Link>
        ))}
        <Link
          href="/contact"
          className="mob-link"
          onClick={() => setOpen(false)}
        >
          Contact
        </Link>
      </div>
    </nav>
  );
}
