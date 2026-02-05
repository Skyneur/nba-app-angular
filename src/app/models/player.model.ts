export interface Player {
  idPlayer: string;
  strPlayer: string;           // Nom complet
  strTeam: string;             // Nom de l'équipe
  strSport: string;            // Sport (Basketball)
  strNationality?: string;     // Nationalité
  strPosition?: string;        // Position
  strHeight?: string;          // Taille (ex: "2.06 m")
  strWeight?: string;          // Poids (ex: "113 kg")
  strThumb?: string;           // Photo du joueur
  strCutout?: string;          // Image détourée
  strBanner?: string;          // Bannière
  strDescriptionEN?: string;   // Description
  dateBorn?: string;           // Date de naissance
  strBirthLocation?: string;   // Lieu de naissance
  strNumber?: string;          // Numéro de maillot
  strWage?: string;            // Salaire
  strSigning?: string;         // Date de signature
  strKit?: string;             // Image du kit
  idTeam?: string;             // ID de l'équipe
}

export interface Team {
  idTeam: string;
  strTeam: string;             // Nom de l'équipe
  strTeamShort?: string;       // Nom court
  strAlternate?: string;       // Nom alternatif
  strSport: string;            // Sport
  strLeague: string;           // Ligue (NBA)
  strDivision?: string;        // Division
  strStadium?: string;         // Stade
  strLocation?: string;        // Ville
  strTeamBadge?: string;       // Logo
  strTeamBanner?: string;      // Bannière
  strDescriptionEN?: string;   // Description
  intFormedYear?: string;      // Année de création
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
