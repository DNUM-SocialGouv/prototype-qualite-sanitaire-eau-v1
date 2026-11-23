import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";

type Props = {
  idTitre: string;
  /** Accordéons de la FAQ (colonne de droite). */
  children: ReactNode;
};

/**
 * Questions fréquentes en desktop (maquettes desktop de l'accueil et de la fiche) : titre, introduction
 * et lien vers toutes les questions à gauche (4 colonnes), accordéons à droite (8 colonnes).
 * Espacements de la maquette : 80 px en haut, 96 px en bas.
 */
export function FaqDeuxColonnes({ idTitre, children }: Props) {
  return (
    <section className={fr.cx("fr-container", "fr-pt-10w", "fr-pb-12w")} aria-labelledby={idTitre}>
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
