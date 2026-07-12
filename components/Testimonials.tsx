import { testimonials } from "@/lib/data";

const STARS5 = Array.from({ length: 5 });

export default function Testimonials() {
  return (
    <section className="testimonials" id="temoignages">
      <div className="container">
        <div className="rating-banner rv">
          <div className="rating-banner__stars">
            {STARS5.map((_, i) => (
              <i key={i} className="ph-fill ph-star" />
            ))}
          </div>
          <p className="rating-banner__text">
            Note <strong>5/5</strong> vérifiée sur Google &amp; Pages Jaunes
          </p>
        </div>
        <div className="testimonials__head">
          <div className="sl sl--center rv rv-d1">Témoignages</div>
          <h2 className="st rv rv-d2">La Confiance de nos Clients</h2>
        </div>
        <div className="testimonials__grid">
          {testimonials.map((t, i) => (
            <div key={i} className={`testimonials__card rv rv-d${(i % 3) + 1}`}>
              <div className="testimonials__card-deco">&rdquo;</div>
              <div className="testimonials__card-stars">
                {STARS5.map((_, j) => (
                  <i key={j} className="ph-fill ph-star" />
                ))}
              </div>
              <p className="testimonials__card-text">{t.text}</p>
              <div className="testimonials__card-author">
                <div className="testimonials__card-avatar">{t.initials}</div>
                <div>
                  <div className="testimonials__card-name">{t.name}</div>
                  <div className="testimonials__card-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}