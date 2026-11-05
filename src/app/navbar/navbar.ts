import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: '../../styles/components/navbar.scss',
})
export class Navbar {
  protected readonly menuOpen = signal(false);

  protected readonly links = [
    { path: '/', label: 'Inicio' },
    { path: '/mapa-de-espana', label: 'Mapa de España' },
    { path: '/intranet', label: 'Intranet' },
    { path: '/iniciar-sesion', label: 'Iniciar Sesión' },
  ];

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
