import { useEffect, useRef, useState } from "react";
import { Application } from "./Application";
import { ChangementAffichage } from "./AvertissementPrototype";
import { modaleChangementAffichage } from "./modalesAccueil";
import { REQUETE_GRAND_ECRAN, type MessageChangerAffichage, type MessageRoute } from "../lib/cadreMobile";
import { useAffichage } from "../lib/affichage";
import { useMediaQuery } from "../lib/useMediaQuery";

/**
 * Page principale : sur mobile, l'application s'affiche directement. À partir de 576 px, elle
 * s'affiche dans une colonne de 390 px sur fond noir (mode Mobile) ou en pleine largeur (mode Desktop).
 * Tant que le mode n'est pas choisi (avertissement non accepté), l'application s'affiche en pleine
 * largeur avec la modale d'accueil, qui propose le choix.
 */
export function CadreMobile() {
  const grandEcran = useMediaQuery(REQUETE_GRAND_ECRAN);
  const { accepte, mode } = useAffichage();
  return grandEcran && accepte && mode === "mobile" ? <Colonne /> : <Application />;
}

function Colonne() {
  const iframe = useRef<HTMLIFrameElement>(null);
  // L'iframe ouvre la route demandée (lien direct, rechargement, retour depuis le mode mobile).
  const [src] = useState(() => window.location.pathname + window.location.search + window.location.hash);

  useEffect(() => {
    document.documentElement.classList.add("cadre-mobile");
    return () => document.documentElement.classList.remove("cadre-mobile");
  }, []);

  useEffect(() => {
    const recevoir = (event: MessageEvent<MessageRoute | MessageChangerAffichage>) => {
      if (event.origin !== window.location.origin || event.source !== iframe.current?.contentWindow) return;
      if (event.data?.type === "changer-affichage") {
        modaleChangementAffichage.open();
        return;
      }
      if (event.data?.type !== "route") return;
      const actuelle = window.location.pathname + window.location.search + window.location.hash;
      if (event.data.url !== actuelle) window.history.replaceState(window.history.state, "", event.data.url);
      document.title = event.data.titre;
    };
    window.addEventListener("message", recevoir);
    return () => window.removeEventListener("message", recevoir);
  }, []);

  return (
    <>
      <iframe ref={iframe} className="cadre-mobile__iframe" src={src} title="Qualité sanitaire des eaux" />
      <ChangementAffichage />
    </>
  );
}
