import { afterNextRender, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import * as L from 'leaflet';

// Vista inicial: la península. Baleares, Canarias, Ceuta y Melilla se alcanzan arrastrando el mapa.
const CENTRO_INICIAL: L.LatLngExpression = [40.0, -3.7];
const ZOOM_INICIAL = 6;
// Zoom tras localizar al usuario: nivel de comunidad autónoma, un poco más cerca que la vista de país.
const ZOOM_UBICACION = 8;

// Teselas gratuitas (sin clave). Ambos proveedores exigen atribución visible, que Leaflet muestra con la opción attribution.
const URL_CARRETERAS = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATRIBUCION_CARRETERAS = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const URL_SATELITE = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const ATRIBUCION_SATELITE = 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community';

/**
 * Mapa de España con dos capas base: satélite (por defecto) y carreteras.
 * Se puede arrastrar y hacer zoom para llegar a las islas.
 */
@Component({
  selector: 'app-mapa-espana',
  templateUrl: './mapa-espana.html',
  styleUrl: '../../../styles/components/mapa-espana.scss',
})
export class MapaEspana {
  // Referencia al <div #lienzo> de la plantilla. Leaflet necesita ese elemento para dibujar el mapa dentro.
  private readonly lienzo = viewChild.required<ElementRef<HTMLDivElement>>('lienzo');
  private readonly destruccion = inject(DestroyRef);

  private mapa?: L.Map;
  private capaSatelite?: L.TileLayer;
  private capaCarreteras?: L.TileLayer;

  // true = satélite visible. Es el estado que decide qué capa se muestra y qué texto tiene el botón.
  protected readonly satelite = signal(true);

  // Estado de la geolocalización: si se está buscando la posición y el mensaje para el usuario (null = sin mensaje).
  protected readonly buscandoUbicacion = signal(false);
  protected readonly mensaje = signal<string | null>(null);
  private marcador?: L.CircleMarker;

  constructor() {
    // Leaflet necesita el elemento ya pintado y con tamaño. afterNextRender espera a ese momento
    // y se ejecuta una sola vez, tras el primer render del componente.
    afterNextRender(() => this.iniciarMapa());

    // Al destruir el componente (p. ej. al cambiar de página) se elimina el mapa y sus eventos.
    // Se pone mapa a undefined para que una respuesta de geolocalización que llegue tarde no toque un mapa ya eliminado.
    this.destruccion.onDestroy(() => {
      this.mapa?.remove();
      this.mapa = undefined;
    });
  }

  protected alternarCapa(): void {
    const { mapa, capaSatelite, capaCarreteras } = this;
    if (!mapa || !capaSatelite || !capaCarreteras) {
      return;
    }

    const mostrarSatelite = !this.satelite();
    if (mostrarSatelite) {
      capaCarreteras.remove();
      capaSatelite.addTo(mapa);
    } else {
      capaSatelite.remove();
      capaCarreteras.addTo(mapa);
    }
    this.satelite.set(mostrarSatelite);
  }

  // IMPORTANTE REVISAR: esta función trata la ubicación del usuario, que es un dato personal.
  // Solo se pide al pulsar el botón (nunca al cargar la página), y las coordenadas no se envían al servidor
  // ni se guardan: solo se usan para centrar el mapa y dibujar el marcador en el navegador.
  protected usarMiUbicacion(): void {
    if (!this.mapa || this.buscandoUbicacion()) {
      return;
    }
    // navigator.geolocation no existe en páginas no seguras (http que no sea localhost).
    if (!navigator.geolocation) {
      this.mensaje.set('Tu navegador no permite obtener la ubicación en esta página.');
      return;
    }

    this.buscandoUbicacion.set(true);
    this.mensaje.set(null);
    navigator.geolocation.getCurrentPosition(
      (posicion) => this.mostrarUbicacion(posicion),
      (error) => this.ubicacionFallida(error),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }

  private mostrarUbicacion(posicion: GeolocationPosition): void {
    this.buscandoUbicacion.set(false);
    const mapa = this.mapa;
    if (!mapa) {
      return;
    }

    const destino: L.LatLngExpression = [posicion.coords.latitude, posicion.coords.longitude];
    mapa.setView(destino, ZOOM_UBICACION);

    // Un solo marcador: si se vuelve a pulsar el botón, se sustituye el anterior.
    this.marcador?.remove();
    this.marcador = L.circleMarker(destino, {
      radius: 8,
      color: '#1a3d18',
      fillColor: '#2d5a27',
      fillOpacity: 0.9,
      weight: 2,
    })
      .bindTooltip('Tu ubicación')
      .addTo(mapa);
  }

  private ubicacionFallida(error: GeolocationPositionError): void {
    this.buscandoUbicacion.set(false);
    this.mensaje.set(
      error.code === error.PERMISSION_DENIED
        ? 'No has dado permiso de ubicación. El mapa sigue mostrando España; puedes volver a intentarlo cuando quieras.'
        : 'No hemos podido obtener tu ubicación. Inténtalo de nuevo.',
    );
  }

  private iniciarMapa(): void {
    this.capaSatelite = L.tileLayer(URL_SATELITE, { attribution: ATRIBUCION_SATELITE, maxZoom: 19 });
    this.capaCarreteras = L.tileLayer(URL_CARRETERAS, { attribution: ATRIBUCION_CARRETERAS, maxZoom: 19 });

    // Solo se añade una capa al crear el mapa: la que indique el estado inicial.
    this.mapa = L.map(this.lienzo().nativeElement, {
      center: CENTRO_INICIAL,
      zoom: ZOOM_INICIAL,
      layers: [this.satelite() ? this.capaSatelite : this.capaCarreteras],
    });
  }
}
