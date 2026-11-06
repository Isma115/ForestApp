import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/auth.service';

const RUTA_LOGIN = '/iniciar-sesion';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: '../../styles/components/navbar.scss',
})
export class Navbar {
  private readonly router = inject(Router);
  protected readonly auth = inject(AuthService);

  protected readonly menuOpen = signal(false);

  private readonly links = [
    { path: '/', label: 'Inicio' },
    { path: '/mapa-de-espana', label: 'Mapa de España' },
    { path: '/intranet', label: 'Intranet' },
    { path: RUTA_LOGIN, label: 'Iniciar Sesión' },
  ];

  /** Con sesión iniciada se oculta "Iniciar Sesión" (en su lugar aparecen el nombre y "Cerrar sesión"). */
  protected readonly linksVisibles = computed(() =>
    this.auth.autenticado() ? this.links.filter((link) => link.path !== RUTA_LOGIN) : this.links,
  );

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected async cerrarSesion(): Promise<void> {
    this.closeMenu();
    await this.auth.cerrarSesion();
    await this.router.navigateByUrl('/');
  }
}
