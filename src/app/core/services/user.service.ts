import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

export interface Role {
  id: number;
  code: string;
  libelle: string;
  description: string;
  niveauAutorisation: number;
  actif: boolean;
  dateCreation: string;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  status: string;
  dateCreation: string;
  dateModification: string;
  roles: Role[];
  totalAssigned: number;
  totalApproved: number;
  totalRejected: number;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  fullName: string;
  phone: string;
  password: string;
  roleCodes: string[];
}

export interface UpdateUserRequest {
  username: string;
  email: string;
  fullName: string;
  phone: string;
  password?: string;
  status: string;
}

export interface InstructeurStatsResponse {
  instructeurId: string;
  fullName: string;
  totalAssigned: number;
  totalApproved: number;
  totalRejected: number;
  tauxApprobation: number;
  performance: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/users`;

  // Obtenir tous les utilisateurs
  getUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.apiUrl);
  }

  // Obtenir un utilisateur par ID
  getUserById(id: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/${id}`);
  }

  // Obtenir un utilisateur par username
  getUserByUsername(username: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/username/${username}`);
  }

  // Obtenir un utilisateur par email
  getUserByEmail(email: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/email/${email}`);
  }

  // Obtenir tous les instructeurs
  getInstructeurs(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.apiUrl}/instructeurs`);
  }

  // Obtenir tous les demandeurs
  getDemandeurs(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.apiUrl}/demandeurs`);
  }

  // Créer un nouvel utilisateur
  createUser(request: CreateUserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.apiUrl, request);
  }

  // Mettre à jour un utilisateur
  updateUser(id: string, request: UpdateUserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/${id}`, request);
  }

  // Activer un utilisateur
  activateUser(id: string): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/${id}/activate`, {});
  }

  // Désactiver un utilisateur
  deactivateUser(id: string): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/${id}/deactivate`, {});
  }

  // Suspendre un utilisateur
  suspendUser(id: string): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/${id}/suspend`, {});
  }

  // Supprimer un utilisateur
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Obtenir les statistiques d'un instructeur
  getInstructeurStats(id: string): Observable<InstructeurStatsResponse> {
    return this.http.get<InstructeurStatsResponse>(`${this.apiUrl}/instructeurs/${id}/stats`);
  }

  // Obtenir les statistiques de tous les instructeurs
  getAllInstructeursStats(): Observable<InstructeurStatsResponse[]> {
    return this.http.get<InstructeurStatsResponse[]>(`${this.apiUrl}/instructeurs/stats`);
  }

  // Réinitialiser les statistiques d'un instructeur
  resetInstructeurStats(id: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/instructeurs/${id}/stats/reset`, {});
  }
}