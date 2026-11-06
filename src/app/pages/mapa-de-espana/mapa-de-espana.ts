import { Component } from '@angular/core';
import { MapaEspana } from '../../components/mapa-espana/mapa-espana';

@Component({
  selector: 'app-mapa-de-espana',
  imports: [MapaEspana],
  template: `
    <section class="page">
      <div class="container">
        <app-mapa-espana />
      </div>
    </section>
  `,
  styleUrl: '../../../styles/pages/mapa-de-espana.scss',
})
export class MapaDeEspana {}
