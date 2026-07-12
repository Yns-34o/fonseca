import { services } from "@/lib/data";

export default function Services() {
  return (
    <section className="services" id="services">
      <div className="container">
        <div className="services__head">
          <div className="sl sl--center rv">Services d&apos;Exception</div>
          <h2 className="st rv rv-d1">
            Des Prestations à la Hauteur
            <br />
            de vos Attentes
          </h2>
          <div className="sep rv rv-d2" />
          <p className="services__sub rv rv-d3">
            Chaque intervention est pensée comme une expérience sur-mesure,
            adaptée à la singularité de votre projet.
          </p>
        </div>
        <div className="services__grid">
          {services.map((s, i) => (
            <div key={s.num} className={`services__card rv rv-d${(i % 3) + 1}`}>
              <div className="services__card-bg">{s.num}</div>
              <div className="services__card-icon">
                <i className={s.icon} />
              </div>
              <h3 className="services__card-title">{s.title}</h3>
              <p className="services__card-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
