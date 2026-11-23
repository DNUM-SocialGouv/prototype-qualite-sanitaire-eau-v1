import { useEffect, useRef, type ReactNode } from "react";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { fr } from "@codegouvfr/react-dsfr";

type Props = {
  /** Contenu au-dessus de la carte (ex. bascule du type d'eau). */
  entete?: ReactNode;
  carte: ReactNode;
  /** Contenu du panneau : sous la carte sur mobile, à gauche sur desktop. */
  panneau: ReactNode;
  /** Affiché à la place de la carte et du panneau (ex. sélecteur de territoires), qui restent montés. */
  remplacement?: ReactNode;
  /**
   * Desktop (maquette desktop) : l'écran occupe toute la hauteur sous le header, panneau de 405 px
   * à gauche (marges de 24 px) et carte à droite, contrôles en haut.
   */
  pleinEcran?: boolean;
};

/**
 * Mise en page des écrans carte. Le panneau du bas de la maquette n'a pas d'équivalent DSFR
 * (cf. NOTES.md) : il est fixe sous la carte, la poignée est décorative.
 */
export function EcranCarte({ entete, carte, panneau, remplacement, pleinEcran }: Props) {
  const ecran = useRef<HTMLDivElement>(null);

  // Plein écran : hauteur de la fenêtre moins celle du header (mesurée, elle dépend du contenu).
  useEffect(() => {
    if (!pleinEcran) return;
    const header = document.querySelector<HTMLElement>(".fr-header");
    if (!header) return;
    const mesurer = () => ecran.current?.style.setProperty("--hauteur-header", `${header.offsetHeight}px`);
    mesurer();
    const observateur = new ResizeObserver(mesurer);
    observateur.observe(header);
    return () => observateur.disconnect();
  }, [pleinEcran]);

  return (
    <div ref={ecran} className={cx("ecran-carte", pleinEcran && "ecran-carte--plein-ecran")}>
      {entete}
      {remplacement}
      <div className="ecran-carte__corps" hidden={Boolean(remplacement)}>
        <div className="ecran-carte__carte">{carte}</div>
        <section className="ecran-carte__panneau" aria-label="Résultats">
          <div className="ecran-carte__poignee" aria-hidden="true" />
          <div className={pleinEcran ? fr.cx("fr-p-3w") : fr.cx("fr-px-2w", "fr-pt-2w", "fr-pb-6w")}>{panneau}</div>
        </section>
      </div>
    </div>
  );
}
