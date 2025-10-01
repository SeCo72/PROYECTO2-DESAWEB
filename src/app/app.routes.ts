import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/login',  
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'scoreboard', 
    loadComponent: () => import('./scoreboard/scoreboard').then(m => m.ScoreboardComponent),
    canActivate: [authGuard] 
  },
  { 
    path: 'admin', 
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./components/admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'teams', loadComponent: () => import('./components/admin/teams/teams-list.component').then(m => m.TeamsListComponent) },
      { path: 'teams/new', loadComponent: () => import('./components/admin/teams/team-form.component').then(m => m.TeamFormComponent) },
      { path: 'teams/:id/edit', loadComponent: () => import('./components/admin/teams/team-form.component').then(m => m.TeamFormComponent) },
      { path: 'players', loadComponent: () => import('./components/admin/players/players-list.component').then(m => m.PlayersListComponent) },
      { path: 'players/new', loadComponent: () => import('./components/admin/players/player-form.component').then(m => m.PlayerFormComponent) },
      { path: 'players/:id/edit', loadComponent: () => import('./components/admin/players/player-form.component').then(m => m.PlayerFormComponent) },
      { path: 'matches', loadComponent: () => import('./components/admin/matches/matches-list.component').then(m => m.MatchesListComponent) },
      { path: 'matches/new', loadComponent: () => import('./components/admin/matches/match-form.component').then(m => m.MatchFormComponent) },
      { path: 'matches/:id/edit', loadComponent: () => import('./components/admin/matches/match-form.component').then(m => m.MatchFormComponent) },
    ]
  },
  { 
    path: '**', 
    redirectTo: '/login'  
  }
];