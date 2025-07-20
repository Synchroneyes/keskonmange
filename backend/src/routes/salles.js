import express from 'express';
import { 
  donneesMemoire, 
  genererIdUnique, 
  ajouterUtilisateurASalle,
  utilisateurEstDansSalle,
  obtenirUtilisateursSalle 
} from '../data/memoire.js';

export const routesSalles = express.Router();

/**
 * POST /api/salles - Créer une nouvelle salle de vote
 */
routesSalles.post('/', (req, res) => {
  try {
    const { nomCreateur, motDePasse } = req.body;

    // Validation des données
    if (!nomCreateur || typeof nomCreateur !== 'string' || nomCreateur.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Le nom du créateur est requis'
      });
    }

    if (!motDePasse || typeof motDePasse !== 'string' || motDePasse.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe doit contenir au moins 3 caractères'
      });
    }

    // Créer la salle
    const salleId = genererIdUnique();
    const nouvelleSalle = {
      id: salleId,
      nomCreateur: nomCreateur.trim(),
      motDePasse,
      dateCreation: new Date().toISOString(),
      estActive: true
    };

    // Sauvegarder en mémoire
    donneesMemoire.salles.set(salleId, nouvelleSalle);
    
    // Ajouter le créateur comme utilisateur de la salle
    ajouterUtilisateurASalle(salleId, nomCreateur.trim());

    console.log(`✅ Nouvelle salle créée: ${salleId} par ${nomCreateur}`);

    // Réponse (sans le mot de passe)
    const { motDePasse: _, ...salleReponse } = nouvelleSalle;
    res.status(201).json({
      success: true,
      data: salleReponse,
      message: 'Salle créée avec succès'
    });

  } catch (error) {
    console.error('Erreur création salle:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la salle'
    });
  }
});

/**
 * GET /api/salles/:id - Obtenir les informations d'une salle
 */
routesSalles.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const salle = donneesMemoire.salles.get(id);

    if (!salle) {
      return res.status(404).json({
        success: false,
        message: 'Salle non trouvée'
      });
    }

    // Réponse sans le mot de passe
    const { motDePasse: _, ...salleReponse } = salle;
    const utilisateurs = obtenirUtilisateursSalle(id);

    res.json({
      success: true,
      data: {
        ...salleReponse,
        nombreUtilisateurs: utilisateurs.length,
        utilisateurs
      }
    });

  } catch (error) {
    console.error('Erreur récupération salle:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la salle'
    });
  }
});

/**
 * POST /api/salles/:id/rejoindre - Rejoindre une salle avec mot de passe
 */
routesSalles.post('/:id/rejoindre', (req, res) => {
  try {
    const { id } = req.params;
    const { motDePasse, nomUtilisateur } = req.body;

    // Validation
    if (!motDePasse || !nomUtilisateur) {
      return res.status(400).json({
        success: false,
        message: 'Mot de passe et nom d\'utilisateur requis'
      });
    }

    const salle = donneesMemoire.salles.get(id);
    
    if (!salle) {
      return res.status(404).json({
        success: false,
        message: 'Salle non trouvée'
      });
    }

    // Vérifier le mot de passe
    if (salle.motDePasse !== motDePasse) {
      return res.status(401).json({
        success: false,
        message: 'Mot de passe incorrect'
      });
    }

    // Ajouter l'utilisateur à la salle
    ajouterUtilisateurASalle(id, nomUtilisateur.trim());

    console.log(`👥 ${nomUtilisateur} a rejoint la salle ${id}`);

    // Réponse sans le mot de passe
    const { motDePasse: _, ...salleReponse } = salle;
    const utilisateurs = obtenirUtilisateursSalle(id);

    res.json({
      success: true,
      data: {
        ...salleReponse,
        nombreUtilisateurs: utilisateurs.length,
        utilisateurs
      },
      message: 'Vous avez rejoint la salle avec succès'
    });

  } catch (error) {
    console.error('Erreur rejoindre salle:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion à la salle'
    });
  }
});

/**
 * POST /api/salles/:id/verifier-mot-de-passe - Vérifier le mot de passe d'une salle
 */
routesSalles.post('/:id/verifier-mot-de-passe', (req, res) => {
  try {
    const { id } = req.params;
    const { motDePasse } = req.body;

    if (!motDePasse) {
      return res.status(400).json({
        success: false,
        message: 'Mot de passe requis'
      });
    }

    const salle = donneesMemoire.salles.get(id);
    
    if (!salle) {
      return res.status(404).json({
        success: false,
        message: 'Salle non trouvée'
      });
    }

    const motDePasseCorrect = salle.motDePasse === motDePasse;

    res.json({
      success: motDePasseCorrect,
      data: { motDePasseCorrect },
      message: motDePasseCorrect ? 'Mot de passe correct' : 'Mot de passe incorrect'
    });

  } catch (error) {
    console.error('Erreur vérification mot de passe:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification'
    });
  }
});

/**
 * GET /api/salles - Lister toutes les salles (pour debug)
 */
routesSalles.get('/', (req, res) => {
  try {
    const salles = Array.from(donneesMemoire.salles.values()).map(salle => {
      const { motDePasse: _, ...sallePublique } = salle;
      const utilisateurs = obtenirUtilisateursSalle(salle.id);
      return {
        ...sallePublique,
        nombreUtilisateurs: utilisateurs.length
      };
    });

    res.json({
      success: true,
      data: salles,
      message: `${salles.length} salle(s) trouvée(s)`
    });

  } catch (error) {
    console.error('Erreur liste salles:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des salles'
    });
  }
});
