import type { Metadata } from "next";
import Services from "@/components/Services";

export const metadata: Metadata = {
  title: "Services — Fonseca EURL",
  description:
    "Peinture intérieure, finitions décoratives, ravalement de façade, peinture extérieure, préparation et conseil par Fonseca EURL.",
};

export default function ServicesPage() {
  return (
    <main className="page">
      <Services />
    </main>
  );
}
