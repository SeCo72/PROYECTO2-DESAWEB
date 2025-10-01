import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsComponent } from '../controls/controls';
import { HttpClientModule } from '@angular/common/http';
import { GameService, Game } from '../services/game';

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  imports: [CommonModule, ControlsComponent, HttpClientModule],
  templateUrl: './scoreboard.html',
  styleUrls: ['./scoreboard.scss'],
  providers: [GameService]
})
export class ScoreboardComponent {
  constructor(private gameService: GameService) {}

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

ngOnInit() {
  const newGame: Game = {
    localPoints: this.localPoints,
    visitorPoints: this.visitorPoints,
    localFouls: this.localFouls,
    visitorFouls: this.visitorFouls,
    currentQuarter: this.currentQuarter,
    minutes: this.minutes,
    seconds: this.seconds
  };

  this.gameService.createGame(newGame).subscribe(game => {
    this.gameId = game.id;
  });
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

    // Guardar cada 5 segundos
    if ((this.minutes*60 + this.seconds) % 5 === 0) {
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

  finalizarCuarto() {
    this.pauseTimer();
    alert('¡Fin del cuarto!');
    if (this.currentQuarter < 4) this.currentQuarter++;
    this.resetTimer();
  }

  finalizarJuego() {
  this.pauseTimer();
  alert('¡Juego finalizado!');
  this.saveGame();  // Guarda el estado final
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
    next: updated => console.log('Partida actualizada', updated),
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
