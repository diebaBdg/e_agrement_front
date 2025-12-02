import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  options?: string;
}

@Component({
  selector: 'app-paiement',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './paiement.component.html',
  styleUrl: './paiement.component.css'
})
export class PaiementComponent implements OnInit {
  selectedPaymentMethod: string = 'carte';
  demandeId: string = '';
  demandeType: string = 'Médecine';
  fraisDossier: number = 50000;
  fraisTraitement: number = 0;
  
  paymentMethods: PaymentMethod[] = [
    {
      id: 'carte',
      name: 'Carte Bancaire',
      icon: '💳',
      description: 'Visa, Mastercard',
      options: 'Visa, Mastercard'
    },
    {
      id: 'mobile',
      name: 'Mobile Money',
      icon: '📱',
      description: 'Orange Money, Wave, Free Money',
      options: 'Orange Money, Wave, Free Money'
    },
    {
      id: 'virement',
      name: 'Virement Bancaire',
      icon: '🏦',
      description: 'Paiement par virement',
      options: 'Paiement par virement'
    }
  ];

  cardDetails = {
    cardNumber: '1234 5678 9012 3456',
    expirationDate: '',
    cvv: '123',
    cardName: 'AMADOU DIALLO'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID de la demande depuis les paramètres de route
    this.route.queryParams.subscribe(params => {
      this.demandeId = params['id'] || 'def456';
      this.demandeType = params['type'] || 'Médecine';
    });
  }

  get total(): number {
    return this.fraisDossier + this.fraisTraitement;
  }

  selectPaymentMethod(methodId: string): void {
    this.selectedPaymentMethod = methodId;
  }

  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    this.cardDetails.cardNumber = formattedValue;
  }

  formatExpirationDate(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.cardDetails.expirationDate = value;
  }

  onSubmit(): void {
    if (this.validateForm()) {
      console.log('Paiement en cours...', {
        demandeId: this.demandeId,
        method: this.selectedPaymentMethod,
        amount: this.total,
        cardDetails: this.selectedPaymentMethod === 'carte' ? this.cardDetails : null
      });
      
      // Simuler le paiement
      alert(`Paiement de ${this.total.toLocaleString()} XOF effectué avec succès !`);
      
      // Rediriger vers la page de confirmation ou le tableau de bord
      this.router.navigate(['/mon-espace']);
    }
  }

  validateForm(): boolean {
    if (this.selectedPaymentMethod === 'carte') {
      if (!this.cardDetails.cardNumber || this.cardDetails.cardNumber.length < 19) {
        alert('Veuillez entrer un numéro de carte valide');
        return false;
      }
      if (!this.cardDetails.expirationDate || this.cardDetails.expirationDate.length < 5) {
        alert('Veuillez entrer une date d\'expiration valide');
        return false;
      }
      if (!this.cardDetails.cvv || this.cardDetails.cvv.length < 3) {
        alert('Veuillez entrer un CVV valide');
        return false;
      }
      if (!this.cardDetails.cardName) {
        alert('Veuillez entrer le nom sur la carte');
        return false;
      }
    }
    return true;
  }

  onCancel(): void {
    if (confirm('Êtes-vous sûr de vouloir annuler le paiement ?')) {
      this.router.navigate(['/mon-espace']);
    }
  }
}
