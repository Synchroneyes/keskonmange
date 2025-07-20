import express from 'express';
import { 
  donneesMemoire, 
  genererIdUnique,
  obtenirVotesProposition,
  utilisateurEstDansSalle 
} from '../data/memoire.js';

export const routesVotes = express.Router();

/**
 * POST /api/votes - Voter pour une proposition
 */
routesVotes.post('/', (req, res) => {
  try {
    const { propositionId, nomUtilisateur, typeVote } = req.body;

    // Validation des données
    if (!propositionId || !nomUtilisateur || !typeVote) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis (propositionId, nomUtilisateur, typeVote)'
      });
    }

    // Valider le type de vote
    const typesVotesValides = ['pour', 'contre'];
    if (!typesVotesValides.includes(typeVote)) {
      return res.status(400).json({
        success: false,
        message: 'Type de vote invalide. Utilisez: ' + typesVotesValides.join(', ')
      });
    }

    // Vérifier que la proposition existe
    const proposition = donneesMemoire.propositions.get(propositionId);
    if (!proposition) {
      return res.status(404).json({
        success: false,
        message: 'Proposition non trouvée'
      });
    }

    // Vérifier que l'utilisateur est dans la salle
    if (!utilisateurEstDansSalle(proposition.salleId, nomUtilisateur)) {
      return res.status(403).json({
        success: false,
        message: 'Vous devez être dans la salle pour voter'
      });
    }

    // Vérifier si l'utilisateur a déjà voté pour cette proposition
    const voteExistant = Array.from(donneesMemoire.votes.values())
      .find(vote => vote.propositionId === propositionId && vote.nomUtilisateur === nomUtilisateur);

    let voteId;
    let message;

    if (voteExistant) {
      // Modifier le vote existant
      voteExistant.typeVote = typeVote;
      voteExistant.dateModification = new Date().toISOString();
      donneesMemoire.votes.set(voteExistant.id, voteExistant);
      voteId = voteExistant.id;
      message = 'Vote modifié avec succès';
      console.log(`🔄 Vote modifié: ${nomUtilisateur} -> ${typeVote} pour ${proposition.nomRestaurant}`);
    } else {
      // Créer un nouveau vote
      voteId = genererIdUnique();
      const nouveauVote = {
        id: voteId,
        propositionId,
        nomUtilisateur: nomUtilisateur.trim(),
        typeVote,
        dateCreation: new Date().toISOString()
      };
      donneesMemoire.votes.set(voteId, nouveauVote);
      message = 'Vote enregistré avec succès';
      console.log(`🗳️  Nouveau vote: ${nomUtilisateur} -> ${typeVote} pour ${proposition.nomRestaurant}`);
    }

    // Mettre à jour le compteur de votes de la proposition
    const votesProposition = obtenirVotesProposition(propositionId);
    const votesPour = votesProposition.filter(v => v.typeVote === 'pour').length;
    const votesContre = votesProposition.filter(v => v.typeVote === 'contre').length;
    
    proposition.nombreVotes = votesProposition.length;
    proposition.votesPour = votesPour;
    proposition.votesContre = votesContre;
    donneesMemoire.propositions.set(propositionId, proposition);

    // Récupérer le vote final
    const voteFinal = donneesMemoire.votes.get(voteId);

    res.json({
      success: true,
      data: {
        vote: voteFinal,
        statistiques: {
          totalVotes: votesProposition.length,
          votesPour,
          votesContre
        }
      },
      message
    });

  } catch (error) {
    console.error('Erreur vote:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'enregistrement du vote'
    });
  }
});

/**
 * GET /api/votes - Récupérer les votes d'une proposition
 * Query params: propositionId (obligatoire)
 */
routesVotes.get('/', (req, res) => {
  try {
    const { propositionId } = req.query;

    if (!propositionId) {
      return res.status(400).json({
        success: false,
        message: 'Le paramètre propositionId est requis'
      });
    }

    // Vérifier que la proposition existe
    const proposition = donneesMemoire.propositions.get(propositionId);
    if (!proposition) {
      return res.status(404).json({
        success: false,
        message: 'Proposition non trouvée'
      });
    }

    // Récupérer les votes
    const votes = obtenirVotesProposition(propositionId);
    const votesPour = votes.filter(v => v.typeVote === 'pour');
    const votesContre = votes.filter(v => v.typeVote === 'contre');

    res.json({
      success: true,
      data: {
        votes,
        statistiques: {
          totalVotes: votes.length,
          votesPour: votesPour.length,
          votesContre: votesContre.length,
          pourcentagePour: votes.length > 0 ? Math.round((votesPour.length / votes.length) * 100) : 0
        }
      }
    });

  } catch (error) {
    console.error('Erreur récupération votes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des votes'
    });
  }
});

/**
 * GET /api/votes/proposition/:propositionId - Récupérer les votes pour une proposition (route alternative)
 */
routesVotes.get('/proposition/:propositionId', (req, res) => {
  try {
    const { propositionId } = req.params;

    // Vérifier que la proposition existe
    const proposition = donneesMemoire.propositions.get(propositionId);
    if (!proposition) {
      return res.status(404).json({
        success: false,
        message: 'Proposition non trouvée'
      });
    }

    // Récupérer les votes
    const votes = obtenirVotesProposition(propositionId);

    res.json({
      success: true,
      data: votes
    });

  } catch (error) {
    console.error('Erreur récupération votes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des votes'
    });
  }
});

/**
 * GET /api/votes/utilisateur/:nomUtilisateur/proposition/:propositionId - Récupérer le vote d'un utilisateur pour une proposition
 */
routesVotes.get('/utilisateur/:nomUtilisateur/proposition/:propositionId', (req, res) => {
  try {
    const { nomUtilisateur, propositionId } = req.params;

    // Vérifier que la proposition existe
    const proposition = donneesMemoire.propositions.get(propositionId);
    if (!proposition) {
      return res.status(404).json({
        success: false,
        message: 'Proposition non trouvée'
      });
    }

    // Chercher le vote de l'utilisateur
    const vote = Array.from(donneesMemoire.votes.values())
      .find(v => v.propositionId === propositionId && v.nomUtilisateur === nomUtilisateur);

    if (!vote) {
      return res.status(404).json({
        success: false,
        message: 'Aucun vote trouvé pour cet utilisateur sur cette proposition',
        data: null
      });
    }

    res.json({
      success: true,
      data: vote
    });

  } catch (error) {
    console.error('Erreur récupération vote utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du vote'
    });
  }
});

/**
 * DELETE /api/votes/:id - Supprimer un vote
 */
routesVotes.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { nomUtilisateur } = req.body;

    const vote = donneesMemoire.votes.get(id);
    
    if (!vote) {
      return res.status(404).json({
        success: false,
        message: 'Vote non trouvé'
      });
    }

    // Vérifier que c'est le bon utilisateur
    if (vote.nomUtilisateur !== nomUtilisateur) {
      return res.status(403).json({
        success: false,
        message: 'Vous ne pouvez supprimer que vos propres votes'
      });
    }

    const propositionId = vote.propositionId;

    // Supprimer le vote
    donneesMemoire.votes.delete(id);

    // Mettre à jour les statistiques de la proposition
    const proposition = donneesMemoire.propositions.get(propositionId);
    if (proposition) {
      const votesRestants = obtenirVotesProposition(propositionId);
      const votesPour = votesRestants.filter(v => v.typeVote === 'pour').length;
      const votesContre = votesRestants.filter(v => v.typeVote === 'contre').length;
      
      proposition.nombreVotes = votesRestants.length;
      proposition.votesPour = votesPour;
      proposition.votesContre = votesContre;
      donneesMemoire.propositions.set(propositionId, proposition);
    }

    console.log(`🗑️  Vote supprimé: ${nomUtilisateur} pour la proposition ${propositionId}`);

    res.json({
      success: true,
      message: 'Vote supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur suppression vote:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du vote'
    });
  }
});
