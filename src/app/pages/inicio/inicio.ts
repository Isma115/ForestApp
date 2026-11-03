import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  template: `
    <section class="hero">
      <div class="container">
        <h1>Bienvenido a ForestApp</h1>
        <p>Texto de ejemplo para la página de inicio. Aquí irá el mensaje principal de la landing.</p>
        <a class="btn" routerLink="/contacto">Contáctanos</a>
      </div>
    </section>
  `,
  styleUrl: '../../../styles/pages/inicio.scss',
})
export class Inicio {}
