import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DemandeService } from '../core/services/demande.service';
import { TypeAgrementService } from '../core/services/type-agrement.service';
import { DocumentService } from '../core/services/document.service';
import { AuthService } from '../core/services/auth.service';
import { UserService } from '../core/services/user.service'; // AJOUTER CET IMPORT
import { SharedHeaderComponent } from "../shared/shared-header/shared-header.component";

@Component({
  selector: 'app-nouvelledemande',
  imports: [CommonModule, RouterModule, FormsModule, SharedHeaderComponent],
  templateUrl: './nouvelledemande.component.html',
  styleUrl: './nouvelledemande.component.css'
})
export class NouvelledemandeComponent implements OnInit {
  private demandeService = inject(DemandeService);
  private typeAgrementService = inject(TypeAgrementService);
  private documentService = inject(DocumentService);
  private authService = inject(AuthService);
  private userService = inject(UserService); // AJOUTER CE SERVICE
  private router = inject(Router);

  currentStep: number = 1;
  totalSteps: number = 4;
  loading: boolean = false;
  loadingTypes: boolean = false;
  loadingUser: boolean = false;
  errorMessage: string = '';
  isAuthenticated: boolean = false;

  agrementTypes: any[] = [];

  formData: any = {
    typeAgrementId: '',
    nomCompletDemandeur: '',
    emailDemandeur: '',
    telephoneDemandeur: '',
    nomEtablissement: '',
    adresseEtablissement: '',
    descriptionActivite: '',
    documentsPaths: []
  };

  selectedFiles: File[] = [];
  uploadedDocuments: string[] = [];
  createdDemandeId: string = '';

  ngOnInit(): void {
    this.loadTypesAgrement();
    this.checkAuthentication();
  }

  checkAuthentication(): void {
    const user = this.authService.getUser();
    this.isAuthenticated = !!user;
    
    if (this.isAuthenticated && user) {
      // Pré-remplir les informations de base du demandeur
      this.formData.nomCompletDemandeur = user.fullName || user.username || '';
      this.formData.emailDemandeur = user.email || '';
      
      // Récupérer les détails complets de l'utilisateur pour le téléphone
      if (user.id) {
        this.loadUserDetails(user.id);
      }
    }
  }

  loadUserDetails(userId: string): void {
    this.loadingUser = true;
    this.userService.getUserById(userId).subscribe({
      next: (userDetails) => {
        // Utiliser les données complètes de l'utilisateur
        this.formData.nomCompletDemandeur = userDetails.fullName || userDetails.username || '';
        this.formData.emailDemandeur = userDetails.email || '';
        this.formData.telephoneDemandeur = userDetails.phone || userDetails.phone || '';
        this.loadingUser = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des détails utilisateur:', err);
        // Continuer avec les données de base du token
        this.loadingUser = false;
      }
    });
  }

  loadTypesAgrement(): void {
    this.loadingTypes = true;
    this.typeAgrementService.getTypesAgrement().subscribe({
      next: (types) => {
        this.agrementTypes = types.filter(t => t.actif);
        console.log('Types chargés:', this.agrementTypes);
        this.loadingTypes = false;
      },
      error: (err) => {
        console.error('Erreur chargement types:', err);
        this.errorMessage = 'Impossible de charger les types d\'agrément';
        this.loadingTypes = false;
      }
    });
  }

  get progress(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps && this.isStepValid(this.currentStep)) {
      this.currentStep++;
      this.errorMessage = '';
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.errorMessage = '';
    }
  }

  goToStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps) {
      // Vérifier que toutes les étapes précédentes sont valides
      let canGoToStep = true;
      for (let i = 1; i < step; i++) {
        if (!this.isStepValid(i)) {
          canGoToStep = false;
          break;
        }
      }
      
      if (canGoToStep || step < this.currentStep) {
        this.currentStep = step;
        this.errorMessage = '';
      }
    }
  }

  // Méthode pour obtenir le libellé du type d'agrément
  getTypeAgrementLibelle(typeId: string): string {
    const type = this.agrementTypes.find(t => t.id === typeId);
    return type ? type.libelle : '';
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Vérifier la taille (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert(`Le fichier ${file.name} dépasse la taille maximale de 10MB`);
          continue;
        }

        // Vérifier le type
        const allowedTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/jpeg',
          'image/jpg',
          'image/png'
        ];

        if (!allowedTypes.includes(file.type)) {
          alert(`Le fichier ${file.name} n'est pas d'un type accepté`);
          continue;
        }

        this.selectedFiles.push(file);
      }
    }
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      const fileArray = Array.from(files);
      fileArray.forEach(file => {
        if (file.size <= 10 * 1024 * 1024) {
          this.selectedFiles.push(file);
        } else {
          alert(`Le fichier ${file.name} dépasse la taille maximale de 10MB`);
        }
      });
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  async onSubmit(): Promise<void> {
    if (!this.isStepValid(this.currentStep)) {
      this.errorMessage = 'Veuillez remplir tous les champs requis';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      // Étape 1: Créer la demande
      const demande = await this.createDemande();
      
      if (!demande || !demande.id) {
        throw new Error('Erreur lors de la création de la demande');
      }

      this.createdDemandeId = demande.id;

      // Étape 2: Uploader les documents
      if (this.selectedFiles.length > 0) {
        await this.uploadDocuments(demande.id);
      }

      // Succès
      this.loading = false;
      alert(`Demande créée avec succès !\nNuméro de suivi: ${demande.numeroDemande}\n\nVous pouvez suivre votre demande avec ce numéro.`);
      
      // Redirection
      const user = this.authService.getUser();
      if (user) {
        this.router.navigate(['/mon-espace']);
      } else {
        this.router.navigate(['/suivre'], {
          queryParams: { numero: demande.numeroDemande }
        });
      }

    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      this.loading = false;
      this.errorMessage = 'Une erreur est survenue lors de la soumission. Veuillez réessayer.';
    }
  }

  private createDemande(): Promise<any> {
    return new Promise((resolve, reject) => {
      const user = this.authService.getUser();
      
      const demandeRequest = {
        typeAgrementId: this.formData.typeAgrementId,
        nomCompletDemandeur: this.formData.nomCompletDemandeur,
        emailDemandeur: this.formData.emailDemandeur,
        telephoneDemandeur: this.formData.telephoneDemandeur,
        nomEtablissement: this.formData.nomEtablissement,
        adresseEtablissement: this.formData.adresseEtablissement,
        descriptionActivite: this.formData.descriptionActivite,
        documentsPaths: []
      };

      // Si l'utilisateur est connecté
      if (user && user.id) {
        this.demandeService.createDemande(user.id, demandeRequest).subscribe({
          next: (demande) => resolve(demande),
          error: (err) => reject(err)
        });
      } else {
        // Demande publique
        this.demandeService.createDemandePublic(demandeRequest).subscribe({
          next: (demande) => resolve(demande),
          error: (err) => reject(err)
        });
      }
    });
  }

  private async uploadDocuments(demandeId: string): Promise<void> {
    const uploadPromises = this.selectedFiles.map(file => {
      return new Promise((resolve, reject) => {
        this.documentService.uploadDocument(demandeId, 'JUSTIFICATIF', file).subscribe({
          next: (doc) => {
            this.uploadedDocuments.push(doc.cheminStockage);
            resolve(doc);
          },
          error: (err) => {
            console.error('Erreur upload document:', err);
            reject(err);
          }
        });
      });
    });

    try {
      await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Erreur lors de l\'upload des documents:', error);
      throw error;
    }
  }

  onCancel(): void {
    if (confirm('Êtes-vous sûr de vouloir annuler ? Toutes les données seront perdues.')) {
      this.router.navigate(['/']);
    }
  }

  isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        return !!this.formData.typeAgrementId;
      case 2:
        return !!(
          this.formData.nomCompletDemandeur &&
          this.formData.emailDemandeur &&
          this.formData.telephoneDemandeur &&
          this.isValidEmail(this.formData.emailDemandeur)
        );
      case 3:
        return !!(
          this.formData.nomEtablissement &&
          this.formData.adresseEtablissement &&
          this.formData.descriptionActivite
        );
      case 4:
        return this.selectedFiles.length > 0;
      default:
        return false;
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}