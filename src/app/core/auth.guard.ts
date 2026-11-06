import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Protege rutas que necesitan sesión iniciada. Si no hay sesión, redirige a /iniciar-sesion.
 *
 * Funciona al recargar la página porque `app.config.ts` espera a `comprobarSesion()`
 * antes de que el router evalúe la primera ruta.
 *
 * IMPORTANTE REVISAR: un guard solo oculta pantallas. Los datos privados deben protegerse
 * en el backend con [Authorize]; cualquiera puede saltarse un guard desde el navegador.
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Devolver un UrlTree hace que el router redirija (mejor que llamar a navigate() aquí)
  return auth.autenticado() ? true : router.createUrlTree(['/iniciar-sesion']);
};
