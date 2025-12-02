import { Routes } from '@angular/router';
import { EspacedemandeurComponent } from './espacedemandeur.component';

export const EspacedemandeurRoutes: Routes = [
  {
    path: '',
    component: EspacedemandeurComponent,
    data: {
      title: 'Mon Espace Demandeur',
    },
    children: [
      {
        path: '',
        component: EspacedemandeurComponent,
        data: {
          title: 'Tableau de Bord',
        },
      },
      {
        path: 'mes-demandes',
        component: EspacedemandeurComponent,
        data: {
          title: 'Mes Demandes',
        },
      },
      {
        path: 'nouvelle-demande',
        component: EspacedemandeurComponent,
        data: {
          title: 'Nouvelle Demande',
        },
      },
      {
        path: 'demande/:id',
        component: EspacedemandeurComponent,
        data: {
          title: 'Détails de la Demande',
        },
      },
      {
        path: 'profil',
        component: EspacedemandeurComponent,
        data: {
          title: 'Mon Profil',
        },
      },
      {
        path: 'documents/:demandeId',
        component: EspacedemandeurComponent,
        data: {
          title: 'Documents de la Demande',
        },
      },
      {
        path: 'historique',
        component: EspacedemandeurComponent,
        data: {
          title: 'Historique des Demandes',
        },
      },
    ]
  },
];