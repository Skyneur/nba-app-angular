# 🏀 NBA Explorer - Application Angular 18

Application Front-End complète développée avec Angular 18, consommant une API NBA personnalisée pour afficher et gérer les données des joueurs NBA.

## 📋 Caractéristiques Techniques

### Framework & Architecture
- ✅ **Angular 18** avec Standalone Components
- ✅ Nouvelle syntaxe de contrôle de flux (`@if`, `@for`)
- ✅ Architecture modulaire (Core, Shared, Features)
- ✅ Lazy Loading des routes pour optimiser les performances
- ✅ SSR-ready avec vérifications `isPlatformBrowser`

### Gestion Asynchrone (RxJS)
- ✅ Service API centralisé avec système de cache
- ✅ Opérateurs RxJS : `map`, `catchError`, `tap`, `finalize`, `debounceTime`, `distinctUntilChanged`, `takeUntil`
- ✅ Subject pour unsubscribe automatique
- ✅ États gérés : Loading, Error, Success

### Routing & Navigation
- ✅ 5 routes configurées avec lazy loading
- ✅ Guard fonctionnel (`playerDetailGuard`) pour valider les paramètres
- ✅ Page 404 personnalisée avec redirection wildcard
- ✅ Navigation avec state pour le comparateur

### Formulaires & Validation
- ✅ Reactive Forms (FormControl)
- ✅ Debounce (300ms) + distinctUntilChanged pour recherche optimisée
- ✅ Tri multi-critères (nom, équipe, position, nationalité)
- ✅ Validation en temps réel

### Gestion d'État & Persistance
- ✅ **Signals Angular** pour réactivité (favoris, historique)
- ✅ LocalStorage avec validation et nettoyage automatique
- ✅ Service de favoris avec toggle et compteur
- ✅ Historique de recherche (5 dernières recherches)

### UI/UX
- ✅ **Bootstrap 5** + Bootstrap Icons
- ✅ Design responsive et mobile-first
- ✅ Thème dark personnalisé (NBA red #E02210)
- ✅ Animations CSS (heartbeat, fadeIn, pulse, shimmer)
- ✅ **Skeleton loading** (12 cards animées)
- ✅ Composants réutilisables (Loader, ErrorMessage, SkeletonCard)

## 🚀 Lancement

```bash
npm install
npm start
```

Application : **http://localhost:4200**

## 🎯 Fonctionnalités

### Pages Principales
1. **Page d'accueil** (`/`) - Présentation de l'application
2. **Liste des joueurs** (`/players`) - Affichage avec recherche, tri et pagination
3. **Détail joueur** (`/players/:id`) - Informations complètes avec guard
4. **Comparateur** (`/compare`) - Comparaison de 2-3 joueurs côte à côte
5. **Page 404** (`/404`) - Gestion des routes invalides

### Fonctionnalités Avancées
- 🌟 **Système de favoris** : Ajout/retrait avec persistance localStorage, filtrage dédié
- 🔍 **Recherche intelligente** : Temps réel avec debounce, historique des 5 dernières recherches
- ⚖️ **Comparateur de joueurs** : Sélection 2-3 joueurs, tableau comparatif détaillé
- 📜 **Infinite scroll** : Chargement progressif avec IntersectionObserver
- 🎨 **Tri avancé** : Par nom, équipe, position, nationalité (A-Z / Z-A)
- 💾 **Persistance** : Favoris et historique conservés entre les sessions
- ⚡ **Optimisations** : Skeleton loading, cache API, lazy loading

## 📦 Structure du Projet

```
src/app/
├── core/
│   ├── guards/           # playerDetailGuard
│   └── services/         # nba-api, favorites, search-history
├── shared/
│   └── components/       # loader, error-message, skeleton-card
├── features/
│   ├── home/            # Page d'accueil
│   ├── player-list/     # Liste avec recherche, favoris, infinite scroll
│   ├── player-detail/   # Détail d'un joueur
│   ├── player-compare/  # Comparateur
│   └── not-found/       # Page 404
├── models/              # Interfaces TypeScript (Player, ApiResponse)
└── app.routes.ts        # Configuration routing + lazy loading
```

## 🔑 Points Clés Techniques

### Clean Code & Architecture
- ✅ Typage TypeScript strict avec interfaces
- ✅ Services injectables avec `providedIn: 'root'`
- ✅ Séparation des responsabilités (services, components, guards)
- ✅ Gestion d'erreurs centralisée avec messages explicites

### Performance & Optimisation
- ✅ Lazy loading de tous les composants
- ✅ Cache API côté client
- ✅ IntersectionObserver pour infinite scroll (pas de scroll events)
- ✅ Debounce sur recherche pour limiter les appels
- ✅ trackBy dans les boucles `@for`
- ✅ Unsubscribe automatique avec `takeUntil(destroy$)`

### Reactive Programming
- ✅ RxJS pour tous les flux asynchrones
- ✅ Signals Angular pour état réactif (favoris, historique)
- ✅ Map pour stockage optimisé (comparateur)
- ✅ Subject pour lifecycle management

### SSR & Compatibilité
- ✅ Vérifications `isPlatformBrowser` pour localStorage
- ✅ Compatible Angular Universal
- ✅ Gestion des APIs navigateur (IntersectionObserver, window)

## 🎨 Design

- Thème dark moderne avec palette NBA
- Animations fluides (CSS + Angular)
- Responsive (mobile, tablette, desktop)
- Accessibilité (aria-labels, focus states)

## 📝 API Utilisée

API NBA personnalisée : `https://tomgaillard.fr/api/nba-data/content.json`  
Fallback local : `/assets/data/nba-players.json`

Données : 100 joueurs NBA avec informations complètes (nom, équipe, position, taille, poids, nationalité, date de naissance, photo)

## 👤 Auteur

**Tom Gaillard**
- 🌐 Portfolio : [tomgaillard.fr](https://tomgaillard.fr)
- 💻 GitHub : [Skyneur/nba-app-angular](https://github.com/Skyneur/nba-app-angular)

---

**Projet d'éducation - Angular 18 - 2026**