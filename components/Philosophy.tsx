import Image from "next/image";
import Counter from "./Counter";

const STARS = Array.from({ length: 5 });

export default function Philosophy() {
  return (
    <section className="philosophy" id="philosophie">
      <div className="container">
        <div className="philosophy__panel">
          <div className="philosophy__grid">
            <div className="philosophy__img rv-l">
              <Image
                src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80"
                alt="Détail de finition peinture impeccable"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="philosophy__text">
              <div className="sl rv">Notre Philosophie</div>
              <h2 className="st rv rv-d1">
                L&apos;Exigence d&apos;un Travail
                <br />
                Irréprochable
              </h2>
              <p className="philosophy__body rv rv-d2">
                Fonseca EURL ne se contente pas d&apos;appliquer de la peinture. Nous
                offrons à chaque espace une nouvelle dimension, où la rigueur
                technique rencontre la sensibilité du geste artisanal. Chaque
                chantier est abordé avec la même exigence : des préparations
                méticuleuses, des finitions sans le moindre défaut, et un respect
                absolu de vos lieux de vie.
              </p>
              <p className="philosophy__body rv rv-d3">
                Notre conviction est simple : un travail d&apos;excellence ne souffre
                aucun compromis. C&apos;est cette philosophie qui nous attire une
                clientèle exigeante, qui ne se contente pas du premier venu et nous
                fait confiance, année après année.
              </p>
              <div className="philosophy__stats rv rv-d4">
                <div>
                  <div className="philosophy__stat-num">
                    5/5{" "}
                    <span className="stars">
                      {STARS.map((_, i) => (
                        <i key={i} className="ph-fill ph-star" />
                      ))}
                    </span>
                  </div>
                  <div className="philosophy__stat-label">Note vérifiée</div>
                </div>
                <div>
                  <div className="philosophy__stat-num">
                    <Counter target={15} />
                  </div>
                  <div className="philosophy__stat-label">Années d&apos;expertise</div>
                </div>
                <div>
                  <div className="philosophy__stat-num">
                    <Counter target={250} />
                  </div>
                  <div className="philosophy__stat-label">Projets livrés</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
