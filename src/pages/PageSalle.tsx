import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FormulaireConnexionSalleUnifie from '../components/FormulaireConnexionSalleUnifie';
import FormulaireProposition from '../components/FormulaireProposition';
import CarteProposition from '../components/CarteProposition';
import Notification from '../components/Notification';
import SectionPartage from '../components/SectionPartage';
import Logo from '../components/Logo';
import { serviceSallesVote, servicePropositions, serviceVotes, ErreurAPI } from '../services';
import type { SalleVote, PropositionRepas, AjouterPropositionRequest } from '../types';

export default function PageSalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // États
  const [salle, setSalle] = useState<SalleVote | null>(null);
  const [propositions, setPropositions] = useState<PropositionRepas[]>([]);
  const [utilisateurActuel, setUtilisateurActuel] = useState<string | null>(null);
  
  // États de chargement et erreurs
  const [chargementConnexion, setChargementConnexion] = useState(false);
  const [chargementVote, setChargementVote] = useState<string | null>(null);
  const [chargementProposition, setChargementProposition] = useState(false);
  const [erreurConnexion, setErreurConnexion] = useState<string | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error' | 'warning' | 'info'} | null>(null);

  // Vérifier si l'URL contient une notification d'erreur ou si l'utilisateur est le créateur
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const error = searchParams.get('error');
    
    if (error === 'access_denied') {
      setNotification({
        message: 'La salle n\'existe pas ou le mot de passe est incorrect.',
        type: 'error'
      });
      // Nettoyer l'URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (id) {
      // Vérifier si l'utilisateur vient de créer cette salle
      verifierCreateur();
    }
  }, [id]);

  // Mettre à jour le titre de la page selon l'état de connexion
  useEffect(() => {
    if (utilisateurActuel && salle) {
      document.title = `KESKONMANGE - Salle de ${salle.nomCreateur}`;
    } else {
      document.title = 'KESKONMANGE - Authentification';
    }
  }, [utilisateurActuel, salle]);

  // Fonction pour vérifier si l'utilisateur est le créateur
  const verifierCreateur = () => {
    try {
      // Vérifier d'abord les informations du créateur
      const creatorInfoStr = sessionStorage.getItem('creatorInfo');
      if (creatorInfoStr) {
        const creatorInfo = JSON.parse(creatorInfoStr);
        
        // Vérifier que les données sont récentes (moins de 5 minutes) et correspondent à cette salle
        const isRecent = Date.now() - creatorInfo.timestamp < 5 * 60 * 1000; // 5 minutes
        const isSameSalle = creatorInfo.salleId === id;
        
        if (isRecent && isSameSalle) {
          // Connecter automatiquement le créateur
          connecterUtilisateur(creatorInfo.nomUtilisateur, creatorInfo.motDePasse, true);
          // Supprimer les informations du sessionStorage
          sessionStorage.removeItem('creatorInfo');
          return;
        }
      }
      
      // Vérifier ensuite les informations utilisateur (pour ceux qui rejoignent)
      const userInfoStr = sessionStorage.getItem('userInfo');
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        
        // Vérifier que les données sont récentes (moins de 5 minutes) et correspondent à cette salle
        const isRecent = Date.now() - userInfo.timestamp < 5 * 60 * 1000; // 5 minutes
        const isSameSalle = userInfo.salleId === id;
        
        if (isRecent && isSameSalle) {
          // Connecter automatiquement l'utilisateur
          connecterUtilisateur(userInfo.nomUtilisateur, userInfo.motDePasse, false);
          // Supprimer les informations du sessionStorage
          sessionStorage.removeItem('userInfo');
          return;
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des informations de connexion:', error);
    }
  };

  // Fonction pour connecter automatiquement un utilisateur (créateur ou participant)
  const connecterUtilisateur = async (nom: string, motDePasse: string, estCreateur: boolean = false) => {
    if (!id) return;
    
    try {
      setChargementConnexion(true);
      
      // Rejoindre la salle directement
      const salle = await serviceSallesVote.rejoindreSalle(id, {
        nomUtilisateur: nom,
        motDePasse
      });
      
      setSalle(salle);
      setUtilisateurActuel(nom);
      
      // Charger les propositions
      await chargerPropositions(id);
      
      // Afficher une notification de bienvenue appropriée
      const message = estCreateur 
        ? `Bienvenue dans votre salle "${salle.nomCreateur}" ! Vous pouvez maintenant proposer des restaurants.`
        : `Bienvenue dans la salle "${salle.nomCreateur}" ! Vous pouvez maintenant proposer des restaurants et voter.`;
      
      setNotification({
        message,
        type: 'success'
      });
      
    } catch (error) {
      console.error('Erreur lors de la connexion automatique:', error);
      setErreurConnexion('Erreur lors de la connexion automatique. Veuillez vous connecter manuellement.');
    } finally {
      setChargementConnexion(false);
    }
  };

  // Fonction pour charger les propositions d'une salle
  const chargerPropositions = async (salleId: string) => {
    try {
      const propositionsSalle = await servicePropositions.obtenirToutesPropositions(salleId);
      setPropositions(propositionsSalle);
    } catch (error) {
      console.error('Erreur lors du chargement des propositions:', error);
    }
  };

  // Fonction pour ajouter une proposition
  const gererAjoutProposition = async (donnees: AjouterPropositionRequest) => {
    try {
      setChargementProposition(true);
      
      await servicePropositions.ajouterProposition(donnees);
      
      // Recharger les propositions
      if (id) {
        await chargerPropositions(id);
      }
      
      // Afficher une notification de succès
      setNotification({
        message: `Proposition "${donnees.nomRestaurant}" ajoutée avec succès !`,
        type: 'success'
      });
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la proposition:', error);
      setNotification({
        message: error instanceof Error ? error.message : 'Erreur lors de l\'ajout de la proposition',
        type: 'error'
      });
    } finally {
      setChargementProposition(false);
    }
  };

  const gererConnexionSalle = async (nomUtilisateur: string, motDePasse: string) => {
    if (!id) return;
    
    try {
      setChargementConnexion(true);
      setErreurConnexion(null);
      
      // Rejoindre la salle directement avec nom + mot de passe
      const salle = await serviceSallesVote.rejoindreSalle(id, {
        nomUtilisateur,
        motDePasse
      });
      
      setSalle(salle);
      setUtilisateurActuel(nomUtilisateur);
      
      // Charger les propositions
      await chargerPropositions(id);
      
      // Afficher une notification de bienvenue
      setNotification({
        message: `Bienvenue dans la salle "${salle.nomCreateur}" ! Vous pouvez maintenant proposer des restaurants et voter.`,
        type: 'success'
      });
      
    } catch (error) {
      console.error('Erreur lors de la connexion à la salle:', error);
      
      if (error instanceof ErreurAPI) {
        if (error.status === 404) {
          setErreurConnexion('Cette salle n\'existe pas ou a été supprimée.');
        } else if (error.status === 403) {
          setErreurConnexion('Mot de passe incorrect.');
        } else {
          setErreurConnexion(`Erreur ${error.status}: ${error.message}`);
        }
      } else {
        setErreurConnexion('Erreur de connexion au serveur.');
      }
    } finally {
      setChargementConnexion(false);
    }
  };

  // Wrapper pour la fonction de vote (pour compatibilité avec CarteProposition)
  const gererVoteWrapper = (propositionId: string, typeVote: 'pour' | 'contre') => {
    gererVote(propositionId, typeVote);
  };

  const gererVote = async (propositionId: string, typeVote: 'pour' | 'contre') => {
    if (!utilisateurActuel) return;
    
    try {
      setChargementVote(propositionId);
      
      await serviceVotes.voter({
        propositionId,
        nomUtilisateur: utilisateurActuel,
        typeVote
      });
      
      // Recharger les propositions
      if (id) {
        await chargerPropositions(id);
      }
      
    } catch (error) {
      console.error('Erreur lors du vote:', error);
    } finally {
      setChargementVote(null);
    }
  };

  const gererRetirerVote = async (propositionId: string) => {
    if (!utilisateurActuel) return;
    
    try {
      setChargementVote(propositionId);
      
      await serviceVotes.retirerVote(propositionId, utilisateurActuel);
      
      // Recharger les propositions
      if (id) {
        await chargerPropositions(id);
      }
      
    } catch (error) {
      console.error('Erreur lors du retrait du vote:', error);
    } finally {
      setChargementVote(null);
    }
  };

  // Grouper les propositions par jour
  const propositionsParJour = propositions.reduce((acc, proposition) => {
    if (!acc[proposition.jour]) {
      acc[proposition.jour] = [];
    }
    acc[proposition.jour].push(proposition);
    return acc;
  }, {} as Record<string, PropositionRepas[]>);

  const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];

  // Redirection si pas d'ID
  if (!id) {
    navigate('/');
    return null;
  }

  // Si l'utilisateur n'est pas encore connecté, afficher le formulaire de connexion unifié
  if (!utilisateurActuel || !salle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-green-900">
        <div className="container mx-auto px-4 py-16">
          
          {/* Notification */}
          {notification && (
            <div className="fixed top-4 right-4 z-50">
              <Notification
                type={notification.type}
                message={notification.message}
                onClose={() => setNotification(null)}
              />
            </div>
          )}
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              🔒 Salle protégée
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Saisissez vos informations pour rejoindre cette salle de vote
            </p>
          </div>
          
          <FormulaireConnexionSalleUnifie
            salleId={id || ''}
            onRejoindre={gererConnexionSalle}
            chargement={chargementConnexion}
            erreur={erreurConnexion}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8">
        
        {/* En-tête de la salle */}
        {salle && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            {/* Logo KESKONMANGE */}
            <div className="text-center mb-6">
              <Logo taille="md" className="mb-4" />
            </div>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                Salle de vote
              </h1>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-6">
                <span>👤 Connecté en tant que <strong>{utilisateurActuel}</strong></span>
                <span>👥 {salle.nombreUtilisateurs || 0} participant{(salle.nombreUtilisateurs || 0) !== 1 ? 's' : ''}</span>
                <span>📝 {propositions.length} proposition{propositions.length !== 1 ? 's' : ''}</span>
              </div>
              
              {/* Section de partage dans l'en-tête */}
              <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                <SectionPartage 
                  salleId={salle.id}
                  titre="📤 Inviter des participants"
                  description="Partagez cette salle pour que vos collègues puissent voter"
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
                />
              </div>
            </div>
          </div>
        )}

        {/* Formulaire d'ajout de proposition */}
        {salle && utilisateurActuel && (
          <FormulaireProposition
            salleId={salle.id}
            nomUtilisateur={utilisateurActuel}
            onAjouterProposition={gererAjoutProposition}
            chargement={chargementProposition}
          />
        )}

        {/* Propositions par jour */}
        <div className="space-y-8">
          {jours.map((jour) => (
            <div key={jour} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 capitalize">
                📅 {jour}
              </h2>
              
              {propositionsParJour[jour]?.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {propositionsParJour[jour].map((proposition) => (
                    <CarteProposition
                      key={proposition.id}
                      proposition={proposition}
                      utilisateurActuel={utilisateurActuel || undefined}
                      onVoter={gererVoteWrapper}
                      onRetirerVote={gererRetirerVote}
                      chargementVote={chargementVote === proposition.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🍽️</div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Aucune proposition pour le {jour}
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                    Soyez le premier à proposer un plat !
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
