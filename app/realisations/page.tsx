import type { Metadata } from "next";
import Gallery from "@/components/Gallery";

export const metadata: Metadata = {
  title: "Réalisations — Fonseca EURL",
  description:
    "Sélection de chantiers de peinture haut de gamme livrés par Fonseca EURL en Île-de-France.",
};

export default function RealisationsPage() {
  return (
    <main className="page">
      <Gallery />
    </main>
  );
}
