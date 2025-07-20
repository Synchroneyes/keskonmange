import { serviceHTTP } from './serviceHTTP';
import { API_ENDPOINTS } from '../config/api';
import type { 
  Vote,
  VoterRequest,
  PropositionRepas
} from '../types';

export class ServiceVotes {
  private readonly basePath = API_ENDPOINTS.votes;

  /**
   * Voter pour une proposition
   * POST /votes
   */
  async voter(donnees: VoterRequest): Promise<Vote> {
    const response = await serviceHTTP.post<Vote>(this.basePath, donnees);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Erreur lors du vote');
    }
    
    return response.data;
  }

  /**
   * Retirer son vote d'une proposition
   * DELETE /votes/:propositionId/utilisateur/:nomUtilisateur
   */
  async retirerVote(propositionId: string, nomUtilisateur: string): Promise<void> {
    const response = await serviceHTTP.delete(
      `${this.basePath}/${propositionId}/utilisateur/${encodeURIComponent(nomUtilisateur)}`
    );
    
    if (!response.success) {
      throw new Error(response.message || 'Erreur lors du retrait du vote');
    }
  }

  /**
   * Récupérer les votes d'un utilisateur pour une salle
   * GET /votes/utilisateur/:nomUtilisateur/salle/:salleId
   */
  async obtenirVotesUtilisateur(nomUtilisateur: string, salleId: string): Promise<Vote[]> {
    const response = await serviceHTTP.get<Vote[]>(
      `${this.basePath}/utilisateur/${encodeURIComponent(nomUtilisateur)}/salle/${salleId}`
    );
    
    if (!response.success) {
      throw new Error(response.message || 'Erreur lors de la récupération des votes');
    }
    
    return response.data || [];
  }

  /**
   * Récupérer les votes pour une proposition
   * GET /votes/proposition/:propositionId
   */
  async obtenirVotesProposition(propositionId: string): Promise<Vote[]> {
    const response = await serviceHTTP.get<Vote[]>(
      `${this.basePath}/proposition/${propositionId}`
    );
    
    if (!response.success) {
      throw new Error(response.message || 'Erreur lors de la récupération des votes');
    }
    
    return response.data || [];
  }

  /**
   * Vérifier si un utilisateur a voté pour une proposition
   * GET /votes/proposition/:propositionId/utilisateur/:nomUtilisateur/exists
   */
  async aVote(propositionId: string, nomUtilisateur: string): Promise<boolean> {
    try {
      const response = await serviceHTTP.get<{ aVote: boolean }>(
        `${this.basePath}/proposition/${propositionId}/utilisateur/${encodeURIComponent(nomUtilisateur)}/exists`
      );
      
      return response.data?.aVote || false;
    } catch {
      // Si l'endpoint retourne 404, cela signifie que l'utilisateur n'a pas voté
      return false;
    }
  }

  /**
   * Obtenir le classement des propositions pour un jour donné
   * GET /votes/classement/salle/:salleId/jour/:jour
   */
  async obtenirClassementParJour(
    salleId: string, 
    jour: 'lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi'
  ): Promise<PropositionRepas[]> {
    const response = await serviceHTTP.get<PropositionRepas[]>(
      `${this.basePath}/classement/salle/${salleId}/jour/${jour}`
    );
    
    if (!response.success) {
      throw new Error(response.message || 'Erreur lors de la récupération du classement');
    }
    
    return response.data || [];
  }
}

// Instance par défaut du service
export const serviceVotes = new ServiceVotes();
