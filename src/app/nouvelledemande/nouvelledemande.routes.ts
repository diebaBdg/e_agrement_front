import { Routes } from '@angular/router';
import { NouvelledemandeComponent } from './nouvelledemande.component';

export const NouvelledemandeRoutes: Routes = [
  {
    path: '',
    component: NouvelledemandeComponent,
    data: {
      title: 'Nouvelle Demande d\'Agrément',
    },
    children: [
      {
        path: '',
        component: NouvelledemandeComponent,
        data: {
          title: 'Créer une Demande',
        },
      },
      {
        path: 'type-agrement',
        component: NouvelledemandeComponent,
        data: {
          title: 'Choisir le Type d\'Agrément',
        },
      },
      {
        path: 'informations-demandeur',
        component: NouvelledemandeComponent,
        data: {
          title: 'Informations du Demandeur',
        },
      },
      {
        path: 'informations-etablissement',
        component: NouvelledemandeComponent,
        data: {
          title: 'Informations de l\'Établissement',
        },
      },
      {
        path: 'documents',
        component: NouvelledemandeComponent,
        data: {
          title: 'Documents Justificatifs',
        },
      },
      {
        path: 'recapitulatif',
        component: NouvelledemandeComponent,
        data: {
          title: 'Récapitulatif de la Demande',
        },
      },
      {
        path: 'confirmation',
        component: NouvelledemandeComponent,
        data: {
          title: 'Confirmation de Soumission',
        },
      },
    ]
  },
];