import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NbaApiService } from '../../core/services/nba-api.service';
import { Player } from '../../models';
import { LoaderComponent } from '../../shared/components/loader.component';
import { ErrorMessageComponent } from '../../shared/components/error-message.component';

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LoaderComponent,
    ErrorMessageComponent
  ],
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.css']
})
export class PlayerDetailComponent implements OnInit, OnDestroy {
  player: Player | null = null;
  loading = false;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private nbaService: NbaApiService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.loadPlayer(id);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPlayer(id: string): void {
    this.loading = true;
    this.error = null;

    this.nbaService.getPlayerById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (player: Player) => {
          this.player = player;
          this.loading = false;
          console.log('✅ Joueur chargé:', player);
        },
        error: (err: Error) => {
          this.error = err.message;
          this.loading = false;
          console.error('❌ Erreur:', err.message);
          
          setTimeout(() => {
            this.router.navigate(['/404']);
          }, 2000);
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/players']);
  }
}
