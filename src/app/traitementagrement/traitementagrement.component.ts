import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
export class TraitementagrementComponent {
  statusCards: StatusCard[] = [
    {
      label: 'Total',
      value: 5,
      icon: '📊',
      color: 'gray'
    },
    {
      label: 'Soumis',
      value: 2,
      icon: 'ℹ️',
      color: 'blue'
    },
    {
      label: 'En Examen',
      value: 1,
      icon: '⏰',
      color: 'orange'
    },
    {
      label: 'Approuvés',
      value: 1,
      icon: '✓',
      color: 'green'
    },
    {
      label: 'Rejetés',
      value: 1,
      icon: '✗',
      color: 'red'
    }
  ];

  requests: ApprovalRequest[] = [
    {
      id: '1',
      initials: 'DAN',
      name: 'Dr. Awa Ndiaye',
      organization: 'Cabinet Médical Ndiaye',
      type: 'Médecine',
      date: '15/01/2024',
      description: 'Demande d\'agrément pour l\'ouverture d\'un cabinet médical spécialisé en pédiatrie',
      status: 'soumis',
      avatarColor: '#d1fae5'
    },
    {
      id: '2',
      initials: 'MB',
      name: 'Moussa Ba',
      organization: 'Pharmacie Ba',
      type: 'Pharmacie',
      date: '12/01/2024',
      description: 'Demande d\'agrément pour l\'ouverture d\'une pharmacie',
      status: 'en-examen',
      avatarColor: '#fef3c7'
    },
    {
      id: '3',
      initials: 'AS',
      name: 'Amadou Sow',
      organization: 'Laboratoire Sow',
      type: 'Laboratoires',
      date: '10/01/2024',
      description: 'Demande d\'agrément pour un laboratoire d\'analyses médicales',
      status: 'approuves',
      avatarColor: '#d1fae5'
    },
    {
      id: '4',
      initials: 'MK',
      name: 'Mariama Kane',
      organization: 'École Privée Kane',
      type: 'Établissements Scolaires',
      date: '08/01/2024',
      description: 'Demande d\'agrément pour une école privée',
      status: 'rejetes',
      avatarColor: '#fee2e2'
    },
    {
      id: '5',
      initials: 'ID',
      name: 'Ibrahima Diallo',
      organization: 'Hôtel Diallo',
      type: 'Hôtellerie',
      date: '05/01/2024',
      description: 'Demande d\'agrément pour un hôtel',
      status: 'soumis',
      avatarColor: '#dbeafe'
    }
  ];

  activeTab: string = 'tous';
  searchQuery: string = '';
  showModal: boolean = false;
  selectedRequest: ApprovalRequest | null = null;
  modalActiveTab: string = 'informations';

  // Données détaillées pour la modal
  requestDetails: any = {
    '1': {
      email: 'awa.ndiaye@example.com',
      telephone: '+221 77 456 7890',
      adresse: 'Avenue Cheikh Anta Diop, Dakar, Sénégal',
      dateSoumission: '15 janvier 2024',
      documents: [
        { id: '1', name: 'Licence Professionnelle.pdf', size: '2.4 MB', uploadDate: '15/01/2024' },
        { id: '2', name: 'Certificat d\'Enregistrement.pdf', size: '1.8 MB', uploadDate: '15/01/2024' }
      ],
      comments: [
        { id: '1', author: 'Instructeur - Aminata Diop', content: 'Dossier complet, en attente de vérification des documents.', timestamp: '2024-01-16 10:30' }
      ]
    },
    '2': {
      email: 'moussa.ba@example.com',
      telephone: '+221 77 123 4567',
      adresse: 'Rue de la Pharmacie, Dakar, Sénégal',
      dateSoumission: '12 janvier 2024',
      documents: [
        { id: '3', name: 'Autorisation d\'Ouverture.pdf', size: '1.5 MB', uploadDate: '12/01/2024' }
      ],
      comments: [
        { id: '2', author: 'Instructeur - Aminata Diop', content: 'Examen en cours.', timestamp: '2024-01-16 09:00' }
      ]
    },
    '3': {
      email: 'amadou.sow@example.com',
      telephone: '+221 77 234 5678',
      adresse: 'Boulevard Général de Gaulle, Dakar, Sénégal',
      dateSoumission: '10 janvier 2024',
      documents: [
        { id: '4', name: 'Agrément Laboratoire.pdf', size: '3.2 MB', uploadDate: '10/01/2024' }
      ],
      comments: []
    },
    '4': {
      email: 'mariama.kane@example.com',
      telephone: '+221 77 345 6789',
      adresse: 'Avenue Faidherbe, Dakar, Sénégal',
      dateSoumission: '08 janvier 2024',
      documents: [],
      comments: [
        { id: '3', author: 'Instructeur - Aminata Diop', content: 'Documents manquants.', timestamp: '2024-01-10 14:00' }
      ]
    },
    '5': {
      email: 'ibrahima.diallo@example.com',
      telephone: '+221 77 456 7890',
      adresse: 'Corniche Ouest, Dakar, Sénégal',
      dateSoumission: '05 janvier 2024',
      documents: [
        { id: '5', name: 'Permis d\'Exploitation.pdf', size: '2.1 MB', uploadDate: '05/01/2024' }
      ],
      comments: []
    }
  };

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

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'soumis': 'Soumis',
      'en-examen': 'En Examen',
      'approuves': 'Approuvés',
      'rejetes': 'Rejetés'
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

  onTabClick(tab: string): void {
    this.activeTab = tab;
  }

  onExaminer(requestId: string): void {
    this.selectedRequest = this.requests.find(r => r.id === requestId) || null;
    if (this.selectedRequest) {
      // Enrichir avec les détails
      const details = this.requestDetails[requestId];
      if (details) {
        this.selectedRequest = { ...this.selectedRequest, ...details };
      }
      this.showModal = true;
      this.modalActiveTab = 'informations';
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedRequest = null;
  }

  onModalTabClick(tab: string): void {
    this.modalActiveTab = tab;
  }

  onApprouver(): void {
    if (this.selectedRequest) {
      console.log('Approuver la demande:', this.selectedRequest.id);
      // Logique d'approbation
      alert('Demande approuvée avec succès !');
      this.closeModal();
    }
  }

  onRejeter(): void {
    if (this.selectedRequest) {
      const reason = prompt('Veuillez indiquer la raison du rejet :');
      if (reason) {
        console.log('Rejeter la demande:', this.selectedRequest.id, 'Raison:', reason);
        // Logique de rejet
        alert('Demande rejetée.');
        this.closeModal();
      }
    }
  }

  downloadDocument(docId: string): void {
    console.log('Télécharger le document:', docId);
    alert('Téléchargement du document en cours...');
  }
}
