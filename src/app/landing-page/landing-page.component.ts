import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface AgrementType {
  icon: string;
  title: string;
  subtitle: string;
}

interface ProcessStep {
  number: number;
  title: string;
  description: string;
}

interface Benefit {
  title: string;
  description: string;
}

@Component({
  selector: 'app-landing-page',
  imports: [CommonModule, RouterModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  agrementTypes: AgrementType[] = [
    {
      icon: '🏥',
      title: 'Médecine',
      subtitle: 'Cabinets médicaux, cliniques, centres de santé'
    },
    {
      icon: '💊',
      title: 'Pharmacie',
      subtitle: 'Pharmacies, officines pharmaceutiques'
    },
    {
      icon: '🔬',
      title: 'Laboratoires',
      subtitle: 'Laboratoires d\'analyses médicales'
    },
    {
      icon: '📚',
      title: 'Établissements Scolaires',
      subtitle: 'Écoles privées, centres de formation'
    },
    {
      icon: '🏨',
      title: 'Hôtellerie',
      subtitle: 'Hôtels, restaurants, établissements touristiques'
    },
    {
      icon: '📊',
      title: 'Autres',
      subtitle: 'Autres types d\'établissements nécessitant un agrément'
    }
  ];

  processSteps: ProcessStep[] = [
    {
      number: 1,
      title: 'Soumettez',
      description: 'Remplissez le formulaire en ligne et téléchargez vos documents justificatifs'
    },
    {
      number: 2,
      title: 'Examen',
      description: 'Votre dossier est examiné par nos instructeurs qualifiés'
    },
    {
      number: 3,
      title: 'Validation',
      description: 'Recevez votre certificat d\'agrément officiel par email'
    }
  ];

  benefits: Benefit[] = [
    {
      title: 'Traitement Rapide',
      description: 'Réponse sous 48 heures pour les dossiers complets'
    },
    {
      title: '100% Sécurisé',
      description: 'Vos données sont protégées avec un chiffrement de niveau bancaire'
    },
    {
      title: 'Suivi en Temps Réel',
      description: 'Suivez l\'avancement de votre demande à chaque étape'
    },
    {
      title: 'Support Dédié',
      description: 'Une équipe disponible pour répondre à toutes vos questions'
    }
  ];
}
