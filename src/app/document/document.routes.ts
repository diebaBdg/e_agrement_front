import { Routes } from '@angular/router';
import { DocumentComponent } from './document.component';

export const DocumentRoutes: Routes = [
  {
    path: '',
    component: DocumentComponent,
    data: {
      title: 'Certificat d\'Agrément',
    },
    children: [
      {
        path: '',
        component: DocumentComponent,
        data: {
          title: 'Visualisation du Certificat',
        },
      },
      {
        path: ':numeroCertificat',
        component: DocumentComponent,
        data: {
          title: 'Certificat d\'Agrément',
        },
      },
      {
        path: 'telecharger/:id',
        component: DocumentComponent,
        data: {
          title: 'Télécharger le Certificat',
        },
      },
      {
        path: 'verifier',
        component: DocumentComponent,
        data: {
          title: 'Vérification du Certificat',
        },
      },
    ]
  },
];