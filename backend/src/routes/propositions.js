import express from 'express';
import { 
  donneesMemoire, 
  genererIdUnique,
  obtenirPropositionsSalle,
  utilisateurEstDansSalle 
} from '../data/memoire.js';

export const routesPropositions = express.Router();

/**
 * POST /api/propositions - Ajouter une proposition de repas
 */
routesPropositions.post('/', (req, res) => {
  try {
    const { salleId, nomUtilisateur, nomRestaurant, description, jour, prix } = req.body;

    // Validation des données
    if (!salleId || !nomUtilisateur || !nomRestaurant || !jour) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs obligatoires doivent être renseignés (salleId, nomUtilisateur, nomRestaurant, jour)'
      });
    }

    // Vérifier que la salle existe
    const salle = donneesMemoire.salles.get(salleId);
    if (!salle) {
      return res.status(404).json({
        success: false,
        message: 'Salle non trouvée'
      });
    }

    // Vérifier que l'utilisateur est dans la salle
    if (!utilisateurEstDansSalle(salleId, nomUtilisateur)) {
      return res.status(403).json({
        success: false,
        message: 'Vous devez rejoindre la salle avant de proposer un repas'
      });
    }

    // Valider le jour
    const joursValides = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];
    if (!joursValides.includes(jour)) {
      return res.status(400).json({
        success: false,
        message: 'Jour invalide. Utilisez: ' + joursValides.join(', ')
      });
    }

    // Créer la proposition
    const propositionId = genererIdUnique();
    const nouvelleProposition = {
      id: propositionId,
      salleId,
      nomUtilisateur: nomUtilisateur.trim(),
      nomRestaurant: nomRestaurant.trim(),
      description: description?.trim() || '',
      jour,
      prix: prix ? parseFloat(prix) : null,
      dateCreation: new Date().toISOString(),
      nombreVotes: 0
    };

    // Sauvegarder en mémoire
    donneesMemoire.propositions.set(propositionId, nouvelleProposition);

    console.log(`🍽️  Nouvelle proposition: ${nomRestaurant} par ${nomUtilisateur} (salle: ${salleId})`);

    res.status(201).json({
      success: true,
      data: nouvelleProposition,
      message: 'Proposition ajoutée avec succès'
    });

  } catch (error) {
    console.error('Erreur ajout proposition:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout de la proposition'
    });
  }
});

/**
 * GET /api/propositions - Récupérer les propositions
 * Query params: salleId (obligatoire), jour (optionnel)
 */
routesPropositions.get('/', (req, res) => {
  try {
    const { salleId, jour } = req.query;

    if (!salleId) {
      return res.status(400).json({
        success: false,
        message: 'Le paramètre salleId est requis'
      });
    }

    // Vérifier que la salle existe
    const salle = donneesMemoire.salles.get(salleId);
    if (!salle) {
      return res.status(404).json({
        success: false,
        message: 'Salle non trouvée'
      });
    }

    // Récupérer les propositions
    const propositions = obtenirPropositionsSalle(salleId, jour);

    res.json({
      success: true,
      data: propositions,
      message: `${propositions.length} proposition(s) trouvée(s)`
    });

  } catch (error) {
    console.error('Erreur récupération propositions:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des propositions'
    });
  }
});

/**
 * GET /api/propositions/:id - Récupérer une proposition par son ID
 */
routesPropositions.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const proposition = donneesMemoire.propositions.get(id);

    if (!proposition) {
      return res.status(404).json({
        success: false,
        message: 'Proposition non trouvée'
      });
    }

    res.json({
      success: true,
      data: proposition
    });

  } catch (error) {
    console.error('Erreur récupération proposition:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la proposition'
    });
  }
});

/**
 * PUT /api/propositions/:id - Modifier une proposition
 */
routesPropositions.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { nomUtilisateur, nomRestaurant, description, prix } = req.body;

    const proposition = donneesMemoire.propositions.get(id);
    
    if (!proposition) {
      return res.status(404).json({
        success: false,
        message: 'Proposition non trouvée'
      });
    }

    // Vérifier que c'est le créateur qui modifie
    if (proposition.nomUtilisateur !== nomUtilisateur) {
      return res.status(403).json({
        success: false,
        message: 'Seul le créateur peut modifier cette proposition'
      });
    }

    // Mettre à jour les champs modifiables
    if (nomRestaurant) proposition.nomRestaurant = nomRestaurant.trim();
    if (description !== undefined) proposition.description = description.trim();
    if (prix !== undefined) proposition.prix = prix ? parseFloat(prix) : null;
    proposition.dateModification = new Date().toISOString();

    // Sauvegarder les modifications
    donneesMemoire.propositions.set(id, proposition);

    console.log(`✏️  Proposition modifiée: ${proposition.nomRestaurant} par ${nomUtilisateur}`);

    res.json({
      success: true,
      data: proposition,
      message: 'Proposition modifiée avec succès'
    });

  } catch (error) {
    console.error('Erreur modification proposition:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification de la proposition'
    });
  }
});

/**
 * DELETE /api/propositions/:id - Supprimer une proposition
 */
routesPropositions.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { nomUtilisateur } = req.body;

    const proposition = donneesMemoire.propositions.get(id);
    
    if (!proposition) {
      return res.status(404).json({
        success: false,
        message: 'Proposition non trouvée'
      });
    }

    // Vérifier que c'est le créateur qui supprime
    if (proposition.nomUtilisateur !== nomUtilisateur) {
      return res.status(403).json({
        success: false,
        message: 'Seul le créateur peut supprimer cette proposition'
      });
    }

    // Supprimer la proposition et ses votes associés
    donneesMemoire.propositions.delete(id);
    
    // Supprimer tous les votes pour cette proposition
    const votesASupprimer = Array.from(donneesMemoire.votes.entries())
      .filter(([_, vote]) => vote.propositionId === id)
      .map(([voteId, _]) => voteId);
    
    votesASupprimer.forEach(voteId => {
      donneesMemoire.votes.delete(voteId);
    });

    console.log(`🗑️  Proposition supprimée: ${proposition.nomRestaurant} par ${nomUtilisateur} (${votesASupprimer.length} votes supprimés)`);

    res.json({
      success: true,
      message: 'Proposition supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur suppression proposition:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la proposition'
    });
  }
});
