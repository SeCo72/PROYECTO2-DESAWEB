import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Navbar -->
      <nav class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-2xl font-bold text-orange-500">🏀 Basketball Admin</h1>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-gray-700">{{ (user$ | async)?.username }}</span>
              <button 
                (click)="logout()"
                class="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-gray-900">Panel de Administración</h2>
          <p class="text-gray-600 mt-2">Gestiona equipos, jugadores y partidos</p>
        </div>

        <!-- Cards de acceso rápido -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Teams Card -->
          <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer" 
               (click)="navigate('/admin/teams')">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span class="text-2xl">🏆</span>
              </div>
              <span class="text-3xl font-bold text-blue-600">→</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Equipos</h3>
            <p class="text-gray-600 text-sm">Gestiona los equipos del sistema</p>
          </div>

          <!-- Players Card -->
          <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer"
               (click)="navigate('/admin/players')">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span class="text-2xl">👥</span>
              </div>
              <span class="text-3xl font-bold text-green-600">→</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Jugadores</h3>
            <p class="text-gray-600 text-sm">Administra el roster de jugadores</p>
          </div>

          <!-- Matches Card -->
          <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer"
               (click)="navigate('/admin/matches')">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span class="text-2xl">🏀</span>
              </div>
              <span class="text-3xl font-bold text-orange-600">→</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Partidos</h3>
            <p class="text-gray-600 text-sm">Programa y gestiona partidos</p>
          </div>
        </div>

        <!-- Acceso al marcador -->
        <div class="mt-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-md p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-2xl font-bold mb-2">Marcador en Vivo</h3>
              <p class="text-orange-100">Ve al tablero de juego en tiempo real</p>
            </div>
            <button 
              (click)="navigate('/scoreboard')"
              class="px-6 py-3 bg-white text-orange-500 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Ver Marcador →
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  user$!: Observable<any>; // <-- Aquí usamos 'any' para mantenerlo como tu código original

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user$ = this.authService.user$; // Inicializamos aquí
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
