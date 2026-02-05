import { Injectable, signal, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Player } from '../../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'nba_favorites';
  
  // Signal pour la réactivité
  favorites = signal<Player[]>([]);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const loaded = this.loadFromStorage();
      console.log('🔍 Favoris chargés:', loaded, 'Count:', loaded.length);
      this.favorites.set(loaded);
    }
  }

  private loadFromStorage(): Player[] {
    if (!isPlatformBrowser(this.platformId)) {
      return [];
    }
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      console.log('📦 localStorage raw data:', data);
      
      if (!data) {
        console.log('✅ Pas de données dans localStorage');
        return [];
      }
      
      const parsed = JSON.parse(data);
      console.log('📋 Données parsées:', parsed);
      
      // Validation stricte : doit être un tableau non vide d'objets valides
      if (!Array.isArray(parsed) || parsed.length === 0) {
        console.log('🧹 Nettoyage: tableau vide ou invalide');
        localStorage.removeItem(this.STORAGE_KEY);
        return [];
      }
      
      // Vérifier que chaque élément est un objet valide avec un idPlayer
      const validPlayers = parsed.filter(p => p && typeof p === 'object' && p.idPlayer);
      console.log('✅ Joueurs valides:', validPlayers.length, '/', parsed.length);
      
      if (validPlayers.length === 0) {
        console.log('🧹 Nettoyage: aucun joueur valide');
        localStorage.removeItem(this.STORAGE_KEY);
        return [];
      }
      
      // Si des entrées invalides ont été filtrées, mettre à jour le storage
      if (validPlayers.length !== parsed.length) {
        console.log('🔧 Mise à jour du storage avec les joueurs valides');
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(validPlayers));
      }
      
      return validPlayers;
    } catch (error) {
      console.error('❌ Erreur chargement favoris:', error);
      localStorage.removeItem(this.STORAGE_KEY);
      return [];
    }
  }

  private saveToStorage(favorites: Player[]): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Erreur sauvegarde favoris:', error);
    }
  }

  addFavorite(player: Player): void {
    const current = this.favorites();
    if (!this.isFavorite(player.idPlayer)) {
      const updated = [...current, player];
      this.favorites.set(updated);
      this.saveToStorage(updated);
    }
  }

  removeFavorite(playerId: number | string): void {
    const current = this.favorites();
    const id = typeof playerId === 'string' ? playerId : playerId.toString();
    const updated = current.filter(p => p.idPlayer !== id);
    this.favorites.set(updated);
    
    // Si plus aucun favori, nettoyer le localStorage
    if (updated.length === 0) {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    } else {
      this.saveToStorage(updated);
    }
  }

  toggleFavorite(player: Player): void {
    if (this.isFavorite(player.idPlayer)) {
      this.removeFavorite(player.idPlayer);
    } else {
      this.addFavorite(player);
    }
  }

  isFavorite(playerId: number | string): boolean {
    const id = typeof playerId === 'string' ? playerId : playerId.toString();
    return this.favorites().some(p => p.idPlayer === id);
  }

  getFavorites(): Player[] {
    return this.favorites();
  }

  clearAll(): void {
    this.favorites.set([]);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  getCount(): number {
    return this.favorites().length;
  }
}
