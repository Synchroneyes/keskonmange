import { useState } from 'react';
import type { AjouterPropositionRequest } from '../types';

interface Props {
  salleId: string;
  nomUtilisateur: string;
  onAjouterProposition: (proposition: AjouterPropositionRequest) => Promise<void>;
  chargement?: boolean;
}

export default function FormulaireProposition({ 
  salleId, 
  nomUtilisateur, 
  onAjouterProposition, 
  chargement = false 
}: Props) {
  const [jour, setJour] = useState<'lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi'>('lundi');
  const [nomRestaurant, setNomRestaurant] = useState('');
  const [description, setDescription] = useState('');
  const [erreur, setErreur] = useState<string | null>(null);

  const joursDisponibles = [
    { value: 'lundi', label: '🌟 Lundi' },
    { value: 'mardi', label: '🔥 Mardi' },
    { value: 'mercredi', label: '⚡ Mercredi' },
    { value: 'jeudi', label: '🌈 Jeudi' },
    { value: 'vendredi', label: '🎉 Vendredi' }
  ] as const;

  const gererSoumission = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur(null);

    // Validation
    if (!nomRestaurant.trim()) {
      setErreur('Le nom du restaurant est requis');
      return;
    }

    try {
      const propositionData: AjouterPropositionRequest = {
        salleId,
        nomUtilisateur,
        nomRestaurant: nomRestaurant.trim(),
        description: description.trim() || undefined,
        jour
      };

      await onAjouterProposition(propositionData);

      // Réinitialiser le formulaire
      setNomRestaurant('');
      setDescription('');
      setJour('lundi');
    } catch (error) {
      setErreur(error instanceof Error ? error.message : 'Erreur lors de l\'ajout de la proposition');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
        🍽️ Proposer un restaurant
      </h2>

      {erreur && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6">
          <p className="text-red-800 dark:text-red-200 text-sm">
            ❌ {erreur}
          </p>
        </div>
      )}

      <form onSubmit={gererSoumission} className="space-y-6">
        {/* Sélection du jour */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Jour de la semaine
          </label>
          <select
            value={jour}
            onChange={(e) => setJour(e.target.value as typeof jour)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-colors duration-200"
            disabled={chargement}
          >
            {joursDisponibles.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Nom du restaurant */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nom du restaurant / lieu *
          </label>
          <input
            type="text"
            value={nomRestaurant}
            onChange={(e) => setNomRestaurant(e.target.value)}
            placeholder="ex: Chez Mario, McDonald's, Boulangerie Paul..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     placeholder-gray-500 dark:placeholder-gray-400
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-colors duration-200"
            disabled={chargement}
            required
          />
        </div>

        {/* Description (optionnelle) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description (optionnelle)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Type de cuisine, spécialités, adresse..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     placeholder-gray-500 dark:placeholder-gray-400
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-colors duration-200 resize-vertical"
            disabled={chargement}
          />
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={chargement || !nomRestaurant.trim()}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700
                   text-white font-bold py-3 px-6 rounded-lg shadow-lg
                   transform transition-all duration-200 hover:scale-105 hover:shadow-xl
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                   flex items-center justify-center gap-2"
        >
          {chargement ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Ajout en cours...
            </>
          ) : (
            <>
              ➕ Ajouter ma proposition
            </>
          )}
        </button>
      </form>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
        * Champs obligatoires
      </p>
    </div>
  );
}
