import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AuthService } from './core/auth.service';
import { sesionCaducadaInterceptor } from './core/sesion-caducada.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([sesionCaducadaInterceptor])),
    // Antes de mostrar nada, comprueba si la cookie de sesión sigue siendo válida.
    // Angular espera a que la promesa termine, así los guards ya saben si hay sesión.
    provideAppInitializer(() => inject(AuthService).comprobarSesion()),
  ],
};
