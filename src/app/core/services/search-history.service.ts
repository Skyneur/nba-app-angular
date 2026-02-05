import { Injectable, signal, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SearchHistoryService {
  private readonly STORAGE_KEY = 'nba_search_history';
  private readonly MAX_HISTORY = 5;
  
  history = signal<string[]>([]);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.history.set(this.loadFromStorage());
    }
  }

  private loadFromStorage(): string[] {
    if (!isPlatformBrowser(this.platformId)) {
      return [];
    }
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erreur chargement historique:', error);
      return [];
    }
  }

  private saveToStorage(history: string[]): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Erreur sauvegarde historique:', error);
    }
  }

  addSearch(term: string): void {
    const trimmed = term.trim();
    if (!trimmed || trimmed.length < 2) return;

    const current = this.history();
    
    // Retirer le terme s'il existe déjà
    const filtered = current.filter(t => t.toLowerCase() !== trimmed.toLowerCase());
    
    // Ajouter en première position
    const updated = [trimmed, ...filtered].slice(0, this.MAX_HISTORY);
    
    this.history.set(updated);
    this.saveToStorage(updated);
  }

  getHistory(): string[] {
    return this.history();
  }

  clearHistory(): void {
    this.history.set([]);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  removeItem(term: string): void {
    const current = this.history();
    const updated = current.filter(t => t !== term);
    this.history.set(updated);
    this.saveToStorage(updated);
  }
}
