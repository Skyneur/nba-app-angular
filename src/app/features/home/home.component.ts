import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  features = [
    {
      icon: 'bi-search',
      title: 'Recherche avancée',
      description: 'Trouvez rapidement vos joueurs préférés avec notre système de recherche instantanée.'
    },
    {
      icon: 'bi-sort-down',
      title: 'Tri puissant',
      description: 'Triez les joueurs par nom, équipe, position ou nationalité en un clic.'
    },
    {
      icon: 'bi-person-badge',
      title: 'Profils détaillés',
      description: 'Consultez les informations complètes : position, équipe, taille, poids, nationalité.'
    },
    {
      icon: 'bi-grid-3x3',
      title: 'Pagination optimisée',
      description: 'Navigation fluide avec 12 joueurs par page pour une expérience optimale.'
    }
  ];
}
