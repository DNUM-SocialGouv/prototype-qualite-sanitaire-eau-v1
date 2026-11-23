import { Tile } from "@codegouvfr/react-dsfr/Tile";
import { fr } from "@codegouvfr/react-dsfr";
import { useBoutonVolet } from "../lib/contexteVolets";
import type { InfosCommune } from "../lib/communes";

/** Section « Contact & liens utiles » : tuiles DSFR horizontales. */
type Props = {
  infos: InfosCommune;
  /** Desktop (maquette desktop) : 3 liens empilés, séparés par des filets, à côté de l'avis sanitaire. */
  desktop?: boolean;
};

export function ContactsUtiles({ infos, desktop }: Props) {
  const boutonVolet = useBoutonVolet();
  const externe = (url: string, nom: string) => ({ href: url, target: "_blank", rel: "noopener noreferrer", title: `${nom} - nouvelle fenêtre` });
  return (
    <section className={fr.cx(desktop ? "fr-mb-0" : "fr-mb-6w")} aria-labelledby="titre-contacts">
      {/* Desktop : la maquette n'affiche pas de titre, il reste pour les lecteurs d'écran. */}
      <h2 id="titre-contacts" className={fr.cx(desktop ? "fr-sr-only" : "fr-h4")}>
        {desktop ? "Pour aller plus loin" : "Contact & liens utiles"}
      </h2>
      <ul className={`${fr.cx("fr-raw-list")} liste-tuiles${desktop ? " liste-tuiles--colonne" : ""}`}>
        <li>
          <Tile
            title="Votre mairie"
            titleAs="h3"
            desc="Questions sur la restriction"
            orientation="horizontal"
            small
            noBorder
            noBackground
            enlargeLinkOrButton
            buttonProps={boutonVolet({ type: "mairie" }, "ouvrir-mairie-contacts")}
          />
        </li>
        <li>
          <Tile
            title="Distributeur"
            titleAs="h3"
            desc="Raccordement, facture, pression"
            orientation="horizontal"
            small
            noBorder
            noBackground
            enlargeLinkOrButton
            linkProps={externe(infos.distributeur, "Distributeur")}
          />
        </li>
        <li>
          <Tile
            title={infos.ars.nom}
            titleAs="h3"
            desc="Résultats officiels du contrôle"
            orientation="horizontal"
            small
            noBorder
            noBackground
            enlargeLinkOrButton
            linkProps={externe(infos.ars.url, infos.ars.nom)}
          />
        </li>
      </ul>
    </section>
  );
}
