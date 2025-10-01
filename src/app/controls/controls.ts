import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './controls.html',
  styleUrls: ['./controls.scss']
})

export class ControlsComponent {
  @Output() addPoints = new EventEmitter<{team: 'local' | 'visitor', points: number}>();
  @Output() subtractPoints = new EventEmitter<{team: 'local' | 'visitor', points: number}>();
  @Output() addFoul = new EventEmitter<'local' | 'visitor'>();

  @Output() startTimer = new EventEmitter<void>();
  @Output() pauseTimer = new EventEmitter<void>();
  @Output() resetTimer = new EventEmitter<void>();
  @Output() resetGame = new EventEmitter<void>();
  

  onAddPoints(team: 'local' | 'visitor', pts: number) {
    this.addPoints.emit({ team, points: pts });
  }

  onSubtractPoints(team: 'local' | 'visitor', pts: number) {
    this.subtractPoints.emit({ team, points: pts });
  }

  onAddFoul(team: 'local' | 'visitor') {
    this.addFoul.emit(team);
  }

  onStartTimer() {
    this.startTimer.emit();
  }

  onPauseTimer() {
    this.pauseTimer.emit();
  }

  onResetTimer() {
    this.resetTimer.emit();
  }

  onResetGame() {
    this.resetGame.emit();
  }
  
}
