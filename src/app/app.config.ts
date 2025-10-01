import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }), // 👈 Usamos zone.js clásico
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])), // 👈 JWT Interceptor
    provideClientHydration(withEventReplay()) // 👈 Mantener hydration si lo necesitas
  ]
};
