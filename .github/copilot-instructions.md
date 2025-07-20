<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Instructions Copilot pour Keskonmange

## Contexte du projet
Ce projet est une application SPA (Single Page Application) moderne construite avec :
- **React 18** avec TypeScript pour la logique frontend
- **Vite** pour le build rapide et le développement
- **Tailwind CSS** pour le styling (privilégier les classes utilitaires Tailwind)

## Préférences de code
- Utiliser TypeScript pour tous les nouveaux composants
- Privilégier les **classes Tailwind CSS** plutôt que le CSS custom
- Utiliser les **hooks React modernes** (useState, useEffect, etc.)
- Préférer les **composants fonctionnels** aux composants de classe
- Appliquer des principes de **responsive design** avec Tailwind
- Utiliser des **noms de variables et fonctions en français** car l'application est destinée à un public francophone

## Architecture recommandée
- Composants dans `/src/components/`
- Pages dans `/src/pages/`
- Hooks personnalisés dans `/src/hooks/`
- Services/API dans `/src/services/`
- Types TypeScript dans `/src/types/`

## Styling
- **Toujours privilégier Tailwind CSS** pour le styling
- Utiliser les classes responsives de Tailwind (`sm:`, `md:`, `lg:`, `xl:`)
- Appliquer le mode sombre avec les classes `dark:`
- Utiliser les animations et transitions de Tailwind

## Bonnes pratiques
- Écrire des composants **réutilisables** et **modulaires**
- Utiliser des **noms descriptifs** en français
- Commenter le code complexe en français
- Prévoir l'intégration future avec une base de données (API REST)
