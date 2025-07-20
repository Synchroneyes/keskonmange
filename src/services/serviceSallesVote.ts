import { serviceHTTP } from './serviceHTTP';
import { API_ENDPOINTS } from '../config/api';
import type { 
  SalleVote, 
  CreerSalleVoteRequest,
  RejoindreSalleRequest,
  VerifierMotDePasseRequest
} from '../types';

export class ServiceSallesVote {
  private readonly basePath = API_ENDPOINTS.salles;

  /**
   * Créer une nouvelle salle de vote
   * POST /salles
   */
  async creerSalle(donnees: CreerSalleVoteRequest): Promise<SalleVote> {
    const response = await serviceHTTP.post<SalleVote>(this.basePath, donnees);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Erreur lors de la création de la salle');
    }
    
    return response.data;
  }

  /**
   * Récupérer les informations d'une salle
   * GET /salles/:id
   */
  async obtenirSalle(salleId: string): Promise<SalleVote> {
    const response = await serviceHTTP.get<SalleVote>(`${this.basePath}/${salleId}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Salle non trouvée');
    }
    
    return response.data;
  }

  /**
   * Vérifier le mot de passe d'une salle
   * POST /salles/:id/verifier-mot-de-passe
   */
  async verifierMotDePasse(salleId: string, donnees: VerifierMotDePasseRequest): Promise<boolean> {
    const endpoint = API_ENDPOINTS.sallesVerifierMotDePasse(salleId);
    const response = await serviceHTTP.post<{ motDePasseCorrect: boolean }>(endpoint, donnees);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Erreur lors de la vérification');
    }
    
    return response.data.motDePasseCorrect;
  }

  /**
   * Rejoindre une salle avec mot de passe
   * POST /salles/:id/rejoindre
   */
  async rejoindreSalle(salleId: string, donnees: RejoindreSalleRequest): Promise<SalleVote> {
    const endpoint = API_ENDPOINTS.sallesRejoindre(salleId);
    const response = await serviceHTTP.post<SalleVote>(endpoint, donnees);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Erreur lors de la connexion à la salle');
    }
    
    return response.data;
  }

  /**
   * Lister toutes les salles (pour debug)
   * GET /salles
   */
  async obtenirToutesSalles(): Promise<SalleVote[]> {
    const response = await serviceHTTP.get<SalleVote[]>(this.basePath);
    
    if (!response.success) {
      throw new Error(response.message || 'Erreur lors de la récupération des salles');
    }
    
    return response.data || [];
  }
}

// Instance par défaut du service
export const serviceSallesVote = new ServiceSallesVote();
