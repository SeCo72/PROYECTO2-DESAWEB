import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Match } from '../../../models/models';

@Component({
  selector: 'app-matches-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-3xl font-bold">Partidos</h2>
          <div class="flex gap-3">
            <button (click)="router.navigate(['/admin/dashboard'])" class="px-4 py-2 bg-gray-200 rounded-lg">← Volver</button>
            <button (click)="router.navigate(['/admin/matches/new'])" class="px-6 py-2 bg-orange-500 text-white rounded-lg">+ Nuevo Partido</button>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-4 mb-6">
          <select [(ngModel)]="statusFilter" (change)="onStatusFilter()" class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none">
            <option value="">Todos los estados</option>
            <option value="Scheduled">Programados</option>
            <option value="InProgress">En Progreso</option>
            <option value="Finished">Finalizados</option>
          </select>
        </div>

        @if (loading) {
          <div class="text-center py-12"><div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div></div>
        }

        @if (!loading && matches.length > 0) {
          <div class="space-y-4">
            @for (match of matches; track match.id) {
              <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                <div class="p-6">
                  <div class="flex items-center justify-between mb-4">
                    <span class="px-3 py-1 rounded-full text-sm font-semibold"
                      [class]="getStatusClass(match.status)">
                      {{ getStatusLabel(match.status) }}
                    </span>
                    <span class="text-gray-500 text-sm">
                      {{ match.scheduledDate | date:'dd/MM/yyyy HH:mm' }}
                    </span>
                  </div>

                  <div class="grid grid-cols-3 gap-4 items-center">
                    <!-- Home Team -->
                    <div class="text-center">
                      <h3 class="font-bold text-lg">{{ match.homeTeam?.name }}</h3>
                      <p class="text-gray-500 text-sm">{{ match.homeTeam?.city }}</p>
                      @if (match.status === 'Finished' && match.homeScore !== null) {
                        <p class="text-3xl font-bold text-orange-500 mt-2">{{ match.homeScore }}</p>
                      }
                    </div>

                    <!-- VS -->
                    <div class="text-center">
                      <span class="text-2xl font-bold text-gray-400">VS</span>
                    </div>

                    <!-- Away Team -->
                    <div class="text-center">
                      <h3 class="font-bold text-lg">{{ match.awayTeam?.name }}</h3>
                      <p class="text-gray-500 text-sm">{{ match.awayTeam?.city }}</p>
                      @if (match.status === 'Finished' && match.awayScore !== null) {
                        <p class="text-3xl font-bold text-orange-500 mt-2">{{ match.awayScore }}</p>
                      }
                    </div>
                  </div>

                  <div class="flex gap-2 mt-4 pt-4 border-t">
                    <button (click)="editMatch(match.id)" class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                      ✏️ Editar
                    </button>
                    <button (click)="deleteMatch(match)" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        }

        @if (!loading && matches.length === 0) {
          <div class="bg-white rounded-lg shadow p-12 text-center">
            <div class="text-6xl mb-4">🏀</div>
            <h3 class="text-xl font-semibold mb-2">No hay partidos</h3>
            <button (click)="router.navigate(['/admin/matches/new'])" class="mt-4 px-6 py-3 bg-orange-500 text-white rounded-lg">Crear Partido</button>
          </div>
        }
      </div>
    </div>
  `
})
export class MatchesListComponent implements OnInit {
  matches: Match[] = [];
  loading = false;
  statusFilter = '';

  constructor(private apiService: ApiService, public router: Router) {}

  ngOnInit(): void {
    this.loadMatches();
  }

  loadMatches(): void {
    this.loading = true;
    this.apiService.getMatches(this.statusFilter || undefined).subscribe({
      next: (data) => { this.matches = data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  onStatusFilter(): void { this.loadMatches(); }
  editMatch(id: number): void { this.router.navigate(['/admin/matches', id, 'edit']); }

  deleteMatch(match: Match): void {
    if (confirm('¿Eliminar este partido?')) {
      this.apiService.deleteMatch(match.id).subscribe({ next: () => this.loadMatches() });
    }
  }

  getStatusClass(status: string): string {
    const classes: any = {
      'Scheduled': 'bg-blue-100 text-blue-800',
      'InProgress': 'bg-green-100 text-green-800',
      'Finished': 'bg-gray-100 text-gray-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      'Scheduled': 'Programado',
      'InProgress': 'En Progreso',
      'Finished': 'Finalizado'
    };
    return labels[status] || status;
  }
}