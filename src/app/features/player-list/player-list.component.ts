import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { NbaApiService } from '../../core/services/nba-api.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { SearchHistoryService } from '../../core/services/search-history.service';
import { Player, ApiResponse } from '../../models';
import { LoaderComponent } from '../../shared/components/loader.component';
import { ErrorMessageComponent } from '../../shared/components/error-message.component';
import { SkeletonCardComponent } from '../../shared/components/skeleton-card.component';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    LoaderComponent,
    ErrorMessageComponent,
    SkeletonCardComponent
  ],
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.css']
})
export class PlayerListComponent implements OnInit, OnDestroy, AfterViewInit {
  searchControl = new FormControl('', { nonNullable: true });
  sortControl = new FormControl('name-asc', { nonNullable: true });

  // Historique de recherche
  showHistory = false;
  dropdownStyle: any = {};
  
  // Filtre favoris
  showOnlyFavorites = false;

  players: Player[] = [];
  loading = false;
  error: string | null = null;
  
  currentPage = 1;
  totalPages = 1;
  perPage = 12;

  // Infinite scroll
  @ViewChild('scrollTrigger') scrollTrigger!: ElementRef;
  private observer?: IntersectionObserver;
  isLoadingMore = false;

  // Système de sélection pour comparaison
  selectedPlayers: Map<number, Player> = new Map();
  maxCompare = 3;

  sortOptions = [
    { value: 'name-asc', label: 'Nom (A-Z)' },
    { value: 'name-desc', label: 'Nom (Z-A)' },
    { value: 'team-asc', label: 'Équipe (A-Z)' },
    { value: 'team-desc', label: 'Équipe (Z-A)' },
    { value: 'position-asc', label: 'Position (A-Z)' },
    { value: 'nationality-asc', label: 'Nationalité (A-Z)' }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private nbaService: NbaApiService,
    public favoritesService: FavoritesService,
    private router: Router,
    public searchHistoryService: SearchHistoryService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadPlayers();
    this.setupSearch();
    this.setupSort();
  }

  ngAfterViewInit(): void {
    this.setupInfiniteScroll();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.observer?.disconnect();
  }

  private setupInfiniteScroll(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !this.isLoadingMore && this.currentPage < this.totalPages) {
          this.loadMorePlayers();
        }
      },
      { threshold: 0.5 }
    );

    if (this.scrollTrigger) {
      this.observer.observe(this.scrollTrigger.nativeElement);
    }
  }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(searchTerm => {
        console.log('🔍 Recherche:', searchTerm);
        
        this.currentPage = 1;
        this.loadPlayers(searchTerm);
      });
  }

  private setupSort(): void {
    this.sortControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.sortPlayers();
      });
  }

  private sortPlayers(): void {
    const sortValue = this.sortControl.value;
    const [field, order] = sortValue.split('-');

    this.players.sort((a, b) => {
      let aValue: string = '';
      let bValue: string = '';

      switch (field) {
        case 'name':
          aValue = a.strPlayer || '';
          bValue = b.strPlayer || '';
          break;
        case 'team':
          aValue = a.strTeam || '';
          bValue = b.strTeam || '';
          break;
        case 'position':
          aValue = a.strPosition || '';
          bValue = b.strPosition || '';
          break;
        case 'nationality':
          aValue = a.strNationality || '';
          bValue = b.strNationality || '';
          break;
      }

      const comparison = aValue.localeCompare(bValue);
      return order === 'asc' ? comparison : -comparison;
    });
  }

  loadPlayers(search?: string, append = false): void {
    if (!append) {
      this.loading = true;
      this.players = [];
    } else {
      this.isLoadingMore = true;
    }
    this.error = null;

    // Si on affiche les favoris, utiliser directement les favoris stockés
    if (this.showOnlyFavorites) {
      const favorites = this.favoritesService.getFavorites();
      console.log('⭐ Affichage des favoris:', favorites.length);
      
      // Filtrer par recherche si nécessaire
      let filteredFavorites = favorites;
      if (search && search.trim()) {
        const searchLower = search.toLowerCase();
        filteredFavorites = favorites.filter(p => 
          p.strPlayer?.toLowerCase().includes(searchLower) ||
          p.strTeam?.toLowerCase().includes(searchLower) ||
          p.strPosition?.toLowerCase().includes(searchLower) ||
          p.strNationality?.toLowerCase().includes(searchLower)
        );
      }
      
      this.players = filteredFavorites;
      this.totalPages = 1;
      this.sortPlayers();
      this.loading = false;
      this.isLoadingMore = false;
      console.log('✅ Favoris chargés:', this.players.length);
      return;
    }

    this.nbaService.getPlayers(this.currentPage, search, this.perPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ApiResponse<Player>) => {
          let newPlayers = response.data;
          
          if (append) {
            this.players = [...this.players, ...newPlayers];
          } else {
            this.players = newPlayers;
          }
          this.totalPages = response.meta?.total_pages || 1;
          this.sortPlayers();
          this.loading = false;
          this.isLoadingMore = false;
          console.log('✅ Joueurs chargés:', this.players.length);
        },
        error: (err: Error) => {
          this.error = err.message;
          if (!append) {
            this.players = [];
          }
          this.loading = false;
          this.isLoadingMore = false;
          console.error('❌ Erreur:', err.message);
        }
      });
  }

  loadMorePlayers(): void {
    if (this.currentPage < this.totalPages && !this.isLoadingMore) {
      this.currentPage++;
      this.loadPlayers(this.searchControl.value, true);
    }
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  toggleFavoritesFilter(): void {
    this.showOnlyFavorites = !this.showOnlyFavorites;
    this.currentPage = 1;
    this.loadPlayers(this.searchControl.value);
  }

  // Historique de recherche
  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      const term = this.searchControl.value?.trim();
      if (term && term.length >= 2) {
        this.searchHistoryService.addSearch(term);
        this.showHistory = false;
      }
    }
  }

  onSearchBlur(): void {
    setTimeout(() => {
      this.showHistory = false;
    }, 200);
  }

  onSearchFocus(event: any): void {
    this.showHistory = true;
    this.calculateDropdownPosition(event.target);
  }

  calculateDropdownPosition(input: HTMLElement): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    const rect = input.getBoundingClientRect();
    this.dropdownStyle = {
      top: `${rect.bottom + window.scrollY + 2}px`,
      left: `${rect.left + window.scrollX}px`,
      width: `${rect.width}px`
    };
  }

  selectFromHistory(term: string): void {
    this.searchControl.setValue(term);
    this.searchHistoryService.addSearch(term);
    this.showHistory = false;
  }

  removeFromHistory(term: string, event: Event): void {
    event.stopPropagation();
    this.searchHistoryService.removeItem(term);
  }

  // Enregistrer la recherche en cours si elle est valide
  private saveCurrentSearch(): void {
    const term = this.searchControl.value?.trim();
    if (term && term.length >= 2) {
      this.searchHistoryService.addSearch(term);
    }
  }

  // Wrapper pour toggle favori avec enregistrement de recherche
  onToggleFavorite(player: Player): void {
    const wasFavorite = this.favoritesService.isFavorite(player.idPlayer);
    this.favoritesService.toggleFavorite(player);
    this.saveCurrentSearch();
    
    // Si on est en mode favoris et qu'on vient de retirer un favori, recharger la liste
    if (this.showOnlyFavorites && wasFavorite) {
      this.loadPlayers(this.searchControl.value);
    }
  }

  // Enregistrer la recherche avant de naviguer vers le profil
  onViewProfile(): void {
    this.saveCurrentSearch();
  }

  // Méthodes de sélection pour comparaison
  togglePlayerSelection(player: Player): void {
    const playerId = typeof player.idPlayer === 'string' ? parseInt(player.idPlayer, 10) : player.idPlayer;
    
    if (this.selectedPlayers.has(playerId)) {
      this.selectedPlayers.delete(playerId);
    } else {
      if (this.selectedPlayers.size < this.maxCompare) {
        this.selectedPlayers.set(playerId, player);
      }
    }
    
    // Enregistrer la recherche lors de la sélection
    this.saveCurrentSearch();
  }

  isPlayerSelected(playerId: number | string): boolean {
    const id = typeof playerId === 'string' ? parseInt(playerId, 10) : playerId;
    return this.selectedPlayers.has(id);
  }

  canSelectMore(): boolean {
    return this.selectedPlayers.size < this.maxCompare;
  }

  canCompare(): boolean {
    return this.selectedPlayers.size >= 2;
  }

  compareSelected(): void {
    if (!this.canCompare()) return;

    const selectedPlayerData = Array.from(this.selectedPlayers.values());

    this.router.navigate(['/compare'], {
      state: { players: selectedPlayerData }
    });
  }
}
