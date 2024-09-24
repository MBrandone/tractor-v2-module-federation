# TODO

- [X] Homepage doit venir de explore
- [X] Listes des machines vient de explore
- [X] les filtres sont recup en query params
- [X] La page machine marche (machine/{id}) et viens du mfe decide
- [X] au click sur checkout, j'affiche le panier qui vient du mfe checkout (checkout fait avec vite + module fede) => Finalement avec rs buils
- [X] La navigation se fait sans rafraîchissement complet de la page (routing de florian rappl)
- [X] Envoyer un mail à Florian Rappl pour demander de l'aide (problème de mal formation du remoteEntry avec Vite expliqué plus bas)
- [X] Mettre sur mon Github
- [X] Différence entre RsPack et RsBuild
- [ ] Deployer sur Github ? gitlab ? GCP ?
- [ ] Pourquoi faut bootstrap.jsx dans index.js ?

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
