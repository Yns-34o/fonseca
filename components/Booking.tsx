"use client";

import {
  Fragment,
  useState,
  useSyncExternalStore,
  FormEvent,
  ChangeEvent,
} from "react";
import {
  buildMonthGrid,
  WEEKDAYS_FR,
  MONTHS_FR,
  formatLongFR,
} from "@/lib/calendar";
import { timeSlots, serviceOptions } from "@/lib/data";

type Form = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

const EMPTY_FORM: Form = {
  name: "",
  email: "",
  phone: "",
  service: "",
  message: "",
};

// "Aujourd'hui" côté client uniquement, sans mismatch d'hydration :
// useSyncExternalStore renvoie null pendant l'hydration (compatible avec le SSR),
// puis la vraie date côté client.
let cachedToday: Date | null = null;
const subscribeToday = () => () => {};
const snapshotToday = (): Date | null =>
  typeof window === "undefined" ? null : (cachedToday ??= new Date());
const snapshotTodaySSR = (): Date | null => null;

export default function Booking() {
  const today = useSyncExternalStore(
    subscribeToday,
    snapshotToday,
    snapshotTodaySSR
  );

  // `view` n'est modifié que par la navigation (handler d'événement) — jamais
  // par un effet. Par défaut on dérive le mois courant de `today`.
  const [view, setView] = useState<{ year: number; month: number } | null>(null);
  const current =
    view ??
    (today ? { year: today.getFullYear(), month: today.getMonth() } : null);

  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [form, setForm] = useState<Form>(EMPTY_FORM);

  const changeMonth = (dir: number) =>
    setView(() => {
      const base =
        view ??
        (today
          ? { year: today.getFullYear(), month: today.getMonth() }
          : { year: 0, month: 0 });
      let m = base.month + dir;
      let y = base.year;
      if (m < 0) {
        m = 11;
        y--;
      } else if (m > 11) {
        m = 0;
        y++;
      }
      return { year: y, month: m };
    });

  const selectDay = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setStep(2);
  };

  const onChange =
    (field: keyof Form) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const isValid =
    form.name.trim() !== "" &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.service !== "";

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValid || !selectedSlot) return;
    setStep(3);
  };

  const cells =
    today && current ? buildMonthGrid(current.year, current.month, today) : [];

  return (
    <section className="booking" id="reservation">
      <div className="container">
        <div className="booking__head">
          <div className="sl sl--center rv">Réservation</div>
          <h2 className="st rv rv-d1">Planifier votre consultation</h2>
          <p className="booking__sub rv rv-d2">
            Sélectionnez une date et un créneau. Nous confirmerons votre
            rendez-vous par email.
          </p>
        </div>

        <div className="steps">
          {[1, 2, 3].map((s, i) => (
            <Fragment key={s}>
              <div
                className={`steps__dot${step === s ? " active" : ""}${
                  step > s ? " done" : ""
                }`}
              >
                {step > s ? <i className="ph-bold ph-check" /> : s}
              </div>
              {i < 2 && <div className={`steps__line${step > s ? " done" : ""}`} />}
            </Fragment>
          ))}
        </div>

        <div className="booking__panel">
          {/* ÉTAPE 1 — Calendrier */}
          <div className={`bk-step${step === 1 ? " active" : ""}`}>
            {!today || !current ? (
              <div className="cal__loading">
                <i className="ph ph-circle-notch" /> Chargement du calendrier…
              </div>
            ) : (
              <div className="cal">
                <div className="cal__header">
                  <div className="cal__title">
                    {MONTHS_FR[current.month]} {current.year}
                  </div>
                  <div className="cal__nav">
                    <button
                      type="button"
                      onClick={() => changeMonth(-1)}
                      aria-label="Mois précédent"
                    >
                      <i className="ph ph-caret-left" />
                    </button>
                    <button
                      type="button"
                      onClick={() => changeMonth(1)}
                      aria-label="Mois suivant"
                    >
                      <i className="ph ph-caret-right" />
                    </button>
                  </div>
                </div>
                <div className="cal__weekdays">
                  {WEEKDAYS_FR.map((w) => (
                    <div key={w} className="cal__wd">
                      {w}
                    </div>
                  ))}
                </div>
                <div className="cal__days">
                  {cells.map((c, i) => {
                    if (c.isEmpty)
                      return <div key={i} className="cal__day cal__day--empty" />;
                    const cls = ["cal__day"];
                    if (c.isPast) cls.push("cal__day--past");
                    else if (c.isSunday) cls.push("cal__day--off");
                    else cls.push("cal__day--work");
                    if (c.isToday) cls.push("cal__day--today");
                    if (selectedDate && c.date.getTime() === selectedDate.getTime())
                      cls.push("cal__day--selected");
                    return (
                      <div
                        key={i}
                        className={cls.join(" ")}
                        onClick={() => c.isWorkable && selectDay(c.date)}
                        role={c.isWorkable ? "button" : undefined}
                        tabIndex={c.isWorkable ? 0 : undefined}
                      >
                        {c.day}
                      </div>
                    );
                  })}
                </div>
                <div className="cal__legend">
                  <div className="cal__legend-item">
                    <span className="cal__legend-dot cal__legend-dot--avail" />{" "}
                    Disponible
                  </div>
                  <div className="cal__legend-item">
                    <span className="cal__legend-dot" /> Indisponible
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ÉTAPE 2 — Créneaux + formulaire */}
          <div className={`bk-step${step === 2 ? " active" : ""}`}>
            <div className="slots__title">Choisissez un créneau</div>
            {selectedDate && (
              <div className="slots__date">{formatLongFR(selectedDate)}</div>
            )}
            <div className="slots__grid">
              {timeSlots.map((slot) => (
                <div
                  key={slot.label}
                  className={`slot${selectedSlot === slot.label ? " selected" : ""}${
                    !slot.avail ? " unavail" : ""
                  }`}
                  onClick={() => slot.avail && setSelectedSlot(slot.label)}
                  role={slot.avail ? "button" : undefined}
                  tabIndex={slot.avail ? 0 : undefined}
                  aria-disabled={!slot.avail}
                >
                  {slot.label}
                </div>
              ))}
            </div>

            <form className="bk-form" onSubmit={onSubmit}>
              <div className="bk-form__row">
                <div className="bk-form__group">
                  <label htmlFor="b-name">Nom complet</label>
                  <input
                    id="b-name"
                    value={form.name}
                    onChange={onChange("name")}
                    placeholder="Votre nom"
                  />
                </div>
                <div className="bk-form__group">
                  <label htmlFor="b-email">Email</label>
                  <input
                    id="b-email"
                    type="email"
                    value={form.email}
                    onChange={onChange("email")}
                    placeholder="votre@email.fr"
                  />
                </div>
              </div>
              <div className="bk-form__row">
                <div className="bk-form__group">
                  <label htmlFor="b-phone">Téléphone</label>
                  <input
                    id="b-phone"
                    type="tel"
                    value={form.phone}
                    onChange={onChange("phone")}
                    placeholder="Facultatif"
                  />
                </div>
                <div className="bk-form__group">
                  <label htmlFor="b-service">Service</label>
                  <select
                    id="b-service"
                    value={form.service}
                    onChange={onChange("service")}
                  >
                    <option value="" disabled>
                      Choisir…
                    </option>
                    {serviceOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="bk-form__group">
                <label htmlFor="b-message">Message</label>
                <textarea
                  id="b-message"
                  value={form.message}
                  onChange={onChange("message")}
                  placeholder="Précisions éventuelles…"
                />
              </div>

              <div className="bk-summary">
                <div className="bk-summary__row">
                  <span className="bk-summary__label">Date</span>
                  <span className="bk-summary__value">
                    {selectedDate ? formatLongFR(selectedDate) : "—"}
                  </span>
                </div>
                <div className="bk-summary__row">
                  <span className="bk-summary__label">Créneau</span>
                  <span className="bk-summary__value">
                    {selectedSlot ?? "—"}
                  </span>
                </div>
                <div className="bk-summary__row">
                  <span className="bk-summary__label">Service</span>
                  <span className="bk-summary__value">{form.service || "—"}</span>
                </div>
              </div>

              <div className="bk-btns">
                <button
                  type="button"
                  className="bk-btn bk-btn--ghost"
                  onClick={() => setStep(1)}
                >
                  <i className="ph ph-caret-left" /> Retour
                </button>
                <button
                  type="submit"
                  className="bk-btn bk-btn--primary"
                  disabled={!selectedSlot || !isValid}
                >
                  Confirmer <i className="ph ph-check" />
                </button>
              </div>
            </form>
          </div>

          {/* ÉTAPE 3 — Succès */}
          <div className={`bk-step${step === 3 ? " active" : ""}`}>
            <div className="bk-success">
              <div className="bk-success__icon">
                <i className="ph ph-check" />
              </div>
              <h3>Rendez-vous demandé</h3>
              <p>
                {`Merci${
                  form.name ? `, ${form.name}` : ""
                } ! Votre demande de rendez-vous${
                  selectedDate ? ` pour le ${formatLongFR(selectedDate)}` : ""
                }${selectedSlot ? ` à ${selectedSlot}` : ""} a bien été enregistrée. Une confirmation vous sera envoyée${
                  form.email ? ` à ${form.email}` : ""
                }.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
