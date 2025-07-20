import { useState } from 'react';

interface Props {
  salleId: string;
  titre?: string;
  description?: string;
  className?: string;
}

export default function SectionPartage({ 
  salleId, 
  titre = "📤 Partager cette salle",
  description = "Invitez d'autres personnes à rejoindre le vote",
  className = ""
}: Props) {
  const [copie, setCopie] = useState(false);

  const gererCopie = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopie(true);
      setTimeout(() => setCopie(false), 2000); // Reset après 2 secondes
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 ${className}`}>
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          {titre}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </div>

      {/* Information sur l'ID de salle */}
      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-blue-500 text-lg">🏠</span>
          <div className="text-center">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
              ID de la salle
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300 font-mono bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">
              {salleId}
            </p>
          </div>
        </div>
      </div>

      {/* URL à copier */}
      <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          🔗 Lien de la salle
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={window.location.href}
            readOnly
            className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 
                     rounded-md text-gray-900 dark:text-white font-mono
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     selection:bg-blue-200 dark:selection:bg-blue-600"
          />
          <button
            type="button"
            onClick={gererCopie}
            className={`px-3 py-2 text-white text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-1
                     ${copie 
                       ? 'bg-green-500 hover:bg-green-600' 
                       : 'bg-blue-500 hover:bg-blue-600'
                     }`}
          >
            {copie ? (
              <>
                ✅ Copié
              </>
            ) : (
              <>
                📋 Copier
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Partagez ce lien avec les participants (mot de passe requis)
        </p>
      </div>

      {/* Aide */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💡 Les nouveaux participants auront besoin du mot de passe
        </p>
      </div>
    </div>
  );
}
