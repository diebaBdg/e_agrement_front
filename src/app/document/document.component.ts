import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { SharedHeaderComponent } from "../shared/shared-header/shared-header.component";

interface CertificateData {
  numeroCertificat: string;
  nomComplet: string;
  etablissement: string;
  adresse: string;
  domaine: string;
  dateApprobation: string;
  dateExpiration: string;
  directeur: string;
  titreDirecteur: string;
}

@Component({
  selector: 'app-document',
  imports: [CommonModule, RouterModule, SharedHeaderComponent],
  templateUrl: './document.component.html',
  styleUrl: './document.component.css'
})
export class DocumentComponent implements OnInit {
  certificateData: CertificateData | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer les données du certificat depuis les query params ou un service
    this.route.queryParams.subscribe(params => {
      if (params['numero']) {
        // En production, récupérer depuis un service
        this.loadCertificateData(params['numero']);
      } else {
        // Données de test par défaut
        this.certificateData = {
          numeroCertificat: 'SN-AGR-2024-001',
          nomComplet: 'Dr. Awa Ndiaye',
          etablissement: 'Cabinet Médical Ndiaye',
          adresse: 'Avenue Cheikh Anta Diop, Dakar, Sénégal',
          domaine: 'MÉDECINE',
          dateApprobation: '15 Janvier 2024',
          dateExpiration: '15 Janvier 2027',
          directeur: 'Dr. Ibrahima Sy',
          titreDirecteur: 'Directeur des Agréments'
        };
      }
    });
  }

  loadCertificateData(numero: string): void {
    // En production, charger depuis un service API
    // Pour l'instant, utiliser des données de test
    this.certificateData = {
      numeroCertificat: numero,
      nomComplet: 'Dr. Awa Ndiaye',
      etablissement: 'Cabinet Médical Ndiaye',
      adresse: 'Avenue Cheikh Anta Diop, Dakar, Sénégal',
      domaine: 'MÉDECINE',
      dateApprobation: '15 Janvier 2024',
      dateExpiration: '15 Janvier 2027',
      directeur: 'Dr. Ibrahima Sy',
      titreDirecteur: 'Directeur des Agréments'
    };
  }

  onPrint(): void {
    window.print();
  }

  onShare(): void {
    if (navigator.share && this.certificateData) {
      navigator.share({
        title: 'Certificat d\'Agrément',
        text: `Certificat d'agrément ${this.certificateData.numeroCertificat}`,
        url: window.location.href
      }).catch(err => console.log('Erreur de partage:', err));
    } else {
      // Fallback: copier le lien dans le presse-papier
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papier !');
    }
  }

  onDownloadPDF(): void {
    // En production, télécharger le PDF depuis le serveur
    alert('Téléchargement du PDF en cours...');
    // window.open(`/api/certificates/${this.certificateData?.numeroCertificat}/pdf`, '_blank');
  }

  onVerify(): void {
    // Rediriger vers la page de vérification
    this.router.navigate(['/verifier'], {
      queryParams: { numero: this.certificateData?.numeroCertificat }
    });
  }
}
