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
