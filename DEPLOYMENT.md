# 🚀 Guide de déploiement KESKONMANGE

## Configuration GitHub Pages

### Étapes pour activer GitHub Pages

1. **Accédez aux paramètres du repository**
   - Allez sur votre repository GitHub
   - Cliquez sur l'onglet **Settings**

2. **Configurez GitHub Pages**
   - Dans le menu latéral, cliquez sur **Pages**
   - Dans la section **Source**, sélectionnez **GitHub Actions**

3. **Vérifiez les permissions**
   - Allez dans **Settings** > **Actions** > **General**
   - Dans **Workflow permissions**, assurez-vous que les permissions de lecture/écriture sont activées

### Déploiement automatique

Le déploiement se fait automatiquement via GitHub Actions :

- ✅ **Déclenchement** : Push sur `main` ou `master`
- ✅ **Build** : Installation des dépendances et compilation avec Vite
- ✅ **Linting** : Vérification du code (si configuré)
- ✅ **Déploiement** : Publication sur GitHub Pages

### URL de l'application

Une fois déployée, votre application sera accessible à :
```
https://[username].github.io/vibecode-keskonmange/
```

Remplacez `[username]` par votre nom d'utilisateur GitHub.

### Fichiers de configuration

- **`.github/workflows/deploy.yml`** : Workflow GitHub Actions
- **`vite.config.ts`** : Configuration Vite avec base path
- **`public/.nojekyll`** : Désactive Jekyll sur GitHub Pages

### Résolution de problèmes

#### L'application ne se charge pas
- Vérifiez que la base path dans `vite.config.ts` correspond au nom de votre repository
- Assurez-vous que GitHub Pages est configuré pour utiliser GitHub Actions

#### Erreurs de build
- Consultez l'onglet **Actions** de votre repository
- Vérifiez les logs de build pour identifier les erreurs

#### Chemins des assets cassés
- Vérifiez la configuration `base` dans `vite.config.ts`
- Assurez-vous que tous les liens relatifs commencent par `/`

### Développement local

Pour tester localement avec la configuration de production :

```bash
npm run build
npm run preview
```

### Variables d'environnement

Si vous utilisez des variables d'environnement, ajoutez-les dans :
**Settings** > **Secrets and variables** > **Actions** > **Variables**

## 🎯 Workflow détaillé

### 1. Build (🏗️)
- Checkout du code source
- Installation de Node.js 20
- Installation des dépendances avec `npm ci`
- Linting du code (optionnel)
- Build de l'application avec `npm run build`
- Upload des artifacts

### 2. Deploy (🚀)
- Téléchargement des artifacts
- Déploiement sur GitHub Pages
- Génération de l'URL de l'application

### Sécurité

Le workflow utilise les permissions minimales nécessaires :
- `contents: read` : Lecture du code source
- `pages: write` : Écriture sur GitHub Pages
- `id-token: write` : Authentification

### Monitoring

- Consultez l'onglet **Actions** pour suivre les déploiements
- Chaque push déclenche un nouveau déploiement
- Les échecs sont notifiés par email (si configuré)
