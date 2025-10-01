import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Game {
  id?: number;
  localPoints: number;
  visitorPoints: number;
  localFouls: number;
  visitorFouls: number;
  currentQuarter: number;
  minutes: number;
  seconds: number;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private apiUrl = 'http://localhost:5231/game';

  constructor(private http: HttpClient) { }

  getGame(id: number): Observable<Game> {
    return this.http.get<Game>(`${this.apiUrl}/${id}`);
  }

  createGame(game: Game): Observable<Game> {
    return this.http.post<Game>(this.apiUrl, game);
  }

  updateGame(id: number, game: Game): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, game);
  }
}
