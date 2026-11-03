import { Component } from '@angular/core';

@Component({
  selector: 'app-servicios',
  template: `
    <section class="page">
      <div class="container">
        <h1>Servicios</h1>
        <div class="grid">
          @for (n of [1, 2, 3]; track n) {
            <article class="card">
              <h2>Servicio {{ n }}</h2>
              <p>Descripción de ejemplo del servicio. Contenido pendiente de definir.</p>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styleUrl: '../../../styles/pages/servicios.scss',
})
export class Servicios {}
