import { useEffect, useRef, useState } from "react";
import { ButtonsGroup } from "@codegouvfr/react-dsfr/ButtonsGroup";
import { SegmentedControl } from "@codegouvfr/react-dsfr/SegmentedControl";
import { modaleAccueil } from "./modalesAccueil";
import { enregistrerAffichage, useAffichage, type ModeAffichage } from "../lib/affichage";
import { REQUETE_GRAND_ECRAN } from "../lib/cadreMobile";
import { useMediaQuery } from "../lib/useMediaQuery";

const TITRE = (
  <>
    Bienvenue
    <br />
    sur ce prototype
  </>
);

type PropsContenu = {
  /** Choix Mobile / Desktop proposé (écran d'au moins 576 px). */
  avecChoix: boolean;
  mode: ModeAffichage;
  onMode: (mode: ModeAffichage) => void;
  onValider: () => void;
};

function ContenuAccueil({ avecChoix, mode, onMode, onValider }: PropsContenu) {
  const segment = (valeur: ModeAffichage) => ({
    value: valeur,
    checked: mode === valeur,
    onChange: () => onMode(valeur),
  });
  return (
    <>
      <p>Cette expérience a été créée et utilisée dans le cadre de tests utilisateurs.</p>
      <ul>
        <li>
          <strong>En cours de conception</strong>
        </li>
        <li>
          <strong>Réservé à l'équipe projet et aux testeurs</strong>
        </li>
      </ul>
      <p>Je m'engage à ne pas partager ce prototype.</p>
      {avecChoix && (
        <SegmentedControl
          legend="Affichage du prototype"
          className="segmented-pleine-largeur fr-mb-3w"
          segments={[
            { label: "Mobile", iconId: "fr-icon-smartphone-line", nativeInputProps: segment("mobile") },
            { label: "Desktop", iconId: "fr-icon-computer-line", nativeInputProps: segment("desktop") },
          ]}
        />
      )}
      <ButtonsGroup buttons={[{ children: "J'ai compris", priority: "tertiary", onClick: onValider }]} />
    </>
  );
}

/**
 * Applique le mode choisi une fois la modale refermée par le DSFR : passer de la page entière
 * à la colonne (ou l'inverse) démonte la modale, ce qui ne doit pas arriver pendant sa fermeture.
 */
function useValidation(id: string, choix: ModeAffichage, fermer: () => void) {
  const aValider = useRef(false);
  const choixCourant = useRef(choix);
  choixCourant.current = choix;

  useEffect(() => {
    const dialogue = document.getElementById(id);
    const appliquer = () => {
      if (!aValider.current) return;
      aValider.current = false;
      enregistrerAffichage(choixCourant.current);
    };
    dialogue?.addEventListener("dsfr.conceal", appliquer);
    return () => dialogue?.removeEventListener("dsfr.conceal", appliquer);
  }, [id]);

  return () => {
    aValider.current = true;
    fermer();
  };
}

/**
 * Modale d'accueil bloquante : volontairement sans bouton « Fermer », ni fermeture par Échap
 * ou par un clic sur le fond (exception validée, cf. NOTES.md). Seul « J'ai compris » la ferme.
 * Sur un écran d'au moins 576 px, elle propose l'affichage Mobile (colonne) ou Desktop (pleine largeur).
 */
export function AvertissementPrototype() {
  const { accepte } = useAffichage();
  const grandEcran = useMediaQuery(REQUETE_GRAND_ECRAN);
  const [choix, setChoix] = useState<ModeAffichage>("mobile");
  const valider = useValidation(modaleAccueil.id, choix, modaleAccueil.close);
  const ouverte = modaleAccueil.isOpenedByDefault && !accepte;

  // Échap : intercepté avant le JS DSFR (phase de capture) tant que la modale est ouverte.
  useEffect(() => {
    if (!ouverte) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (!document.getElementById(modaleAccueil.id)?.classList.contains("fr-modal--opened")) return;
      event.stopPropagation();
      event.preventDefault();
    };
    window.addEventListener("keydown", onKeyDown, { capture: true });

    // Contenu derrière la modale inaccessible tant qu'elle est ouverte : le DSFR 1.14 piège
    // le focus mais ne rend pas le reste de la page inerte.
    const dialogue = document.getElementById(modaleAccueil.id);
    const freres = [...(dialogue?.parentElement?.children ?? [])].filter(
      (element) => element !== dialogue && !element.hasAttribute("inert"),
    );
    freres.forEach((element) => element.setAttribute("inert", ""));
    const liberer = () => freres.forEach((element) => element.removeAttribute("inert"));
    dialogue?.addEventListener("dsfr.conceal", liberer);

    return () => {
      window.removeEventListener("keydown", onKeyDown, { capture: true });
      dialogue?.removeEventListener("dsfr.conceal", liberer);
      liberer();
    };
  }, [ouverte]);

  if (!ouverte) return null;

  return (
    <modaleAccueil.Component
      className="avertissement-prototype modale-centree"
      title={TITRE}
      // Option native du DSFR : un clic sur le fond ne ferme pas la modale.
      concealingBackdrop={false}
    >
      <ContenuAccueil avecChoix={grandEcran} mode={choix} onMode={setChoix} onValider={valider} />
    </modaleAccueil.Component>
  );
}
