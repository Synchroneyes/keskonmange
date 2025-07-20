/**
 * Configuration de l'API backend
 */

// URL de base pour l'API backend
export const API_BASE_URL = 'http://localhost:3001/api';

// Endpoints de l'API
export const API_ENDPOINTS = {
  // Salles
  salles: '/salles',
  sallesRejoindre: (id: string) => `/salles/${id}/rejoindre`,
  sallesVerifierMotDePasse: (id: string) => `/salles/${id}/verifier-mot-de-passe`,
  
  // Propositions
  propositions: '/propositions',
  proposition: (id: string) => `/propositions/${id}`,
  
  // Votes
  votes: '/votes',
  voteUtilisateur: (nomUtilisateur: string, propositionId: string) => 
    `/votes/utilisateur/${nomUtilisateur}/proposition/${propositionId}`,
  
  // Santé du serveur
  health: '/health'
};

// Configuration des timeouts
export const API_CONFIG = {
  timeout: 10000, // 10 secondes
  retryAttempts: 3
};
