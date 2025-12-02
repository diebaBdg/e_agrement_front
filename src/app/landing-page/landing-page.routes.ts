import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page.component';

export const LandingPageRoutes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    data: {
      title: 'Accueil - Agréments Sénégal',
    },
    children: [
      {
        path: '',
        component: LandingPageComponent,
        data: {
          title: 'Page d\'Accueil',
        },
      },
      {
        path: 'a-propos',
        component: LandingPageComponent,
        data: {
          title: 'À Propos',
        },
      },
      {
        path: 'services',
        component: LandingPageComponent,
        data: {
          title: 'Nos Services',
        },
      },
      {
        path: 'aide',
        component: LandingPageComponent,
        data: {
          title: 'Centre d\'Aide',
        },
      },
      {
        path: 'contact',
        component: LandingPageComponent,
        data: {
          title: 'Nous Contacter',
        },
      },
      {
        path: 'faq',
        component: LandingPageComponent,
        data: {
          title: 'Questions Fréquentes',
        },
      },
    ]
  },
];