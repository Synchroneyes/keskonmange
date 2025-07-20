import { useState, useEffect } from 'react';
import type { PropositionRepas } from '../types';
import { serviceVotes } from '../services/serviceVotes';
import ModalDetailsVotes from './ModalDetailsVotes';

interface Props {
  proposition: PropositionRepas;
  utilisateurActuel?: string;
  onVoter: (propositionId: string, typeVote: 'pour' | 'contre') => void;
  onRetirerVote: (propositionId: string) => void;
  chargementVote?: boolean;
}

export default function CarteProposition({ 
  proposition, 
  utilisateurActuel, 
  onVoter, 
  onRetirerVote, 
  chargementVote = false 
}: Props) {
  const [aVote, setAVote] = useState(false);
  const [typeVoteUtilisateur, setTypeVoteUtilisateur] = useState<'pour' | 'contre' | null>(null);
  const [modalOuvert, setModalOuvert] = useState(false);
  const [chargementVerification, setChargementVerification] = useState(false);

  // Vérifier si l'utilisateur a voté pour cette proposition
  useEffect(() => {
    if (utilisateurActuel) {
      verifierVoteUtilisateur();
    }
  }, [proposition.id, utilisateurActuel]);

  const verifierVoteUtilisateur = async () => {
    if (!utilisateurActuel) return;
    
    try {
      setChargementVerification(true);
      const votes = await serviceVotes.obtenirVotesProposition(proposition.id);
      const voteUtilisateur = votes.find(vote => vote.nomUtilisateur === utilisateurActuel);
      
      if (voteUtilisateur) {
        setAVote(true);
        setTypeVoteUtilisateur(voteUtilisateur.typeVote);
      } else {
        setAVote(false);
        setTypeVoteUtilisateur(null);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du vote:', error);
      setAVote(false);
      setTypeVoteUtilisateur(null);
    } finally {
      setChargementVerification(false);
    }
  };
  
  const gererClicVotePour = () => {
    if (chargementVote || chargementVerification) return;
    
    if (aVote) {
      onRetirerVote(proposition.id);
      setAVote(false);
      setTypeVoteUtilisateur(null);
    } else {
      onVoter(proposition.id, 'pour');
      setAVote(true);
      setTypeVoteUtilisateur('pour');
    }
  };

  const gererClicVoteContre = () => {
    if (chargementVote || chargementVerification) return;
    
    if (aVote) {
      onRetirerVote(proposition.id);
      setAVote(false);
      setTypeVoteUtilisateur(null);
    } else {
      onVoter(proposition.id, 'contre');
      setAVote(true);
      setTypeVoteUtilisateur('contre');
    }
  };

  const ouvrirModal = () => {
    setModalOuvert(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-200">
      {/* En-tête avec nom du plat */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            🍽️ {proposition.nomRestaurant}
          </h3>
          {proposition.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {proposition.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Proposé par <strong>{proposition.nomUtilisateur}</strong>
            </p>
          </div>
        </div>
        
        {/* Badge du jour */}
        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
          {proposition.jour.charAt(0).toUpperCase() + proposition.jour.slice(1)}
        </span>
      </div>

      {/* Section votes */}
      <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
        <div className="flex items-center justify-between mb-3">
          {/* Nombre de votes cliquable */}
          <button
            onClick={ouvrirModal}
            className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors"
          >
            <span className="text-2xl">👥</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {proposition.nombreVotes} vote{proposition.nombreVotes !== 1 ? 's' : ''}
            </span>
          </button>
          
          {/* Boutons de vote */}
          {utilisateurActuel && (
            <div className="flex items-center gap-2">
              {/* Bouton pour */}
              <button
                onClick={gererClicVotePour}
                disabled={chargementVote || chargementVerification}
                className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:opacity-50 flex items-center gap-1 ${
                  aVote && typeVoteUtilisateur === 'pour'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-green-900 dark:hover:text-green-300'
                }`}
              >
                {chargementVote || chargementVerification ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <>
                    <span>👍</span>
                    <span className="text-sm">{proposition.votesPour || 0}</span>
                  </>
                )}
              </button>

              {/* Bouton contre */}
              <button
                onClick={gererClicVoteContre}
                disabled={chargementVote || chargementVerification}
                className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:opacity-50 flex items-center gap-1 ${
                  aVote && typeVoteUtilisateur === 'contre'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-red-900 dark:hover:text-red-300'
                }`}
              >
                {chargementVote || chargementVerification ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <>
                    <span>👎</span>
                    <span className="text-sm">{proposition.votesContre || 0}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
        
        {/* Indicateur du vote utilisateur */}
        {utilisateurActuel && aVote && (
          <div className="mb-3">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              typeVoteUtilisateur === 'pour'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              <span>{typeVoteUtilisateur === 'pour' ? '👍' : '👎'}</span>
              Vous avez voté {typeVoteUtilisateur === 'pour' ? 'pour' : 'contre'}
            </span>
          </div>
        )}
        
        {/* Statistiques des votes simplifiées */}
        {proposition.nombreVotes > 0 ? (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Cliquez sur le nombre de votes pour voir les détails
          </div>
        ) : (
          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
            Aucun vote pour le moment
          </p>
        )}
      </div>

      {/* Modal des détails des votes */}
      <ModalDetailsVotes
        propositionId={proposition.id}
        nomRestaurant={proposition.nomRestaurant}
        estOuvert={modalOuvert}
        onFermer={() => setModalOuvert(false)}
      />
    </div>
  );
}
