import { useEffect, useState } from 'react';
import type { Vote } from '../types';
import { serviceVotes } from '../services/serviceVotes';

interface Props {
  propositionId: string;
  nomRestaurant: string;
  estOuvert: boolean;
  onFermer: () => void;
}

export default function ModalDetailsVotes({ 
  propositionId, 
  nomRestaurant, 
  estOuvert, 
  onFermer 
}: Props) {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const chargerVotes = async () => {
    try {
      setChargement(true);
      setErreur(null);
      const votesData = await serviceVotes.obtenirVotesProposition(propositionId);
      setVotes(votesData);
    } catch (error) {
      console.error('Erreur lors du chargement des votes:', error);
      setErreur('Impossible de charger les détails des votes');
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    if (estOuvert && propositionId) {
      chargerVotes();
    }
  }, [estOuvert, propositionId, chargerVotes]);

  const votesPour = votes.filter(vote => vote.typeVote === 'pour');
  const votesContre = votes.filter(vote => vote.typeVote === 'contre');

  if (!estOuvert) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* En-tête */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              📊 Détails des votes
            </h3>
            <button
              onClick={onFermer}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            🍽️ {nomRestaurant}
          </p>
        </div>

        {/* Contenu */}
        <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">
          {chargement ? (
            <div className="flex items-center justify-center py-8">
              <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : erreur ? (
            <div className="text-center py-8">
              <p className="text-red-500 dark:text-red-400">{erreur}</p>
              <button
                onClick={chargerVotes}
                className="mt-2 text-blue-500 hover:text-blue-600 text-sm"
              >
                Réessayer
              </button>
            </div>
          ) : votes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                Aucun vote pour cette proposition
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Résumé */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Total des votes
                  </span>
                  <span className="text-lg font-bold text-gray-800 dark:text-white">
                    {votes.length}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-green-600 dark:text-green-400">👍</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {votesPour.length} pour
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-red-600 dark:text-red-400">👎</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {votesContre.length} contre
                    </span>
                  </div>
                </div>
              </div>

              {/* Votes pour */}
              {votesPour.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2 flex items-center gap-1">
                    <span>👍</span>
                    Votes pour ({votesPour.length})
                  </h4>
                  <div className="space-y-2">
                    {votesPour.map((vote) => (
                      <div
                        key={vote.id}
                        className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 rounded-lg p-3"
                      >
                        <span className="font-medium text-gray-800 dark:text-white">
                          {vote.nomUtilisateur}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(vote.dateCreation).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Votes contre */}
              {votesContre.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2 flex items-center gap-1">
                    <span>👎</span>
                    Votes contre ({votesContre.length})
                  </h4>
                  <div className="space-y-2">
                    {votesContre.map((vote) => (
                      <div
                        key={vote.id}
                        className="flex items-center justify-between bg-red-50 dark:bg-red-900/20 rounded-lg p-3"
                      >
                        <span className="font-medium text-gray-800 dark:text-white">
                          {vote.nomUtilisateur}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(vote.dateCreation).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pied de page */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onFermer}
            className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
