import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

// Icônes Phosphor (importés depuis node_modules) — le markup <i class="ph ph-…"> reste inchangé.
import "@phosphor-icons/web/regular";
import "@phosphor-icons/web/bold";
import "@phosphor-icons/web/fill";

import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import RevealOnScroll from "@/components/RevealOnScroll";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fonseca EURL — Peintre en Bâtiment Haut de Gamme · Pontault-Combault",
  description:
    "Fonseca EURL, artisan peintre d'exception en Île-de-France. Finitions irréprochables, accompagnement sur-mesure et réputation 5/5 vérifiée.",
  keywords: [
    "peintre en bâtiment",
    "peinture haut de gamme",
    "Pontault-Combault",
    "Île-de-France",
    "ravalement façade",
    "peinture intérieure",
    "Fonseca EURL",
  ],
  authors: [{ name: "Fonseca EURL" }],
  openGraph: {
    title: "Fonseca EURL — Peintre en Bâtiment Haut de Gamme",
    description:
      "Artisan peintre d'exception en Île-de-France. Finitions irréprochables et réputation 5/5 vérifiée.",
    locale: "fr_FR",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>
        <Preloader />
        <Navbar />
        {children}
        <RevealOnScroll />
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
