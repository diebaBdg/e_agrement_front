import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DemandeService } from '../core/services/demande.service';
import { DocumentService } from '../core/services/document.service';
import { AuthService } from '../core/services/auth.service';

interface StatusCard {
  label: string;
  value: number;
  icon: string;
  color: string;
}

interface ApprovalRequest {
  id: string;
  initials: string;
  name: string;
  organization: string;
  type: string;
  date: string;
  description: string;
  status: 'soumis' | 'en-examen' | 'approuves' | 'rejetes';
  avatarColor: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  dateSoumission?: string;
}

interface Document {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

@Component({
  selector: 'app-traitementagrement',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './traitementagrement.component.html',
  styleUrl: './traitementagrement.component.css'
})
export class TraitementagrementComponent implements OnInit {
  private demandeService = inject(DemandeService);
  private documentService = inject(DocumentService);
  private authService = inject(AuthService);

  statusCards: StatusCard[] = [];
  requests: ApprovalRequest[] = [];
  activeTab: string = 'tous';
  searchQuery: string = '';
  showModal: boolean = false;
  selectedRequest: ApprovalRequest | null = null;
  modalActiveTab: string = 'informations';
  loading: boolean = true;
  error: string | null = null;

  requestDetails: any = {};
  instructeurId: string = '';

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (!user || !user.id) {
      alert('Veuillez vous connecter');
      return;
    }

    // Vérifier le rôle
    if (!this.authService.hasRole('INSTRUCTEUR')) {
      alert('Accès réservé aux instructeurs');
      return;
    }

    this.instructeurId = user.id;
    this.loadDemandesInstructeur();
    this.loadStatistiques();
  }

  loadDemandesInstructeur(): void {
    this.loading = true;
    this.error = null;

    this.demandeService.getDemandesInstructeur(this.instructeurId).subscribe({
      next: (demandes) => {
        this.requests = demandes.map(d => this.mapDemande(d));
        this.updateStatusCards();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement demandes:', err);
        this.error = 'Impossible de charger les demandes';
        this.loading = false;
      }
    });
  }

  loadStatistiques(): void {
    this.demandeService.getStatistiquesInstructeur(this.instructeurId).subscribe({
      next: (stats) => {
        this.statusCards = [
          {
            label: 'Total',
            value: stats.totalDemandes,
            icon: '📊',
            color: 'gray'
          },
          {
            label: 'Soumis',
            value: stats.demandesSoumises,
            icon: 'ℹ️',
            color: 'blue'
          },
          {
            label: 'En Examen',
            value: stats.demandesEnCours,
            icon: '⏰',
            color: 'orange'
          },
          {
            label: 'Approuvés',
            value: stats.demandesApprouvees,
            icon: '✓',
            color: 'green'
          },
          {
            label: 'Rejetés',
            value: stats.demandesRejetees,
            icon: '✗',
            color: 'red'
          }
        ];
      },
      error: (err) => {
        console.error('Erreur chargement statistiques:', err);
      }
    });
  }

  private mapDemande(demande: any): ApprovalRequest {
    const initials = this.getInitials(demande.nomCompletDemandeur);
    
    return {
      id: demande.id,
      initials: initials,
      name: demande.nomCompletDemandeur,
      organization: demande.nomEtablissement,
      type: demande.typeAgrement?.libelle || 'N/A',
      date: this.formatDate(demande.createdAt),
      description: demande.descriptionActivite,
      status: this.mapStatut(demande.statut),
      avatarColor: this.generateAvatarColor(demande.nomCompletDemandeur),
      email: demande.emailDemandeur,
      telephone: demande.telephoneDemandeur,
      adresse: demande.adresseEtablissement,
      dateSoumission: this.formatDate(demande.createdAt)
    };
  }

  private mapStatut(statut: string): 'soumis' | 'en-examen' | 'approuves' | 'rejetes' {
    const statutMap: any = {
      'SOUMIS': 'soumis',
      'EN_COURS': 'en-examen',
      'EN_EXAMEN': 'en-examen',
      'APPROUVE': 'approuves',
      'REJETE': 'rejetes'
    };
    return statutMap[statut] || 'soumis';
  }

  private updateStatusCards(): void {
    const total = this.requests.length;
    const soumis = this.requests.filter(r => r.status === 'soumis').length;
    const enExamen = this.requests.filter(r => r.status === 'en-examen').length;
    const approuves = this.requests.filter(r => r.status === 'approuves').length;
    const rejetes = this.requests.filter(r => r.status === 'rejetes').length;

    this.statusCards = [
      { label: 'Total', value: total, icon: '📊', color: 'gray' },
      { label: 'Soumis', value: soumis, icon: 'ℹ️', color: 'blue' },
      { label: 'En Examen', value: enExamen, icon: '⏰', color: 'orange' },
      { label: 'Approuvés', value: approuves, icon: '✓', color: 'green' },
      { label: 'Rejetés', value: rejetes, icon: '✗', color: 'red' }
    ];
  }

  get filteredRequests(): ApprovalRequest[] {
    let filtered = this.requests;

    if (this.activeTab !== 'tous') {
      filtered = filtered.filter(req => req.status === this.activeTab);
    }

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(req =>
        req.name.toLowerCase().includes(query) ||
        req.organization.toLowerCase().includes(query) ||
        req.type.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  onTabClick(tab: string): void {
    this.activeTab = tab;
  }

  onExaminer(requestId: string): void {
    const request = this.requests.find(r => r.id === requestId);
    if (!request) return;

    this.selectedRequest = request;
    this.modalActiveTab = 'informations';
    
    // Charger les documents
    this.loadDocuments(requestId);
    
    this.showModal = true;
  }

  private loadDocuments(demandeId: string): void {
    this.documentService.getDocumentsByDemande(demandeId).subscribe({
      next: (docs) => {
        this.requestDetails[demandeId] = {
          documents: docs.map(d => ({
            id: d.id,
            name: d.nomFichier,
            size: d.tailleFormatee,
            uploadDate: this.formatDate(d.dateUpload)
          })),
          comments: []
        };
      },
      error: (err) => {
        console.error('Erreur chargement documents:', err);
      }
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedRequest = null;
  }

  onModalTabClick(tab: string): void {
    this.modalActiveTab = tab;
  }

  onApprouver(): void {
    if (!this.selectedRequest) return;

    const commentaire = prompt('Commentaire (optionnel):') || '';
    
    this.demandeService.approuverDemande(
      this.selectedRequest.id,
      this.instructeurId,
      { commentaire }
    ).subscribe({
      next: () => {
        alert('Demande approuvée avec succès !');
        this.closeModal();
        this.loadDemandesInstructeur();
        this.loadStatistiques();
      },
      error: (err) => {
        console.error('Erreur approbation:', err);
        alert('Erreur lors de l\'approbation');
      }
    });
  }

  onRejeter(): void {
    if (!this.selectedRequest) return;

    const motifRejet = prompt('Veuillez indiquer la raison du rejet:');
    if (!motifRejet) return;

    const commentaire = prompt('Commentaire additionnel (optionnel):') || '';

    this.demandeService.rejeterDemande(
      this.selectedRequest.id,
      this.instructeurId,
      { motifRejet, commentaire }
    ).subscribe({
      next: () => {
        alert('Demande rejetée.');
        this.closeModal();
        this.loadDemandesInstructeur();
        this.loadStatistiques();
      },
      error: (err) => {
        console.error('Erreur rejet:', err);
        alert('Erreur lors du rejet');
      }
    });
  }

  downloadDocument(docId: string): void {
    this.documentService.downloadDocument(docId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'document';
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Erreur téléchargement:', err);
        alert('Erreur lors du téléchargement');
      }
    });
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'soumis': 'Soumis',
      'en-examen': 'En Examen',
      'approuves': 'Approuvé',
      'rejetes': 'Rejeté'
    };
    return labels[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'soumis': 'blue',
      'en-examen': 'orange',
      'approuves': 'green',
      'rejetes': 'red'
    };
    return colors[status] || 'gray';
  }

  private getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 3);
  }

  private generateAvatarColor(name: string): string {
    const colors = ['#d1fae5', '#fef3c7', '#fee2e2', '#dbeafe', '#e0e7ff'];
    const index = name.length % colors.length;
    return colors[index];
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