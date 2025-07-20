import { useState } from 'react';
import type { CreationSalleVote } from '../types';

interface Props {
  onCreerSalle: (donnees: CreationSalleVote) => Promise<void>;
  chargement?: boolean;
  erreur?: string | null;
}

export default function FormulaireCreationSalle({ onCreerSalle, chargement = false, erreur }: Props) {
  const [nomUtilisateur, setNomUtilisateur] = useState('');
  const [motDePasse, setMotDePasse] = useState('');

  const gererSoumission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nomUtilisateur.trim() && motDePasse.trim() && !chargement) {
      await onCreerSalle({
        nomUtilisateur: nomUtilisateur.trim(),
        motDePasse: motDePasse.trim()
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          🍽️ Créer une salle de vote
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Organisez les repas du midi de votre équipe
        </p>
        
        {/* Explication de la semaine */}
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-2">
            <span className="text-blue-500 text-lg">📅</span>
            <div className="text-left">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                Planification automatique
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                La salle de vote sera créée pour <strong>tous les repas du midi de la semaine</strong> (lundi au vendredi)
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={gererSoumission} className="space-y-6">
        {/* Affichage des erreurs */}
        {erreur && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <span className="text-red-500 text-lg">⚠️</span>
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                  Erreur lors de la création
                </p>
                <p className="text-xs text-red-700 dark:text-red-300">
                  {erreur}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Nom d'utilisateur */}
        <div>
          <label 
            htmlFor="nomUtilisateur" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            👤 Votre nom
          </label>
          <input
            type="text"
            id="nomUtilisateur"
            value={nomUtilisateur}
            onChange={(e) => setNomUtilisateur(e.target.value)}
            placeholder="Ex: Jean Dupont"
            disabled={chargement}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     dark:bg-gray-700 dark:text-white dark:placeholder-gray-400
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200"
            required
          />
        </div>

        {/* Mot de passe */}
        <div>
          <label 
            htmlFor="motDePasse" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            🔒 Mot de passe de la salle
          </label>
          <input
            type="password"
            id="motDePasse"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            placeholder="Choisissez un mot de passe"
            disabled={chargement}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     dark:bg-gray-700 dark:text-white dark:placeholder-gray-400
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200"
            required
          />
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Ce mot de passe sera demandé à tous les participants pour rejoindre la salle
          </p>
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={!nomUtilisateur.trim() || !motDePasse.trim() || chargement}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 
                   hover:from-blue-600 hover:to-purple-700 
                   disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed
                   text-white font-semibold rounded-lg shadow-lg
                   transform transition-all duration-200 
                   hover:scale-105 hover:shadow-xl
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   disabled:transform-none disabled:shadow-lg"
        >
          {chargement ? (
            <span className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Création en cours...</span>
            </span>
          ) : (
            '🚀 Créer la salle pour cette semaine'
          )}
        </button>
      </form>
    </div>
  );
}
