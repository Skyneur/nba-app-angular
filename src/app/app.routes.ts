import { Routes } from '@angular/router';
import { playerDetailGuard } from './core/guards/player-detail.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'NBA App - Accueil'
  },
  {
    path: 'players',
    loadComponent: () => import('./features/player-list/player-list.component').then(m => m.PlayerListComponent),
    title: 'NBA App - Joueurs'
  },
  {
    path: 'players/:id',
    loadComponent: () => import('./features/player-detail/player-detail.component').then(m => m.PlayerDetailComponent),
    canActivate: [playerDetailGuard],
    title: 'NBA App - Détail Joueur'
  },
  {
    path: '404',
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'NBA App - Page non trouvée'
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];
