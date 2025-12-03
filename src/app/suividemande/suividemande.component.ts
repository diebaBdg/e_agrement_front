import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DemandeService } from '../core/services/demande.service';
import { DocumentService } from '../core/services/document.service';

interface TimelineStep {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
  completed: boolean;
  icon: string;
}

interface Document {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

@Component({
  selector: 'app-suividemande',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './suividemande.component.html',
  styleUrl: './suividemande.component.css'
})
export class SuividemandeComponent implements OnInit {
  private demandeService = inject(DemandeService);
  private documentService = inject(DocumentService);
  private route = inject(ActivatedRoute);

  trackingNumber: string = '';
  emailDemandeur: string = '';
  showResults: boolean = false;
  replyMessage: string = '';
  loading: boolean = false;
  error: string | null = null;

  demandeData: any = null;
  timelineSteps: TimelineStep[] = [];
  documents: Document[] = [];
  messages: Message[] = [];

  ngOnInit(): void {
    // Vérifier si un numéro est passé en paramètre
    this.route.queryParams.subscribe(params => {
      if (params['numero']) {
        this.trackingNumber = params['numero'];
        // Demander l'email si pas fourni
        if (!params['email']) {
          const email = prompt('Veuillez entrer votre email pour suivre cette demande:');
          if (email) {
            this.emailDemandeur = email;
            this.onSearch();
          }
        }
      }
    });
  }

  onSearch(): void {
    if (!this.trackingNumber.trim()) {
      this.error = 'Veuillez entrer un numéro de suivi';
      return;
    }

    if (!this.emailDemandeur.trim()) {
      this.error = 'Veuillez entrer votre email';
      return;
    }

    this.loading = true;
    this.error = null;
    this.showResults = false;

    this.demandeService.suivreDemande(this.trackingNumber, this.emailDemandeur).subscribe({
      next: (demande) => {
        this.demandeData = {
          nom: demande.nomEtablissement,
          type: demande.typeAgrement?.libelle || 'N/A',
          numeroSuivi: demande.numeroDemande,
          dateSoumission: this.formatDate(demande.createdAt),
          statut: this.getStatutLabel(demande.statut),
          statutColor: this.getStatutColor(demande.statut)
        };

        this.buildTimeline(demande);
        this.loadDocuments(demande.id);
        this.buildMessages(demande);

        this.showResults = true;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur recherche demande:', err);
        this.loading = false;
        
        if (err.status === 404) {
          this.error = 'Aucune demande trouvée avec ce numéro et cet email';
        } else {
          this.error = 'Erreur lors de la recherche. Veuillez réessayer';
        }
      }
    });
  }

  private buildTimeline(demande: any): void {
    const steps: TimelineStep[] = [
      {
        id: 1,
        title: 'Demande soumise',
        date: this.formatDate(demande.createdAt),
        time: this.formatTime(demande.createdAt),
        description: 'Votre demande a été reçue avec succès',
        completed: true,
        icon: '✓'
      }
    ];

    // Ajout des étapes selon le statut
    const statut = demande.statut;

    if (statut !== 'SOUMIS') {
      steps.push({
        id: 2,
        title: 'En cours de traitement',
        date: demande.dateAssignation ? this.formatDate(demande.dateAssignation) : '',
        time: demande.dateAssignation ? this.formatTime(demande.dateAssignation) : '',
        description: demande.instructeurNom 
          ? `Assigné à ${demande.instructeurNom}` 
          : 'En attente d\'assignation à un instructeur',
        completed: !!demande.dateAssignation,
        icon: demande.dateAssignation ? '✓' : '⏰'
      });
    }

    if (statut === 'EN_EXAMEN' || statut === 'APPROUVE' || statut === 'REJETE') {
      steps.push({
        id: 3,
        title: 'En cours d\'examen',
        date: demande.dateExamen ? this.formatDate(demande.dateExamen) : '',
        time: demande.dateExamen ? this.formatTime(demande.dateExamen) : '',
        description: 'Un instructeur examine votre dossier',
        completed: !!demande.dateExamen,
        icon: demande.dateExamen ? '✓' : '⏰'
      });
    }

    if (statut === 'APPROUVE') {
      steps.push({
        id: 4,
        title: 'Demande approuvée',
        date: demande.dateDecision ? this.formatDate(demande.dateDecision) : '',
        time: demande.dateDecision ? this.formatTime(demande.dateDecision) : '',
        description: 'Votre demande a été approuvée',
        completed: true,
        icon: '✓'
      });
    } else if (statut === 'REJETE') {
      steps.push({
        id: 4,
        title: 'Demande rejetée',
        date: demande.dateDecision ? this.formatDate(demande.dateDecision) : '',
        time: demande.dateDecision ? this.formatTime(demande.dateDecision) : '',
        description: demande.motifRejet || 'Votre demande a été rejetée',
        completed: true,
        icon: '✗'
      });
    } else {
      steps.push({
        id: 4,
        title: 'Décision finale',
        date: '',
        time: '',
        description: 'Approbation ou rejet de la demande',
        completed: false,
        icon: '⏰'
      });
    }

    this.timelineSteps = steps;
  }

  private loadDocuments(demandeId: string): void {
    this.documentService.getDocumentsByDemande(demandeId).subscribe({
      next: (docs) => {
        this.documents = docs.map(d => ({
          id: d.id,
          name: d.nomFichier,
          size: d.tailleFormatee,
          uploadDate: this.formatDate(d.dateUpload)
        }));
      },
      error: (err) => {
        console.error('Erreur chargement documents:', err);
      }
    });
  }

  private buildMessages(demande: any): void {
    this.messages = [];

    if (demande.commentaireInstructeur) {
      this.messages.push({
        id: '1',
        sender: demande.instructeurNom || 'Instructeur',
        content: demande.commentaireInstructeur,
        timestamp: demande.dateExamen ? this.formatDateTime(demande.dateExamen) : ''
      });
    }
  }

  downloadDocument(documentId: string): void {
    this.documentService.downloadDocument(documentId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        const doc = this.documents.find(d => d.id === documentId);
        link.download = doc?.name || 'document';
        
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Erreur téléchargement:', err);
        alert('Erreur lors du téléchargement du document');
      }
    });
  }

  sendMessage(): void {
    if (this.replyMessage.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'Vous',
        content: this.replyMessage,
        timestamp: new Date().toLocaleString('fr-FR')
      };
      this.messages.push(newMessage);
      this.replyMessage = '';
      
      // TODO: Envoyer le message à l'API si disponible
      alert('Fonctionnalité de messagerie en cours de développement');
    }
  }

  private getStatutLabel(statut: string): string {
    const statutMap: any = {
      'SOUMIS': 'Soumis',
      'EN_COURS': 'En Cours',
      'EN_EXAMEN': 'En Examen',
      'APPROUVE': 'Approuvé',
      'REJETE': 'Rejeté',
      'EN_ATTENTE_PAIEMENT': 'En Attente de Paiement'
    };
    return statutMap[statut] || statut;
  }

  private getStatutColor(statut: string): string {
    const colorMap: any = {
      'SOUMIS': 'blue',
      'EN_COURS': 'orange',
      'EN_EXAMEN': 'orange',
      'APPROUVE': 'green',
      'REJETE': 'red',
      'EN_ATTENTE_PAIEMENT': 'yellow'
    };
    return colorMap[statut] || 'gray';
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  }

  private formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  private formatDateTime(dateString: string): string {
    return `${this.formatDate(dateString)} ${this.formatTime(dateString)}`;
  }
}