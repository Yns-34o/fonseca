// Génération de la grille du mois pour le calendrier de réservation.
// Semaine débutant lundi (convention française). Jours ouvrables : lundi à samedi.

export const WEEKDAYS_FR = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"] as const;

export const MONTHS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
] as const;

export type CalCell = {
  day: number;
  date: Date;
  isEmpty: boolean;
  isPast: boolean;
  isToday: boolean;
  isSunday: boolean;
  isWorkable: boolean;
};

const empty = (): CalCell => ({
  day: 0,
  date: new Date(0),
  isEmpty: true,
  isPast: false,
  isToday: false,
  isSunday: false,
  isWorkable: false,
});

// Construit les cellules d'un mois (avec cases vides de tête pour aligner sur lundi).
export function buildMonthGrid(year: number, month: number, today: Date): CalCell[] {
  const first = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0).getDate();
  // getDay : 0=dimanche … 6=samedi. On veut lundi en index 0 → (getDay + 6) % 7.
  const leading = (first.getDay() + 6) % 7;

  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const cells: CalCell[] = [];

  for (let i = 0; i < leading; i++) cells.push(empty());

  for (let d = 1; d <= lastDay; d++) {
    const date = new Date(year, month, d);
    const isSunday = date.getDay() === 0;
    cells.push({
      day: d,
      date,
      isEmpty: false,
      isPast: date.getTime() < startOfToday.getTime(),
      isToday: date.getTime() === startOfToday.getTime(),
      isSunday,
      isWorkable: date.getTime() >= startOfToday.getTime() && !isSunday,
    });
  }

  return cells;
}

// Formate une date en français long, ex. « lundi 14 juillet 2025 ».
export function formatLongFR(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
