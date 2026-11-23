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
 */
export function FaqDeuxColonnes({ idTitre, children }: Props) {
  return (
    <section className={fr.cx("fr-container", "fr-py-8w")} aria-labelledby={idTitre}>
      <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
        <div className={fr.cx("fr-col-4")}>
          <h2 id={idTitre}>Questions fréquentes</h2>
          <p>Les réponses aux questions les plus posées sur l’eau du robinet et les eaux de baignade.</p>
          <Link to="/faq" className={fr.cx("fr-link", "fr-icon-arrow-right-line", "fr-link--icon-right")}>
            Voir toutes les questions
          </Link>
        </div>
        <div className={fr.cx("fr-col-8")}>
          <div className={fr.cx("fr-accordions-group")}>{children}</div>
        </div>
      </div>
    </section>
  );
}
