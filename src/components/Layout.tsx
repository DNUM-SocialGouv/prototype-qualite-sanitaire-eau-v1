import { Header } from "@codegouvfr/react-dsfr/Header";
import { Footer } from "@codegouvfr/react-dsfr/Footer";
import { Display, headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";
import { SkipLinks } from "@codegouvfr/react-dsfr/SkipLinks";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { fr } from "@codegouvfr/react-dsfr";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { AvertissementPrototype, ChangementAffichage } from "./AvertissementPrototype";
import { modaleChangementAffichage } from "./modalesAccueil";
import { dansLeCadre, demanderChangementAffichage, REQUETE_GRAND_ECRAN } from "../lib/cadreMobile";
import { useDesktop, useMediaQuery } from "../lib/useMediaQuery";

const brandTop = (
  <>
    Ministère
    <br />
    de la Santé, des Familles,
    <br />
    de l'Autonomie
    <br />
    et des Personnes handicapées
  </>
);

const homeLinkProps = { to: "/", title: "Accueil - Qualité sanitaire des eaux" };

const accesCarte = { iconId: "fr-icon-road-map-line", text: "Carte", linkProps: { to: "/carte" } } as const;

/** Lien « Changer d'affichage » : dans la colonne, la page parente rouvre le choix. */
const itemChangerAffichage = {
  text: "Changer d'affichage (mobile / desktop)",
  buttonProps: dansLeCadre ? { onClick: demanderChangementAffichage } : modaleChangementAffichage.buttonProps,
};

export function Layout() {
  // Le choix d'affichage n'existe qu'à partir de 576 px (la colonne en fait toujours partie).
  const grandEcran = useMediaQuery(REQUETE_GRAND_ECRAN);
  const choixAffichage = dansLeCadre || grandEcran;
  const desktop = useDesktop();
  return (
    <>
      <SkipLinks
        links={[
          { label: "Contenu", anchor: "#contenu" },
          { label: "Pied de page", anchor: "#footer" },
        ]}
      />
      <Header
        brandTop={brandTop}
        homeLinkProps={homeLinkProps}
        serviceTitle={
          <>
            Qualité sanitaire des eaux{" "}
            {/* Badge de service en bêta, tel que prévu par le DSFR dans l'en-tête */}
            <Badge as="span" small noIcon className={fr.cx("fr-badge--green-menthe")}>
              Prototype
            </Badge>
          </>
        }
        serviceTagline="Suivez la qualité de l'eau en France"
        // Desktop : accès rapide « Carte » (maquette desktop) ; les paramètres d'affichage restent dans le pied de page.
        quickAccessItems={desktop ? [accesCarte] : [headerFooterDisplayItem]}
      />
      <main id="contenu" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer
        id="footer"
        brandTop={brandTop}
        homeLinkProps={homeLinkProps}
        accessibility="partially compliant"
        accessibilityLinkProps={{ to: "/accessibilite" }}
        contentDescription="Qualité de l’eau est le service public pour s’informer sur la qualité de l’eau en France grâce aux données officielles du contrôle sanitaire."
        domains={["sante.gouv.fr", "sante.fr", "eaufrance.fr", "vigieau.gouv.fr"]}
        termsLinkProps={{ to: "/mentions-legales" }}
        websiteMapLinkProps={{ to: "/plan-du-site" }}
        bottomItems={[
          { text: "Données personnelles", linkProps: { to: "/donnees-personnelles" } },
          { text: "Gestion des cookies", linkProps: { to: "/gestion-des-cookies" } },
          headerFooterDisplayItem,
          ...(choixAffichage ? [itemChangerAffichage] : []),
        ]}
      />
      <Display />
      {/* Dans la colonne, la page parente porte ces modales : jamais deux modales à la fois. */}
      {!dansLeCadre && (
        <>
          <AvertissementPrototype />
          <ChangementAffichage />
        </>
      )}
      <ScrollRestoration />
    </>
  );
}
