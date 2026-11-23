import { fr } from "@codegouvfr/react-dsfr";
import { RechercheLieu } from "../components/RechercheLieu";
import { ArticlesQualite } from "../components/ArticlesQualite";
import { FaqAccueil } from "../components/FaqAccueil";
import { VoletCalcaire } from "../components/VoletCalcaire";
import { useDesktop } from "../lib/useMediaQuery";

export function Accueil() {
  const desktop = useDesktop();
  return (
    <>
      {/* Fond lavande sur mobile, blanc sur desktop (maquettes), cf. styles/app.css. */}
      <section className="accueil-entete">
        <div className={fr.cx("fr-container")}>
          <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters", "fr-grid-row--middle")}>
            <div className={fr.cx("fr-col-12", "fr-col-lg-6")}>
              <h1>Résultats du contrôle sanitaire des eaux</h1>
              <p className={fr.cx(desktop && "fr-text--lg")}>
                Accédez aux résultats officiels des contrôles sanitaires pour l’<strong>eau potable</strong> et les{" "}
                <strong>eaux de baignade</strong> des lacs, rivières et plages, en France métropolitaine et dans les
                outre-mer.
              </p>
            </div>
            <div className={fr.cx("fr-col-12", "fr-col-lg-5", "fr-col-offset-lg-1")}>
              <RechercheLieu />
            </div>
          </div>
        </div>
      </section>
      <ArticlesQualite />
      <FaqAccueil />
      <VoletCalcaire />
    </>
  );
}
