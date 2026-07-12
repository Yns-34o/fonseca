"use client";

import { useEffect } from "react";

// Panneau coulissant "Mentions légales". Contrôlé par son parent (Footer).
// Fermeture : overlay, bouton, ou touche Échap. Scroll-lock du body quand ouvert.
export default function LegalPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <div className={`legal-panel${open ? " open" : ""}`} aria-hidden={!open}>
      <div className="legal-panel__overlay" onClick={onClose} />
      <div
        className="legal-panel__drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mentions légales"
      >
        <div className="legal-panel__head">
          <button
            type="button"
            className="legal-panel__close"
            onClick={onClose}
            aria-label="Fermer"
          >
            <i className="ph ph-x" />
          </button>
        </div>
        <div className="legal-panel__body">
          <div className="lp-tag">Informations légales</div>
          <h2 className="lp-title">Mentions légales</h2>
          <div className="lp-sep" />

          <h3 className="lp-h2">Éditeur du site</h3>
          <table className="lp-table">
            <tbody>
              <tr>
                <td>Dénomination</td>
                <td>Fonseca EURL</td>
              </tr>
              <tr>
                <td>Forme juridique</td>
                <td>
                  Entreprise Unipersonnelle à Responsabilité Limitée {/* [À REMPLACER] */}
                </td>
              </tr>
              <tr>
                <td>Siège social</td>
                <td>Pontault-Combault (77340), France {/* [À REMPLACER] */}</td>
              </tr>
              <tr>
                <td>SIRET</td>
                <td>[À REMPLACER]</td>
              </tr>
              <tr>
                <td>Contact</td>
                <td>contact@fonseca-eurl.fr</td>
              </tr>
            </tbody>
          </table>

          <h3 className="lp-h2">Directeur de la publication</h3>
          <p className="lp-p">
            Le directeur de la publication est le représentant légal de Fonseca
            EURL. {/* [À REMPLACER] — nom du responsable */}
          </p>

          <h3 className="lp-h2">Hébergement</h3>
          <p className="lp-p">
            Le présent site est hébergé par {/* [À REMPLACER] — nom de l’hébergeur */}.
            <br />
            {/* [À REMPLACER] — adresse de l’hébergeur */}
          </p>

          <h3 className="lp-h2">Propriété intellectuelle</h3>
          <p className="lp-p">
            L&apos;ensemble des contenus présents sur ce site (textes, images,
            logos, identité visuelle) est la propriété exclusive de Fonseca EURL
            ou de ses partenaires. Toute reproduction, représentation ou
            diffusion, totale ou partielle, sans autorisation écrite préalable
            est interdite et constitue une contrefaçon.
          </p>

          <h3 className="lp-h2">Données personnelles</h3>
          <p className="lp-p">
            Les informations recueillies via les formulaires (nom, email,
            téléphone) servent uniquement à traiter vos demandes de contact et de
            devis. Conformément au RGPD, vous disposez d&apos;un droit
            d&apos;accès, de rectification et de suppression de vos données.
          </p>
          <ul className="lp-ul">
            <li>
              <strong>Durée de conservation :</strong> les données sont conservées
              le temps nécessaire au traitement de votre demande.
            </li>
            <li>
              <strong>Destinataires :</strong> vos données ne sont jamais cédées à
              des tiers à des fins commerciales.
            </li>
            <li>
              <strong>Vos droits :</strong> vous pouvez les exercer à tout moment
              par email.
            </li>
          </ul>

          <h3 className="lp-h2">Cookies</h3>
          <p className="lp-p">
            Ce site ne dépose aucun cookie publicitaire ni de tracking tiers. Seuls
            des cookies strictement nécessaires au fonctionnement peuvent être
            utilisés.
          </p>

          <div className="lp-footer">
            Mentions légales mises à jour le {/* [À REMPLACER] — date */}.
          </div>
        </div>
      </div>
    </div>
  );
}
