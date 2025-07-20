import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import FormulaireAuthentification from '../components/FormulaireAuthentification'
import ExplicationsPrincipe from '../components/ExplicationsPrincipe'
import Notification from '../components/Notification'
import Logo from '../components/Logo'
import { serviceSallesVote, ErreurAPI } from '../services'
import type { CreationSalleVote } from '../types'

export default function PageAccueil() {
  const navigate = useNavigate()
  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur] = useState<string | null>(null)

  // Définir le titre de la page
  useEffect(() => {
    document.title = 'KESKONMANGE - Accueil';
  }, []);

  // Écouter les erreurs d'authentification depuis l'URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const erreurParam = urlParams.get('erreur')
    if (erreurParam === 'mot-de-passe-incorrect') {
      setErreur('Mot de passe incorrect. Veuillez réessayer.')
      // Nettoyer l'URL
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  const gererCreationSalle = async (donnees: CreationSalleVote) => {
    setChargement(true)
    setErreur(null)
    
    try {
      // Appel au service backend
      const nouvelleSalle = await serviceSallesVote.creerSalle({
        nomCreateur: donnees.nomUtilisateur,
        motDePasse: donnees.motDePasse
      })
      
      console.log('Salle créée avec succès:', nouvelleSalle)
      
      // Stocker les informations du créateur temporairement
      sessionStorage.setItem('creatorInfo', JSON.stringify({
        salleId: nouvelleSalle.id,
        nomUtilisateur: donnees.nomUtilisateur,
        motDePasse: donnees.motDePasse,
        timestamp: Date.now()
      }));
      
      // Redirection vers la salle créée
      navigate(`/salles/${nouvelleSalle.id}`)
      
    } catch (error) {
      console.error('Erreur lors de la création de la salle:', error)
      
      if (error instanceof ErreurAPI) {
        setErreur(`Erreur ${error.status}: ${error.message}`)
      } else {
        setErreur('Erreur de connexion au serveur. Veuillez réessayer.')
      }
    } finally {
      setChargement(false)
    }
  }

  const gererRejoindeSalle = async (salleId: string, nomUtilisateur: string, motDePasse: string) => {
    setChargement(true)
    setErreur(null)
    
    try {
      // Vérifier que la salle existe et que le mot de passe est correct
      await serviceSallesVote.verifierMotDePasse(salleId, { motDePasse })
      
      // Rejoindre la salle
      await serviceSallesVote.rejoindreSalle(salleId, {
        nomUtilisateur,
        motDePasse
      })
      
      console.log('Salle rejointe avec succès')
      
      // Stocker les informations de connexion pour éviter la double authentification
      sessionStorage.setItem('userInfo', JSON.stringify({
        salleId: salleId,
        nomUtilisateur: nomUtilisateur,
        motDePasse: motDePasse,
        timestamp: Date.now()
      }));
      
      // Redirection vers la salle
      navigate(`/salles/${salleId}`)
      
    } catch (error) {
      console.error('Erreur lors de la connexion à la salle:', error)
      
      if (error instanceof ErreurAPI) {
        if (error.status === 404) {
          setErreur('Cette salle n\'existe pas. Vérifiez l\'ID de la salle.')
        } else if (error.status === 403) {
          setErreur('Mot de passe incorrect.')
        } else {
          setErreur(`Erreur ${error.status}: ${error.message}`)
        }
      } else {
        setErreur('Erreur de connexion au serveur. Veuillez réessayer.')
      }
    } finally {
      setChargement(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <div className="container mx-auto px-4 py-16">
        
        {/* Notification d'erreur */}
        {erreur && (
          <div className="fixed top-4 right-4 z-50">
            <Notification
              type="error"
              message={erreur}
              onClose={() => setErreur(null)}
            />
          </div>
        )}
        
        {/* Header principal */}
        <div className="text-center mb-20">
          {/* Logo KESKONMANGE */}
          <div className="mb-8">
            <Logo taille="xl" className="mb-4" cliquable={false} />
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 
                           bg-clip-text text-transparent">
              KESKONMANGE?
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-4 max-w-3xl mx-auto">
            L'outil collaboratif pour organiser les repas de votre équipe
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Fini les discussions interminables sur "qu'est-ce qu'on mange ?" ! 
            Créez, proposez, votez et organisez vos repas d'équipe en toute simplicité.
          </p>
        </div>

        {/* Explications du principe */}
        <ExplicationsPrincipe />

        {/* Section formulaire */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Prêt à commencer ?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Créez votre première salle de vote ou rejoignez une salle existante
            </p>
          </div>

          <FormulaireAuthentification
            onCreerSalle={gererCreationSalle}
            onRejoindre={gererRejoindeSalle}
            chargement={chargement}
            erreur={erreur}
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-20">
          <p className="text-gray-500 dark:text-gray-400">
            Une solution moderne pour des équipes organisées 🚀
          </p>
        </div>
        
      </div>
    </div>
  )
}
