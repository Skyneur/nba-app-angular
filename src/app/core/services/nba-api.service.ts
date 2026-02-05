import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, map, tap, finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Player, Team, SportsDbResponse, ApiResponse } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class NbaApiService {
  private readonly API_URL = environment.apiUrl;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  private teamsCache: Team[] = [];

  constructor(private http: HttpClient) {}

  getPlayers(page: number = 1, search?: string, perPage: number = 25): Observable<ApiResponse<Player>> {
    this.loadingSubject.next(true);
    
    if (search && search.trim()) {
      const searchTerms = search.trim().toLowerCase().split(' ');
      
      return this.http.get<{ player: Player[] }>(`${this.API_URL}/searchplayers.php?p=${encodeURIComponent(search.trim())}`)
        .pipe(
          map(response => {
            const players = response.player || [];
            let nbaPlayers = players.filter(p => {
              if (p.strSport !== 'Basketball') return false;
              
              const playerName = p.strPlayer.toLowerCase();
              return searchTerms.some(term => playerName.includes(term));
            });
            
            if (nbaPlayers.length === 0) {
              const localPlayers = this.getLocalNBAPlayers();
              nbaPlayers = localPlayers.filter(p => {
                const playerName = p.strPlayer.toLowerCase();
                return searchTerms.some(term => playerName.includes(term));
              });
            }
            
            const startIndex = (page - 1) * perPage;
            const endIndex = startIndex + perPage;
            const paginatedPlayers = nbaPlayers.slice(startIndex, endIndex);
            
            return {
              data: paginatedPlayers,
              meta: {
                total_pages: Math.ceil(nbaPlayers.length / perPage),
                current_page: page,
                next_page: page < Math.ceil(nbaPlayers.length / perPage) ? page + 1 : null,
                per_page: perPage,
                total_count: nbaPlayers.length
              }
            };
          }),
          tap(response => console.log('✅ Joueurs trouvés:', response.data.length)),
          catchError(this.handleError),
          finalize(() => this.loadingSubject.next(false))
        );
    }
    
    return this.getAllNBAPlayers(page, perPage);
  }

  private getLocalNBAPlayers(): Player[] {
    const famousPlayers = [
      'LeBron James', 'Stephen Curry', 'Kevin Durant', 'Giannis Antetokounmpo',
      'Luka Doncic', 'Joel Embiid', 'Nikola Jokic', 'Damian Lillard',
      'Kawhi Leonard', 'Anthony Davis', 'James Harden', 'Jayson Tatum',
      'Devin Booker', 'Donovan Mitchell', 'Trae Young', 'Jimmy Butler',
      'Paul George', 'Kyrie Irving', 'Bradley Beal', 'Zion Williamson',
      'Ja Morant', 'Shai Gilgeous-Alexander', 'De\'Aaron Fox', 'Julius Randle'
    ];

    return famousPlayers.map((name, index) => ({
      idPlayer: `${134060 + index}`,
      strPlayer: name,
      strTeam: 'NBA',
      strSport: 'Basketball',
      strPosition: ['Guard', 'Forward', 'Center'][index % 3],
      strNationality: 'USA',
      strHeight: `${(1.90 + Math.random() * 0.2).toFixed(2)}m`,
      strWeight: `${90 + Math.floor(Math.random() * 20)}kg`,
      strNumber: `${index + 1}`,
      idTeam: '134860'
    }));
  }

  private getAllNBAPlayers(page: number = 1, perPage: number = 25): Observable<ApiResponse<Player>> {
    return this.getTeams().pipe(
      map(teams => teams.slice(0, 5)),
      map(teams => {
        const allPlayers: Player[] = [];
        const famousPlayers = [
          'LeBron James', 'Stephen Curry', 'Kevin Durant', 'Giannis Antetokounmpo',
          'Luka Doncic', 'Joel Embiid', 'Nikola Jokic', 'Damian Lillard',
          'Kawhi Leonard', 'Anthony Davis', 'James Harden', 'Jayson Tatum',
          'Devin Booker', 'Donovan Mitchell', 'Trae Young', 'Jimmy Butler',
          'Paul George', 'Kyrie Irving', 'Bradley Beal', 'Zion Williamson'
        ];

        teams.forEach((team, index) => {
          for (let i = 0; i < 4; i++) {
            const playerIndex = index * 4 + i;
            if (playerIndex < famousPlayers.length) {
              allPlayers.push({
                idPlayer: `${134060 + playerIndex}`,
                strPlayer: famousPlayers[playerIndex],
                strTeam: team.strTeam,
                strSport: 'Basketball',
                strPosition: ['Guard', 'Forward', 'Center'][i % 3],
                strNationality: 'USA',
                strHeight: `${(1.90 + Math.random() * 0.2).toFixed(2)}m`,
                strWeight: `${90 + Math.floor(Math.random() * 20)}kg`,
                strNumber: `${i + 1}`,
                idTeam: team.idTeam
              });
            }
          }
        });

        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        const paginatedPlayers = allPlayers.slice(startIndex, endIndex);

        return {
          data: paginatedPlayers,
          meta: {
            total_pages: Math.ceil(allPlayers.length / perPage),
            current_page: page,
            next_page: page < Math.ceil(allPlayers.length / perPage) ? page + 1 : null,
            per_page: perPage,
            total_count: allPlayers.length
          }
        };
      }),
      catchError(this.handleError),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  getPlayerById(id: string): Observable<Player> {
    this.loadingSubject.next(true);
    
    const numericId = parseInt(id, 10);
    if (numericId >= 134060 && numericId < 134084) {
      const localPlayers = this.getLocalNBAPlayers();
      const player = localPlayers.find(p => p.idPlayer === id);
      
      if (player) {
        return of(player).pipe(
          tap(p => console.log('✅ Détails joueur (local):', p.strPlayer)),
          finalize(() => this.loadingSubject.next(false))
        );
      }
    }
    
    return this.http.get<SportsDbResponse<Player>>(`${this.API_URL}/lookupplayer.php?id=${id}`)
      .pipe(
        map(response => {
          const players = response.players || [];
          if (players.length === 0) {
            throw new Error('Joueur non trouvé');
          }
          return players[0];
        }),
        tap(player => console.log('✅ Détails joueur:', player.strPlayer)),
        catchError(this.handleError),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  getTeams(): Observable<Team[]> {
    if (this.teamsCache.length > 0) {
      return of(this.teamsCache);
    }

    this.loadingSubject.next(true);
    
    return this.http.get<SportsDbResponse<Team>>(`${this.API_URL}/search_all_teams.php?l=NBA`)
      .pipe(
        map(response => response.teams || []),
        tap(teams => {
          this.teamsCache = teams;
          console.log('✅ Équipes récupérées:', teams.length);
        }),
        catchError(this.handleError),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  getPlayersByTeam(teamId: string): Observable<Player[]> {
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

    if (error.error instanceof ErrorEvent) {
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
