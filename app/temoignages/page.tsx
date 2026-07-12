import type { Metadata } from "next";
import Testimonials from "@/components/Testimonials";

export const metadata: Metadata = {
  title: "Témoignages — Fonseca EURL",
  description:
    "Avis clients vérifiés : la réputation 5/5 de Fonseca EURL, artisan peintre en bâtiment en Île-de-France.",
};

export default function TemoignagesPage() {
  return (
    <main className="page">
      <Testimonials />
    </main>
  );
}
