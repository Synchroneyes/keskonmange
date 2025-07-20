import { useNavigate } from 'react-router-dom';

interface Props {
  taille?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  afficherTexte?: boolean;
  cliquable?: boolean;
}

export default function Logo({ 
  taille = 'md', 
  className = '', 
  afficherTexte = true,
  cliquable = true
}: Props) {
  const navigate = useNavigate();

  const tailleClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-5xl',
    xl: 'text-6xl'
  };

  const tailleTexte = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const gererClic = () => {
    if (cliquable) {
      navigate('/');
    }
  };

  const baseClasses = `flex items-center justify-center ${className}`;
  const containerClasses = cliquable 
    ? `${baseClasses} cursor-pointer hover:opacity-80 transition-opacity duration-200` 
    : baseClasses;

  return (
    <div 
      className={containerClasses}
      onClick={gererClic}
      role={cliquable ? "button" : undefined}
      tabIndex={cliquable ? 0 : undefined}
      onKeyDown={cliquable ? (e) => e.key === 'Enter' && gererClic() : undefined}
    >
      {/* Icône du logo */}
      <div className={`${tailleClasses[taille]} mr-3`}>
        🍽️
      </div>
      
      {/* Texte du logo */}
      {afficherTexte && (
        <div className="text-center">
          <h1 className={`${tailleTexte[taille]} font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent`}>
            KESKONMANGE
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">
            VOTE COLLABORATIF
          </p>
        </div>
      )}
    </div>
  );
}
