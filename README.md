# SpendTracker

Application mobile de suivi de dépenses personnelles construite avec **React Native, TypeScript, Expo et Supabase**. Synchronisation cloud, statistiques mensuelles, catégorisation personnalisable.

[**Live Demo (Expo Web) →**](https://spendtracker-alpha.vercel.app/)

## Fonctionnalités

- **Authentification** : signup/login via Supabase Auth, persistance de session avec AsyncStorage
- **Catégories personnalisables** : 6 catégories par défaut, création/édition/suppression de catégories perso avec icône emoji et couleur
- **Suivi des dépenses** : ajout rapide avec montant, description, catégorie, date
- **Statistiques mensuelles** : total du mois, comparaison avec mois précédent, graphique camembert SVG fait main, répartition par catégorie avec barres de progression
- **Synchronisation temps réel** : modifications de catégories répercutées instantanément sur tous les écrans via React Context
- **Multi-utilisateur sécurisé** : Row Level Security Supabase, chaque utilisateur voit uniquement ses propres données
- **Cross-platform** : tourne sur iOS, Android et Web (Expo Web)

## Stack

- **Framework** : React Native via Expo SDK 50+
- **Langage** : TypeScript
- **Navigation** : React Navigation (Bottom Tabs + Native Stack)
- **Backend** : Supabase (PostgreSQL + Auth + RLS)
- **State global** : React Context (Auth + Categories)
- **Graphiques** : SVG natif via react-native-svg
- **Date** : date-fns avec locale française
- **Déploiement** : Expo Web → Vercel

## Architecture

```
src/
├── components/          # PieChart, CategoryModal
├── contexts/            # AuthContext, CategoriesContext
├── lib/                 # supabase client, defaultCategories, stats helpers
├── navigation/          # RootNavigator (auth gate), TabNavigator
├── screens/             # Login, Home, AddExpense, Stats, Settings, Categories
├── theme/               # palette de couleurs Black/White/Terracotta
└── types/               # interfaces TypeScript partagées
```

## Schéma de base de données

Deux tables avec Row Level Security activée :

- `st_categories` : catégories utilisateur (nom, icône, couleur, par défaut)
- `st_expenses` : dépenses (montant, description, catégorie, date)

Chaque table a 4 policies RLS (SELECT/INSERT/UPDATE/DELETE) qui vérifient `auth.uid() = user_id`.

## Choix techniques notables

- **Pie chart SVG fait main** : utilisation de `strokeDasharray` et `strokeDashoffset` sur des cercles superposés plutôt qu'une lib externe lourde, pour un rendu léger et personnalisable
- **CategoriesContext avec mise à jour optimiste** : les mutations (add/update/delete) mettent à jour l'état local immédiatement après le succès Supabase, évitant un refetch complet — UX fluide et économique en requêtes
- **Adaptations cross-platform** : `Alert` natif sur mobile / `window.confirm` sur web, suppression via bouton trash plutôt que long press (compatible souris)
- **Largeur fixe 480px sur web** : l'app s'affiche en format mobile centré sur grand écran, comme un mockup interactif

## Installation locale

```bash
git clone https://github.com/carlos-ky/spendtracker.git
cd spendtracker
npm install

# Configurer .env à la racine :
# EXPO_PUBLIC_SUPABASE_URL=...
# EXPO_PUBLIC_SUPABASE_ANON_KEY=...

npx expo start --web    # web
npx expo start          # mobile via Expo Go
```

## Auteur

**Carlos KY** — Frontend Developer
[Portfolio](https://portfolio-flame-chi-66.vercel.app/) · [GitHub](https://github.com/carlos-ky)

## Licence

MIT