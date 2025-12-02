import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

export interface AssignationResponse {
  id: string;
  demandeId: string;
  demandeNumero: string;
  instructeurId: string;
  instructeurNom: string;
  dateAssignation: string;
  active: boolean;
  commentaire: string;
  demandeStatut: string;
  demandeNomEtablissement: string;
}

export interface CreateAssignationRequest {
  instructeurId: string;
  commentaire: string;
}

@Injectable({
  providedIn: 'root'
})
export class AssignationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/assignations`;

  // Obtenir les demandes assignées à un instructeur
  getAssignationsByInstructeur(instructeurId: string): Observable<AssignationResponse[]> {
    return this.http.get<AssignationResponse[]>(`${this.apiUrl}/instructeurs/${instructeurId}`);
  }

  // Compter les assignations actives d'un instructeur
  countActiveAssignations(instructeurId: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/instructeurs/${instructeurId}/count-active`);
  }

  // Obtenir toutes les assignations d'une demande
  getAssignationsByDemande(demandeId: string): Observable<AssignationResponse[]> {
    return this.http.get<AssignationResponse[]>(`${this.apiUrl}/demandes/${demandeId}`);
  }

  // Obtenir l'assignation active d'une demande
  getActiveAssignation(demandeId: string): Observable<AssignationResponse> {
    return this.http.get<AssignationResponse>(`${this.apiUrl}/demandes/${demandeId}/active`);
  }

  // Assigner une demande à un instructeur
  assignDemande(demandeId: string, request: CreateAssignationRequest): Observable<AssignationResponse> {
    return this.http.post<AssignationResponse>(`${this.apiUrl}/demandes/${demandeId}/assign`, request);
  }

  // Réassigner une demande à un autre instructeur
  reassignDemande(demandeId: string, request: CreateAssignationRequest): Observable<AssignationResponse> {
    return this.http.post<AssignationResponse>(`${this.apiUrl}/demandes/${demandeId}/reassign`, request);
  }

  // Désactiver une assignation
  disableAssignation(assignationId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${assignationId}/disable`, {});
  }
}