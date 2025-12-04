import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-shared-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <div class="header-container">
        <div class="logo-section" routerLink="/" style="cursor: pointer;">
          <div class="logo-icon">✓</div>
          <div class="logo-text">
            <h1 class="logo-title">Agréments Sénégal</h1>
            <p class="logo-subtitle">République du Sénégal</p>
          </div>
        </div>
        
        <nav class="nav-menu">
          <a routerLink="/" class="nav-link" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Accueil</a>
          
          <!-- Liens publics (visible uniquement si non connecté) -->
          <ng-container *ngIf="!isAuthenticated">
            <a routerLink="/nouvelle-demande" class="nav-link" routerLinkActive="active">Nouvelle Demande</a>
            <a routerLink="/suivre" class="nav-link" routerLinkActive="active">Suivre</a>
          </ng-container>
          
          <!-- Liens pour Demandeur -->
          <ng-container *ngIf="isAuthenticated && userRole === 'DEMANDEUR'">
            <a routerLink="/mon-espace" class="nav-link" routerLinkActive="active">Mon Espace</a>
            <a routerLink="/nouvelle-demande" class="nav-link" routerLinkActive="active">Nouvelle Demande</a>
          </ng-container>
          
          <!-- Liens pour Instructeur -->
          <ng-container *ngIf="isAuthenticated && userRole === 'INSTRUCTEUR'">
            <a routerLink="/tableau-de-bord" class="nav-link" routerLinkActive="active">Mes Demandes</a>
          </ng-container>
          
          <!-- Liens pour Admin -->
          <ng-container *ngIf="isAuthenticated && userRole === 'ADMIN'">
            <a routerLink="/admin" class="nav-link" routerLinkActive="active">Administration</a>
          </ng-container>
        </nav>
        
        <div class="header-actions">
          <!-- Actions si non connecté -->
          <ng-container *ngIf="!isAuthenticated">
            <a routerLink="/connexion" class="btn-link">Connexion</a>
            <a routerLink="/inscription" class="btn-secondary">S'inscrire</a>
            <a routerLink="/nouvelle-demande" class="btn-primary">Nouvelle Demande</a>
          </ng-container>
          
          <!-- Actions si connecté -->
          <ng-container *ngIf="isAuthenticated">
            <div class="user-info">
              <span class="user-name">{{ userName }}</span>
              <span class="user-role">{{ userRoleLabel }}</span>
            </div>
            <button class="btn-logout" (click)="onLogout()">
              Déconnexion
            </button>
          </ng-container>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: #ffffff;
      padding: 1rem 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-container {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo-icon {
      width: 45px;
      height: 45px;
      background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 1.25rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .logo-title {
      font-size: 1.25rem;
      font-weight: bold;
      color: #1f2937;
      margin: 0;
    }

    .logo-subtitle {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }

    .nav-menu {
      display: flex;
      gap: 2rem;
      flex: 1;
      justify-content: center;
    }

    .nav-link {
      text-decoration: none;
      color: #1f2937;
      font-weight: 500;
      transition: all 0.3s ease;
      position: relative;
      padding: 0.5rem 0;
    }

    .nav-link.active {
      color: #0d9488;
      font-weight: 600;
    }

    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, #0d9488, #5eead4);
    }

    .nav-link:hover {
      color: #0d9488;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      padding: 0.5rem 1rem;
      background: #f0fdfa;
      border-radius: 8px;
    }

    .user-name {
      font-weight: 600;
      color: #0d9488;
      font-size: 0.95rem;
    }

    .user-role {
      font-size: 0.75rem;
      color: #6b7280;
      text-transform: uppercase;
    }

    .btn-link {
      text-decoration: none;
      color: #1f2937;
      font-weight: 500;
      transition: all 0.3s ease;
      padding: 0.5rem 1rem;
    }

    .btn-link:hover {
      color: #0d9488;
    }

    .btn-secondary {
      padding: 0.5rem 1.25rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      text-decoration: none;
      color: #1f2937;
      font-weight: 500;
      background: #ffffff;
      transition: all 0.3s ease;
    }

    .btn-secondary:hover {
      border-color: #0d9488;
      color: #0d9488;
    }

    .btn-primary {
      padding: 0.5rem 1.25rem;
      background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
      color: white;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
      border: none;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    .btn-logout {
      padding: 0.5rem 1.25rem;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-logout:hover {
      background: #dc2626;
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .header-container {
        flex-direction: column;
        gap: 1rem;
      }

      .nav-menu {
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
      }

      .header-actions {
        flex-direction: column;
        width: 100%;
      }
    }
  `]
})
export class SharedHeaderComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  isAuthenticated: boolean = false;
  userName: string = '';
  userRole: string = '';
  userRoleLabel: string = '';

  ngOnInit(): void {
    this.checkAuthentication();
  }

  checkAuthentication(): void {
    const user = this.authService.getUser();
    this.isAuthenticated = !!user;
    
    if (this.isAuthenticated && user) {
      this.userName = user.fullName || user.username;
      
      // Déterminer le rôle principal
      if (user.roles && user.roles.length > 0) {
        const role = user.roles[0];
        this.userRole = role.replace('ROLE_', '');
        this.userRoleLabel = this.getRoleLabel(this.userRole);
      }
    }
  }

  getRoleLabel(role: string): string {
    const roleLabels: { [key: string]: string } = {
      'DEMANDEUR': 'Demandeur',
      'INSTRUCTEUR': 'Instructeur',
      'ADMIN': 'Administrateur',
      'ADMINISTRATEUR': 'Administrateur'
    };
    return roleLabels[role] || role;
  }

  onLogout(): void {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      this.authService.logout();
      this.router.navigate(['/']);
      window.location.reload(); // Recharger la page pour réinitialiser l'état
    }
  }
}