import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DemandeService, DemandeResponse } from '../core/services/demande.service';
import { AuthService } from '../core/services/auth.service';
import { DocumentService } from '../core/services/document.service';

interface SummaryCard {
  label: string;
  value: number;
  color: string;
}

interface DemandeUI {
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
  private demandeService = inject(DemandeService);
  private authService = inject(AuthService);
  private documentService = inject(DocumentService);
  
  showModal: boolean = false;
  activeTab: string = 'informations';
  selectedDemande: DemandeDetails | null = null;
  newComment: string = '';
  loading: boolean = true;
  errorMessage: string = '';

  summaryCards: SummaryCard[] = [
    {
      label: 'Total Demandes',
      value: 0,
      color: 'gray'
    },
    {
      label: 'En Cours',
      value: 0,
      color: 'orange'
    },
    {
      label: 'Approuvées',
      value: 0,
      color: 'green'
    }
  ];

  demandes: DemandeUI[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadMesDemandes();
  }

  loadMesDemandes(): void {
    const user = this.authService.getUser();
    if (!user) {
      this.router.navigate(['/connexion']);
      return;
    }

    this.loading = true;
    this.demandeService.getMesDemandes(user.id).subscribe({
      next: (demandes: DemandeResponse[]) => {
        this.transformDemandes(demandes);
        this.updateSummaryCards(demandes);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des demandes:', error);
        this.errorMessage = 'Impossible de charger vos demandes. Veuillez réessayer.';
        this.loading = false;
      }
    });
  }

  transformDemandes(demandes: DemandeResponse[]): void {
    this.demandes = demandes.map(demande => {
      const uiDemande: DemandeUI = {
        id: demande.id,
        nom: demande.nomEtablissement,
        type: demande.typeAgrement?.libelle || 'Non spécifié',
        dateSoumission: this.formatDate(demande.createdAt),
        numeroDemande: demande.numeroDemande,
        statut: this.getStatutLabel(demande.statut),
        statutColor: this.getStatutColor(demande.statut),
        statutIcon: this.getStatutIcon(demande.statut),
        actionType: this.getActionType(demande.statut),
        actionLabel: this.getActionLabel(demande.statut),
        actionIcon: this.getActionIcon(demande.statut)
      };

      if (demande.statut === 'EN_ATTENTE_PAIEMENT' && demande.montantPaiement) {
        uiDemande.montant = demande.montantPaiement;
      }

      return uiDemande;
    });
  }

  updateSummaryCards(demandes: DemandeResponse[]): void {
    const total = demandes.length;
    const enCours = demandes.filter(d => 
      d.statut === 'SOUMIS' || d.statut === 'EN_COURS' || d.statut === 'EN_EXAMEN'
    ).length;
    const approuvees = demandes.filter(d => d.statut === 'APPROUVE').length;

    this.summaryCards = [
      { label: 'Total Demandes', value: total, color: 'gray' },
      { label: 'En Cours', value: enCours, color: 'orange' },
      { label: 'Approuvées', value: approuvees, color: 'green' }
    ];
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getStatutLabel(statut: string): string {
    const statutMap: { [key: string]: string } = {
      'SOUMIS': 'Soumis',
      'EN_COURS': 'En Cours',
      'EN_EXAMEN': 'En Examen',
      'APPROUVE': 'Approuvée',
      'REJETE': 'Rejetée',
      'EN_ATTENTE_PAIEMENT': 'Paiement requis'
    };
    return statutMap[statut] || statut;
  }

  getStatutColor(statut: string): string {
    switch (statut) {
      case 'APPROUVE': return 'green';
      case 'REJETE': return 'red';
      case 'EN_ATTENTE_PAIEMENT': return 'yellow';
      case 'SOUMIS':
      case 'EN_COURS':
      case 'EN_EXAMEN': return 'orange';
      default: return 'gray';
    }
  }

  getStatutIcon(statut: string): string {
    switch (statut) {
      case 'APPROUVE': return '✓';
      case 'REJETE': return '✗';
      case 'EN_ATTENTE_PAIEMENT': return '$';
      case 'SOUMIS':
      case 'EN_COURS':
      case 'EN_EXAMEN': return '⏰';
      default: return '📄';
    }
  }

  getActionType(statut: string): 'details' | 'paiement' | 'certificat' {
    switch (statut) {
      case 'EN_ATTENTE_PAIEMENT': return 'paiement';
      case 'APPROUVE': return 'certificat';
      default: return 'details';
    }
  }

  getActionLabel(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE_PAIEMENT': return 'Effectuer le Paiement';
      case 'APPROUVE': return 'Voir le Certificat';
      default: return 'Voir les Détails';
    }
  }

  getActionIcon(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE_PAIEMENT': return '$';
      case 'APPROUVE': return '📜';
      default: return '👁️';
    }
  }

  onViewDetails(demandeId: string): void {
    this.loading = true;
    this.demandeService.getDemandeById(demandeId).subscribe({
      next: (demande: DemandeResponse) => {
        this.selectedDemande = this.transformToDetails(demande);
        this.activeTab = 'informations';
        this.showModal = true;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des détails:', error);
        this.errorMessage = 'Impossible de charger les détails de la demande.';
        this.loading = false;
      }
    });
  }

  transformToDetails(demande: DemandeResponse): DemandeDetails {
    return {
      id: demande.id,
      nomComplet: demande.nomCompletDemandeur,
      email: demande.emailDemandeur,
      telephone: demande.telephoneDemandeur,
      dateSoumission: this.formatDate(demande.createdAt),
      nomEtablissement: demande.nomEtablissement,
      adresse: demande.adresseEtablissement,
      description: demande.descriptionActivite,
      type: demande.typeAgrement?.libelle || 'Non spécifié',
      statut: this.getStatutLabel(demande.statut),
      documents: demande.documentsPaths || [],
      commentaires: demande.commentaireInstructeur ? [{
        id: '1',
        auteur: demande.instructeurNom || 'Instructeur',
        contenu: demande.commentaireInstructeur,
        date: demande.dateExamen ? this.formatDate(demande.dateExamen) : 'Date non spécifiée'
      }] : []
    };
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedDemande = null;
  }

  onTabClick(tab: string): void {
    this.activeTab = tab;
  }

  onApprove(): void {
    if (this.selectedDemande) {
      if (confirm('Êtes-vous sûr de vouloir approuver cette demande ?')) {
        console.log('Demande approuvée:', this.selectedDemande.id);
        alert('La demande a été approuvée avec succès !');
        this.closeModal();
        this.loadMesDemandes();
      }
    }
  }

  onReject(): void {
    if (this.selectedDemande) {
      const reason = prompt('Veuillez indiquer la raison du rejet :');
      if (reason) {
        console.log('Demande rejetée:', this.selectedDemande.id, 'Raison:', reason);
        alert('La demande a été rejetée.');
        this.closeModal();
        this.loadMesDemandes();
      }
    }
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
      this.router.navigate(['/document'], {
        queryParams: {
          numero: demande.numeroDemande
        }
      });
    }
  }

  onAccessTracking(): void {
    this.router.navigate(['/suivre']);
  }

  downloadDocument(documentName: string): void {
    // Implémentez le téléchargement de document ici
    console.log('Télécharger:', documentName);
    // Utilisez documentService.downloadDocument() si disponible
  }
}
