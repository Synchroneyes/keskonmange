# 🧪 Guide de test pour le routage SPA sur GitHub Pages

## ✅ Configuration mise en place

1. **`public/404.html`** : Page de redirection automatique pour GitHub Pages
2. **`index.html`** : Script de gestion des redirections dans l'app React
3. **`.github/workflows/deploy.yml`** : Copie automatique du 404.html lors du build
4. **`public/.nojekyll`** : Désactive Jekyll pour éviter les conflits

## 🔍 Comment tester

### Test en local (avant déploiement)
```bash
# Build et servir localement
npm run build
npx serve dist

# Tester les routes directes
# http://localhost:3000/
# http://localhost:3000/salles/test123
```

### Test en production (après déploiement)
1. **Route principale** : https://keskonmange.monvoisin-kevin.fr/
2. **Route directe** : https://keskonmange.monvoisin-kevin.fr/salles/abc123
3. **Route avec paramètres** : https://keskonmange.monvoisin-kevin.fr/salles/abc123?param=value

## 🛠️ Comment ça fonctionne

### Étape 1 : Accès direct à une route
Quand un utilisateur accède directement à `/salles/xxxx` :

1. GitHub Pages ne trouve pas le fichier physique
2. Retourne la page `404.html`
3. Le script dans `404.html` capture l'URL
4. Redirige vers `/?p=/salles/xxxx`

### Étape 2 : Gestion de la redirection
1. `index.html` se charge avec le paramètre `p`
2. Le script dans `<head>` lit le paramètre `p`
3. Utilise `history.replaceState()` pour restaurer l'URL originale
4. React Router prend le relais normalement

## 🐛 Dépannage

### La route ne fonctionne toujours pas
1. Vérifiez que `404.html` est présent dans le dossier `dist/`
2. Vérifiez que le CNAME est correct
3. Attendez la propagation DNS (jusqu'à 24h)
4. Testez en navigation privée pour éviter le cache

### Erreur de redirection infinie
Vérifiez que le script dans `index.html` est bien formaté et ne contient pas d'erreurs JavaScript.

### Les paramètres d'URL sont perdus
Le script preserve automatiquement les paramètres GET. Si ils sont perdus, vérifiez la logique de redirection.

## 📝 Scripts impliqués

### 404.html (Capture et redirection)
```javascript
var pathSegments = window.location.pathname.split('/').filter(segment => segment !== '');
var redirect = window.location.origin + '/?p=/' + pathSegments.join('/');
window.location.replace(redirect);
```

### index.html (Restauration de l'URL)
```javascript
if (l.search && l.search.includes('p=')) {
  // Parse et restaure l'URL originale
  window.history.replaceState(null, null, originalPath);
}
```

## ✅ Checklist de déploiement

- [ ] `404.html` créé dans `public/`
- [ ] Script ajouté dans `index.html`
- [ ] Workflow GitHub Actions met à jour
- [ ] Build teste localement
- [ ] Déployé sur GitHub Pages
- [ ] DNS configuré (CNAME)
- [ ] Routes testées en production

## 🎯 Routes à tester absolument

1. **Page d'accueil** : `/`
2. **Salle spécifique** : `/salles/[id]`
3. **Salle avec erreur** : `/salles/[id]?error=access_denied`
4. **Routes inexistantes** : `/route-qui-nexiste-pas` (doit rediriger vers l'accueil)

Une fois toutes ces étapes validées, votre SPA fonctionnera parfaitement sur GitHub Pages ! 🚀
