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

  players: Player[] = [];
  loading = false;
  error: string | null = null;
  
  currentPage = 1;
  totalPages = 1;
  perPage = 25;

  private destroy$ = new Subject<void>();

  constructor(private nbaService: NbaApiService) {}

  ngOnInit(): void {
    this.loadPlayers();
    this.setupSearch();
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

  loadPlayers(search?: string): void {
    this.loading = true;
    this.error = null;

    this.nbaService.getPlayers(this.currentPage, search, this.perPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ApiResponse<Player>) => {
          this.players = response.data;
          this.totalPages = response.meta?.total_pages || 1;
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
