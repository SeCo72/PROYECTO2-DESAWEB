import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Player, Team } from '../../../models/models';

@Component({
  selector: 'app-player-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-3xl mx-auto px-4 py-8">
        <h2 class="text-3xl font-bold mb-6">{{ isEdit ? 'Editar' : 'Nuevo' }} Jugador</h2>

        <div class="bg-white rounded-xl shadow-md p-6">
          <form (ngSubmit)="onSubmit()" #playerForm="ngForm">
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="col-span-2">
                <label class="block text-sm font-medium mb-2">Nombre Completo *</label>
                <input type="text" [(ngModel)]="player.fullName" name="fullName" required class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">Número *</label>
                <input type="number" [(ngModel)]="player.number" name="number" required min="0" max="99" class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">Posición *</label>
                <select [(ngModel)]="player.position" name="position" required class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none">
                  <option value="">Selecciona...</option>
                  <option value="PG">PG - Base</option>
                  <option value="SG">SG - Escolta</option>
                  <option value="SF">SF - Alero</option>
                  <option value="PF">PF - Ala-Pívot</option>
                  <option value="C">C - Pívot</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">Altura (m) *</label>
                <input type="number" [(ngModel)]="player.height" name="height" required step="0.01" min="1.5" max="2.5" class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">Edad *</label>
                <input type="number" [(ngModel)]="player.age" name="age" required min="15" max="50" class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              
              <div class="col-span-2">
                <label class="block text-sm font-medium mb-2">Nacionalidad *</label>
                <input type="text" [(ngModel)]="player.nationality" name="nationality" required class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              
              <div class="col-span-2">
                <label class="block text-sm font-medium mb-2">Equipo *</label>
                <select [(ngModel)]="player.teamId" name="teamId" required class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none">
                  <option [value]="0">Selecciona un equipo...</option>
                  @for (team of teams; track team.id) {
                    <option [value]="team.id">{{ team.name }}</option>
                  }
                </select>
              </div>
              
              <div class="col-span-2">
                <label class="block text-sm font-medium mb-2">URL Foto (opcional)</label>
                <input type="url" [(ngModel)]="player.photoUrl" name="photoUrl" class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
            </div>

            @if (errorMessage) {
              <div class="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{{ errorMessage }}</div>
            }

            <div class="flex gap-3">
              <button type="button" (click)="router.navigate(['/admin/players'])" class="flex-1 px-6 py-3 bg-gray-200 rounded-lg">Cancelar</button>
              <button type="submit" [disabled]="!playerForm.valid || loading" class="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg disabled:opacity-50">
                {{ loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class PlayerFormComponent implements OnInit {
  player: Partial<Player> = { fullName: '', number: 0, position: '', height: 0, age: 0, nationality: '', teamId: 0, photoUrl: '' };
  teams: Team[] = [];
  isEdit = false;
  loading = false;
  errorMessage = '';
  playerId?: number;

  constructor(private apiService: ApiService, public router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadTeams();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.playerId = +id;
      this.loadPlayer(this.playerId);
    }
  }

  loadTeams(): void {
    this.apiService.getTeams().subscribe(data => this.teams = data);
  }

  loadPlayer(id: number): void {
    this.loading = true;
    this.apiService.getPlayer(id).subscribe({
      next: (data) => { this.player = data; this.loading = false; },
      error: () => { this.errorMessage = 'Error al cargar jugador'; this.loading = false; }
    });
  }

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';
    const request = this.isEdit && this.playerId
      ? this.apiService.updatePlayer(this.playerId, this.player as Player)
      : this.apiService.createPlayer(this.player);

    request.subscribe({
      next: () => this.router.navigate(['/admin/players']),
      error: (err) => { this.errorMessage = err.error?.message || 'Error'; this.loading = false; }
    });
  }
}