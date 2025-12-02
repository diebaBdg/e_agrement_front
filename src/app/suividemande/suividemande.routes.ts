import { Routes } from '@angular/router';
import { SuividemandeComponent } from './suividemande.component';

export const SuividemandeRoutes: Routes = [
  {
    path: '',
    component: SuividemandeComponent,
    data: {
      title: 'Suivre une Demande',
    },
    children: [
      {
        path: '',
        component: SuividemandeComponent,
        data: {
          title: 'Suivi de Demande',
        },
      },
      {
        path: ':numeroDemande',
        component: SuividemandeComponent,
        data: {
          title: 'Détails de la Demande',
        },
      },
      {
        path: 'verification/:code',
        component: SuividemandeComponent,
        data: {
          title: 'Vérification de Demande',
        },
      },
    ]
  },
];