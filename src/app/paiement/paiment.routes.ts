import { Routes } from '@angular/router';
import { PaiementComponent } from './paiement.component';

export const PaiementRoutes: Routes = [
  {
    path: '',
    component: PaiementComponent,
    data: {
      title: 'Paiement des Frais',
    },
    children: [
      {
        path: '',
        component: PaiementComponent,
        data: {
          title: 'Effectuer un Paiement',
        },
      },
      {
        path: 'methode',
        component: PaiementComponent,
        data: {
          title: 'Choisir la Méthode de Paiement',
        },
      },
      {
        path: 'carte-bancaire',
        component: PaiementComponent,
        data: {
          title: 'Paiement par Carte Bancaire',
        },
      },
      {
        path: 'mobile-money',
        component: PaiementComponent,
        data: {
          title: 'Paiement Mobile Money',
        },
      },
      {
        path: 'virement',
        component: PaiementComponent,
        data: {
          title: 'Paiement par Virement',
        },
      },
      {
        path: 'confirmation/:id',
        component: PaiementComponent,
        data: {
          title: 'Confirmation de Paiement',
        },
      },
      {
        path: 'recu/:id',
        component: PaiementComponent,
        data: {
          title: 'Reçu de Paiement',
        },
      },
    ]
  },
];