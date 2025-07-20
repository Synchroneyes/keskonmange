# 🔧 Backend KESKONMANGE

## Configuration pour api.keskonmange.monvoisin-kevin.fr

### Variables d'environnement requises

Créez un fichier `.env` dans le dossier `backend/` :

```env
# Port du serveur
PORT=3001

# Configuration CORS
CORS_ORIGIN=https://keskonmange.monvoisin-kevin.fr

# Base de données (si vous en ajoutez une plus tard)
# DATABASE_URL=...

# Autres configurations
NODE_ENV=production
```

### Installation et démarrage

```bash
# Installation des dépendances
cd backend
npm install

# Démarrage en mode production
npm start

# Démarrage en mode développement
npm run dev
```

### Configuration du serveur web

#### Nginx (recommandé)

```nginx
server {
    listen 80;
    server_name api.keskonmange.monvoisin-kevin.fr;
    
    # Redirection vers HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name api.keskonmange.monvoisin-kevin.fr;
    
    # Configuration SSL (Let's Encrypt recommandé)
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Apache (.htaccess)

```apache
# Redirection vers HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Proxy vers l'application Node.js
ProxyPreserveHost On
ProxyPass / http://localhost:3001/
ProxyPassReverse / http://localhost:3001/
```

### Process Manager (PM2 recommandé)

```bash
# Installation de PM2
npm install -g pm2

# Démarrage de l'application
pm2 start src/server.js --name "keskonmange-api"

# Configuration du démarrage automatique
pm2 startup
pm2 save
```

### Monitoring

```bash
# Vérifier les logs
pm2 logs keskonmange-api

# Vérifier le statut
pm2 status

# Redémarrer l'application
pm2 restart keskonmange-api
```

### Sécurité

1. **Firewall** : Ouvrez uniquement les ports 80, 443 et 22 (SSH)
2. **SSL/TLS** : Utilisez Let's Encrypt pour les certificats gratuits
3. **CORS** : Configuré pour accepter uniquement le domaine frontend
4. **Rate limiting** : Considérez l'ajout d'un middleware de limitation de débit

### Tests de connectivité

```bash
# Test de l'API en local
curl http://localhost:3001/api/health

# Test de l'API en production
curl https://api.keskonmange.monvoisin-kevin.fr/api/health
```
