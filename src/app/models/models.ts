// Auth Models
export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  expiresAt: string;
}

// Team Model
export interface Team {
  id: number;
  name: string;
  city: string;
  logoUrl?: string;
  players?: Player[];
  createdAt?: string;
}

// Player Model
export interface Player {
  id: number;
  fullName: string;
  number: number;
  position: string;
  height: number;
  age: number;
  nationality: string;
  photoUrl?: string;
  teamId: number;
  createdAt?: string;
}

// Match Model
export interface Match {
  id: number;
  homeTeamId: number;
  homeTeam?: Team;
  awayTeamId: number;
  awayTeam?: Team;
  scheduledDate: string;
  homeScore?: number | null;
  awayScore?: number | null;
  status: string; // 'Scheduled' | 'InProgress' | 'Finished'
  gameId?: number;
  game?: any;
  matchPlayers?: MatchPlayer[];
  createdAt?: string;
}

export interface MatchPlayer {
  id: number;
  matchId: number;
  playerId: number;
  player?: Player;
  isStarter: boolean;
}