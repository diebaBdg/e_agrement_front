import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SelectOption {
  id: string;
  libelle: string;
  code?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class SelectService {
  private readonly http = inject(HttpClient);
  private readonly typesAgrementUrl = `${environment.apiUrl}/api/types-agrement`;
  private readonly instructeursUrl = `${environment.apiUrl}/api/users/instructeurs`;
  private readonly demandeursUrl = `${environment.apiUrl}/api/users/demandeurs`;

  // Obtenir tous les types d'agrément pour les sélections
  getTypesAgrement(): Observable<SelectOption[]> {
    return this.http.get<SelectOption[]>(this.typesAgrementUrl);
  }

  // Obtenir tous les instructeurs pour les sélections
  getInstructeurs(): Observable<SelectOption[]> {
    return this.http.get<SelectOption[]>(this.instructeursUrl);
  }

  // Obtenir tous les demandeurs pour les sélections
  getDemandeurs(): Observable<SelectOption[]> {
    return this.http.get<SelectOption[]>(this.demandeursUrl);
  }

  // Obtenir les statuts de demande (énumération statique)
  getStatuts(): Observable<SelectOption[]> {
    return new Observable(observer => {
      observer.next([
        { id: 'SOUMIS', libelle: 'Soumis', code: 'SOUMIS' },
        { id: 'EN_COURS', libelle: 'En Cours', code: 'EN_COURS' },
        { id: 'EN_EXAMEN', libelle: 'En Examen', code: 'EN_EXAMEN' },
        { id: 'APPROUVE', libelle: 'Approuvé', code: 'APPROUVE' },
        { id: 'REJETE', libelle: 'Rejeté', code: 'REJETE' },
        { id: 'EN_ATTENTE_PAIEMENT', libelle: 'En Attente de Paiement', code: 'EN_ATTENTE_PAIEMENT' }
      ]);
      observer.complete();
    });
  }

  // Obtenir les méthodes de paiement (énumération statique)
  getMethodesPaiement(): Observable<SelectOption[]> {
    return new Observable(observer => {
      observer.next([
        { id: 'CARTE_BANCAIRE', libelle: 'Carte Bancaire', code: 'CARTE_BANCAIRE' },
        { id: 'MOBILE_MONEY', libelle: 'Mobile Money', code: 'MOBILE_MONEY' },
        { id: 'VIREMENT', libelle: 'Virement Bancaire', code: 'VIREMENT' }
      ]);
      observer.complete();
    });
  }

  // Obtenir les opérateurs mobile money (énumération statique)
  getOperateursMobileMoney(): Observable<SelectOption[]> {
    return new Observable(observer => {
      observer.next([
        { id: 'ORANGE_MONEY', libelle: 'Orange Money', code: 'ORANGE_MONEY' },
        { id: 'WAVE', libelle: 'Wave', code: 'WAVE' },
        { id: 'FREE_MONEY', libelle: 'Free Money', code: 'FREE_MONEY' }
      ]);
      observer.complete();
    });
  }
}