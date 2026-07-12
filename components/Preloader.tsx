"use client";

import { useEffect, useState } from "react";

// Écran de chargement. Un failsafe CSS (animation `preloaderDie`, 4 s) le masque
// quoiqu'il arrive ; ce composant ajoute `.done` dès que la fenêtre est chargée.
export default function Preloader() {
  const [done, setDone] = useState(true); // TEMP capture

  useEffect(() => {
    const finish = () => setDone(true);

    if (document.readyState === "complete") {
      const t = setTimeout(finish, 500);
      return () => clearTimeout(t);
    }

    window.addEventListener("load", finish);
    const failsafe = setTimeout(finish, 3500);
    return () => {
      window.removeEventListener("load", finish);
      clearTimeout(failsafe);
    };
  }, []);

  return (
    <div className={`preloader${done ? " done" : ""}`} id="preloader">
      <span className="preloader__text">Fonseca EURL</span>
      <div className="preloader__brush" aria-hidden="true">
        <div className="preloader__stroke" />
        <div className="preloader__tip" />
      </div>
    </div>
  );
}
