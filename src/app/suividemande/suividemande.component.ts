import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
export class SuividemandeComponent {
  trackingNumber: string = '';
  showResults: boolean = false;
  replyMessage: string = '';

  // Données de la demande (simulées)
  demandeData: any = {
    nom: 'Cabinet Médical Ndiaye',
    type: 'Médecine',
    numeroSuivi: 'ddd',
    dateSoumission: '15/01/2024',
    statut: 'En Examen',
    statutColor: 'orange'
  };

  timelineSteps: TimelineStep[] = [
    {
      id: 1,
      title: 'Demande soumise',
      date: '2024-01-15',
      time: '10:30',
      description: 'Votre demande a été reçue avec succès',
      completed: true,
      icon: '✓'
    },
    {
      id: 2,
      title: 'Paiement confirmé',
      date: '2024-01-15',
      time: '11:00',
      description: 'Le paiement de 50,000 FCFA a été validé',
      completed: true,
      icon: '✓'
    },
    {
      id: 3,
      title: 'En cours d\'examen',
      date: '2024-01-16',
      time: '09:00',
      description: 'Un instructeur examine votre dossier',
      completed: true,
      icon: '✓'
    },
    {
      id: 4,
      title: 'Vérification des documents',
      date: '',
      time: '',
      description: 'Vérification de la conformité des documents fournis',
      completed: false,
      icon: '⏰'
    },
    {
      id: 5,
      title: 'Décision finale',
      date: '',
      time: '',
      description: 'Approbation ou rejet de la demande',
      completed: false,
      icon: '⏰'
    }
  ];

  documents: Document[] = [
    {
      id: '1',
      name: 'Licence Professionnelle.pdf',
      size: '2.4 MB',
      uploadDate: '15/01/2024'
    },
    {
      id: '2',
      name: 'Certificat d\'Enregistrement.pdf',
      size: '1.8 MB',
      uploadDate: '15/01/2024'
    }
  ];

  messages: Message[] = [
    {
      id: '1',
      sender: 'Instructeur - Aminata Diop',
      content: 'Bonjour, votre dossier est en cours d\'examen. Nous vous contacterons si des documents supplémentaires sont nécessaires.',
      timestamp: '2024-01-16 14:30'
    }
  ];

  onSearch(): void {
    if (this.trackingNumber.trim()) {
      // Simuler la recherche - en production, ce serait un appel API
      this.demandeData.numeroSuivi = this.trackingNumber;
      this.showResults = true;
    }
  }

  downloadDocument(documentId: string): void {
    console.log('Téléchargement du document:', documentId);
    // Logique de téléchargement
    alert('Téléchargement du document en cours...');
  }

  sendMessage(): void {
    if (this.replyMessage.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'Vous',
        content: this.replyMessage,
        timestamp: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0].substring(0, 5)
      };
      this.messages.push(newMessage);
      this.replyMessage = '';
    }
  }
}
