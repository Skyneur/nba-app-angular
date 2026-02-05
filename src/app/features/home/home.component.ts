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
      description: 'Trouvez rapidement vos joueurs préférés avec notre système de recherche en temps réel.'
    },
    {
      icon: 'bi-person-badge',
      title: 'Profils détaillés',
      description: 'Consultez toutes les informations sur les joueurs NBA : position, équipe, statistiques, etc.'
    },
    {
      icon: 'bi-trophy',
      title: 'Toutes les équipes',
      description: 'Accédez aux 30 équipes NBA avec leurs joueurs et informations complètes.'
    },
    {
      icon: 'bi-lightning',
      title: 'Temps réel',
      description: 'Des données à jour grâce à l\'API balldontlie.io.'
    }
  ];
}
