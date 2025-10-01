import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Match, Team } from '../../../models/models';

@Component({
  selector: 'app-match-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-3xl mx-auto px-4 py-8">
        <h2 class="text-3xl font-bold mb-6">{{ isEdit ? 'Editar' : 'Nuevo' }} Partido</h2>

        <div class="bg-white rounded-xl shadow-md p-6">
          <form (ngSubmit)="onSubmit()" #matchForm="ngForm">
            <div class="space-y-4 mb-4">
              <div>
                <label class="block text-sm font-medium mb-2">Equipo Local *</label>
                <select [(ngModel)]="match.homeTeamId" name="homeTeamId" required class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none">
                  <option [value]="0">Selecciona equipo local...</option>
                  @for (team of teams; track team.id) {
                    <option [value]="team.id">{{ team.name }}</option>
                  }
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">Equipo Visitante *</label>
                <select [(ngModel)]="match.awayTeamId" name="awayTeamId" required class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none">
                  <option [value]="0">Selecciona equipo visitante...</option>
                  @for (team of teams; track team.id) {
                    <option [value]="team.id">{{ team.name }}</option>
                  }
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">Fecha y Hora *</label>
                <input type="datetime-local" [(ngModel)]="scheduledDateLocal" name="scheduledDate" required class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">Estado *</label>
                <select [(ngModel)]="match.status" name="status" required class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none">
                  <option value="Scheduled">Programado</option>
                  <option value="InProgress">En Progreso</option>
                  <option value="Finished">Finalizado</option>
                </select>
              </div>

              @if (match.status === 'Finished') {
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium mb-2">Marcador Local</label>
                    <input type="number" [(ngModel)]="match.homeScore" name="homeScore" min="0" class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-2">Marcador Visitante</label>
                    <input type="number" [(ngModel)]="match.awayScore" name="awayScore" min="0" class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
                  </div>
                </div>
              }
            </div>

            @if (errorMessage) {
              <div class="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{{ errorMessage }}</div>
            }

            <div class="flex gap-3">
              <button type="button" (click)="router.navigate(['/admin/matches'])" class="flex-1 px-6 py-3 bg-gray-200 rounded-lg">Cancelar</button>
              <button type="submit" [disabled]="!matchForm.valid || loading" class="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg disabled:opacity-50">
                {{ loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class MatchFormComponent implements OnInit {
  match: Partial<Match> = { homeTeamId: 0, awayTeamId: 0, scheduledDate: '', status: 'Scheduled', homeScore: null, awayScore: null };
  teams: Team[] = [];
  isEdit = false;
  loading = false;
  errorMessage = '';
  matchId?: number;
  scheduledDateLocal = '';

  constructor(private apiService: ApiService, public router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadTeams();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.matchId = +id;
      this.loadMatch(this.matchId);
    }
  }

  loadTeams(): void {
    this.apiService.getTeams().subscribe(data => this.teams = data);
  }

  loadMatch(id: number): void {
    this.loading = true;
    this.apiService.getMatch(id).subscribe({
      next: (data) => {
        this.match = data;
        this.scheduledDateLocal = new Date(data.scheduledDate).toISOString().slice(0, 16);
        this.loading = false;
      },
      error: () => { this.errorMessage = 'Error al cargar partido'; this.loading = false; }
    });
  }

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.match.scheduledDate = new Date(this.scheduledDateLocal).toISOString();

    const request = this.isEdit && this.matchId
      ? this.apiService.updateMatch(this.matchId, this.match as Match)
      : this.apiService.createMatch(this.match);

    request.subscribe({
      next: () => this.router.navigate(['/admin/matches']),
      error: (err) => { this.errorMessage = err.error?.message || 'Error'; this.loading = false; }
    });
  }
}