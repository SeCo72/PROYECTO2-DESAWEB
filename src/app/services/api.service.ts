import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team, Player, Match } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:5000/api'; // Cambia según tu configuración

  constructor(private http: HttpClient) {}

  // ============ TEAMS ============
  getTeams(search?: string): Observable<Team[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    return this.http.get<Team[]>(`${this.apiUrl}/teams`, { params });
  }

  getTeam(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/teams/${id}`);
  }

  createTeam(team: Partial<Team>): Observable<Team> {
    return this.http.post<Team>(`${this.apiUrl}/teams`, team);
  }

  updateTeam(id: number, team: Team): Observable<Team> {
    return this.http.put<Team>(`${this.apiUrl}/teams/${id}`, team);
  }

  deleteTeam(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/teams/${id}`);
  }

  // ============ PLAYERS ============
  getPlayers(teamId?: number, search?: string): Observable<Player[]> {
    let params = new HttpParams();
    if (teamId) params = params.set('teamId', teamId.toString());
    if (search) params = params.set('search', search);
    return this.http.get<Player[]>(`${this.apiUrl}/players`, { params });
  }

  getPlayer(id: number): Observable<Player> {
    return this.http.get<Player>(`${this.apiUrl}/players/${id}`);
  }

  createPlayer(player: Partial<Player>): Observable<Player> {
    return this.http.post<Player>(`${this.apiUrl}/players`, player);
  }

  updatePlayer(id: number, player: Player): Observable<Player> {
    return this.http.put<Player>(`${this.apiUrl}/players/${id}`, player);
  }

  deletePlayer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/players/${id}`);
  }

  // ============ MATCHES ============
  getMatches(status?: string): Observable<Match[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<Match[]>(`${this.apiUrl}/matches`, { params });
  }

  getMatch(id: number): Observable<Match> {
    return this.http.get<Match>(`${this.apiUrl}/matches/${id}`);
  }

  createMatch(match: Partial<Match>): Observable<Match> {
    return this.http.post<Match>(`${this.apiUrl}/matches`, match);
  }

  updateMatch(id: number, match: Match): Observable<Match> {
    return this.http.put<Match>(`${this.apiUrl}/matches/${id}`, match);
  }

  deleteMatch(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/matches/${id}`);
  }

  setMatchRoster(matchId: number, playerIds: number[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/matches/${matchId}/roster`, playerIds);
  }

  getMatchRoster(matchId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/matches/${matchId}/roster`);
  }
}