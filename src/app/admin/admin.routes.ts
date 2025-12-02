import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

export const AdminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    data: {
      title: 'Administration',
    },
    children: [
      {
        path: '',
        component: AdminComponent,
        data: {
          title: 'Tableau de Bord Administrateur',
        },
      },
      {
        path: 'utilisateurs',
        component: AdminComponent,
        data: {
          title: 'Gestion des Utilisateurs',
        },
      },
      {
        path: 'statistiques',
        component: AdminComponent,
        data: {
          title: 'Statistiques Globales',
        },
      },
      {
        path: 'rapports',
        component: AdminComponent,
        data: {
          title: 'Rapports',
        },
      },
      {
        path: 'parametres',
        component: AdminComponent,
        data: {
          title: 'Paramètres Système',
        },
      },
      {
        path: 'types-agrement',
        component: AdminComponent,
        data: {
          title: 'Gestion des Types d\'Agrément',
        },
      },
      {
        path: 'instructeurs',
        component: AdminComponent,
        data: {
          title: 'Gestion des Instructeurs',
        },
      },
    ]
  },
];