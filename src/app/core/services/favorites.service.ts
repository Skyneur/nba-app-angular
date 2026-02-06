import { Injectable, signal, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Player } from '../../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'nba_favorites';
  
  favorites = signal<Player[]>([]);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.favorites.set(this.loadFromStorage());
    }
  }

  private loadFromStorage(): Player[] {
    if (!isPlatformBrowser(this.platformId)) {
      return [];
    }
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return [];
      
      const parsed = JSON.parse(data);
      
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.removeItem(this.STORAGE_KEY);
        return [];
      }
      
      const validPlayers = parsed.filter(p => p && typeof p === 'object' && p.idPlayer);
      
      if (validPlayers.length === 0) {
        localStorage.removeItem(this.STORAGE_KEY);
        return [];
      }
      
      if (validPlayers.length !== parsed.length) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(validPlayers));
      }
      
      return validPlayers;
    } catch (error) {
      console.error('Erreur chargement favoris:', error);
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
