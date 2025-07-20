import { useState } from 'react';
import SectionPartage from './SectionPartage';
import Logo from './Logo';

interface Props {
  salleId: string;
  onRejoindre: (nomUtilisateur: string, motDePasse: string) => Promise<void>;
  chargement?: boolean;
  erreur?: string | null;
}

export default function FormulaireConnexionSalleUnifie({ 
  salleId, 
  onRejoindre, 
  chargement = false, 
  erreur 
}: Props) {
  const [nomUtilisateur, setNomUtilisateur] = useState('');
  const [motDePasse, setMotDePasse] = useState('');

  const gererSoumission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nomUtilisateur.trim() && motDePasse.trim() && !chargement) {
      await onRejoindre(nomUtilisateur.trim(), motDePasse.trim());
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md mx-auto">
      {/* Logo KESKONMANGE - Élément séparé */}
      <div className="text-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-600">
        <Logo taille="lg" />
      </div>
      
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          👋 Rejoindre la salle
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Saisissez vos informations pour participer aux votes
        </p>

      </div>

      {/* Affichage des erreurs */}
      {erreur && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-2">
            <span className="text-red-500 text-lg">❌</span>
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                Erreur de connexion
              </p>
              <p className="text-xs text-red-700 dark:text-red-300">
                {erreur}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={gererSoumission} className="space-y-6">
        {/* Nom d'utilisateur */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            👤 Votre nom
          </label>
          <input
            type="text"
            value={nomUtilisateur}
            onChange={(e) => setNomUtilisateur(e.target.value)}
            placeholder="ex: Jean Dupont"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     placeholder-gray-500 dark:placeholder-gray-400
                     focus:ring-2 focus:ring-green-500 focus:border-transparent
                     transition-colors duration-200"
            disabled={chargement}
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Ce nom apparaîtra dans vos propositions et votes
          </p>
        </div>

        {/* Mot de passe */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            🔐 Mot de passe de la salle
          </label>
          <input
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            placeholder="Mot de passe communiqué par le créateur"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     placeholder-gray-500 dark:placeholder-gray-400
                     focus:ring-2 focus:ring-green-500 focus:border-transparent
                     transition-colors duration-200"
            disabled={chargement}
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Demandez le mot de passe au créateur de la salle
          </p>
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={chargement || !nomUtilisateur.trim() || !motDePasse.trim()}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700
                   text-white font-bold py-3 px-6 rounded-lg shadow-lg
                   transform transition-all duration-200 hover:scale-105 hover:shadow-xl
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                   flex items-center justify-center gap-2"
        >
          {chargement ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Connexion en cours...
            </>
          ) : (
            <>
              🎯 Rejoindre la salle
            </>
          )}
        </button>
      </form>

      {/* Section de partage */}
      <div className="mt-6 border-t border-gray-200 dark:border-gray-600 pt-6">
        <SectionPartage 
          salleId={salleId}
          titre="📤 Partager cette salle"
          description="Invitez d'autres personnes à rejoindre le vote"
          className="bg-transparent shadow-none p-0"
        />
      </div>

      {/* Aide */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💡 Vous avez besoin du mot de passe communiqué par le créateur
        </p>
      </div>
    </div>
  );
}
