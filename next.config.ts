import type { NextConfig } from "next";

// Le projet contient un sous-dossier `fonseca/` (ancien doublon) et le parent
// a aussi un `package-lock.json` : Next risquait d'inférer la mauvaise racine de
// workspace (warning + instabilité/panic du dev server Turbopack). On force la
// racine sur le dossier d'où `next` est lancé.
const projectRoot = process.cwd();

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  outputFileTracingRoot: projectRoot,
  images: {
    // Autorise l'optimisation next/image pour les hôtes distants utilisés par le site.
    // `search` est volontairement omis : les URL Unsplash (?w=…&q=…) et le CDN hero
    // (auth_key=…) portent une query string qui doit passer le filtre.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "z-cdn-media.chatglm.cn", pathname: "/**" },
    ],
    // ── Repli si vos images ne s'affichent pas en local ─────────────────────────
    // L'optimiseur fetch les images côté serveur Node. Sur certains postes, le
    // magasin de certificats de Node ne valide pas le certificat des CDN
    // (erreur « UNABLE_TO_VERIFY_LEAF_SIGNATURE » / _next/image → 500).
    // En production (Vercel…) cela fonctionne sans rien changer.
    // Pour afficher les images en local dans ce cas, décommentez la ligne suivante :
    // unoptimized: true,
  },
};

export default nextConfig;
