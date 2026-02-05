# 🏀 NBA Explorer - Application Angular 18

Application Front-End robuste développée avec Angular 18, consommant l'API **balldontlie.io** pour afficher les données NBA (joueurs, équipes, statistiques).

## 📋 Caractéristiques Techniques

### Framework & Architecture
- ✅ **Angular 18** avec Standalone Components
- ✅ Nouvelle syntaxe de contrôle de flux (`@if`, `@for`)
- ✅ Architecture modulaire (Core, Shared, Features)
- ✅ Lazy Loading des routes pour optimiser les performances

### Gestion Asynchrone (RxJS)
- ✅ Service API centralisé avec gestion d'erreurs
- ✅ Opérateurs RxJS : `map`, `catchError`, `tap`, `finalize`, `debounceTime`
- ✅ BehaviorSubject pour l'état de chargement global
- ✅ États gérés : Loading, Error, Data

### Routing & Navigation
- ✅ Configuration des routes avec `app.routes.ts`
- ✅ Guard fonctionnel pour valider les paramètres
- ✅ Lazy loading des composants
- ✅ Page 404 personnalisée

### Formulaires
- ✅ Reactive Forms pour la recherche
- ✅ Debounce (300ms) sur la recherche en temps réel
- ✅ Validation et messages d'erreur

### UI/UX
- ✅ Bootstrap 5 + Bootstrap Icons
- ✅ Design responsive (mobile-first)
- ✅ Animations CSS personnalisées
- ✅ Composants réutilisables (Loader, ErrorMessage)

## 🚀 Lancement

```bash
npm install
npm start
```

Application : **http://localhost:4200/**

## 🎯 Fonctionnalités

1. **Page d'accueil** (`/`) - Présentation
2. **Liste des joueurs** (`/players`) - Recherche en temps réel + Pagination
3. **Détail joueur** (`/players/:id`) - Informations complètes
4. **Page 404** - Routes invalides

## 📦 Structure

```
src/app/
├── core/          # Services, Guards
├── shared/        # Composants réutilisables
├── features/      # Pages (home, player-list, player-detail, not-found)
├── models/        # Interfaces TypeScript
└── app.routes.ts  # Configuration routing
```

## 🔑 Points Clés Clean Code

- Typage TypeScript fort
- Gestion d'erreurs centralisée
- Reactive Forms avec debounce
- Guard fonctionnel
- Unsubscribe automatique (takeUntil)

Projet d'éducation 2026