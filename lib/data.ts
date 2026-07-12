// Source de données unique du site Fonseca EURL.
// Les champs marqués [À REMPLACER] sont des placeholders à renseigner avec les infos réelles.

export type NavLink = { href: string; label: string };

export const navLinks: NavLink[] = [
  { href: "/", label: "Accueil" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/services", label: "Services" },
  { href: "/temoignages", label: "Témoignages" },
  { href: "/reservation", label: "Réserver" },
];

export const heroImage =
  "https://z-cdn-media.chatglm.cn/files/1f0054cf-fdc6-4a3b-975b-dc12244d6e3b.jpg?auth_key=1883363318-a3d57690b9964c1db26b9b1259477607-0-8775c807e67c5462b1840ba68e8bab5e";

export type Service = {
  num: string;
  icon: string; // classe Phosphor, ex. "ph-bold ph-paint-brush"
  title: string;
  desc: string;
};

export const services: Service[] = [
  { num: "01", icon: "ph-bold ph-paint-brush", title: "Peinture Intérieure", desc: "Des murs aux plafonds, chaque surface est préparée avec soin et revêtue d'une finition irréprochable avec des peintures premium." },
  { num: "02", icon: "ph-bold ph-diamond", title: "Finitions Décoratives", desc: "Patines, effets texturés, moulages peints — chaque technique est maîtrisée pour apporter une dimension artistique unique." },
  { num: "03", icon: "ph-bold ph-buildings", title: "Ravalement de Façade", desc: "Nettoyage, traitement, enduit et peinture : nous prenons en charge l'intégralité pour valoriser votre patrimoine." },
  { num: "04", icon: "ph-bold ph-house-line", title: "Peinture Extérieure", desc: "Volets, bardages, garages — nous traitons chaque élément extérieur avec la même exigence que vos intérieurs." },
  { num: "05", icon: "ph-bold ph-shield-check", title: "Préparation & Traitement", desc: "Rebouchage, ponçage, sous-couche : chaque étape est essentielle et nous ne les négligeons jamais." },
  { num: "06", icon: "ph-bold ph-compass", title: "Conseil & Accompagnement", desc: "Nous prenons le temps d'écouter vos envies et de vous conseiller sur les couleurs, finitions et matériaux." },
];

export type GalleryItem = {
  src: string;
  alt: string;
  title: string;
  category: string;
};

export const galleryImages: GalleryItem[] = [
  { src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=80", alt: "Résidence — Salon", title: "Résidence Privée — Salon", category: "Finitions Intérieures" },
  { src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80", alt: "Villa — Ravalement", title: "Villa Contemporaine", category: "Ravalement de Façade" },
  { src: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80", alt: "Suite — Décorative", title: "Suite Premium", category: "Peinture Décorative" },
  { src: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80", alt: "Chambre — Mise en peinture", title: "Chambre Maîtresse", category: "Mise en Peinture" },
  { src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop&q=80", alt: "Espace de vie — Finitions", title: "Espace de Vie", category: "Peinture Intégrale" },
];

export type Testimonial = {
  text: string;
  name: string;
  role: string;
  initials: string;
};

export const testimonials: Testimonial[] = [
  {
    text: "J'ai fait appel à M. Fonseca à plusieurs reprises au fil des années pour des travaux de natures différentes, et je n'ai jamais été déçu. Le résultat est toujours impeccable, les surfaces sont parfaites, et les lieux sont laissés dans un état de propreté remarquable. Mon adresse de confiance, sans hésitation.",
    name: "Khelifik",
    role: "Client fidèle — Avis Google",
    initials: "K",
  },
  {
    // [À REMPLACER] — témoignage client réel
    text: "Un travail d'orfèvre. L'équipe a transformé notre salon avec une finesse d'exécution rare. Ponctualité, propreté et conseil en couleur au top. Je recommande vivement Fonseca EURL.",
    name: "Sophie M.",
    role: "Particulier — Île-de-France",
    initials: "S",
  },
  {
    // [À REMPLACER] — témoignage client réel
    text: "Ravalement de notre façade réalisé dans les règles de l'art. Accompagnement sérieux du devis à la livraison. Le rendu sublime notre maison. Merci pour ce travail soigné.",
    name: "Antoine L.",
    role: "Propriétaire — Pontault-Combault",
    initials: "A",
  },
];

export type ContactDetail = { icon: string; lines: string[] };

export const contactInfo: { details: ContactDetail[] } = {
  details: [
    // [À REMPLACER] — coordonnées réelles
    { icon: "ph ph-map-pin", lines: ["Fonseca EURL", "Pontault-Combault (77340)", "Île-de-France"] },
    { icon: "ph ph-phone", lines: ["+33 X XX XX XX XX"] },
    { icon: "ph ph-envelope-simple", lines: ["contact@fonseca-eurl.fr"] },
    { icon: "ph ph-clock", lines: ["Lun – Ven : 8h00 – 18h00", "Sam : sur rendez-vous"] },
  ],
};

export type TimeSlot = { label: string; avail: boolean };

export const timeSlots: TimeSlot[] = [
  { label: "08:00 – 09:00", avail: true },
  { label: "09:00 – 10:00", avail: true },
  { label: "10:00 – 11:00", avail: false },
  { label: "11:00 – 12:00", avail: true },
  { label: "14:00 – 15:00", avail: true },
  { label: "15:00 – 16:00", avail: false },
  { label: "16:00 – 17:00", avail: true },
  { label: "17:00 – 18:00", avail: true },
];

export const serviceOptions: string[] = [
  "Peinture Intérieure",
  "Finitions Décoratives",
  "Ravalement de Façade",
  "Peinture Extérieure",
  "Préparation & Traitement",
  "Conseil & Accompagnement",
];
