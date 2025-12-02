import { Routes } from '@angular/router';
import { LoginComponent } from '../app/login/login.component';
import { RegisterComponent } from '../app/register/register.component';

export const AuthRoutes: Routes = [
  {
    path: 'connexion',
    component: LoginComponent,
    data: {
      title: 'Connexion',
    },
  },
  {
    path: 'inscription',
    component: RegisterComponent,
    data: {
      title: 'Inscription',
    },
  },
  {
    path: 'mot-de-passe-oublie',
    component: LoginComponent,
    data: {
      title: 'Mot de passe oublié',
    },
  },
  {
    path: 'reinitialiser-mot-de-passe',
    component: LoginComponent,
    data: {
      title: 'Réinitialiser le mot de passe',
    },
  },
  {
    path: 'verification-email',
    component: RegisterComponent,
    data: {
      title: 'Vérification de l\'email',
    },
  },
];