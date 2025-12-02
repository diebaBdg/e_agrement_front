import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { TraitementagrementComponent } from './traitementagrement/traitementagrement.component';
import { NouvelledemandeComponent } from './nouvelledemande/nouvelledemande.component';
import { SuividemandeComponent } from './suividemande/suividemande.component';
import { EspacedemandeurComponent } from './espacedemandeur/espacedemandeur.component';
import { PaiementComponent } from './paiement/paiement.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DocumentComponent } from './document/document.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent
  },
  {
    path: 'tableau-de-bord',
    component: TraitementagrementComponent
  },
  {
    path: 'nouvelle-demande',
    component: NouvelledemandeComponent
  },
  {
    path: 'suivre',
    component: SuividemandeComponent
  },
  {
    path: 'mon-espace',
    component: EspacedemandeurComponent
  },
  {
    path: 'paiement',
    component: PaiementComponent
  },
  {
    path: 'admin',
    component: AdminComponent
  },
  {
    path: 'connexion',
    component: LoginComponent
  },
  {
    path: 'inscription',
    component: RegisterComponent
  },
  {
    path: 'document',
    component: DocumentComponent
  }
];
