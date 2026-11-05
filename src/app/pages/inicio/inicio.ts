import { Component } from '@angular/core';
import { NoticiasCarrusel } from '../../components/noticias-carrusel/noticias-carrusel';

@Component({
  selector: 'app-inicio',
  imports: [NoticiasCarrusel],
  template: `
    <section class="noticias">
      <div class="container">
        <h2>Últimas noticias forestales</h2>
        <p>Actualidad del sector forestal en España, recopilada de fuentes especializadas.</p>
        <app-noticias-carrusel />
      </div>
    </section>

    <section class="resumen">
      <div class="container">
        <h2>Resumen del proyecto</h2>
        <p>
          ForestApp es una aplicación web dedicada al mundo forestal. Reúne en un solo lugar
          información y servicios para quienes cuidan y trabajan en los montes, y te mantiene al día
          con la actualidad del sector.
        </p>
        <p>
          Desde la portada puedes consultar las últimas noticias forestales recopiladas de fuentes
          especializadas. La sección de información reúne datos y recursos del sector, y el mapa de
          España te permite localizar la actividad forestal por territorio. Si necesitas ayuda o
          quieres ponerte en contacto con nosotros, dispones de un formulario específico, y el área
          de intranet está reservada a los usuarios registrados que gestionan el día a día de la
          organización.
        </p>
        <p>
          (Texto de ejemplo: se sustituirá por el definitivo.)
        </p>
      </div>
    </section>
  `,
  styleUrl: '../../../styles/pages/inicio.scss',
})
export class Inicio {}
