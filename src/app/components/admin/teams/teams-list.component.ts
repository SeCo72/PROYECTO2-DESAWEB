import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Team } from '../../../models/models';

@Component({
  selector: 'app-teams-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-3xl font-bold text-gray-900">Equipos</h2>
            <p class="text-gray-600 mt-1">Gestiona los equipos de basketball</p>
          </div>
          <div class="flex gap-3">
            <button 
              (click)="router.navigate(['/admin/dashboard'])"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              ← Volver
            </button>
            <button 
              (click)="router.navigate(['/admin/teams/new'])"
              class="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              + Nuevo Equipo
            </button>
          </div>
        </div>

        <!-- Search -->
        <div class="bg-white rounded-lg shadow p-4 mb-6">
          <input 
            type="text" 
            [(ngModel)]="searchTerm"
            (input)="onSearch()"
            placeholder="Buscar equipos..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          />
        </div>

        <!-- Loading -->
        @if (loading) {
          <div class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        }

        <!-- Teams Grid -->
        @if (!loading && teams.length > 0) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (team of teams; track team.id) {
              <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden">
                <!-- Team Header -->
                <div class="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
                  @if (team.logoUrl) {
                    <img [src]="team.logoUrl" [alt]="team.name" class="w-20 h-20 rounded-full bg-white p-2 mx-auto mb-3">
                  } @else {
                    <div class="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-3">
                      <span class="text-3xl">🏀</span>
                    </div>
                  }
                  <h3 class="text-xl font-bold text-center">{{ team.name }}</h3>
                  <p class="text-orange-100 text-center text-sm mt-1">{{ team.city }}</p>
                </div>

                <!-- Team Info -->
                <div class="p-6">
                  <div class="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span>👥 {{ team.players?.length || 0 }} jugadores</span>
                  </div>

                  <!-- Actions -->
                  <div class="flex gap-2">
                    <button 
                      (click)="editTeam(team.id)"
                      class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      (click)="deleteTeam(team)"
                      class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        }

        <!-- Empty State -->
        @if (!loading && teams.length === 0) {
          <div class="bg-white rounded-lg shadow p-12 text-center">
            <div class="text-6xl mb-4">🏀</div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">No hay equipos</h3>
            <p class="text-gray-600 mb-6">Comienza creando tu primer equipo</p>
            <button 
              (click)="router.navigate(['/admin/teams/new'])"
              class="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Crear Equipo
            </button>
          </div>
        }
      </div>
    </div>
  `
})
export class TeamsListComponent implements OnInit {
  teams: Team[] = [];
  loading = false;
  searchTerm = '';

  constructor(
    private apiService: ApiService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams(): void {
    this.loading = true;
    this.apiService.getTeams(this.searchTerm).subscribe({
      next: (data) => {
        this.teams = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading teams:', err);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.loadTeams();
  }

  editTeam(id: number): void {
    this.router.navigate(['/admin/teams', id, 'edit']);
  }

  deleteTeam(team: Team): void {
    if (confirm(`¿Estás seguro de eliminar "${team.name}"?`)) {
      this.apiService.deleteTeam(team.id).subscribe({
        next: () => {
          this.loadTeams();
        },
        error: (err) => {
          alert('Error al eliminar el equipo: ' + (err.error?.message || err.message));
        }
      });
    }
  }
}