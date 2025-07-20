// Export des services
export { serviceHTTP, ServiceHTTP, ErreurAPI } from './serviceHTTP';
export { serviceSallesVote, ServiceSallesVote } from './serviceSallesVote';
export { servicePropositions, ServicePropositions } from './servicePropositions';
export { serviceVotes, ServiceVotes } from './serviceVotes';

// Export des types de réponse API
export type { ReponseAPI } from './serviceHTTP';

// Re-export des types métier pour faciliter les imports
export type {
  CreationSalleVote,
  SalleVote,
  PropositionRepas,
  Vote,
  CreerSalleVoteRequest,
  AjouterPropositionRequest,
  VoterRequest
} from '../types';
