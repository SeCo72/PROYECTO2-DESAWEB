import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Team } from '../../../models/models';

@Component({
  selector: 'app-team-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-6">
          <h2 class="text-3xl font-bold text-gray-900">
            {{ isEdit ? 'Editar Equipo' : 'Nuevo Equipo' }}
          </h2>
        </div>

        <div class="bg-white rounded-xl shadow-md p-6">
          <form (ngSubmit)="onSubmit()" #teamForm="ngForm">
            <!-- Nombre -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Equipo *
              </label>
              <input 
                type="text" 
                [(ngModel)]="team.name" 
                name="name"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="Lakers, Bulls, etc."
              />
            </div>

            <!-- Ciudad -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Ciudad *
              </label>
              <input 
                type="text" 
                [(ngModel)]="team.city" 
                name="city"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="Los Angeles, Chicago, etc."
              />
            </div>

            <!-- Logo URL -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                URL del Logo (opcional)
              </label>
              <input 
                type="url" 
                [(ngModel)]="team.logoUrl" 
                name="logoUrl"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="https://ejemplo.com/logo.png"
              />
              @if (team.logoUrl) {
                <div class="mt-3">
                  <img [src]="team.logoUrl" alt="Preview" class="w-24 h-24 object-contain border rounded-lg p-2">
                </div>
              }
            </div>

            <!-- Error Message -->
            @if (errorMessage) {
              <div class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {{ errorMessage }}
              </div>
            }

            <!-- Actions -->
            <div class="flex gap-3">
              <button 
                type="button"
                (click)="router.navigate(['/admin/teams'])"
                class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                [disabled]="!teamForm.valid || loading"
                class="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
              >
                @if (loading) {
                  <span>Guardando...</span>
                } @else {
                  <span>{{ isEdit ? 'Actualizar' : 'Crear' }} Equipo</span>
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class TeamFormComponent implements OnInit {
  team: Partial<Team> = {
    name: '',
    city: '',
    logoUrl: ''
  };
  isEdit = false;
  loading = false;
  errorMessage = '';
  teamId?: number;

  constructor(
    private apiService: ApiService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.teamId = +id;
      this.loadTeam(this.teamId);
    }
  }

  loadTeam(id: number): void {
    this.loading = true;
    this.apiService.getTeam(id).subscribe({
      next: (data) => {
        this.team = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar el equipo';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';

    const request = this.isEdit && this.teamId
      ? this.apiService.updateTeam(this.teamId, this.team as Team)
      : this.apiService.createTeam(this.team);

    request.subscribe({
      next: () => {
        this.router.navigate(['/admin/teams']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al guardar el equipo';
        this.loading = false;
      }
    });
  }
}