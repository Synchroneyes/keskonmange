import { useState } from 'react';
import type { CreationSalleVote } from '../types';

interface Props {
  onCreerSalle: (donnees: CreationSalleVote) => Promise<void>;
  onRejoindre: (salleId: string, nomUtilisateur: string, motDePasse: string) => Promise<void>;
  chargement?: boolean;
  erreur?: string | null;
}

export default function FormulaireAuthentification({ 
  onCreerSalle, 
  onRejoindre, 
  chargement = false, 
  erreur 
}: Props) {
  const [mode, setMode] = useState<'creer' | 'rejoindre'>('creer');
  const [nomUtilisateur, setNomUtilisateur] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [salleId, setSalleId] = useState('');

  const gererSoumissionCreation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nomUtilisateur.trim() && motDePasse.trim() && !chargement) {
      await onCreerSalle({
        nomUtilisateur: nomUtilisateur.trim(),
        motDePasse: motDePasse.trim()
      });
    }
  };

  const gererSoumissionRejoindre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nomUtilisateur.trim() && motDePasse.trim() && salleId.trim() && !chargement) {
      await onRejoindre(salleId.trim(), nomUtilisateur.trim(), motDePasse.trim());
    }
  };

  const changerMode = (nouveauMode: 'creer' | 'rejoindre') => {
    setMode(nouveauMode);
    // Réinitialiser les champs lors du changement de mode
    setNomUtilisateur('');
    setMotDePasse('');
    setSalleId('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md mx-auto">
      {/* Sélecteur de mode */}
      <div className="flex mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        <button
          type="button"
          onClick={() => changerMode('creer')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
            mode === 'creer'
              ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
          }`}
        >
          🍽️ Créer une salle
        </button>
        <button
          type="button"
          onClick={() => changerMode('rejoindre')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
            mode === 'rejoindre'
              ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
          }`}
        >
          👋 Rejoindre une salle
        </button>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {mode === 'creer' ? '🍽️ Créer une salle de vote' : '👋 Rejoindre la salle'}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {mode === 'creer' 
            ? 'Organisez les repas du midi de votre équipe'
            : 'Participez aux votes pour les repas de la semaine'
          }
        </p>
        
        {/* Information contextuelle */}
        <div className={`border rounded-lg p-4 mb-6 ${
          mode === 'creer'
            ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700'
            : 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700'
        }`}>
          <div className="flex items-start space-x-2">
            <span className={`text-lg ${
              mode === 'creer' ? 'text-blue-500' : 'text-green-500'
            }`}>
              {mode === 'creer' ? '📅' : '🎯'}
            </span>
            <div className="text-left">
              <p className={`text-sm font-medium mb-1 ${
                mode === 'creer'
                  ? 'text-blue-800 dark:text-blue-200'
                  : 'text-green-800 dark:text-green-200'
              }`}>
                {mode === 'creer' ? 'Planification automatique' : 'Participation active'}
              </p>
              <p className={`text-xs ${
                mode === 'creer'
                  ? 'text-blue-700 dark:text-blue-300'
                  : 'text-green-700 dark:text-green-300'
              }`}>
                {mode === 'creer'
                  ? 'La salle de vote sera créée pour tous les repas du midi de la semaine (lundi au vendredi)'
                  : 'Proposez vos plats préférés et votez pour ceux de vos collègues'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Affichage des erreurs */}
      {erreur && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-2">
            <span className="text-red-500 text-lg">❌</span>
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

      <form onSubmit={mode === 'creer' ? gererSoumissionCreation : gererSoumissionRejoindre} className="space-y-6">
        {/* ID de salle (uniquement en mode rejoindre) */}
        {mode === 'rejoindre' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🔗 ID de la salle
            </label>
            <input
              type="text"
              value={salleId}
              onChange={(e) => setSalleId(e.target.value)}
              placeholder="Entrez l'ID de la salle à rejoindre"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       placeholder-gray-500 dark:placeholder-gray-400
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       transition-colors duration-200"
              disabled={chargement}
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              L'ID vous a été communiqué par le créateur de la salle
            </p>
          </div>
        )}

        {/* Nom d'utilisateur */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            👤 {mode === 'creer' ? 'Votre nom (créateur)' : 'Votre nom'}
          </label>
          <input
            type="text"
            value={nomUtilisateur}
            onChange={(e) => setNomUtilisateur(e.target.value)}
            placeholder={mode === 'creer' ? 'ex: Sophie Martin' : 'ex: Jean Dupont'}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     placeholder-gray-500 dark:placeholder-gray-400
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-colors duration-200"
            disabled={chargement}
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {mode === 'creer' 
              ? 'Ce nom apparaîtra comme créateur de la salle'
              : 'Ce nom apparaîtra dans les propositions et votes'
            }
          </p>
        </div>

        {/* Mot de passe */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            🔐 {mode === 'creer' ? 'Mot de passe de la salle' : 'Mot de passe'}
          </label>
          <input
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            placeholder={mode === 'creer' ? 'Créez un mot de passe sécurisé' : 'Mot de passe de la salle'}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     placeholder-gray-500 dark:placeholder-gray-400
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-colors duration-200"
            disabled={chargement}
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {mode === 'creer' 
              ? 'Partagez ce mot de passe avec votre équipe pour qu\'ils puissent rejoindre'
              : 'Demandez le mot de passe au créateur de la salle'
            }
          </p>
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={chargement || !nomUtilisateur.trim() || !motDePasse.trim() || (mode === 'rejoindre' && !salleId.trim())}
          className={`w-full font-bold py-3 px-6 rounded-lg shadow-lg
                   transform transition-all duration-200 hover:scale-105 hover:shadow-xl
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                   flex items-center justify-center gap-2 ${
            mode === 'creer'
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
              : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
          }`}
        >
          {chargement ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              {mode === 'creer' ? 'Création en cours...' : 'Connexion en cours...'}
            </>
          ) : (
            <>
              {mode === 'creer' ? '🚀 Créer la salle' : '🎯 Rejoindre la salle'}
            </>
          )}
        </button>
      </form>

      {/* Aide et informations */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {mode === 'creer' 
            ? '💡 Une fois créée, partagez l\'ID et le mot de passe avec votre équipe'
            : '💡 Vous avez besoin de l\'ID de salle et du mot de passe'
          }
        </p>
      </div>
    </div>
  );
}
