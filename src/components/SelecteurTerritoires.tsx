import { useEffect, useId, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { fr } from "@codegouvfr/react-dsfr";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { TERRITOIRES, silhouette, type IdTerritoire } from "../lib/territoires";

type PropsGrille = {
  /** Option cochée. */
  actif: IdTerritoire;
  /** Changement d'option cochée (flèches du clavier, clic). */
  onActif: (id: IdTerritoire) => void;
  /** Validation : clic sur une vignette, ou Entrée / Espace sur l'option cochée. */
  onChoix: (id: IdTerritoire) => void;
  className?: string;
  groupe?: RefObject<HTMLFieldSetElement | null>;
};

/**
 * Grille des territoires : groupe de boutons radio sur le modèle des boutons radio riches DSFR,
 * en vignettes (adaptation, cf. NOTES.md).
 */
export function GrilleTerritoires({ actif, onActif, onChoix, className, groupe }: PropsGrille) {
  const id = useId();

  const valider = (event: KeyboardEvent<HTMLInputElement>, territoire: IdTerritoire) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    // Espace ne déclenche pas le clic natif : la validation passe par ici.
    event.preventDefault();
    onChoix(territoire);
  };

  return (
    <fieldset ref={groupe} className={cx("selecteur-territoires__groupe", className)}>
      <legend className={fr.cx("fr-sr-only")}>Territoire à afficher</legend>
      {TERRITOIRES.map((territoire) => (
        <div key={territoire.id} className="selecteur-territoires__option">
          <input
            type="radio"
            id={`${id}-${territoire.id}`}
            name={`${id}-territoire`}
            className={fr.cx("fr-sr-only")}
            checked={actif === territoire.id}
            onChange={() => onActif(territoire.id)}
            onKeyDown={(event) => valider(event, territoire.id)}
          />
          {/* Le clic (souris ou doigt) se fait sur l'étiquette : il choisit directement le territoire. */}
          <label
            htmlFor={`${id}-${territoire.id}`}
            className={fr.cx("fr-text--sm", "fr-text--bold")}
            onClick={() => onChoix(territoire.id)}
          >
            <span
              className="selecteur-territoires__silhouette"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: silhouette(territoire.id) }}
            />
            <span className="selecteur-territoires__nom">{territoire.nom}</span>
          </label>
        </div>
      ))}
    </fieldset>
  );
}

type Props = {
  /** Territoire affiché sur la carte, présélectionné à l'ouverture. */
  valeur: IdTerritoire;
  onChoix: (id: IdTerritoire) => void;
  onFermer: () => void;
};

/**
 * Sélecteur de territoires (mobile), à la place de la carte et de la recherche.
 * Un clic choisit le territoire ; au clavier, les flèches changent l'option active et
 * Entrée ou Espace la valident. ✕ et Échap ferment sans changer de territoire.
 */
export function SelecteurTerritoires({ valeur, onChoix, onFermer }: Props) {
  const id = useId();
  const [actif, setActif] = useState(valeur);
  const groupe = useRef<HTMLFieldSetElement>(null);

  // À l'ouverture, focus sur le territoire sélectionné.
  useEffect(() => {
    groupe.current?.querySelector<HTMLInputElement>("input:checked")?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onFermer();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onFermer]);

  return (
    <section className="selecteur-territoires" aria-labelledby={`${id}-titre`}>
      <div className="selecteur-territoires__entete">
        <h2 id={`${id}-titre`} className={fr.cx("fr-text--md", "fr-text--bold", "fr-mb-0")}>
          <span className={fr.cx("fr-icon-france-line", "fr-mr-1w")} aria-hidden="true" />
          Sélecteur de territoires
        </h2>
        <Button
          iconId="fr-icon-close-line"
          priority="tertiary no outline"
          title="Fermer le sélecteur de territoires"
          onClick={onFermer}
        />
      </div>
      <p className={fr.cx("fr-text--sm", "fr-mx-2w", "fr-my-1w")}>Choisissez le territoire à afficher sur la carte.</p>
      <GrilleTerritoires actif={actif} onActif={setActif} onChoix={onChoix} groupe={groupe} />
    </section>
  );
}

type PropsBande = {
  /** Territoire affiché sur la carte. */
  valeur: IdTerritoire;
  /** Choix d'un territoire (clic, flèches, Entrée / Espace) : la carte se recentre directement. */
  onChoix: (id: IdTerritoire) => void;
};

/**
 * Territoires en desktop (maquette « bande sur la carte ») : bande blanche posée en bas de la carte,
 * avec les 10 vignettes sur une ligne. Même groupe de boutons radio que le sélecteur mobile.
 */
export function BandeTerritoires({ valeur, onChoix }: PropsBande) {
  const id = useId();
  return (
    <section className="bande-territoires" aria-labelledby={`${id}-titre`}>
      <h2 id={`${id}-titre`} className={fr.cx("fr-text--md", "fr-text--bold", "fr-mb-1w")}>
        Territoires
      </h2>
      <GrilleTerritoires
        actif={valeur}
        onActif={onChoix}
        onChoix={onChoix}
        className="selecteur-territoires__groupe--bande"
      />
    </section>
  );
}
