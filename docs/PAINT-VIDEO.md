# Vidéo « peinture qui se révèle au scroll »

Le fond de l'accueil (`components/PaintBackdrop.tsx`) peut afficher une vidéo
cinématique dont la **position de lecture est pilotée par le scroll** : plus on
défile, plus le pinceau « peint » le site. La vidéo ne se lit jamais en continu,
c'est le défilement qui l'avance ou la recule (frame par frame).

Ce guide explique comment **déposer la vidéo sans toucher au code**.

---

## 1. Déposer les fichiers

Placez les deux fichiers ici (formats complets requis pour couvrir tous les navigateurs) :

```
public/paint-reveal.webm   ← WebM / VP9 (Chrome, Firefox, Edge) — le plus léger
public/paint-reveal.mp4    ← MP4 / H.264 (Safari, repli universel)
```

Aucun changement de code ni de configuration :
- `next dev` recharge automatiquement le dossier `public/` → rafraîchir la page.
- En production, relancer un `next build` après ajout des fichiers.

**Pour désactiver** la vidéo : supprimez ou renommez les deux fichiers. Le composant
retombe automatiquement sur l'effet d'origine (image fixe + ligne SVG qui se peint
au scroll) via le gestionnaire d'erreur de la balise `<video>`.

> La vidéo ne s'affiche que sur **desktop** (≥ 768px) **sans** « mouvement réduit ».
> Sur mobile et si l'utilisateur demande `prefers-reduced-motion`, c'est le fond
> statique qui s'affiche (perf + accessibilité).

---

## 2. Réglages d'export (à donner à l'outil IA ou à ffmpeg)

Le succès de l'effet dépend beaucoup de l'encodage : le **scrubbing** (`currentTime`)
ne s'arrête que sur des **keyframes**, d'où l'importance d'un GOP court.

| Réglage | Valeur conseillée | Pourquoi |
| --- | --- | --- |
| Durée | **4 à 6 s** | Mappe ~3 viewports de scroll. Trop court = saccades, trop long = fichier lourd. |
| Résolution | **1920×1080 (16:9)** | Le conteneur est `object-fit:cover`. Éviter le 4K (seek + poids). |
| Keyframe (GOP) | tous les **2-5 frames** (`-g 60`) | **Critique** : GOP long = scrubbing saccadé. Désactiver la « scene detection ». |
| Piste audio | **aucune** | Vidéo en pause + muette → l'audio est du gaspillage. |
| Contenu | pinceau démarrant ~5 %, **entièrement révélé vers 95 %** | Évite une frame vide aux positions de scroll extrêmes. |

### Cibles de qualité

- **WebM / VP9** : CRF 31-35, ~1,5-2,5 Mbps, `row-mt=1`, `tile-columns=2`. Cible ≤ 3 Mo.
- **MP4 / H.264** : CRF 23-26, preset `slow`, `-movflags +faststart` (moov atom en tête = métadonnées immédiates). Cible ≤ 5 Mo.

### Exemples ffmpeg

```bash
# WebM / VP9 (prioritaire — le navigateur essaie d'abord ce source)
ffmpeg -i input.mov -an -c:v libvpx-vp9 -b:v 2M -crf 33 -g 60 -row-mt 1 -tile-columns 2 public/paint-reveal.webm

# MP4 / H.264 (repli Safari)
ffmpeg -i input.mov -an -c:v libx264 -crf 24 -preset slow -g 60 -movflags +faststart public/paint-reveal.mp4
```

---

## 3. Vérification rapide

1. `npm run dev` puis ouvrez l'accueil.
2. Scrollez vers le bas → la vidéo avance ; remontez → elle recule (fluide).
3. DevTools → onglet Network → filtrez `paint-reveal` → les réponses doivent être
   en **206 Partial Content** (le serveur honore les requêtes `Range:`, indispensables
   au scrubbing).
4. Supprimez les deux fichiers → l'effet SVG d'origine réapparaît sans erreur.

---

## Notes techniques

- **Range requests** : `next dev` et `next start` (Node), ainsi que Vercel, servent
  les fichiers de `public/` avec `Accept-Ranges`. Un hébergement statique « maison »
  qui retirerait les en-têtes `Range:` forcerait le téléchargement complet avant tout
  scrubbing → à valider sur la cible de déploiement.
- Aucune dépendance externe (pas de GSAP) : l'effet réutilise le pattern maison
  `requestAnimationFrame` + `window.scrollY` déjà utilisé par les autres effets
  peinture-au-scroll du site.
- Pas de composant `next/video` : la doc Next.js 16 recommande la balise `<video>`
  HTML native pour les vidéos auto-hébergées pilotées manuellement.
