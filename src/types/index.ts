// Types pour le formulaire de création
export interface CreationSalleVote {
  nomUtilisateur: string;
  motDePasse: string;
}

// Types correspondant au backend
export interface SalleVote {
  id: string;
  nomCreateur: string;
  dateCreation: string;
  estActive: boolean;
  nombreUtilisateurs?: number;
  utilisateurs?: string[];
}

export interface PropositionRepas {
  id: string;
  salleId: string;
  nomUtilisateur: string;
  nomRestaurant: string;
  description?: string;
  jour: 'lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi';
  dateCreation: string;
  dateModification?: string;
  nombreVotes: number;
  votesPour?: number;
  votesContre?: number;
}

export interface Vote {
  id: string;
  propositionId: string;
  nomUtilisateur: string;
  typeVote: 'pour' | 'contre';
  dateCreation: string;
  dateModification?: string;
}

// Types pour les requêtes API correspondant au backend
export interface CreerSalleVoteRequest {
  nomCreateur: string;
  motDePasse: string;
}

export interface RejoindreSalleRequest {
  nomUtilisateur: string;
  motDePasse: string;
}

export interface VerifierMotDePasseRequest {
  motDePasse: string;
}

export interface AjouterPropositionRequest {
  salleId: string;
  nomUtilisateur: string;
  nomRestaurant: string;
  description?: string;
  jour: 'lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi';
}

export interface VoterRequest {
  propositionId: string;
  nomUtilisateur: string;
  typeVote: 'pour' | 'contre';
}

// Types pour les réponses avec statistiques
export interface StatistiquesVotes {
  totalVotes: number;
  votesPour: number;
  votesContre: number;
  pourcentagePour?: number;
}

export interface ReponseVote {
  vote: Vote;
  statistiques: StatistiquesVotes;
}
