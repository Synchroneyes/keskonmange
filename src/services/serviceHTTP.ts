import { API_BASE_URL } from '../config/api';

// Types pour les réponses API
export interface ReponseAPI<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

// Configuration des headers par défaut
const getHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
});

// Classe pour gérer les erreurs API
export class ErreurAPI extends Error {
  public status: number;
  public response?: unknown;

  constructor(message: string, status: number, response?: unknown) {
    super(message);
    this.name = 'ErreurAPI';
    this.status = status;
    this.response = response;
  }
}

// Service HTTP de base
export class ServiceHTTP {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async gererReponse<T>(response: Response): Promise<ReponseAPI<T>> {
    const contentType = response.headers.get('content-type');
    
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new ErreurAPI(
        data.message || `Erreur HTTP ${response.status}`,
        response.status,
        data
      );
    }

    return data;
  }

  // GET
  async get<T>(endpoint: string): Promise<ReponseAPI<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    return this.gererReponse<T>(response);
  }

  // POST
  async post<T>(endpoint: string, data?: unknown): Promise<ReponseAPI<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.gererReponse<T>(response);
  }

  // PUT
  async put<T>(endpoint: string, data?: unknown): Promise<ReponseAPI<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.gererReponse<T>(response);
  }

  // DELETE
  async delete<T>(endpoint: string): Promise<ReponseAPI<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    return this.gererReponse<T>(response);
  }

  // PATCH
  async patch<T>(endpoint: string, data?: unknown): Promise<ReponseAPI<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.gererReponse<T>(response);
  }
}

// Instance par défaut du service HTTP
export const serviceHTTP = new ServiceHTTP();
