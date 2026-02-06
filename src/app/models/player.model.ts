export interface Player {
  idPlayer: string;
  strPlayer: string;
  strTeam: string;
  strSport: string;
  strNationality?: string;
  strPosition?: string;
  strHeight?: string;
  strWeight?: string;
  strThumb?: string;
  strCutout?: string;
  strBanner?: string;
  strDescriptionEN?: string;
  dateBorn?: string;
  strBirthLocation?: string;
  strNumber?: string;
  strWage?: string;
  strSigning?: string;
  strKit?: string;
  idTeam?: string;
}

export interface Team {
  idTeam: string;
  strTeam: string;
  strTeamShort?: string;
  strAlternate?: string;
  strSport: string;
  strLeague: string;
  strDivision?: string;
  strStadium?: string;
  strLocation?: string;
  strTeamBadge?: string;
  strTeamBanner?: string;
  strDescriptionEN?: string;
  intFormedYear?: string;
}

export interface SportsDbResponse<T> {
  players?: T[];
  teams?: T[];
  player?: T[];
  team?: T[];
}

export interface LoadingState<T> {
  loading: boolean;
  data: T | null;
  error: string | null;
}

export interface ApiResponse<T> {
  data: T[];
  meta?: {
    total_pages: number;
    current_page: number;
    next_page: number | null;
    per_page: number;
    total_count: number;
  };
}
