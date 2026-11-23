import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CircleMarker } from "react-leaflet";
import type { Map as CarteLeaflet } from "leaflet";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { fr } from "@codegouvfr/react-dsfr";
import { EcranCarte } from "../components/EcranCarte";
import { CarteIgn } from "../components/CarteIgn";
import { BasculeTypeEau } from "../components/BasculeTypeEau";
import { RechercheCarte } from "../components/RechercheCarte";
import { ZonesSecteurs } from "../components/ZonesSecteurs";
import { LegendeZone } from "../components/LegendeZone";
import { GrilleTerritoires, SelecteurTerritoires } from "../components/SelecteurTerritoires";
import { useDesktop } from "../lib/useMediaQuery";
import { TOUS_LES_SECTEURS } from "../lib/secteurs";
import { VUE_FRANCE } from "../lib/carte";
import { TERRITOIRE_PAR_DEFAUT, territoire as trouverTerritoire, type IdTerritoire } from "../lib/territoires";
import type { TypeEau } from "../lib/recherche";

/** Zoom à partir duquel les secteurs de distribution s’affichent (une agglomération et sa région). */
const ZOOM_SECTEURS = 8;

export function Carte() {
  const [parametres, setParametres] = useSearchParams();
  const typeEau: TypeEau = parametres.get("type") === "baignade" ? "baignade" : "potable";
  const [carte, setCarte] = useState<CarteLeaflet>();
  const [zoom, setZoom] = useState(VUE_FRANCE.zoom);
  const [position, setPosition] = useState<[number, number]>();
  const secteursVisibles = typeEau === "potable" && zoom >= ZOOM_SECTEURS;
  const idBoutonTerritoires = useId();
  const [selecteurOuvert, setSelecteurOuvert] = useState(false);
  const [territoire, setTerritoire] = useState<IdTerritoire>(TERRITOIRE_PAR_DEFAUT);
  const aRecentrer = useRef(false);

  const fermerSelecteur = useCallback(() => setSelecteurOuvert(false), []);
  const choisirTerritoire = useCallback((id: IdTerritoire) => {
    setTerritoire(id);
    aRecentrer.current = true;
    setSelecteurOuvert(false);
  }, []);

  // Sélecteur fermé : la carte réapparaît (taille recalculée), recentrée si un territoire a été choisi,
  // et le focus revient au bouton Territoires.
  const dejaOuvert = useRef(false);
  useEffect(() => {
    if (selecteurOuvert) {
      dejaOuvert.current = true;
      return;
    }
    if (!dejaOuvert.current) return;
    carte?.invalidateSize();
    if (aRecentrer.current) {
      aRecentrer.current = false;
      carte?.fitBounds(trouverTerritoire(territoire).emprise, { padding: [16, 16] });
    }
    document.getElementById(idBoutonTerritoires)?.focus();
  }, [selecteurOuvert, carte, territoire, idBoutonTerritoires]);

  useEffect(() => {
    if (!carte) return;
    const suivreZoom = () => setZoom(carte.getZoom());
    suivreZoom();
    carte.on("zoomend", suivreZoom);
    return () => {
      carte.off("zoomend", suivreZoom);
    };
  }, [carte]);

  // Desktop : la grille des territoires est toujours visible dans le panneau, le choix recentre directement.
  const desktop = useDesktop();
  const recentrer = (id: IdTerritoire) => {
    setTerritoire(id);
    carte?.fitBounds(trouverTerritoire(id).emprise, { padding: [16, 16] });
  };

  const onLocalisation = useCallback(
    (lat: number, lon: number) => {
      setPosition([lat, lon]);
      carte?.setView([lat, lon], 13);
    },
    [carte],
  );

  const bascule = (
    <BasculeTypeEau valeur={typeEau} masquerLegende onChange={(type) => setParametres({ type }, { replace: true })} />
  );
  const baignadeBientot = (
    <Alert
      severity="info"
      title="Bientôt disponible"
      description="Les résultats des eaux de baignade seront bientôt consultables sur la carte."
    />
  );

  const panneauMobile =
    typeEau === "potable" ? (
      <>
        {/* Recherche en premier : visible sans défilement sur mobile, sous la carte. */}
        <RechercheCarte onLocalisation={onLocalisation} />
        <p className={fr.cx("fr-message", "fr-message--info", "fr-mt-2w", "fr-mb-0")} aria-live="polite">
          {secteursVisibles
            ? "Cliquez sur un secteur pour consulter la qualité de son eau."
            : "Zoomez sur une ville pour afficher les secteurs de distribution."}
        </p>
      </>
    ) : (
      baignadeBientot
    );

  // Desktop (maquette desktop) : sans le message d'aide, absent de la maquette (cf. NOTES.md).
  const panneauDesktop = (
    <>
      <h1 className={fr.cx("fr-h4", "fr-mb-2w")}>Qualité de l’eau près de chez vous</h1>
      <p className={fr.cx("fr-mb-3w")}>
        Recherchez une commune ou une adresse pour connaître la qualité de l’eau du robinet ou de baignade.
      </p>
      <div className={fr.cx("fr-mb-3w")}>{bascule}</div>
      {typeEau === "potable" ? <RechercheCarte onLocalisation={onLocalisation} /> : baignadeBientot}
      <hr className={fr.cx("fr-mt-0", "fr-pb-3w")} />
      <h2 className={fr.cx("fr-text--md", "fr-text--bold", "fr-mb-2w")}>Ou choisissez un territoire</h2>
      <GrilleTerritoires
        actif={territoire}
        onActif={recentrer}
        onChoix={recentrer}
        className="selecteur-territoires__groupe--panneau"
      />
    </>
  );

  return (
    <>
      {!desktop && <h1 className={fr.cx("fr-sr-only")}>Carte de la qualité de l’eau</h1>}
      <EcranCarte
        pleinEcran={desktop}
        entete={!desktop && <div className={fr.cx("fr-container", "fr-py-2w")}>{bascule}</div>}
        carte={
          <CarteIgn
            onPrete={setCarte}
            surCarte={secteursVisibles && <LegendeZone aGauche />}
            controlesGauche={
              // Desktop : pas de bouton Territoires, la grille est dans le panneau.
              !desktop && (
                <Button
                  id={idBoutonTerritoires}
                  iconId="fr-icon-france-line"
                  priority="tertiary"
                  title="Choisir un territoire"
                  nativeButtonProps={{ "aria-label": "Choisir un territoire" }}
                  onClick={() => setSelecteurOuvert(true)}
                />
              )
            }
          >
            {secteursVisibles && <ZonesSecteurs secteurs={TOUS_LES_SECTEURS} />}
            {position && <CircleMarker center={position} radius={8} className="carte-ign__position" />}
          </CarteIgn>
        }
        remplacement={
          !desktop &&
          selecteurOuvert && (
            <SelecteurTerritoires valeur={territoire} onChoix={choisirTerritoire} onFermer={fermerSelecteur} />
          )
        }
        panneau={desktop ? panneauDesktop : panneauMobile}
      />
    </>
  );
}
