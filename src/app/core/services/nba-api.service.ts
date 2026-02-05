import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of, forkJoin, EMPTY } from 'rxjs';
import { catchError, map, tap, finalize, mergeMap, shareReplay, expand, scan, takeLast } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Player, Team, SportsDbResponse, ApiResponse } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class NbaApiService {
  private readonly API_URL = environment.apiUrl;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  private allPlayersCache: Player[] = [];
  private loadAllPlayersObservable$: Observable<Player[]> | null = null;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  private loadAllPlayers(): Observable<Player[]> {
    if (this.allPlayersCache.length > 0) {
      console.log('📦 Cache:', this.allPlayersCache.length, 'joueurs');
      return of(this.allPlayersCache);
    }

    if (this.loadAllPlayersObservable$) {
      console.log('⏳ Chargement en cours...');
      return this.loadAllPlayersObservable$;
    }

    console.log('🔄 Chargement depuis votre API...');
    this.loadingSubject.next(true);

    const observable$ = this.http.get<Player[]>(this.API_URL).pipe(
      tap(players => {
        this.allPlayersCache = players;
        console.log('✅ Total joueurs NBA:', players.length);
        this.loadAllPlayersObservable$ = null;
      }),
      catchError(err => {
        console.error('❌ Erreur API:', err);
        console.log('📁 Fallback vers données locales...');
        // Fallback vers le fichier local si l'API ne répond pas
        return this.http.get<Player[]>('/assets/data/nba-players.json');
      }),
      tap(players => {
        if (!this.allPlayersCache.length) {
          this.allPlayersCache = players;
        }
      }),
      finalize(() => {
        console.log('🏁 Terminé');
        this.loadingSubject.next(false);
      }),
      shareReplay(1)
    ) as Observable<Player[]>;

    this.loadAllPlayersObservable$ = observable$;
    return observable$;
  }

  getPlayers(page: number = 1, search?: string, perPage: number = 25): Observable<ApiResponse<Player>> {
    return this.loadAllPlayers().pipe(
      map(allPlayers => {
        let filteredPlayers = allPlayers;

        if (search && search.trim()) {
          const searchLower = search.trim().toLowerCase();
          filteredPlayers = allPlayers.filter(p =>
            p.strPlayer.toLowerCase().includes(searchLower) ||
            p.strTeam?.toLowerCase().includes(searchLower) ||
            p.strPosition?.toLowerCase().includes(searchLower)
          );
        }

        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        const paginatedPlayers = filteredPlayers.slice(startIndex, endIndex);

        return {
          data: paginatedPlayers,
          meta: {
            total_pages: Math.ceil(filteredPlayers.length / perPage),
            current_page: page,
            next_page: page < Math.ceil(filteredPlayers.length / perPage) ? page + 1 : null,
            per_page: perPage,
            total_count: filteredPlayers.length
          }
        };
      })
    );
  }

  getPlayerById(id: string): Observable<Player> {
    return this.loadAllPlayers().pipe(
      map(players => {
        const player = players.find(p => p.idPlayer === id);
        if (!player) {
          throw new Error('Joueur non trouvé');
        }
        return player;
      }),
      catchError(err => {
        console.error('❌ Joueur non trouvé:', id);
        return throwError(() => err);
      })
    );
  }

  getTeams(): Observable<Team[]> {
    if (!this.isBrowser) {
      return of([]);
    }

    this.loadingSubject.next(true);

    return this.http.get<SportsDbResponse<Team>>(`${this.API_URL}/search_all_teams.php?l=NBA`)
      .pipe(
        map(response => response.teams || []),
        tap(teams => console.log('✅ Équipes récupérées:', teams.length)),
        catchError(this.handleError),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  getPlayersByTeam(teamId: string): Observable<Player[]> {
    if (!this.isBrowser) {
      return of([]);
    }

    this.loadingSubject.next(true);

    return this.http.get<SportsDbResponse<Player>>(`${this.API_URL}/lookup_all_players.php?id=${teamId}`)
      .pipe(
        map(response => response.player || []),
        tap(players => console.log(`✅ Joueurs de l'équipe ${teamId}:`, players.length)),
        catchError(this.handleError),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof Error) {
      errorMessage = `Erreur réseau: ${error.error.message}`;
      console.error('🔴 Erreur client:', error.error.message);
    } else {
      switch (error.status) {
        case 0:
          errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
          break;
        case 400:
          errorMessage = 'Requête invalide. Vérifiez les paramètres.';
          break;
        case 404:
          errorMessage = 'Ressource non trouvée.';
          break;
        case 429:
          errorMessage = 'Trop de requêtes. Veuillez patienter.';
          break;
        case 500:
        case 502:
        case 503:
          errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
          break;
        default:
          errorMessage = `Erreur ${error.status}: ${error.message}`;
      }

      console.error(`🔴 Erreur serveur:`, `\n- Code: ${error.status}`, `\n- Message: ${error.message}`, `\n- URL: ${error.url}`);
    }

    return throwError(() => new Error(errorMessage));
  }
}