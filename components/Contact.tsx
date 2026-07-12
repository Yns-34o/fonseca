"use client";

import { useState, FormEvent } from "react";
import { contactInfo, serviceOptions } from "@/lib/data";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const onChange =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.includes("@") || !form.service) return;
    setSent(true);
  };

  return (
    <section className="contact" id="contact">
      <div className="container contact__grid">
        <div className="contact__info">
          <h2 className="contact__title">Discutons de votre projet</h2>
          <p className="contact__desc">
            Chaque projet est unique. Prenez le temps de nous exposer vos envies,
            nous vous répondrons dans les plus brefs délais avec une proposition
            adaptée à vos besoins.
          </p>
          <ul className="contact__details">
            {contactInfo.details.map((d, i) => (
              <li key={i}>
                <i className={d.icon} />
                <div>
                  {d.lines.map((line, j) => (
                    <span key={j}>
                      {line}
                      {j < d.lines.length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="contact__form-wrap">
          {sent ? (
            <div className="contact__success vis">
              <i className="ph ph-check-circle" />
              <h3>Demande envoyée</h3>
              <p>
                Merci pour votre message. Nous reviendrons vers vous rapidement
                pour échanger sur votre projet.
              </p>
            </div>
          ) : (
            <form className="contact__form" onSubmit={onSubmit}>
              <div className="contact__form-row">
                <div className="contact__form-group">
                  <label htmlFor="c-name">Nom complet</label>
                  <input
                    id="c-name"
                    type="text"
                    value={form.name}
                    onChange={onChange("name")}
                    placeholder="Votre nom"
                    required
                  />
                </div>
                <div className="contact__form-group">
                  <label htmlFor="c-email">Email</label>
                  <input
                    id="c-email"
                    type="email"
                    value={form.email}
                    onChange={onChange("email")}
                    placeholder="votre@email.fr"
                    required
                  />
                </div>
              </div>
              <div className="contact__form-row">
                <div className="contact__form-group">
                  <label htmlFor="c-phone">Téléphone</label>
                  <input
                    id="c-phone"
                    type="tel"
                    value={form.phone}
                    onChange={onChange("phone")}
                    placeholder="Facultatif"
                  />
                </div>
                <div className="contact__form-group">
                  <label htmlFor="c-service">Service</label>
                  <select
                    id="c-service"
                    value={form.service}
                    onChange={onChange("service")}
                    required
                  >
                    <option value="" disabled>
                      Choisir un service
                    </option>
                    {serviceOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="contact__form-group">
                <label htmlFor="c-message">Message</label>
                <textarea
                  id="c-message"
                  value={form.message}
                  onChange={onChange("message")}
                  placeholder="Décrivez votre projet…"
                  rows={4}
                />
              </div>
              <button type="submit" className="contact__submit">
                Envoyer ma demande <i className="ph ph-arrow-right" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}