import Link from "next/link";

// Hero de l'accueil : section transparente, le fond fixe (PaintBackdrop) apparaît
// derrière. Les CTA naviguent vers les routes /contact et /reservation.
export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="container hero__content">
        <p className="hero__tag">Peinture Haut de Gamme · Île-de-France</p>
        <h1 className="hero__title">
          L&apos;Art de Sublimer
          <br />
          vos Espaces de Vie
        </h1>
        <p className="hero__sub">
          Depuis Pontault-Combault, Fonseca EURL transcende l&apos;ordinaire de la
          peinture en bâtiment. Chaque surface est traitée avec la précision
          d&apos;un artisan d&apos;exception.
        </p>
        <div className="hero__actions">
          <Link href="/contact" className="hero__cta">
            Confiez-nous votre projet <i className="ph ph-arrow-right" />
          </Link>
          <Link href="/reservation" className="hero__cta hero__cta--ghost">
            Réserver une consultation
          </Link>
        </div>
      </div>
      <div className="hero__scroll">
        <span>Défiler</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}
