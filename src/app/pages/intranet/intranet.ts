import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

/**
 * Página de la intranet. Con sesión muestra la bienvenida; sin sesión, un aviso con un botón para iniciarla.
 *
 * IMPORTANTE REVISAR: ocultar contenido en el frontend no lo protege. Cualquier dato privado que se muestre
 * aquí debe venir de un endpoint del backend protegido con [Authorize].
 */
@Component({
  selector: 'app-intranet',
  imports: [RouterLink],
  template: `
    <section class="page">
      <div class="container intranet">
        @if (auth.autenticado()) {
          <h1>Hola, {{ auth.usuario()?.nombre }}</h1>
          <p>Bienvenido a la intranet de ForestApp.</p>
        } @else {
          <!-- Ilustración decorativa: un abeto con un candado (bosque + acceso restringido) -->
          <svg class="intranet__icono" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
            <polygon class="icono__arbol" points="54,8 22,50 36,50 14,82 94,82 72,50 86,50" />
            <rect class="icono__tronco" x="48" y="82" width="12" height="16" />
            <line class="icono__suelo" x1="8" y1="99" x2="112" y2="99" />
            <path class="icono__arco" d="M80 76 v-8 a10 10 0 0 1 20 0 v8" />
            <rect class="icono__candado" x="72" y="76" width="36" height="28" rx="4" />
            <circle class="icono__cerradura" cx="90" cy="88" r="3.5" />
            <rect class="icono__cerradura" x="88.5" y="89" width="3" height="8" rx="1" />
          </svg>
          <h1>Intranet</h1>
          <p>Debes iniciar sesión para acceder a la intranet.</p>
          <a class="btn" routerLink="/iniciar-sesion">Iniciar sesión</a>
        }
      </div>
    </section>
  `,
  styleUrl: '../../../styles/pages/intranet.scss',
})
export class Intranet {
  protected readonly auth = inject(AuthService);
}
