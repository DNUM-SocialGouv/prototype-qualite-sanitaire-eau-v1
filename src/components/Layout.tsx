import { Header } from "@codegouvfr/react-dsfr/Header";
import { Footer } from "@codegouvfr/react-dsfr/Footer";
import { Display, headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";
import { SkipLinks } from "@codegouvfr/react-dsfr/SkipLinks";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { fr } from "@codegouvfr/react-dsfr";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { AvertissementPrototype } from "./AvertissementPrototype";
import { BandeauAvis } from "./BandeauAvis";
import { dansLeCadre } from "../lib/cadreMobile";
import { useDesktop } from "../lib/useMediaQuery";

const brandTop = (
  <>
    Ministère
    <br />
    de la Santé, des Familles,
    <br />
    de l’Autonomie
    <br />
    et des Personnes handicapées
  </>
);

const homeLinkProps = { to: "/", title: "Accueil - Qualité sanitaire des eaux" };

export function Layout() {
  const desktop = useDesktop();
  const { pathname } = useLocation();
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
        // Desktop : pas d'accès rapide « Carte » (demande de l'utilisateur) ; les paramètres d'affichage sont dans le pied de page.
        quickAccessItems={desktop ? [] : [headerFooterDisplayItem]}
      />
      <main id="contenu" tabIndex={-1}>
        <Outlet />
      </main>
      {/* Bandeau « Je donne mon avis », permanent au-dessus du pied de page (maquettes desktop et mobile),
          sauf sur l'écran carte. */}
      {pathname !== "/carte" && <BandeauAvis mobile={!desktop} />}
      <Footer
        id="footer"
        brandTop={brandTop}
        homeLinkProps={homeLinkProps}
        accessibility="partially compliant"
        accessibilityLinkProps={{ to: "/accessibilite" }}
        // Desktop : intitulé du service repris dans le texte (demande validée, écart avec la maquette desktop).
        contentDescription={`${desktop ? "Qualité sanitaire des eaux" : "Qualité de l’eau"} est le service public pour s’informer sur la qualité de l’eau en France grâce aux données officielles du contrôle sanitaire.`}
        domains={["sante.gouv.fr", "sante.fr", "eaufrance.fr", "vigieau.gouv.fr"]}
        termsLinkProps={{ to: "/mentions-legales" }}
        websiteMapLinkProps={{ to: "/plan-du-site" }}
        bottomItems={[
          { text: "Données personnelles", linkProps: { to: "/donnees-personnelles" } },
          { text: "Gestion des cookies", linkProps: { to: "/gestion-des-cookies" } },
          headerFooterDisplayItem,
        ]}
      />
      <Display />
      {/* Dans la colonne, la page parente porte la modale d'accueil : jamais deux modales à la fois. */}
      {!dansLeCadre && <AvertissementPrototype />}
      <ScrollRestoration />
    </>
  );
}
