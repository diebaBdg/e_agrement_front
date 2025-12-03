import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DemandeService } from '../core/services/demande.service';
import { DocumentService } from '../core/services/document.service';
import { AuthService } from '../core/services/auth.service';

interface SummaryCard {
  label: string;
  value: number;
  color: string;
}

interface Demande {
  id: string;
  nom: string;
  type: string;
  dateSoumission: string;
  numeroDemande: string;
  statut: string;
  statutColor: string;
  statutIcon: string;
  actionType: 'details' | 'paiement' | 'certificat';
  actionLabel: string;
  actionIcon: string;
  montant?: number;
}

interface DemandeDetails {
  id: string;
  nomComplet: string;
  email: string;
  telephone: string;
  dateSoumission: string;
  nomEtablissement: string;
  adresse: string;
  description: string;
  type: string;
  statut: string;
  documents: string[];
  commentaires: any[];
}

@Component({
  selector: 'app-espacedemandeur',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './espacedemandeur.component.html',
  styleUrl: './espacedemandeur.component.css'
})
export class EspacedemandeurComponent implements OnInit {
[x: string]: any;
downloadDocument(_t190: string) {
throw new Error('Method not implemented.');
}
  private demandeService = inject(DemandeService);
  private documentService = inject(DocumentService);
  private authService = inject(AuthService);
  private router = inject(Router);

  showModal: boolean = false;
  activeTab: string = 'informations';
  selectedDemande: DemandeDetails | null = null;
  newComment: string = '';
  loading: boolean = true;
  error: string | null = null;

  summaryCards: SummaryCard[] = [];
  demandes: Demande[] = [];
errorMessage: any;

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (!user || !user.id) {
      alert('Veuillez vous connecter pour accéder à votre espace');
      this.router.navigate(['/connexion']);
      return;
    }

    this.loadMesDemandes(user.id);
  }

  loadMesDemandes(demandeurId: string): void {
    this.loading = true;
    this.error = null;

    this.demandeService.getMesDemandes(demandeurId).subscribe({
      next: (demandes) => {
        this.demandes = demandes.map(d => this.mapDemande(d));
        this.updateSummaryCards();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement demandes:', err);
        this.error = 'Impossible de charger vos demandes';
        this.loading = false;
      }
    });
  }

  reloadMesDemandes(): void {
    const user = this.authService.getUser();
    if (user && user.id) {
      this.loadMesDemandes(user.id);
    }
  }

  private mapDemande(demande: any): Demande {
    const statutInfo = this.getStatutInfo(demande.statut);
    
    return {
      id: demande.id,
      nom: demande.nomEtablissement,
      type: demande.typeAgrement?.libelle || 'N/A',
      dateSoumission: this.formatDate(demande.createdAt),
      numeroDemande: demande.numeroDemande,
      statut: statutInfo.label,
      statutColor: statutInfo.color,
      statutIcon: statutInfo.icon,
      actionType: this.getActionType(demande.statut),
      actionLabel: this.getActionLabel(demande.statut),
      actionIcon: this.getActionIcon(demande.statut),
      montant: demande.montantPaiement
    };
  }

  private getStatutInfo(statut: string): { label: string; color: string; icon: string } {
    const statutMap: any = {
      'SOUMIS': { label: 'Soumis', color: 'blue', icon: 'ℹ️' },
      'EN_COURS': { label: 'En Cours', color: 'orange', icon: '⏰' },
      'EN_EXAMEN': { label: 'En Examen', color: 'orange', icon: '⏰' },
      'APPROUVE': { label: 'Approuvé', color: 'green', icon: '✓' },
      'REJETE': { label: 'Rejeté', color: 'red', icon: '✗' },
      'EN_ATTENTE_PAIEMENT': { label: 'Paiement requis', color: 'yellow', icon: '$' }
    };

    return statutMap[statut] || { label: statut, color: 'gray', icon: '?' };
  }

  private getActionType(statut: string): 'details' | 'paiement' | 'certificat' {
    if (statut === 'EN_ATTENTE_PAIEMENT') return 'paiement';
    if (statut === 'APPROUVE') return 'certificat';
    return 'details';
  }

  private getActionLabel(statut: string): string {
    if (statut === 'EN_ATTENTE_PAIEMENT') return 'Effectuer le Paiement';
    if (statut === 'APPROUVE') return 'Voir le Certificat';
    return 'Voir les Détails';
  }

  private getActionIcon(statut: string): string {
    if (statut === 'EN_ATTENTE_PAIEMENT') return '$';
    if (statut === 'APPROUVE') return '📜';
    return '👁️';
  }

  private updateSummaryCards(): void {
    const total = this.demandes.length;
    const enCours = this.demandes.filter(d => 
      d.statut === 'En Cours' || d.statut === 'En Examen' || d.statut === 'Soumis'
    ).length;
    const approuvees = this.demandes.filter(d => d.statut === 'Approuvé').length;

    this.summaryCards = [
      { label: 'Total Demandes', value: total, color: 'gray' },
      { label: 'En Cours', value: enCours, color: 'orange' },
      { label: 'Approuvées', value: approuvees, color: 'green' }
    ];
  }

  onViewDetails(demandeId: string): void {
    this.loading = true;
    
    this.demandeService.getDemandeById(demandeId).subscribe({
      next: (demande) => {
        this.selectedDemande = {
          id: demande.id,
          nomComplet: demande.nomCompletDemandeur,
          email: demande.emailDemandeur,
          telephone: demande.telephoneDemandeur,
          dateSoumission: this.formatDate(demande.createdAt),
          nomEtablissement: demande.nomEtablissement,
          adresse: demande.adresseEtablissement,
          description: demande.descriptionActivite,
          type: demande.typeAgrement?.libelle || 'N/A',
          statut: this.getStatutInfo(demande.statut).label,
          documents: [],
          commentaires: []
        };

        // Charger les documents
        this.loadDocuments(demandeId);
        
        this.activeTab = 'informations';
        this.showModal = true;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement détails:', err);
        alert('Impossible de charger les détails de la demande');
        this.loading = false;
      }
    });
  }

  private loadDocuments(demandeId: string): void {
    this.documentService.getDocumentsByDemande(demandeId).subscribe({
      next: (documents) => {
        if (this.selectedDemande) {
          this.selectedDemande.documents = documents.map(d => d.nomFichier);
        }
      },
      error: (err) => {
        console.error('Erreur chargement documents:', err);
      }
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedDemande = null;
  }

  onTabClick(tab: string): void {
    this.activeTab = tab;
  }

  onApprove(): void {
    alert('Cette action est réservée aux instructeurs');
  }

  onReject(): void {
    alert('Cette action est réservée aux instructeurs');
  }

  addComment(): void {
    if (this.newComment.trim() && this.selectedDemande) {
      const comment = {
        id: Date.now().toString(),
        auteur: 'Vous',
        contenu: this.newComment,
        date: new Date().toLocaleString('fr-FR')
      };
      this.selectedDemande.commentaires.push(comment);
      this.newComment = '';
      
      // TODO: Envoyer le commentaire à l'API si disponible
    }
  }

  onMakePayment(demandeId: string): void {
    const demande = this.demandes.find(d => d.id === demandeId);
    if (demande) {
      this.router.navigate(['/paiement'], {
        queryParams: {
          id: demande.numeroDemande,
          type: demande.type
        }
      });
    }
  }

  onViewCertificate(demandeId: string): void {
    const demande = this.demandes.find(d => d.id === demandeId);
    if (demande) {
      // TODO: Implémenter la vue du certificat
      alert(`Certificat pour la demande ${demande.numeroDemande}`);
    }
  }

  onAccessTracking(): void {
    this.router.navigate(['/suivre']);
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}