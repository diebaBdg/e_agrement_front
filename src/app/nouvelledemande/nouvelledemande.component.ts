import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nouvelledemande',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './nouvelledemande.component.html',
  styleUrl: './nouvelledemande.component.css'
})
export class NouvelledemandeComponent {
  currentStep: number = 1;
  totalSteps: number = 4;

  agrementTypes: string[] = [
    'Médecine',
    'Pharmacie',
    'Laboratoires',
    'Établissements Scolaires',
    'Hôtellerie',
    'Autres'
  ];

  formData: any = {
    typeAgrement: '',
    nomComplet: '',
    email: '',
    telephone: '',
    nomEtablissement: '',
    adresse: '',
    descriptionActivite: '',
    documents: []
  };

  selectedFiles: File[] = [];

  get progress(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep = step;
    }
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size <= 10 * 1024 * 1024) { // 10MB max
          this.selectedFiles.push(file);
          this.formData.documents.push(file);
        } else {
          alert(`Le fichier ${file.name} dépasse la taille maximale de 10MB`);
        }
      }
    }
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size <= 10 * 1024 * 1024) {
          this.selectedFiles.push(file);
          this.formData.documents.push(file);
        } else {
          alert(`Le fichier ${file.name} dépasse la taille maximale de 10MB`);
        }
      }
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.formData.documents.splice(index, 1);
  }

  onSubmit(): void {
    console.log('Formulaire soumis:', this.formData);
    // Logique de soumission du formulaire
    alert('Votre demande a été soumise avec succès !');
  }

  onCancel(): void {
    if (confirm('Êtes-vous sûr de vouloir annuler ? Toutes les données seront perdues.')) {
      // Rediriger vers la page d'accueil
      window.location.href = '/';
    }
  }

  isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        return !!this.formData.typeAgrement;
      case 2:
        return !!(this.formData.nomComplet && this.formData.email && this.formData.telephone);
      case 3:
        return !!(this.formData.nomEtablissement && this.formData.adresse && this.formData.descriptionActivite);
      case 4:
        return this.selectedFiles.length > 0;
      default:
        return false;
    }
  }
}
