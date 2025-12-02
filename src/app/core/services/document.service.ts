import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

export interface DocumentResponse {
  id: string;
  nomFichier: string;
  nomStockage: string;
  cheminStockage: string;
  typeMime: string;
  taille: number;
  typeDocument: string;
  demandeId: string;
  dateUpload: string;
  actif: boolean;
  tailleFormatee: string;
  urlTelechargement: string;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/documents`;

  // Obtenir les informations d'un document
  getDocumentById(documentId: string): Observable<DocumentResponse> {
    return this.http.get<DocumentResponse>(`${this.apiUrl}/${documentId}`);
  }

  // Obtenir tous les documents d'une demande
  getDocumentsByDemande(demandeId: string): Observable<DocumentResponse[]> {
    return this.http.get<DocumentResponse[]>(`${this.apiUrl}/demande/${demandeId}`);
  }

  // Obtenir les documents d'une demande par type
  getDocumentsByDemandeAndType(demandeId: string, typeDocument: string): Observable<DocumentResponse[]> {
    return this.http.get<DocumentResponse[]>(`${this.apiUrl}/demande/${demandeId}/type/${typeDocument}`);
  }

  // Uploader un document pour une demande
  uploadDocument(demandeId: string, typeDocument: string, file: File): Observable<DocumentResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<DocumentResponse>(`${this.apiUrl}/upload/${demandeId}`, formData, {
      params: { typeDocument }
    });
  }

  // Télécharger un document
  downloadDocument(documentId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${documentId}/download`, {
      responseType: 'blob'
    });
  }

  // Supprimer un document
  deleteDocument(documentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${documentId}`);
  }
}