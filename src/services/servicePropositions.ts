import { serviceHTTP } from './serviceHTTP';
import { API_ENDPOINTS } from '../config/api';
import type { 
  PropositionRepas, 
  AjouterPropositionRequest
} from '../types';

export class ServicePropositions {
  private readonly basePath = API_ENDPOINTS.propositions;

  /**
   * Ajouter une proposition de repas
   * POST /propositions
   */
  async ajouterProposition(donnees: AjouterPropositionRequest): Promise<PropositionRepas> {
    const response = await serviceHTTP.post<PropositionRepas>(this.basePath, donnees);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Erreur lors de l\'ajout de la proposition');
    }
    
    return response.data;
  }

  /**
   * Récupérer les propositions d'une salle pour un jour donné
   * GET /propositions?salleId=xxx&jour=lundi
   */
  async obtenirPropositionsParJour(
    salleId: string, 
    jour: 'lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi'
  ): Promise<PropositionRepas[]> {
    const response = await serviceHTTP.get<PropositionRepas[]>(
      `${this.basePath}?salleId=${salleId}&jour=${jour}`
    );
    
    if (!response.success) {
      throw new Error(response.message || 'Erreur lors de la récupération des propositions');
    }
    
    return response.data || [];
  }

  /**
   * Récupérer toutes les propositions d'une salle
   * GET /propositions?salleId=xxx
   */
  async obtenirToutesPropositions(salleId: string): Promise<PropositionRepas[]> {
    const response = await serviceHTTP.get<PropositionRepas[]>(
      `${this.basePath}?salleId=${salleId}`
    );
    
    if (!response.success) {
      throw new Error(response.message || 'Erreur lors de la récupération des propositions');
    }
    
    return response.data || [];
  }

  /**
   * Récupérer une proposition par son ID
   * GET /propositions/:id
   */
  async obtenirProposition(propositionId: string): Promise<PropositionRepas> {
    const response = await serviceHTTP.get<PropositionRepas>(`${this.basePath}/${propositionId}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Proposition non trouvée');
    }
    
    return response.data;
  }

  /**
   * Modifier une proposition
   * PUT /propositions/:id
   */
  async modifierProposition(
    propositionId: string, 
    donnees: Partial<AjouterPropositionRequest>
  ): Promise<PropositionRepas> {
    const response = await serviceHTTP.put<PropositionRepas>(
      `${this.basePath}/${propositionId}`, 
      donnees
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Erreur lors de la modification de la proposition');
    }
    
    return response.data;
  }

  /**
   * Supprimer une proposition
   * DELETE /propositions/:id
   */
  async supprimerProposition(propositionId: string): Promise<void> {
    const response = await serviceHTTP.delete(`${this.basePath}/${propositionId}`);
    
    if (!response.success) {
      throw new Error(response.message || 'Erreur lors de la suppression de la proposition');
    }
  }
}

// Instance par défaut du service
export const servicePropositions = new ServicePropositions();
