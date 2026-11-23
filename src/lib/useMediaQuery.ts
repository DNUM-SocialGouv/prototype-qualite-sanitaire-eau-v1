import { useCallback, useSyncExternalStore } from "react";

/** Vrai tant que la media query correspond (suivi au redimensionnement). */
export function useMediaQuery(requete: string) {
  const abonner = useCallback(
    (rappel: () => void) => {
      const liste = window.matchMedia(requete);
      liste.addEventListener("change", rappel);
      return () => liste.removeEventListener("change", rappel);
    },
    [requete],
  );
  return useSyncExternalStore(abonner, () => window.matchMedia(requete).matches);
}

/** Point de rupture lg du DSFR (992 px) : mise en page desktop (mode Desktop, en pleine largeur). */
export const useDesktop = () => useMediaQuery("(min-width: 62em)");
