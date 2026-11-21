import type { ReactNode } from "react";

type Props = {
  /** Contenu au-dessus de la carte (ex. bascule du type d'eau). */
  entete?: ReactNode;
  carte: ReactNode;
  /** Contenu du panneau : sous la carte sur mobile, à gauche sur desktop. */
  panneau: ReactNode;
  /** Affiché à la place de la carte et du panneau (ex. sélecteur de territoires), qui restent montés. */
  remplacement?: ReactNode;
};

/**
 * Mise en page des écrans carte. Le panneau du bas de la maquette n'a pas d'équivalent DSFR
 * (cf. NOTES.md) : il est fixe sous la carte, la poignée est décorative.
 */
export function EcranCarte({ entete, carte, panneau, remplacement }: Props) {
  return (
    <div className="ecran-carte">
      {entete}
      {remplacement}
      <div className="ecran-carte__corps" hidden={Boolean(remplacement)}>
        <div className="ecran-carte__carte">{carte}</div>
        <section className="ecran-carte__panneau" aria-label="Résultats">
          <div className="ecran-carte__poignee" aria-hidden="true" />
          <div className="fr-px-2w fr-pt-2w fr-pb-6w">{panneau}</div>
        </section>
      </div>
    </div>
  );
}
