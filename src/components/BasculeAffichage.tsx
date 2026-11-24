import { SegmentedControl } from "@codegouvfr/react-dsfr/SegmentedControl";
import { fr } from "@codegouvfr/react-dsfr";
import { enregistrerAffichage, useAffichage, type ModeAffichage } from "../lib/affichage";

/**
 * Bascule Desktop / Mobile, fixée en bas à droite de l'écran (à partir de 576 px, une fois l'avertissement
 * accepté). Contrôle segmenté DSFR en petite taille, icônes seules (libellés lus par les lecteurs
 * d'écran), posé dans une pastille blanche (cf. NOTES.md).
 * En mode Mobile, elle est dans la page parente, donc dans la bande noire, hors de la colonne.
 */
export function BasculeAffichage() {
  const { mode } = useAffichage();
  const segment = (valeur: ModeAffichage) => ({
    value: valeur,
    checked: mode === valeur,
    onChange: () => enregistrerAffichage(valeur),
  });
  return (
    <div className="bascule-affichage">
      <SegmentedControl
        small
        hideLegend
        legend="Affichage du prototype"
        name="affichage-prototype"
        segments={[
          {
            label: <span className={fr.cx("fr-sr-only")}>Affichage desktop</span>,
            iconId: "fr-icon-computer-line",
            nativeInputProps: { ...segment("desktop"), title: "Affichage desktop" },
          },
          {
            label: <span className={fr.cx("fr-sr-only")}>Affichage mobile</span>,
            iconId: "fr-icon-smartphone-line",
            nativeInputProps: { ...segment("mobile"), title: "Affichage mobile" },
          },
        ]}
      />
    </div>
  );
}
