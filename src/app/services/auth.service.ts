import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { LoginDto, RegisterDto, AuthResponse } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5231/api/auth';
  private tokenKey = 'auth_token';

  // Inicializa userSubject con la info actual si hay token válido
  private userSubject = new BehaviorSubject<AuthResponse | null>(this.getCurrentUser());
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.userSubject.next(response);
        })
      );
  }

  register(data: RegisterDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.userSubject.next(response);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.userSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getCurrentUser(): AuthResponse | null {
    const token = this.getToken();
    if (!token || !this.isAuthenticated()) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        token,
        username: payload.unique_name || 'Admin', // asegura que siempre haya un username
        email: payload.email || '',
        expiresAt: new Date(payload.exp * 1000).toISOString()
      };
    } catch {
      return null;
    }
  }
}
