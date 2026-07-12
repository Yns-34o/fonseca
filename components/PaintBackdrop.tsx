"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

// Évite l'avertissement useLayoutEffect lors du SSR d'un composant client.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Fond fixe plein écran de l'accueil : un « océan de peinture » vivant dessiné
// sur <canvas>. Surface qui ondule en continu (vagues glossy, cellules
// lumineuses, reflets mouillés, coulures) et réagit au scroll : plus on défile,
// plus la marée monte et se densifie ; quand on remonte, elle redescend et se
// calme (entièrement réversible). Le canvas est placé AU-DESSUS des voiles pour
// ne jamais être assombri.
export default function PaintBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [reduce, setReduce] = useState(false);

  // Mesure du viewport + détection du mouvement réduit (réactif).
  useIsoLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const measure = () =>
      setSize({ w: window.innerWidth, h: window.innerHeight });
    measure();
    const onReduce = (e: MediaQueryListEvent) => setReduce(e.matches);
    mq.addEventListener("change", onReduce);
    window.addEventListener("resize", measure);
    return () => {
      mq.removeEventListener("change", onReduce);
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Boucle d'animation + lecture du scroll.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !size) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── Paramètres visuels ──────────────────────────────────────────────
    const W = size.w;
    const H = size.h;
    const isSmall = W < 768;
    // Palette 0=ivoire, 1=or, 2=rouge (le rouge reste rare, accent seulement).
    const palette = ["255,250,240", "200,165,105", "216,70,86"];
    const hueFor = (i: number) => (i % 6 === 0 ? 2 : i % 2 === 0 ? 0 : 1);
    // Marée : déjà visible en haut de page, monte avec le scroll.
    const tideTop = H * 0.1; // marée haute (scroll max)
    const tideBottom = H * 0.6; // marée basse (haut de page) — déjà présente
    const bands = 4;
    const bandGap = H * 0.11;
    const blobCount = isSmall ? 16 : 30;
    const dripCount = isSmall ? 4 : 7;

    // ── Résolution du canvas (DPR plafonné pour les perfs) ──────────────
    const dpr = Math.min(window.devicePixelRatio || 1, isSmall ? 1.25 : 2);
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // ── Champ de cellules (positions déterministes) ─────────────────────
    const blobs = Array.from({ length: blobCount }, (_, i) => ({
      x: ((i + 0.5) / blobCount) * W,
      r: 36 + ((i * 53) % 80),
      speed: 0.18 + (i % 7) * 0.06,
      phase: (i * 1.37) % (Math.PI * 2),
      hue: hueFor(i),
    }));
    const drips = Array.from({ length: dripCount }, (_, i) => ({
      x: W * (0.08 + (i / dripCount) * 0.86 + ((i * 31) % 11) / 100),
      len: 0.5 + (i % 3) * 0.25,
      w: 2 + (i % 2),
      phase: (i * 2.1) % (Math.PI * 2),
    }));

    // ── Progression du scroll (lissée → réversibilité fluide) ───────────
    let progress = 0;
    let target = 0;
    const readTarget = () => {
      const main = document.getElementById("home-main");
      const max = main
        ? main.scrollHeight - window.innerHeight
        : document.documentElement.scrollHeight - window.innerHeight;
      target = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };

    const surfaceY = (p: number, x: number, t: number, ampMul: number) => {
      const base = tideBottom - p * (tideBottom - tideTop);
      const amp = (10 + p * 24) * ampMul;
      return (
        base +
        Math.sin(x / 70 + t * 0.5) * amp +
        Math.sin(x / 34 - t * 0.8) * amp * 0.45 +
        Math.sin(x / 130 + t * 0.25) * amp * 0.6
      );
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      const p = progress;

      // 1) Brume colorée atmosphérique (en hauteur).
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < 4; i++) {
        const cx = W * (0.2 + i * 0.22) + Math.sin(t * 0.1 + i) * 80;
        const cy = H * (0.18 + (i % 2) * 0.16) + Math.cos(t * 0.13 + i) * 40;
        const rr = Math.max(160, W * (0.26 + p * 0.12));
        const col = palette[i % 2 === 0 ? 0 : 1];
        const a = 0.05 + p * 0.06;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr);
        g.addColorStop(0, `rgba(${col},${a})`);
        g.addColorStop(1, `rgba(${col},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, rr, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2) Masse de peinture (vagues glossy superposées).
      ctx.globalCompositeOperation = "source-over";
      for (let b = 0; b < bands; b++) {
        const ampMul = 1 - b * 0.16;
        const yTop = surfaceY(p, W * 0.5, t, ampMul) + b * bandGap;
        ctx.beginPath();
        ctx.moveTo(0, H);
        for (let x = 0; x <= W; x += 14) {
          ctx.lineTo(x, surfaceY(p, x, t, ampMul) + b * bandGap);
        }
        ctx.lineTo(W, H);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, yTop - 20, 0, H);
        const a = (0.34 + p * 0.34) * (1 - b * 0.16);
        grad.addColorStop(0, `rgba(246,240,228,${a})`);
        grad.addColorStop(0.16, `rgba(200,165,105,${a * 0.8})`);
        grad.addColorStop(0.5, `rgba(120,80,55,${a * 0.5})`);
        grad.addColorStop(1, `rgba(16,13,11,0.78)`);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // 3) Cellules de peinture glossy (additif) — se densifient au scroll.
      ctx.globalCompositeOperation = "lighter";
      const active = Math.round(16 + p * (blobCount - 16));
      for (let i = 0; i < active; i++) {
        const bl = blobs[i];
        const x = bl.x + Math.sin(t * bl.speed + bl.phase) * (40 + p * 50);
        const surf = surfaceY(p, x, t, 1);
        const y =
          surf +
          20 +
          Math.cos(t * bl.speed * 0.8 + bl.phase) * (18 + p * 30) +
          (i % 3) * 26;
        const r = Math.max(8, bl.r * (0.6 + p * 0.7));
        const col = palette[bl.hue];
        const a = 0.18 + p * 0.14;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgba(${col},${a})`);
        g.addColorStop(0.45, `rgba(${col},${a * 0.4})`);
        g.addColorStop(1, `rgba(${col},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4) Ligne de surface mouillée (reflet glossy).
      ctx.strokeStyle = `rgba(255,250,240,${0.13 + p * 0.15})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 10) {
        const y = surfaceY(p, x, t, 1);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 5) Coulures : la peinture dégouline depuis la surface.
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < dripCount; i++) {
        const dr = drips[i];
        const top = surfaceY(p, dr.x, t, 1) + 6;
        const len = Math.max(0, dr.len * (70 + p * H * 0.4));
        if (len < 4) continue;
        const col = palette[1];
        const g = ctx.createLinearGradient(dr.x, top, dr.x, top + len);
        g.addColorStop(0, `rgba(${col},${0.2 + p * 0.12})`);
        g.addColorStop(1, `rgba(${col},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(dr.x - dr.w / 2, top, dr.w, len);
        ctx.beginPath();
        ctx.arc(dr.x, top + len, Math.max(1.5, dr.w), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col},${0.14 + p * 0.1})`;
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
    };

    // ── Boucle ──────────────────────────────────────────────────────────
    let raf = 0;
    let t = 0;
    let running = true;
    const animate = () => {
      progress += (target - progress) * 0.07;
      t += 0.016;
      draw(t);
      if (running) raf = requestAnimationFrame(animate);
    };

    const onScroll = () => readTarget();
    readTarget();

    if (reduce) {
      running = false;
      progress = 0.3;
      target = 0.3;
      draw(0);
    } else {
      raf = requestAnimationFrame(animate);
    }

    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reduce) {
        running = true;
        raf = requestAnimationFrame(animate);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [size, reduce]);

  // Canvas en DERNIER : il se pose au-dessus des voiles pour ne pas être assombri.
  return (
    <div className="paint-bd" aria-hidden="true">
      <div className="paint-bd__bg" />
      <div className="paint-bd__scrim paint-bd__scrim--top" />
      <div className="paint-bd__scrim paint-bd__scrim--bottom" />
      <canvas ref={canvasRef} className="paint-bd__fluid" />
    </div>
  );
}
