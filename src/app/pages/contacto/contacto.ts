import { Component } from '@angular/core';

@Component({
  selector: 'app-contacto',
  template: `
    <section class="page">
      <div class="container">
        <h1>Contacto</h1>
        <p>Formulario de ejemplo (solo visual, aún sin envío).</p>
        <form class="form" (submit)="$event.preventDefault()">
          <label>
            Nombre
            <input type="text" name="nombre" />
          </label>
          <label>
            Email
            <input type="email" name="email" />
          </label>
          <label>
            Mensaje
            <textarea name="mensaje" rows="5"></textarea>
          </label>
          <button class="btn" type="submit">Enviar</button>
        </form>
      </div>
    </section>
  `,
  styleUrl: '../../../styles/pages/contacto.scss',
})
export class Contacto {}
