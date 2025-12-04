import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { SharedHeaderComponent } from "../shared/shared-header/shared-header.component";

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterModule, FormsModule, SharedHeaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  showPassword: boolean = false;
  loading: boolean = false;
  errorMessage: string = '';

  onSubmit(): void {
    // Validation des champs
    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Veuillez entrer une adresse email valide';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login({
      login: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        this.authService.saveUser(response);

        console.log('Connexion réussie:', response);

        this.redirectByRole(response.roles);

        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur de connexion:', error);
        this.loading = false;
        
        if (error.status === 401) {
          this.errorMessage = 'Email ou mot de passe incorrect';
        } else if (error.status === 403) {
          this.errorMessage = 'Votre compte est désactivé. Veuillez contacter l\'administrateur';
        } else if (error.status === 0) {
          this.errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet';
        } else {
          this.errorMessage = 'Une erreur est survenue. Veuillez réessayer';
        }
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private redirectByRole(roles: string[]): void {
    if (!roles || roles.length === 0) {
      this.router.navigate(['/mon-espace']);
      return;
    }

    if (roles.includes('ADMIN') || roles.includes('ADMINISTRATEUR')) {
      this.router.navigate(['/admin']);
    } else if (roles.includes('INSTRUCTEUR')) {
      this.router.navigate(['/tableau-de-bord']);
    } else {
      this.router.navigate(['/mon-espace']);
    }
  }
}