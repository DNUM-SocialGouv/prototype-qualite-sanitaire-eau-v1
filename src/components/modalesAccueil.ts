import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { accepteAuChargement } from "../lib/affichage";
import { dansLeCadre } from "../lib/cadreMobile";

/**
 * Modale d'accueil bloquante, ouverte d'elle-même tant que l'avertissement n'a pas été accepté.
 * Jamais dans l'iframe de la colonne : la page parente s'en charge avant de l'afficher.
 */
export const modaleAccueil = createModal({
  id: "avertissement-prototype",
  isOpenedByDefault: !accepteAuChargement && !dansLeCadre,
});

/** Même contenu, rouvert depuis le pied de page pour changer d'affichage : fermable (Fermer, Échap). */
export const modaleChangementAffichage = createModal({ id: "changer-affichage", isOpenedByDefault: false });
