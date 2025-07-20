# 🍽️ Keskonmange - Application SPA Moderne

Une application Single Page Application (SPA) moderne construite avec React, TypeScript, Vite et Tailwind CSS.

## 🚀 Technologies utilisées

- **React 18** - Bibliothèque UI moderne avec TypeScript
- **Vite** - Build tool ultra-rapide avec hot reload
- **Tailwind CSS** - Framework CSS utility-first pour un styling minimal
- **TypeScript** - Typage statique pour un développement robuste

## ✨ Fonctionnalités

- ⚡ Développement rapide avec Vite et Hot Module Replacement
- 🎨 Interface moderne avec Tailwind CSS (zéro CSS custom)
- 🌙 Support du mode sombre intégré
- 📱 Design responsive par défaut
- 🔧 Configuration TypeScript stricte
- 🎯 Prêt pour l'intégration avec une base de données

## 🛠️ Installation et démarrage

1. **Installer les dépendances :**
   ```bash
   npm install
   ```

2. **Lancer le serveur de développement :**
   ```bash
   npm run dev
   ```

3. **Construire pour la production :**
   ```bash
   npm run build
   ```

4. **Prévisualiser la version de production :**
   ```bash
   npm run preview
   ```

## 📁 Structure du projet

```
src/
├── components/     # Composants réutilisables
├── pages/         # Pages de l'application
├── hooks/         # Hooks React personnalisés
├── services/      # Services API et utilitaires
├── types/         # Types TypeScript
└── App.tsx        # Composant principal
```

## 🎨 Guide de style

- **CSS :** Utiliser exclusivement les classes Tailwind CSS
- **Composants :** Privilégier les composants fonctionnels avec hooks
- **TypeScript :** Typer tous les props et états
- **Nommage :** Variables et fonctions en français (public francophone)

## 🚧 Prochaines étapes

- [ ] Intégration avec une API REST
- [ ] Gestion d'état globale (Zustand/Redux Toolkit)
- [ ] Authentification utilisateur
- [ ] Base de données (MongoDB/PostgreSQL)
- [ ] Tests unitaires et d'intégration

## 📝 Développement

Ce projet utilise les configurations ESLint et TypeScript strictes pour maintenir la qualité du code.
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
