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
import { SelecteurTerritoires } from "../components/SelecteurTerritoires";
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

  const onLocalisation = useCallback(
    (lat: number, lon: number) => {
      setPosition([lat, lon]);
      carte?.setView([lat, lon], 13);
    },
    [carte],
  );

  return (
    <>
      <h1 className={fr.cx("fr-sr-only")}>Carte de la qualité de l’eau</h1>
      <EcranCarte
        entete={
          <div className={fr.cx("fr-container", "fr-py-2w")}>
            <BasculeTypeEau
              valeur={typeEau}
              masquerLegende
              onChange={(type) => setParametres({ type }, { replace: true })}
            />
          </div>
        }
        carte={
          <CarteIgn
            onPrete={setCarte}
            surCarte={secteursVisibles && <LegendeZone aGauche />}
            controlesGauche={
              <Button
                id={idBoutonTerritoires}
                iconId="fr-icon-france-line"
                priority="tertiary"
                title="Choisir un territoire"
                nativeButtonProps={{ "aria-label": "Choisir un territoire" }}
                onClick={() => setSelecteurOuvert(true)}
              />
            }
          >
            {secteursVisibles && <ZonesSecteurs secteurs={TOUS_LES_SECTEURS} />}
            {position && <CircleMarker center={position} radius={8} className="carte-ign__position" />}
          </CarteIgn>
        }
        remplacement={
          selecteurOuvert && (
            <SelecteurTerritoires valeur={territoire} onChoix={choisirTerritoire} onFermer={fermerSelecteur} />
          )
        }
        panneau={
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
            <Alert
              severity="info"
              title="Bientôt disponible"
              description="Les résultats des eaux de baignade seront bientôt consultables sur la carte."
            />
          )
        }
      />
    </>
  );
}
