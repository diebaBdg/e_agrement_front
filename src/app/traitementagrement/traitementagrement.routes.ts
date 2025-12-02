import { Routes } from '@angular/router';
import { TraitementagrementComponent } from './traitementagrement.component';

export const TraitementagrementRoutes: Routes = [
  {
    path: '',
    component: TraitementagrementComponent,
    data: {
      title: 'Traitement des Agréments',
    },
    children: [
      {
        path: '',
        component: TraitementagrementComponent,
        data: {
          title: 'Tableau de Bord Instructeur',
        },
      },
      {
        path: 'demandes',
        component: TraitementagrementComponent,
        data: {
          title: 'Liste des Demandes',
        },
      },
      {
        path: 'demandes/:id',
        component: TraitementagrementComponent,
        data: {
          title: 'Examiner la Demande',
        },
      },
      {
        path: 'demandes/:id/approuver',
        component: TraitementagrementComponent,
        data: {
          title: 'Approuver la Demande',
        },
      },
      {
        path: 'demandes/:id/rejeter',
        component: TraitementagrementComponent,
        data: {
          title: 'Rejeter la Demande',
        },
      },
      {
        path: 'statistiques',
        component: TraitementagrementComponent,
        data: {
          title: 'Statistiques Instructeur',
        },
      },
      {
        path: 'mes-demandes',
        component: TraitementagrementComponent,
        data: {
          title: 'Mes Demandes Assignées',
        },
      },
    ]
  },
];