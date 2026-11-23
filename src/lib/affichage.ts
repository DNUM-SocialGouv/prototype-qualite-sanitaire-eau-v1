import { useSyncExternalStore } from "react";

/**
 * Acceptation de l'avertissement et mode d'affichage choisi (mobile en colonne ou desktop pleine largeur),
 * mémorisés pour la session de l'onglet (cf. NOTES.md). L'iframe de la colonne partage ce stockage.
 */
export type ModeAffichage = "mobile" | "desktop";

const CLE_ACCEPTATION = "avertissement-prototype-accepte";
const CLE_MODE = "affichage-prototype";

function lire(cle: string) {
  try {
    return window.sessionStorage.getItem(cle);
  } catch {
    return null;
  }
}

function ecrire(cle: string, valeur: string) {
  try {
    window.sessionStorage.setItem(cle, valeur);
  } catch {
    // Stockage indisponible : le choix vaut jusqu'au prochain chargement.
  }
}

type Etat = { accepte: boolean; mode: ModeAffichage };

let etat: Etat = {
  accepte: lire(CLE_ACCEPTATION) === "oui",
  mode: lire(CLE_MODE) === "desktop" ? "desktop" : "mobile",
};

/** Acceptation au chargement de la page : décide si la modale d'accueil s'ouvre d'elle-même. */
export const accepteAuChargement = etat.accepte;

const abonnes = new Set<() => void>();

function abonner(rappel: () => void) {
  abonnes.add(rappel);
  return () => {
    abonnes.delete(rappel);
  };
}

export function enregistrerAffichage(mode: ModeAffichage) {
  ecrire(CLE_ACCEPTATION, "oui");
  ecrire(CLE_MODE, mode);
  etat = { accepte: true, mode };
  abonnes.forEach((rappel) => rappel());
}

export function useAffichage() {
  return useSyncExternalStore(abonner, () => etat);
}
