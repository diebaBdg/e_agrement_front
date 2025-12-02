import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  nomComplet: string = '';
  email: string = '';
  telephone: string = '';
  password: string = '';
  confirmPassword: string = '';
  acceptTerms: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  loading: boolean = false;
  errorMessage: string = '';

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const nameParts = this.nomComplet.trim().split(' ');
    const prenom = nameParts[0] || '';
    const nom = nameParts.slice(1).join(' ') || nameParts[0];

    this.authService.register({
      nom: nom,
      prenom: prenom,
      email: this.email,
      phone: this.telephone,
      password: this.password,
      confirmPassword: this.confirmPassword
    }).subscribe({
      next: (response) => {
        console.log('Inscription réussie:', response);
        this.loading = false;
        
        alert('Inscription réussie ! Vous pouvez maintenant vous connecter avec votre login: ' + response.login);
        
        this.router.navigate(['/connexion']);
      },
      error: (error) => {
        console.error('Erreur d\'inscription:', error);
        this.loading = false;
        
        if (error.status === 400) {
          if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Données invalides. Veuillez vérifier vos informations';
          }
        } else if (error.status === 409) {
          this.errorMessage = 'Cet email est déjà utilisé';
        } else if (error.status === 0) {
          this.errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet';
        } else {
          this.errorMessage = 'Une erreur est survenue. Veuillez réessayer';
        }
      }
    });
  }

  validateForm(): boolean {
    if (!this.nomComplet || this.nomComplet.trim().length < 3) {
      this.errorMessage = 'Veuillez entrer votre nom complet (minimum 3 caractères)';
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email || !emailRegex.test(this.email)) {
      this.errorMessage = 'Veuillez entrer une adresse email valide';
      return false;
    }

    const phoneRegex = /^(\+221)?[0-9]{9,}$/;
    if (!this.telephone || !phoneRegex.test(this.telephone.replace(/\s/g, ''))) {
      this.errorMessage = 'Veuillez entrer un numéro de téléphone valide (ex: +221 77 123 4567)';
      return false;
    }

    if (!this.password || this.password.length < 8) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 8 caractères';
      return false;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return false;
    }

    if (!this.acceptTerms) {
      this.errorMessage = 'Veuillez accepter les conditions d\'utilisation';
      return false;
    }

    return true;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}