# Utiliser l'image officielle Node.js LTS
FROM node:20-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY src/ ./src/

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001 -G nodejs

# Changer la propriété des fichiers
RUN chown -R nodeuser:nodejs /app
USER nodeuser

# Exposer le port 3001
EXPOSE 3001

# Définir les variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=3001

# Commande de démarrage
CMD ["node", "src/server.js"]
