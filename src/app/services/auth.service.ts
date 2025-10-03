import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { LoginDto, RegisterDto, AuthResponse } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5231/api/auth';
  private tokenKey = 'auth_token';
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;
  private userSubject = new BehaviorSubject<AuthResponse | null>(null);

  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      this.userSubject.next(this.getCurrentUser());
    }
  }

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
    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
    }
    this.userSubject.next(null);
  }

  getToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser) {
      return false;
    }

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
    if (!this.isBrowser) {
      return null;
    }

    const token = this.getToken();
    if (!token || !this.isAuthenticated()) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        token,
        username: payload.unique_name,
        email: payload.email,
        expiresAt: new Date(payload.exp * 1000).toISOString()
      };
    } catch {
      return null;
    }
  }
}