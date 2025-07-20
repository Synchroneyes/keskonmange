# 🐳 Docker Configuration pour KESKONMANGE

## 🚀 Démarrage rapide

### Windows (PowerShell)
```powershell
.\start-backend.ps1
```

### Linux/Mac (Bash)
```bash
chmod +x start-backend.sh
./start-backend.sh
```

### Manuel
```bash
# Construire l'image
docker-compose build

# Démarrer en arrière-plan
docker-compose up -d

# Vérifier les logs
docker-compose logs -f
```

## 📋 Configuration

### Ports
- **Backend API** : `127.0.0.1:20880` → `container:3001`

### Variables d'environnement
Les variables sont définies dans `backend/.env.docker` :
- `NODE_ENV=production`
- `PORT=3001`
- `CORS_ORIGIN=https://keskonmange.monvoisin-kevin.fr`

## 🔧 Commandes utiles

```bash
# Voir les conteneurs en cours
docker-compose ps

# Voir les logs en temps réel
docker-compose logs -f

# Arrêter les services
docker-compose down

# Redémarrer un service
docker-compose restart keskonmange-backend

# Reconstruire l'image
docker-compose build --no-cache

# Entrer dans le conteneur
docker-compose exec keskonmange-backend sh

# Vérifier la santé du service
curl http://127.0.0.1:20880/api/health
```

## 🌐 Configuration du frontend

Pour utiliser l'API Docker en développement local, modifiez `.env.development` :

```env
# Commenter cette ligne
# VITE_API_BASE_URL=http://localhost:3001/api

# Décommenter cette ligne
VITE_API_BASE_URL=http://127.0.0.1:20880/api
```

## 📊 Monitoring

### Health Check
Le conteneur inclut un health check qui vérifie `/api/health` toutes les 30 secondes.

### Logs
Les logs sont persistés dans le dossier `./logs/` du host.

## 🔒 Sécurité

- Le conteneur utilise un utilisateur non-root (`nodeuser`)
- Le port est bindé uniquement sur `127.0.0.1` (localhost)
- Les variables sensibles sont externalisées dans `.env.docker`

## 🚨 Dépannage

### Le service ne démarre pas
```bash
# Vérifier les logs
docker-compose logs keskonmange-backend

# Vérifier l'état des conteneurs
docker-compose ps
```

### Port déjà utilisé
```bash
# Vérifier qui utilise le port 20880
netstat -tulpn | grep 20880

# Ou modifier le port dans docker-compose.yml
ports:
  - "127.0.0.1:NOUVEAU_PORT:3001"
```

### Problème de permissions
```bash
# Reconstruire l'image
docker-compose build --no-cache
```

## 📦 Production

Pour le déploiement en production, modifiez `backend/.env.docker` avec vos vraies valeurs :

```env
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://keskonmange.monvoisin-kevin.fr
# Ajoutez d'autres variables selon vos besoins
```
