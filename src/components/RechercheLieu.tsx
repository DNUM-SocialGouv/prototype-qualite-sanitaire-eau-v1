import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonsGroup } from "@codegouvfr/react-dsfr/ButtonsGroup";
import { fr } from "@codegouvfr/react-dsfr";
import { useDesktop } from "../lib/useMediaQuery";
import { BasculeTypeEau } from "./BasculeTypeEau";
import { ChampSuggestions } from "./ChampSuggestions";
import {
  chercherCommunes,
  chercherLieuxBaignade,
  type Suggestion,
  type TypeEau,
} from "../lib/recherche";
import { COMMUNES_AVEC_DONNEES, NOMS_COMMUNES_AVEC_DONNEES, routeCommune } from "../lib/secteurs";

const CHAMP_PAR_TYPE = {
  potable: {
    label: "Rechercher une adresse ou une commune",
    placeholder: "Adresse, commune…",
    chercher: chercherCommunes,
  },
  baignade: {
    label: "Rechercher un lieu de baignade",
    placeholder: "Plage, lac, rivière, commune…",
    chercher: chercherLieuxBaignade,
  },
} as const;

export function RechercheLieu() {
  const navigate = useNavigate();
  const [typeEau, setTypeEau] = useState<TypeEau>("potable");
  const [message, setMessage] = useState<string>();
  const champ = CHAMP_PAR_TYPE[typeEau];
  // Desktop : marges intérieures de 32 px (maquette desktop).
  const desktop = useDesktop();

  function onSelection(suggestion: Suggestion) {
    if (typeEau === "baignade") {
      setMessage(`Le parcours baignade n’est pas encore disponible dans ce prototype (${suggestion.libelle}).`);
    } else if (COMMUNES_AVEC_DONNEES.includes(suggestion.id)) {
      navigate(routeCommune(suggestion.id));
    } else {
      setMessage(`Les données de ${suggestion.libelle} ne sont pas disponibles dans ce prototype. Essayez avec ${NOMS_COMMUNES_AVEC_DONNEES}.`);
    }
  }

  return (
    // Desktop : espacements de la maquette (32 px autour, 16 px entre les éléments, bouton LG).
    // Le bas vaut 16 px car le groupe de boutons DSFR ajoute déjà 16 px sous le bouton.
    <div className={`bloc-recherche ${desktop ? fr.cx("fr-pt-4w", "fr-px-4w", "fr-pb-2w") : fr.cx("fr-p-3w")}`}>
      <h2 className={fr.cx("fr-h4")}>Rechercher un lieu</h2>
      <BasculeTypeEau
        valeur={typeEau}
        onChange={(type) => {
          setTypeEau(type);
          setMessage(undefined);
        }}
        className={fr.cx(desktop ? "fr-mb-2w" : "fr-mb-3w")}
      />
      <ChampSuggestions
        // Nouveau champ (saisie vidée) à chaque changement de type d'eau.
        key={typeEau}
        label={champ.label}
        // Desktop, eau potable : exemple d'adresse de la maquette desktop.
        placeholder={desktop && typeEau === "potable" ? "Ex. : 12 rue Nationale, Lille" : champ.placeholder}
        chercher={champ.chercher}
        onSelection={onSelection}
        onSaisie={() => setMessage(undefined)}
        message={message ? { etat: "info", texte: message } : undefined}
      />
      <p className={fr.cx("fr-hr-or", desktop ? "fr-my-2w" : "fr-my-3w")}>ou</p>
      <ButtonsGroup
        buttonsSize={desktop ? "large" : "medium"}
        buttons={[
          {
            children: "Explorer sur la carte",
            priority: "secondary",
            iconId: "fr-icon-road-map-line",
            linkProps: { to: `/carte?type=${typeEau}` },
          },
        ]}
      />
    </div>
  );
}
