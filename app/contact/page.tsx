import type { Metadata } from "next";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact — Fonseca EURL",
  description:
    "Confiez votre projet de peinture à Fonseca EURL. Exposez-nous vos envies, nous vous répondons rapidement.",
};

export default function ContactPage() {
  return (
    <main className="page">
      <Contact />
    </main>
  );
}
