import type { Metadata } from "next";
import Booking from "@/components/Booking";

export const metadata: Metadata = {
  title: "Réserver une consultation — Fonseca EURL",
  description:
    "Planifiez votre consultation avec Fonseca EURL : choisissez une date et un créneau, nous confirmons par email.",
};

export default function ReservationPage() {
  return (
    <main className="page">
      <Booking />
    </main>
  );
}
