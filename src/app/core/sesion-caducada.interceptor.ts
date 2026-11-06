import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * Peticiones cuyo 401 forma parte del funcionamiento normal y que gestiona el propio AuthService:
 * login (credenciales incorrectas), yo (comprobar si hay sesión) y logout.
 */
const RUTAS_EXCLUIDAS = ['/api/auth/login', '/api/auth/yo', '/api/auth/logout'];

/**
 * Si la API responde 401 a cualquier otra petición mientras creíamos tener sesión,
 * es que la cookie ha caducado (30 min de inactividad): se olvida al usuario y se
 * lleva a la página de inicio de sesión.
 *
 * IMPORTANTE REVISAR: el error se sigue propagando (throwError) para que quien hizo
 * la petición sepa que falló.
 */
export const sesionCaducadaInterceptor: HttpInterceptorFn = (peticion, siguiente) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return siguiente(peticion).pipe(
    catchError((error: unknown) => {
      const esSesionCaducada =
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        peticion.url.startsWith('/api/') &&
        !RUTAS_EXCLUIDAS.some((ruta) => peticion.url.startsWith(ruta)) &&
        auth.autenticado();

      if (esSesionCaducada) {
        auth.olvidarSesion();
        void router.navigate(['/iniciar-sesion']);
      }

      return throwError(() => error);
    }),
  );
};
