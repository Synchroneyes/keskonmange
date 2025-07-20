export default function ExplicationsPrincipe() {
  const etapes = [
    {
      icone: "🗳️",
      titre: "Créez votre salle",
      description: "Créez un espace de vote partagé pour votre équipe avec un nom personnalisé"
    },
    {
      icone: "📝",
      titre: "Proposez des plats",
      description: "Chaque collègue peut proposer ses idées de repas pour la semaine"
    },
    {
      icone: "👥",
      titre: "Votez ensemble",
      description: "L'équipe vote pour ses plats préférés et organise automatiquement les repas"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Comment ça marche ?
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Organisez facilement les repas de votre équipe en 3 étapes simples
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {etapes.map((etape, index) => (
          <div 
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center
                     transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <div className="text-5xl mb-4">{etape.icone}</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              {etape.titre}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {etape.description}
            </p>
            
            {/* Numéro d'étape */}
            <div className="mt-4">
              <span className="inline-flex items-center justify-center w-8 h-8 
                             bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 
                             rounded-full text-sm font-semibold">
                {index + 1}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
