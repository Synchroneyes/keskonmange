import express from 'express';
import cors from 'cors';
import { routesSalles } from './routes/salles.js';
import { routesPropositions } from './routes/propositions.js';
import { routesVotes } from './routes/votes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/salles', routesSalles);
app.use('/api/propositions', routesPropositions);
app.use('/api/votes', routesVotes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend KESKONMANGE fonctionne correctement',
    timestamp: new Date().toISOString()
  });
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: `Route ${req.originalUrl} non trouvée` 
  });
});

// Gestion globale des erreurs
app.use((error, req, res, next) => {
  console.error('Erreur serveur:', error);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur KESKONMANGE démarré sur http://localhost:${PORT}`);
  console.log(`📋 API disponible sur http://localhost:${PORT}/api`);
  console.log(`❤️  Status: http://localhost:${PORT}/api/health`);
});
