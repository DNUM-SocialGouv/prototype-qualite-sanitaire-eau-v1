import { useMemo } from "react";
import { GeoJSON } from "react-leaflet";
import type { FeatureCollection } from "geojson";
import { fr } from "@codegouvfr/react-dsfr";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { CarteIgn } from "./CarteIgn";
import { LegendeZone } from "./LegendeZone";
import { emprise, type Secteur } from "../lib/secteurs";
import type { InfosCommune } from "../lib/communes";

type Props = {
  secteur: Secteur;
  infos: InfosCommune;
  /** Carte (8 colonnes) et étapes (4 colonnes) côte à côte (maquette desktop). */
  desktop?: boolean;
};

/** Section « Votre secteur » : carte du réseau, puis les étapes de l'eau jusqu'au robinet. */
export function VotreSecteur({ secteur, infos, desktop }: Props) {
  const empriseCarte = useMemo(() => {
    const [ouest, sud, est, nord] = emprise([secteur]);
    return [
      [sud, ouest],
      [nord, est],
    ] as [[number, number], [number, number]];
  }, [secteur]);

  // Desktop (maquette) : libellés et textes en taille normale, titres des étapes en grand.
  const petit = desktop ? "fr-text--md" : "fr-text--sm";
  const titre = desktop ? "fr-text--lg" : undefined;
  const libelle = "fr-mb-1w";

  return (
    <section aria-labelledby="titre-secteur">
      {/* Desktop : titre plus grand et étapes en plus gros caractères (maquettes). */}
      <h2 id="titre-secteur" className={fr.cx(desktop ? "fr-h2" : "fr-h4")}>
        Votre secteur
      </h2>
      <div className={cx(desktop && fr.cx("fr-grid-row", "fr-grid-row--gutters"))}>
      <div className={cx(desktop && fr.cx("fr-col-8"))}>
      {/* Desktop : carte de 736 px de large à 1440 px (56 px de retrait à droite), comme la maquette. */}
      <div className={cx(desktop && fr.cx("fr-mr-7w"))}>
      <div className={cx("carte-fiche", desktop && "carte-fiche--desktop")}>
        <CarteIgn key={secteur.properties.id} emprise={empriseCarte} sansControles className="carte-ign--fiche">
          <GeoJSON data={{ type: "FeatureCollection", features: [secteur] } as FeatureCollection} style={{ className: "carte-ign__zone" }} />
        </CarteIgn>
      </div>
      <LegendeZone horsCarte grande={desktop} texte="Zone = réseau de distribution d’eau" />
      </div>
      </div>
      <div className={cx(desktop && fr.cx("fr-col-4"))}>
      {/* Espacements des maquettes : 8 px sous chaque libellé, 24 px entre les étapes. */}
      <ol className={cx("etapes-eau", desktop && "etapes-eau--desktop", fr.cx(desktop ? "fr-mt-0" : "fr-mt-3w"))}>
        <li>
          <p className={`${fr.cx(petit, libelle)} fr-text-mention--grey`}>Origine de l’eau (captage)</p>
          <p className={fr.cx(titre, "fr-text--bold", "fr-mb-0")}>{infos.captage}</p>
        </li>
        <li>
          <p className={`${fr.cx(petit, libelle)} fr-text-mention--grey`}>Traitement appliqué</p>
          <p className={fr.cx(titre, "fr-text--bold", "fr-mb-1w")}>{infos.traitement.nom}</p>
          <p className={fr.cx(petit, "fr-mb-0")}>{infos.traitement.description}</p>
        </li>
        <li>
          <p className={`${fr.cx(petit, libelle)} fr-text-mention--grey`}>Distribution</p>
          <p className={fr.cx(petit, "fr-mb-0")}>Maîtrise d’ouvrage / exploitant</p>
          <p className={fr.cx(titre, "fr-text--bold", "fr-mb-1w")}>{infos.exploitant}</p>
          <p className={fr.cx(petit, "fr-mb-0")}>Gestionnaire distribution</p>
          <p className={fr.cx("fr-mb-0")}>
            <a className={fr.cx("fr-link", !desktop && "fr-link--sm")} href={infos.gestionnaire.url} target="_blank" rel="noopener noreferrer" title={`${infos.gestionnaire.nom} - nouvelle fenêtre`}>
              {infos.gestionnaire.nom}
            </a>
          </p>
        </li>
        <li>
          <p className={`${fr.cx(petit, libelle)} fr-text-mention--grey`}>Votre robinet</p>
          <p className={fr.cx(titre, "fr-text--bold", "fr-mb-0")}>≈ {infos.habitantsParSecteur.toLocaleString("fr-FR")} habitants desservis</p>
        </li>
      </ol>
      </div>
      </div>
    </section>
  );
}
