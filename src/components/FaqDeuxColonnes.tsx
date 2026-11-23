import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";

type Props = {
  idTitre: string;
  /** Marges de la section : accueil (80 / 96 px) ou fiche (56 / 64 px), d'après les maquettes. */
  marges?: "accueil" | "fiche";
  /** Accordéons de la FAQ (colonne de droite). */
  children: ReactNode;
};

/**
 * Questions fréquentes en desktop (maquettes desktop de l'accueil et de la fiche) : titre, introduction
 * et lien vers toutes les questions à gauche (4 colonnes), accordéons à droite (8 colonnes).
 * Espacements des maquettes : 80 / 96 px sur l'accueil, 56 / 64 px sur la fiche.
 */
export function FaqDeuxColonnes({ idTitre, marges = "accueil", children }: Props) {
  return (
    <section
      className={fr.cx("fr-container", ...(marges === "fiche" ? (["fr-pt-7w", "fr-pb-8w"] as const) : (["fr-pt-10w", "fr-pb-12w"] as const)))}
      aria-labelledby={idTitre}
    >
      <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
        <div className={fr.cx("fr-col-4")}>
          <h2 id={idTitre}>Questions fréquentes</h2>
          <p>Les réponses aux questions les plus posées sur l’eau du robinet et les eaux de baignade.</p>
          <Link to="/faq" className={fr.cx("fr-link", "fr-icon-arrow-right-line", "fr-link--icon-right")}>
            Voir toutes les questions
          </Link>
        </div>
        <div className={fr.cx("fr-col-8")}>
          {/* Retrait de 56 px : accordéons à x = 584 px et 736 px de large à 1440 px, comme les maquettes. */}
          <div className={fr.cx("fr-accordions-group", "fr-pl-7w")}>{children}</div>
        </div>
      </div>
    </section>
  );
}
