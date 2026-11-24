import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CircleMarker } from "react-leaflet";
import type { FitBoundsOptions, Map as CarteLeaflet } from "leaflet";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { fr } from "@codegouvfr/react-dsfr";
import { EcranCarte } from "../components/EcranCarte";
import { CarteIgn } from "../components/CarteIgn";
import { BasculeTypeEau } from "../components/BasculeTypeEau";
import { RechercheCarte } from "../components/RechercheCarte";
import { ZonesSecteurs } from "../components/ZonesSecteurs";
import { LegendeZone } from "../components/LegendeZone";
import { BandeTerritoires, SelecteurTerritoires } from "../components/SelecteurTerritoires";
import { useDesktop } from "../lib/useMediaQuery";
import { TOUS_LES_SECTEURS } from "../lib/secteurs";
import { VUE_FRANCE } from "../lib/carte";
import { TERRITOIRE_PAR_DEFAUT, territoire as trouverTerritoire, type IdTerritoire } from "../lib/territoires";
import type { TypeEau } from "../lib/recherche";

/**
 * Marges de cadrage d'un territoire. En desktop, la bande des territoires (en bas) et les boutons de la
 * carte (à droite) sont posés sur la carte : on les exclut pour que le territoire reste entièrement visible.
 */
function margesCadrage(carte: CarteLeaflet): FitBoundsOptions {
  const conteneur = carte.getContainer().closest<HTMLElement>(".carte-ign") ?? carte.getContainer();
  const bande = conteneur.querySelector<HTMLElement>(".bande-territoires");
  const controles = conteneur.querySelector<HTMLElement>(".carte-ign__controles:not(.carte-ign__controles--gauche)");
  const bas = bande ? conteneur.getBoundingClientRect().bottom - bande.getBoundingClientRect().top + 16 : 16;
  const droite = controles ? conteneur.getBoundingClientRect().right - controles.getBoundingClientRect().left + 16 : 16;
  return { paddingTopLeft: [16, 16], paddingBottomRight: [droite, bas] };
}

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
      if (carte) carte.fitBounds(trouverTerritoire(territoire).emprise, margesCadrage(carte));
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

  // Desktop : les territoires sont dans une bande posée en bas de la carte, le choix recentre directement.
  const desktop = useDesktop();
  const recentrer = (id: IdTerritoire) => {
    setTerritoire(id);
    if (carte) carte.fitBounds(trouverTerritoire(id).emprise, margesCadrage(carte));
  };

  // Desktop : au chargement, la France hexagonale est cadrée au-dessus de la bande des territoires.
  useEffect(() => {
    if (!carte || !desktop) return;
    const image = requestAnimationFrame(() => carte.fitBounds(trouverTerritoire(TERRITOIRE_PAR_DEFAUT).emprise, margesCadrage(carte)));
    return () => cancelAnimationFrame(image);
  }, [carte, desktop]);

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

  // Desktop (maquette desktop « bande sur la carte ») : sans le message d'aide, absent de la maquette (cf. NOTES.md).
  const panneauDesktop = (
    <>
      <h1 className={fr.cx("fr-h5", "fr-mb-2w")}>Rechercher un lieu</h1>
      <p className={fr.cx("fr-mb-2w")}>Consultez la qualité de l’eau du robinet ou de baignade près de chez vous.</p>
      <div className={fr.cx("fr-mb-2w")}>{bascule}</div>
      {typeEau === "potable" ? <RechercheCarte desktop onLocalisation={onLocalisation} /> : baignadeBientot}
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
            surCarte={
              <>
                {secteursVisibles && <LegendeZone aGauche />}
                {desktop && <BandeTerritoires valeur={territoire} onChoix={recentrer} />}
              </>
            }
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
