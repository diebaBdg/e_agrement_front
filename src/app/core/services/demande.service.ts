import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

export interface TypeAgrement {
  id: string;
  code: string;
  libelle: string;
  description: string;
  actif: boolean;
}

export interface CreateDemandeRequest {
  typeAgrementId: string;
  nomCompletDemandeur: string;
  emailDemandeur: string;
  telephoneDemandeur: string;
  nomEtablissement: string;
  adresseEtablissement: string;
  descriptionActivite: string;
  documentsPaths: string[];
}

export interface UpdateDemandeRequest {
  nomEtablissement: string;
  adresseEtablissement: string;
  descriptionActivite: string;
  documentsPaths: string[];
}

export interface DemandeResponse {
  id: string;
  numeroDemande: string;
  typeAgrement: TypeAgrement;
  demandeurId: string;
  nomCompletDemandeur: string;
  emailDemandeur: string;
  telephoneDemandeur: string;
  nomEtablissement: string;
  adresseEtablissement: string;
  descriptionActivite: string;
  documentsPaths: string[];
  statut: string;
  instructeurId?: string;
  instructeurNom?: string;
  dateAssignation?: string;
  commentaireInstructeur?: string;
  dateExamen?: string;
  motifRejet?: string;
  dateDecision?: string;
  montantPaiement?: number;
  statutPaiement?: string;
  referencePaiement?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface AssignerInstructeurRequest {
  instructeurId: string;
}

export interface ExaminerDemandeRequest {
  commentaire: string;
}

export interface ApprouverDemandeRequest {
  commentaire: string;
}

export interface RejeterDemandeRequest {
  motifRejet: string;
  commentaire: string;
}

export interface StatistiquesResponse {
  totalDemandes: number;
  demandesSoumises: number;
  demandesEnCours: number;
  demandesApprouvees: number;
  demandesRejetees: number;
  demandesNonAssignees: number;
}

@Injectable({
  providedIn: 'root'
})
export class DemandeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/demandes`;

  // Récupérer toutes les demandes
  getDemandes(): Observable<DemandeResponse[]> {
    return this.http.get<DemandeResponse[]>(this.apiUrl);
  }

  // Récupérer une demande par ID
  getDemandeById(id: string): Observable<DemandeResponse> {
    return this.http.get<DemandeResponse>(`${this.apiUrl}/${id}`);
  }

  // Suivre une demande avec numéro et email
  suivreDemande(numeroDemande: string, email: string): Observable<DemandeResponse> {
    return this.http.get<DemandeResponse>(`${this.apiUrl}/suivre/${numeroDemande}`, {
      params: { email }
    });
  }

  // Récupérer les demandes par statut
  getDemandesParStatut(statut: string): Observable<DemandeResponse[]> {
    return this.http.get<DemandeResponse[]>(`${this.apiUrl}/statut/${statut}`);
  }

  // Récupérer les demandes non assignées
  getDemandesNonAssignees(): Observable<DemandeResponse[]> {
    return this.http.get<DemandeResponse[]>(`${this.apiUrl}/non-assignees`);
  }

  // Récupérer mes demandes (pour demandeur)
  getMesDemandes(demandeurId: string): Observable<DemandeResponse[]> {
    return this.http.get<DemandeResponse[]>(`${this.apiUrl}/mes-demandes`, {
      params: { demandeurId }
    });
  }

  // Récupérer les demandes assignées à un instructeur
  getDemandesInstructeur(instructeurId: string): Observable<DemandeResponse[]> {
    return this.http.get<DemandeResponse[]>(`${this.apiUrl}/instructeur/mes-demandes`, {
      params: { instructeurId }
    });
  }

  // Créer une nouvelle demande (authentifié)
  createDemande(demandeurId: string, request: CreateDemandeRequest): Observable<DemandeResponse> {
    return this.http.post<DemandeResponse>(this.apiUrl, request, {
      params: { demandeurId }
    });
  }

  // Créer une demande publique (sans authentification)
  createDemandePublic(request: CreateDemandeRequest): Observable<DemandeResponse> {
    return this.http.post<DemandeResponse>(`${this.apiUrl}/public`, request);
  }

  // Modifier une demande
  updateDemande(id: string, demandeurId: string, request: UpdateDemandeRequest): Observable<DemandeResponse> {
    return this.http.put<DemandeResponse>(`${this.apiUrl}/${id}`, request, {
      params: { demandeurId }
    });
  }

  // Supprimer une demande
  deleteDemande(id: string, demandeurId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      params: { demandeurId }
    });
  }

  // Assigner une demande à un instructeur
  assignerDemande(id: string, request: AssignerInstructeurRequest): Observable<DemandeResponse> {
    return this.http.post<DemandeResponse>(`${this.apiUrl}/${id}/assigner`, request);
  }

  // Réassigner une demande à un autre instructeur
  reassignerDemande(id: string, request: AssignerInstructeurRequest): Observable<DemandeResponse> {
    return this.http.put<DemandeResponse>(`${this.apiUrl}/${id}/reassigner`, request);
  }

  // Examiner une demande
  examinerDemande(id: string, instructeurId: string, request: ExaminerDemandeRequest): Observable<DemandeResponse> {
    return this.http.put<DemandeResponse>(`${this.apiUrl}/${id}/examiner`, request, {
      params: { instructeurId }
    });
  }

  // Approuver une demande
  approuverDemande(id: string, instructeurId: string, request: ApprouverDemandeRequest): Observable<DemandeResponse> {
    return this.http.put<DemandeResponse>(`${this.apiUrl}/${id}/approuver`, request, {
      params: { instructeurId }
    });
  }

  // Rejeter une demande
  rejeterDemande(id: string, instructeurId: string, request: RejeterDemandeRequest): Observable<DemandeResponse> {
    return this.http.put<DemandeResponse>(`${this.apiUrl}/${id}/rejeter`, request, {
      params: { instructeurId }
    });
  }

  // Obtenir les statistiques globales
  getStatistiquesGlobales(): Observable<StatistiquesResponse> {
    return this.http.get<StatistiquesResponse>(`${this.apiUrl}/statistiques/globales`);
  }

  // Obtenir les statistiques d'un instructeur
  getStatistiquesInstructeur(instructeurId: string): Observable<StatistiquesResponse> {
    return this.http.get<StatistiquesResponse>(`${this.apiUrl}/statistiques/instructeur`, {
      params: { instructeurId }
    });
  }
}