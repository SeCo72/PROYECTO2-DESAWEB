import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Player, Team } from '../../../models/models';

@Component({
  selector: 'app-players-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-3xl font-bold">Jugadores</h2>
          <div class="flex gap-3">
            <button (click)="router.navigate(['/admin/dashboard'])" class="px-4 py-2 bg-gray-200 rounded-lg">← Volver</button>
            <button (click)="router.navigate(['/admin/players/new'])" class="px-6 py-2 bg-orange-500 text-white rounded-lg">+ Nuevo Jugador</button>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-4 mb-6 flex gap-4">
          <input type="text" [(ngModel)]="searchTerm" (input)="onSearch()" placeholder="Buscar jugadores..." class="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
          <select [(ngModel)]="selectedTeamId" (change)="onTeamFilter()" class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none">
            <option [value]="null">Todos los equipos</option>
            @for (team of teams; track team.id) {
              <option [value]="team.id">{{ team.name }}</option>
            }
          </select>
        </div>

        @if (loading) {
          <div class="text-center py-12"><div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div></div>
        }

        @if (!loading && players.length > 0) {
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipo</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posición</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Edad</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Altura</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                @for (player of players; track player.id) {
                  <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap font-bold text-orange-500">{{ player.number }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ player.fullName }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ player.team?.name }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ player.position }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ player.age }} años</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ player.height }}m</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right">
                      <button (click)="editPlayer(player.id)" class="text-blue-600 hover:text-blue-800 mr-3">✏️</button>
                      <button (click)="deletePlayer(player)" class="text-red-600 hover:text-red-800">🗑️</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }

        @if (!loading && players.length === 0) {
          <div class="bg-white rounded-lg shadow p-12 text-center">
            <div class="text-6xl mb-4">👥</div>
            <h3 class="text-xl font-semibold mb-2">No hay jugadores</h3>
            <button (click)="router.navigate(['/admin/players/new'])" class="mt-4 px-6 py-3 bg-orange-500 text-white rounded-lg">Crear Jugador</button>
          </div>
        }
      </div>
    </div>
  `
})
export class PlayersListComponent implements OnInit {
  players: Player[] = [];
  teams: Team[] = [];
  loading = false;
  searchTerm = '';
  selectedTeamId: number | null = null;

  constructor(private apiService: ApiService, public router: Router) {}

  ngOnInit(): void {
    this.loadTeams();
    this.loadPlayers();
  }

  loadTeams(): void {
    this.apiService.getTeams().subscribe(data => this.teams = data);
  }

  loadPlayers(): void {
    this.loading = true;
    this.apiService.getPlayers(this.selectedTeamId || undefined, this.searchTerm).subscribe({
      next: (data) => { this.players = data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  onSearch(): void { this.loadPlayers(); }
  onTeamFilter(): void { this.loadPlayers(); }
  editPlayer(id: number): void { this.router.navigate(['/admin/players', id, 'edit']); }

  deletePlayer(player: Player): void {
    if (confirm(`¿Eliminar a ${player.fullName}?`)) {
      this.apiService.deletePlayer(player.id).subscribe({ next: () => this.loadPlayers() });
    }
  }
}