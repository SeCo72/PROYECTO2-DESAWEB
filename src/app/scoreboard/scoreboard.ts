import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ControlsComponent } from '../controls/controls';
import { HttpClientModule } from '@angular/common/http';
import { GameService, Game } from '../services/game';
import { ApiService } from '../services/api.service';
import { Match } from '../models/models';

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ControlsComponent, HttpClientModule],
  templateUrl: './scoreboard.html',
  styleUrls: ['./scoreboard.scss'],
  providers: [GameService]
})
export class ScoreboardComponent implements OnInit {
  // Datos del partido
  matches: Match[] = [];
  selectedMatch?: Match;
  
  // Datos del juego
  localPoints = 0;
  visitorPoints = 0;
  localFouls = 0;
  visitorFouls = 0;
  currentQuarter = 1;
  
  minutes = 10;
  seconds = 0;
  timer: any;
  running = false;
  gameId?: number;

  constructor(
    private gameService: GameService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.loadInProgressMatches();
  }

  loadInProgressMatches() {
    this.apiService.getMatches('InProgress').subscribe({
      next: (matches) => {
        this.matches = matches;
      },
      error: (err) => console.error('Error cargando partidos', err)
    });
  }

  onMatchSelect() {
    if (!this.selectedMatch) return;

    // Si el partido ya tiene un juego asociado, cargarlo
    if (this.selectedMatch.gameId) {
      this.gameService.getGame(this.selectedMatch.gameId).subscribe({
        next: (game) => {
          this.loadGameState(game);
        },
        error: (err) => console.error('Error cargando juego', err)
      });
    } else {
      // Crear nuevo juego
      this.createNewGame();
    }
  }

  createNewGame() {
    const newGame: Game = {
      localPoints: 0,
      visitorPoints: 0,
      localFouls: 0,
      visitorFouls: 0,
      currentQuarter: 1,
      minutes: 10,
      seconds: 0
    };

    this.gameService.createGame(newGame).subscribe({
      next: (game) => {
        this.gameId = game.id;
        this.loadGameState(game);
        
        // Asociar el juego con el partido
        if (this.selectedMatch) {
          this.apiService.updateMatch(this.selectedMatch.id, {
            ...this.selectedMatch,
            gameId: game.id
          }).subscribe();
        }
      },
      error: (err) => console.error('Error creando juego', err)
    });
  }

  loadGameState(game: Game) {
    this.gameId = game.id;
    this.localPoints = game.localPoints;
    this.visitorPoints = game.visitorPoints;
    this.localFouls = game.localFouls;
    this.visitorFouls = game.visitorFouls;
    this.currentQuarter = game.currentQuarter;
    this.minutes = game.minutes;
    this.seconds = game.seconds;
  }

  startTimer() {
    if (!this.running) {
      this.running = true;
      this.timer = setInterval(() => this.countdown(), 1000);
    }
  }

  pauseTimer() {
    this.running = false;
    clearInterval(this.timer);
  }

  resetTimer() {
    this.pauseTimer();
    this.minutes = 10;
    this.seconds = 0;
  }

  countdown() {
    if (this.seconds === 0) {
      if (this.minutes === 0) {
        this.endQuarter();
        return;
      }
      this.minutes--;
      this.seconds = 59;
    } else {
      this.seconds--;
    }

    if ((this.minutes * 60 + this.seconds) % 5 === 0) {
      this.saveGame();
    }
  }

  endQuarter() {
    this.pauseTimer();
    alert('¡Fin del cuarto!');
    if (this.currentQuarter < 4) this.currentQuarter++;
    this.resetTimer();
    this.saveGame();
  }

  addPoints(team: 'local' | 'visitor', pts: number) {
    if (team === 'local') this.localPoints += pts;
    else this.visitorPoints += pts;
    this.saveGame();
  }

  subtractPoints(team: 'local' | 'visitor', pts: number) {
    if (team === 'local') this.localPoints = Math.max(0, this.localPoints - pts);
    else this.visitorPoints = Math.max(0, this.visitorPoints - pts);
    this.saveGame();
  }

  addFoul(team: 'local' | 'visitor') {
    if (team === 'local') this.localFouls++;
    else this.visitorFouls++;
    this.saveGame();
  }

  finalizarJuego() {
    this.pauseTimer();
    alert('¡Juego finalizado!');
    this.saveGame();
  }

  saveGame() {
    if (!this.gameId) return;

    const game: Game = {
      id: this.gameId,
      localPoints: this.localPoints,
      visitorPoints: this.visitorPoints,
      localFouls: this.localFouls,
      visitorFouls: this.visitorFouls,
      currentQuarter: this.currentQuarter,
      minutes: this.minutes,
      seconds: this.seconds
    };

    this.gameService.updateGame(this.gameId, game).subscribe({
      next: updated => console.log('Partida actualizada'),
      error: err => console.error('Error al actualizar partida', err)
    });
  }

  resetGame() {
    this.localPoints = 0;
    this.visitorPoints = 0;
    this.localFouls = 0;
    this.visitorFouls = 0;
    this.currentQuarter = 1;
    this.resetTimer();
    this.saveGame();
  }
}