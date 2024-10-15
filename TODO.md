# TODO

- [ ] Deployer sur GCP
  - [X] Réussir à déployer à la main
    - [X] https://www.brm.ovh
    - [X] page 404
    - [X] Vérifier provisionnement certificat ssl : https://console.cloud.google.com/security/ccm/lbCertificates/details/tractor-v2-ssl?project=tractor-v2-module-federation
    - [X] index.html de app-shell doit aller chercher les bons js (pas le cas pour l'instant) => Config de build de prod
    - [ ] Comment faire pour que Storage ne cache pas les fichiers
    - [ ] c'est quoi les différence avec www et pas www pour les domaines
  - [ ] Automatiser
    - [ ] Sur githubactions
    - [ ] Créer la pipeline pour app-shell
    - [ ] Savoir trigger une pipeline en fonction des changements dans les dossiers du repo, puis un console.log
    - [ ] Observer les changement des derniers commits
    - [ ] variabiliser la pipeline et trigger les pipelines nécessaires en fonctions des changements
- [ ] Pourquoi faut bootstrap.jsx dans index.js ?

## Deploiement

On déploie sur GCP pour expérimenter.

Tout se fait depuis racine du projet
=> Utiliser le make file
Basé sur https://cloud.google.com/storage/docs/hosting-static-website?hl=fr#objectives

Copier la page 404
`gcloud storage cp -r app-shell/404.html gs://tractor-v2-module-federation`

Configurer le bucket pour qu'on connaisse la main page et l'error page
`gcloud storage buckets update gs://tractor-v2-module-federation --web-main-page-suffix=app-shell/index.html --web-error-page=404.html`

Rendre les fichiers visibles par le public
`gcloud storage buckets add-iam-policy-binding gs://tractor-v2-module-federation --member=allUsers --role=roles/storage.objectViewer`
=> N'a pas fonctionné, je l'ai rajouté à la main

Vérifier l'état du certificat ssl
`gcloud compute ssl-certificates describe tractor-v2-ssl \
--global \
--format="get(name,managed.status)"`

Vérifier l'état du domaine
`gcloud compute ssl-certificates describe tractor-v2-ssl \
--global \
--format="get(managed.domainStatus)"`

certificat SSL
https://cloud.google.com/load-balancing/docs/ssl-certificates/troubleshooting?hl=fr&_gl=1*1xhohpg*_ga*MTEzMDc0MTgwNy4xNjg5ODY2OTIw*_ga_WH2QY8WWF5*MTcyODk5NDc1My4zMC4xLjE3Mjg5OTUwOTguNjAuMC4w#certificate-managed-status

# Les différents types d'entrés pour un nom de domaine
Voici une rapide description des différents types d’entrée que vous pouvez ajouter à votre zone DNS.

A
Permet d’associer un nom de domaine ou sous-domaine à une adresse IPv4.

AAAA
Permet d’associer un nom de domaine ou sous-domaine à une adresse IPv6.

CNAME
C’est un alias du champ A, utile pour renseigner différents noms alternatifs aux services d’un host.

DKIM
Permet de diffuser des clés permettant à un serveur de messagerie de vérifier des signatures DKIM (utile pour la lutte contre le spam).

LOC
Spécifie une zone géographique associée à un nom de domaine.

MX
Spécifie le serveur mail responsable de la distribution des e-mails pour un domaine.

NAPTR
Permet de préciser les services publics que vous distribuez sous un nom de domaine.

NS
Permet de déclarer les serveurs autoritaires de la zone.

SPF
Permet de garantir aux serveurs mails distants que les serveurs dont vous disposez sont bien autorisés à envoyer des mails. Utile dans la lutte contre le SPAM.

SRV
Permet de préciser l'adresse du serveur ainsi que le port à utiliser pour un service donné. C'est une version étendue et plus générique du champ MX.

SSHFP
Permet de publier des clefs SSH publiques dans le système DNS, aidant à la vérification de l’authenticité de la machine hôte.

TXT
Permet d’entrer n’importe quel texte dans la zone DNS.

## VISION TODO
- On est contraint de partager React en dépendance car interdit d'avoir deux fois le même react pour utiliser les hooks
    - => Mais comment je fais si je veux lancer mon MFE seul et que React n'est pas intégré dedans
- Et si on utilisait typescript ? typing entre composant pas du même projet ?
- monitoring erreur ? sentry ?
- design system du projet tractor v2 ?
- Comment on en parle en CoP day ou à la tribu ? Extraction de certains composants en MFE ?
- Comment utiliser shared ? react react-dom ?
- Testing on fait comment ?
- Comment on débuggue du module federation ?

## APPRENTISSAGE

### Différence entre RsBuild et RsPack

RsPack est un web bundler écrit en Rust. Il offre une compatibilité forte avec l'eco-systeme de webpack afin de faciliter son remplacement.
Le build est beaucoup plus rapide (410ms vs 5s sur web pack)
https://rspack.dev/guide/start/introduction

Aout 2024 => V1 production-ready
Il propose un serveur de dev, des loaders pour intégrer plein de type de fichiers dans la web app, module federation, code splitting
Un argument de vente est le compatible avec webpack et facile de passer de l'un à l'autre.

Comparaison 
bundlers => Build tool
RsPack => RxBuild
Rollup => Vite
WebPack => CRA / Vue CLI

Les build tools font essentiellement de la compilation

### Asset prefix rsbuild
Toujours definir l'assetPrefix ou le host dans lequel run le producer. Le consumer utilise cette info pour ajouter la balise script nécessaire

### index.js inclut bootstrap.jsx

Si un module est consommateur => index inclut bootstrap.jsx

### React router est limité
React-Router n'est pas utilisable quand t'as du routing entre micro-frontends
Ici on s'en sort avec un router fait main

### Tooling vite pas ouf encore
Vite ne marche pas avec tout.

```
I guess the bigger issue is that the Vite plugin only works with hosts also coming from Vite.
So its either:
Vite -> Vite
Vite -> Webpack / rspack
or alternatively:
Webpack -> Webpack / rspack
Webpack -> Transformed output of Vite / most likely via some other MF plugin or by post-processing the result
```
ABANDON D'INTEGRER VITE
1.a) problème de esmodule. Le remoteEntry produit par Vite est en esmodule. Quand le navigateur le charge, il ne comprend pas l'instruction "import.meta.url"

1.b) afin de resoudre le problème de "import.meta.url", j'ai mi une config de build vite différente :
```
build: {
        target: 'esnext',
        minify: false,
        cssCodeSplit: false,
        modulePreload: false,
        rollupOptions: {
            output: {
                format: 'system',
                entryFileNames: 'assets/[name].js',
                minifyInternalExports: false
            }
        }
    },
```
Après avoir changé ça. Le remoteEntry a changé (il y a plus de import.meta.url, ni de export).
Mais quand le navigateur essaie de le lire, il dit ne pas connaitre l'objet System, qui est tout en haut.
Pour résoudre, on a importé
```
<script src="https://cdn.jsdelivr.net/npm/systemjs@6.11.0/dist/system.min.js"></script>
```
ça commence à faire tricky, on s'éloigne des sentiers battues

1.c) maintenant on a l'erreur
TypeError: self.webpackHotUpdateexplore is not a function.
L'erreur va beaucoup trop loin

# DONE
- [X] Homepage doit venir de explore
- [X] Listes des machines vient de explore
- [X] les filtres sont recup en query params
- [X] La page machine marche (machine/{id}) et viens du mfe decide
- [X] au click sur checkout, j'affiche le panier qui vient du mfe checkout (checkout fait avec vite + module fede) => Finalement avec rs buils
- [X] La navigation se fait sans rafraîchissement complet de la page (routing de florian rappl)
- [X] Envoyer un mail à Florian Rappl pour demander de l'aide (problème de mal formation du remoteEntry avec Vite expliqué plus bas)
- [X] Mettre sur mon Github
- [X] Différence entre RsPack et RsBuild

