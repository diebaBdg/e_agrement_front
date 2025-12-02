import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

export interface TypeAgrementDTO {
  id: string;
  code: string;
  libelle: string;
  description: string;
  actif: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TypeAgrementService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/types-agrement`;

  // Obtenir tous les types d'agrément
  getTypesAgrement(): Observable<TypeAgrementDTO[]> {
    return this.http.get<TypeAgrementDTO[]>(this.apiUrl);
  }

  // Obtenir un type d'agrément par ID
  getTypeAgrementById(id: string): Observable<TypeAgrementDTO> {
    return this.http.get<TypeAgrementDTO>(`${this.apiUrl}/${id}`);
  }

  // Obtenir un type d'agrément par code
  getTypeAgrementByCode(code: string): Observable<TypeAgrementDTO> {
    return this.http.get<TypeAgrementDTO>(`${this.apiUrl}/code/${code}`);
  }

  // Créer un nouveau type d'agrément
  createTypeAgrement(request: TypeAgrementDTO): Observable<TypeAgrementDTO> {
    return this.http.post<TypeAgrementDTO>(this.apiUrl, request);
  }

  // Mettre à jour un type d'agrément
  updateTypeAgrement(id: string, request: TypeAgrementDTO): Observable<TypeAgrementDTO> {
    return this.http.put<TypeAgrementDTO>(`${this.apiUrl}/${id}`, request);
  }

  // Supprimer un type d'agrément
  deleteTypeAgrement(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}