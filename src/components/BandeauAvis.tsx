import { fr } from "@codegouvfr/react-dsfr";

/**
 * Bandeau « Je donne mon avis » (maquette desktop), au-dessus du pied de page. Le bouton est le
 * dispositif officiel Services Publics+ (image fournie), hors composants DSFR (cf. NOTES.md).
 */
export function BandeauAvis() {
  return (
    <section className="bandeau-avis" aria-labelledby="titre-bandeau-avis">
      <div className={fr.cx("fr-container")}>
        <div className={fr.cx("fr-grid-row")}>
          <div className={`${fr.cx("fr-col-8", "fr-col-offset-2")} bandeau-avis__contenu`}>
            <div>
              <h2 id="titre-bandeau-avis" className={fr.cx("fr-h6", "fr-mb-1w")}>
                Aidez-nous à améliorer ce service !
              </h2>
              <p className={fr.cx("fr-mb-0")}>Donnez-nous votre avis, cela ne prend que 2 minutes.</p>
            </div>
            {/* Prototype : adresse générale du service, sans identifiant de démarche (cf. NOTES.md). */}
            <a
              className="fr-raw-link"
              href="https://jedonnemonavis.numerique.gouv.fr/"
              target="_blank"
              rel="noopener noreferrer"
              title="Je donne mon avis - nouvelle fenêtre"
            >
              <img src={`${import.meta.env.BASE_URL}images/je-donne-mon-avis.png`} alt="Je donne mon avis" width={200} height={85} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
