import type { LatLngBoundsLiteral } from "leaflet";

/** Territoires proposés par le sélecteur de la carte, dans l'ordre de la maquette. */
export type IdTerritoire =
  | "france-hexagonale"
  | "corse"
  | "guadeloupe"
  | "martinique"
  | "guyane"
  | "la-reunion"
  | "mayotte"
  | "saint-pierre-et-miquelon"
  | "saint-barthelemy"
  | "saint-martin";

export type Territoire = {
  id: IdTerritoire;
  nom: string;
  /** Emprise indicative [[sud, ouest], [nord, est]], pour recentrer la carte. */
  emprise: LatLngBoundsLiteral;
};

export const TERRITOIRES: Territoire[] = [
  { id: "france-hexagonale", nom: "France hexagonale", emprise: [[42.3, -4.8], [51.1, 8.3]] },
  { id: "corse", nom: "Corse", emprise: [[41.33, 8.53], [43.03, 9.57]] },
  { id: "guadeloupe", nom: "Guadeloupe", emprise: [[15.83, -61.81], [16.52, -61.0]] },
  { id: "martinique", nom: "Martinique", emprise: [[14.38, -61.24], [14.88, -60.8]] },
  { id: "guyane", nom: "Guyane", emprise: [[2.11, -54.6], [5.78, -51.6]] },
  { id: "la-reunion", nom: "La Réunion", emprise: [[-21.39, 55.21], [-20.87, 55.84]] },
  { id: "mayotte", nom: "Mayotte", emprise: [[-13.01, 45.01], [-12.63, 45.3]] },
  { id: "saint-pierre-et-miquelon", nom: "Saint-Pierre-et-Miquelon", emprise: [[46.75, -56.42], [47.15, -56.12]] },
  { id: "saint-barthelemy", nom: "Saint-Barthélemy", emprise: [[17.87, -62.88], [17.97, -62.78]] },
  { id: "saint-martin", nom: "Saint-Martin", emprise: [[18.04, -63.16], [18.13, -62.97]] },
];

export const TERRITOIRE_PAR_DEFAUT: IdTerritoire = "france-hexagonale";

export const territoire = (id: IdTerritoire) => TERRITOIRES.find((t) => t.id === id)!;

/**
 * Silhouettes exportées de Figma (viewBox 56 × 56, remplissage `currentColor`), insérées en ligne
 * pour prendre la couleur DSFR du texte.
 */
const silhouettes = import.meta.glob<string>("../assets/territoires/*.svg", {
  query: "?raw",
  import: "default",
  eager: true,
});

export const silhouette = (id: IdTerritoire) => silhouettes[`../assets/territoires/${id}.svg`];
