// Stockage en mémoire pour les données de l'application

// Structure des données
export const donneesMemoire = {
  salles: new Map(), // id -> SalleVote
  propositions: new Map(), // id -> PropositionRepas
  votes: new Map(), // id -> Vote
  utilisateurs: new Map() // salleId -> Set<nomUtilisateur>
};

// Fonctions utilitaires pour la gestion des données

/**
 * Générer un ID unique simple
 */
export function genererIdUnique() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Ajouter un utilisateur à une salle
 */
export function ajouterUtilisateurASalle(salleId, nomUtilisateur) {
  if (!donneesMemoire.utilisateurs.has(salleId)) {
    donneesMemoire.utilisateurs.set(salleId, new Set());
  }
  donneesMemoire.utilisateurs.get(salleId).add(nomUtilisateur);
}

/**
 * Vérifier si un utilisateur est dans une salle
 */
export function utilisateurEstDansSalle(salleId, nomUtilisateur) {
  const utilisateursSalle = donneesMemoire.utilisateurs.get(salleId);
  return utilisateursSalle ? utilisateursSalle.has(nomUtilisateur) : false;
}

/**
 * Obtenir tous les utilisateurs d'une salle
 */
export function obtenirUtilisateursSalle(salleId) {
  const utilisateursSalle = donneesMemoire.utilisateurs.get(salleId);
  return utilisateursSalle ? Array.from(utilisateursSalle) : [];
}

/**
 * Obtenir les propositions d'une salle
 */
export function obtenirPropositionsSalle(salleId, jour = null) {
  const toutesPropositions = Array.from(donneesMemoire.propositions.values());
  let propositionsSalle = toutesPropositions.filter(p => p.salleId === salleId);
  
  if (jour) {
    propositionsSalle = propositionsSalle.filter(p => p.jour === jour);
  }
  
  return propositionsSalle;
}

/**
 * Obtenir les votes d'une proposition
 */
export function obtenirVotesProposition(propositionId) {
  const tousVotes = Array.from(donneesMemoire.votes.values());
  return tousVotes.filter(v => v.propositionId === propositionId);
}

/**
 * Afficher les statistiques de l'application
 */
export function afficherStatistiques() {
  console.log('📊 Statistiques KESKONMANGE:');
  console.log(`   Salles: ${donneesMemoire.salles.size}`);
  console.log(`   Propositions: ${donneesMemoire.propositions.size}`);
  console.log(`   Votes: ${donneesMemoire.votes.size}`);
  console.log(`   Utilisateurs actifs: ${Array.from(donneesMemoire.utilisateurs.values()).reduce((total, set) => total + set.size, 0)}`);
}
