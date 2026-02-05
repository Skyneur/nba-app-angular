import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { NbaApiService } from '../../core/services/nba-api.service';
import { Player, ApiResponse } from '../../models';
import { LoaderComponent } from '../../shared/components/loader.component';
import { ErrorMessageComponent } from '../../shared/components/error-message.component';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    LoaderComponent,
    ErrorMessageComponent
  ],
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.css']
})
export class PlayerListComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('', { nonNullable: true });
  sortControl = new FormControl('name-asc', { nonNullable: true });

  players: Player[] = [];
  loading = false;
  error: string | null = null;
  
  currentPage = 1;
  totalPages = 1;
  perPage = 12;

  sortOptions = [
    { value: 'name-asc', label: 'Nom (A-Z)' },
    { value: 'name-desc', label: 'Nom (Z-A)' },
    { value: 'team-asc', label: 'Équipe (A-Z)' },
    { value: 'team-desc', label: 'Équipe (Z-A)' },
    { value: 'position-asc', label: 'Position (A-Z)' },
    { value: 'nationality-asc', label: 'Nationalité (A-Z)' }
  ];

  private destroy$ = new Subject<void>();

  constructor(private nbaService: NbaApiService) {}

  ngOnInit(): void {
    this.loadPlayers();
    this.setupSearch();
    this.setupSort();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  loadPlayers(search?: string): void {
    this.loading = true;
    this.error = null;

    this.nbaService.getPlayers(this.currentPage, search, this.perPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ApiResponse<Player>) => {
          this.players = response.data;
          this.totalPages = response.meta?.total_pages || 1;
          this.sortPlayers();
          this.loading = false;
          console.log('✅ Joueurs chargés:', this.players.length);
        },
        error: (err: Error) => {
          this.error = err.message;
          this.players = [];
          this.loading = false;
          console.error('❌ Erreur:', err.message);
        }
      });
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPlayers(this.searchControl.value);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPlayers(this.searchControl.value);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadPlayers(this.searchControl.value);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }
}
