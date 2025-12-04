import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DemandeService } from '../core/services/demande.service';
import { UserService } from '../core/services/user.service';
import { AuthService } from '../core/services/auth.service';
import { SharedHeaderComponent } from "../shared/shared-header/shared-header.component";

interface KPICard {
  label: string;
  value: number;
  subtitle: string;
  trend: string;
  icon: string;
  color: string;
}

interface User {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  role: string;
  statut: 'actif' | 'inactif' | 'suspendu';
  dateInscription: string;
  demandesTotal: number;
  avatarColor: string;
}

interface TypeDemandeStats {
  type: string;
  count: number;
  pourcentage: number;
}

interface MonthlyTrend {
  month: string;
  total: number;
  soumis: number;
  approuves: number;
  rejetes: number;
}

@Component({
  selector: 'app-admin',
  imports: [CommonModule, RouterModule, FormsModule, SharedHeaderComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  private demandeService = inject(DemandeService);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  activeTab: string = 'vue-ensemble';
  kpiCards: KPICard[] = [];
  users: User[] = [];
  searchQuery: string = '';
  selectedRole: string = 'tous';
  selectedStatut: string = 'tous';
  
  loading: boolean = true;
  error: string | null = null;
  
  demandesParType: TypeDemandeStats[] = [];
  monthlyTrends: MonthlyTrend[] = [];
  recentActivities: any[] = [];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    // Charger les statistiques globales
    this.demandeService.getStatistiquesGlobales().subscribe({
      next: (stats) => {
        const tauxApprobation = stats.totalDemandes > 0 
          ? Math.round((stats.demandesApprouvees / stats.totalDemandes) * 100) 
          : 0;

        this.kpiCards = [
          {
            label: 'Total Demandes',
            value: stats.totalDemandes,
            subtitle: 'Toutes les demandes',
            trend: '↑',
            icon: '📊',
            color: 'gray'
          },
          {
            label: 'En Cours',
            value: stats.demandesEnCours,
            subtitle: 'Demandes en traitement',
            trend: '',
            icon: '⏰',
            color: 'orange'
          },
          {
            label: 'Approuvées',
            value: stats.demandesApprouvees,
            subtitle: 'Demandes validées',
            trend: '↑',
            icon: '✓',
            color: 'green'
          },
          {
            label: 'Taux d\'Approbation',
            value: tauxApprobation,
            subtitle: 'Des demandes',
            trend: '↑',
            icon: '📈',
            color: 'green'
          }
        ];

        // Générer les statistiques par type (simulé)
        this.generateTypeStats(stats);
        
        // Générer les tendances mensuelles (simulé)
        this.generateMonthlyTrends(stats);

        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des statistiques:', err);
        this.error = 'Impossible de charger les statistiques';
        this.loading = false;
      }
    });

    // Charger les utilisateurs
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users.map(user => ({
          id: user.id,
          nom: user.fullName,
          email: user.email,
          telephone: user.phone,
          role: this.getRoleLabel(user.roles),
          statut: this.mapStatus(user.status),
          dateInscription: this.formatDate(user.dateCreation),
          demandesTotal: user.totalAssigned || 0,
          avatarColor: this.generateAvatarColor(user.fullName)
        }));

        // Mettre à jour le KPI des utilisateurs
        const userKpi = this.kpiCards.find(k => k.label === 'Utilisateurs');
        if (userKpi) {
          userKpi.value = this.users.filter(u => u.statut === 'actif').length;
        } else {
          this.kpiCards.push({
            label: 'Utilisateurs',
            value: this.users.filter(u => u.statut === 'actif').length,
            subtitle: 'Utilisateurs actifs',
            trend: '↑',
            icon: '👥',
            color: 'blue'
          });
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs:', err);
      }
    });
  }

  generateTypeStats(stats: any): void {
    const total = stats.totalDemandes || 1;
    
    // Simulation des types (à remplacer par des vraies données de l'API)
    this.demandesParType = [
      {
        type: 'Médecine',
        count: Math.round(stats.totalDemandes * 0.3),
        pourcentage: 30
      },
      {
        type: 'Pharmacie',
        count: Math.round(stats.totalDemandes * 0.25),
        pourcentage: 25
      },
      {
        type: 'Laboratoires',
        count: Math.round(stats.totalDemandes * 0.2),
        pourcentage: 20
      },
      {
        type: 'Établissements Scolaires',
        count: Math.round(stats.totalDemandes * 0.15),
        pourcentage: 15
      },
      {
        type: 'Hôtellerie',
        count: Math.round(stats.totalDemandes * 0.1),
        pourcentage: 10
      }
    ];
  }

  generateMonthlyTrends(stats: any): void {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'];
    
    this.monthlyTrends = months.map(month => {
      const total = Math.floor(Math.random() * 50) + 20;
      const soumis = Math.floor(total * 0.4);
      const approuves = Math.floor(total * 0.35);
      const rejetes = total - soumis - approuves;
      
      return {
        month,
        total,
        soumis,
        approuves,
        rejetes
      };
    });
  }

  getBarWidth(count: number): number {
    const max = Math.max(...this.demandesParType.map(d => d.count));
    return max > 0 ? (count / max) * 100 : 0;
  }

  getSoumisPercentage(trend: MonthlyTrend): number {
    return trend.total > 0 ? (trend.soumis / trend.total) * 100 : 0;
  }

  getApprouvesPercentage(trend: MonthlyTrend): number {
    return trend.total > 0 ? (trend.approuves / trend.total) * 100 : 0;
  }

  getRejetesPercentage(trend: MonthlyTrend): number {
    return trend.total > 0 ? (trend.rejetes / trend.total) * 100 : 0;
  }

  get filteredUsers(): User[] {
    let filtered = this.users;

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        user.nom.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.telephone.includes(query)
      );
    }

    if (this.selectedRole !== 'tous') {
      filtered = filtered.filter(user => user.role === this.selectedRole);
    }

    if (this.selectedStatut !== 'tous') {
      filtered = filtered.filter(user => user.statut === this.selectedStatut);
    }

    return filtered;
  }

  onTabClick(tab: string): void {
    this.activeTab = tab;
  }

  onUserAction(userId: string, action: string): void {
    switch(action) {
      case 'edit':
        console.log('Modifier utilisateur:', userId);
        alert('Fonctionnalité de modification en cours de développement');
        break;
      case 'view':
        console.log('Voir utilisateur:', userId);
        alert('Fonctionnalité de visualisation en cours de développement');
        break;
      case 'suspend':
        this.suspendUser(userId);
        break;
      case 'activate':
        this.activateUser(userId);
        break;
      case 'delete':
        this.deleteUser(userId);
        break;
    }
  }

  suspendUser(userId: string): void {
    if (confirm('Êtes-vous sûr de vouloir suspendre cet utilisateur ?')) {
      this.userService.suspendUser(userId).subscribe({
        next: () => {
          alert('Utilisateur suspendu avec succès');
          this.loadUsers();
        },
        error: (err) => {
          console.error('Erreur lors de la suspension:', err);
          alert('Erreur lors de la suspension de l\'utilisateur');
        }
      });
    }
  }

  activateUser(userId: string): void {
    this.userService.activateUser(userId).subscribe({
      next: () => {
        alert('Utilisateur activé avec succès');
        this.loadUsers();
      },
      error: (err) => {
        console.error('Erreur lors de l\'activation:', err);
        alert('Erreur lors de l\'activation de l\'utilisateur');
      }
    });
  }

  deleteUser(userId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          alert('Utilisateur supprimé avec succès');
          this.loadUsers();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          alert('Erreur lors de la suppression de l\'utilisateur');
        }
      });
    }
  }

  getStatusColor(statut: string): string {
    const colors: { [key: string]: string } = {
      'actif': 'green',
      'inactif': 'gray',
      'suspendu': 'red'
    };
    return colors[statut] || 'gray';
  }

  getStatusLabel(statut: string): string {
    const labels: { [key: string]: string } = {
      'actif': 'Actif',
      'inactif': 'Inactif',
      'suspendu': 'Suspendu'
    };
    return labels[statut] || statut;
  }

  getRoleColor(role: string): string {
    return role === 'Instructeur' ? 'blue' : 'gray';
  }

  getInitials(nom: string): string {
    return nom
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  // Méthodes utilitaires privées
  private getRoleLabel(roles: any[]): string {
    if (!roles || roles.length === 0) return 'Demandeur';
    const role = roles[0];
    return role.libelle || role.code || 'Demandeur';
  }

  private mapStatus(status: string): 'actif' | 'inactif' | 'suspendu' {
    const statusMap: { [key: string]: 'actif' | 'inactif' | 'suspendu' } = {
      'ACTIF': 'actif',
      'INACTIF': 'inactif',
      'SUSPENDU': 'suspendu'
    };
    return statusMap[status] || 'inactif';
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  private generateAvatarColor(name: string): string {
    const colors = ['#d1fae5', '#fef3c7', '#fee2e2', '#dbeafe', '#e0e7ff', '#fce7f3'];
    const index = name.length % colors.length;
    return colors[index];
  }
}