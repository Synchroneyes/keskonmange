import { useState } from 'react';

interface Props {
  onRejoindre: (nomUtilisateur: string, motDePasse: string) => Promise<void>;
  motDePasse: string;
  chargement?: boolean;
  erreur?: string | null;
}

export default function FormulaireRejoindreSalle({ onRejoindre, motDePasse, chargement = false, erreur }: Props) {
  const [nomUtilisateur, setNomUtilisateur] = useState('');

  const gererSoumission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nomUtilisateur.trim() && !chargement) {
      await onRejoindre(nomUtilisateur.trim(), motDePasse);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          👋 Rejoindre la salle
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Participez aux votes pour les repas de la semaine
        </p>
        
        {/* Information sur la participation */}
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-2">
            <span className="text-green-500 text-lg">🎯</span>
            <div className="text-left">
              <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
                Participation active
              </p>
              <p className="text-xs text-green-700 dark:text-green-300">
                Proposez vos plats préférés et votez pour ceux de vos collègues
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
                  Erreur
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
            placeholder="Ex: Marie Martin"
            disabled={chargement}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     focus:ring-2 focus:ring-green-500 focus:border-green-500 
                     dark:bg-gray-700 dark:text-white dark:placeholder-gray-400
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200"
            required
          />
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Ce nom sera visible par tous les participants de la salle
          </p>
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={!nomUtilisateur.trim() || chargement}
          className="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 
                   hover:from-green-600 hover:to-emerald-700 
                   disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed
                   text-white font-semibold rounded-lg shadow-lg
                   transform transition-all duration-200 
                   hover:scale-105 hover:shadow-xl
                   focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                   disabled:transform-none disabled:shadow-lg"
        >
          {chargement ? (
            <span className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Connexion...</span>
            </span>
          ) : (
            '🚀 Rejoindre la salle'
          )}
        </button>
      </form>
    </div>
  );
}
