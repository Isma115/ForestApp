import { Component, DestroyRef, OnInit, computed, effect, inject, signal } from '@angular/core';
import { Noticia } from '../../core/noticia.model';
import { NoticiasService } from '../../core/noticias.service';

const MAXIMO_NOTICIAS = 6;
const INTERVALO_MS = 10000;
// Tiempo máximo mostrando el spinner. Pasado este tiempo sin respuesta, se avisa de que no hay noticias.
const TIEMPO_MAXIMO_CARGA_MS = 30000;
const FORMATO_FECHA = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

/**
 * Carrusel con las últimas noticias forestales (máximo 6).
 * Avanza solo cada 10 s; se pausa al pasar el ratón o al enfocar con el teclado, y se desactiva del todo al pulsar una flecha.
 */
@Component({
  selector: 'app-noticias-carrusel',
  templateUrl: './noticias-carrusel.html',
  styleUrl: '../../../styles/components/noticias-carrusel.scss',
})
export class NoticiasCarrusel implements OnInit {
  private readonly servicio = inject(NoticiasService);
  private readonly destruccion = inject(DestroyRef);
  private temporizadorCarga?: ReturnType<typeof setTimeout>;

  // true cuando han pasado 30 s y las noticias siguen sin llegar.
  protected readonly tiempoAgotado = signal(false);

  // Quien prefiere menos movimiento (ajuste del sistema operativo) no tiene avance automático.
  private readonly reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  protected readonly noticias = computed(() => this.servicio.noticias().slice(0, MAXIMO_NOTICIAS));
  protected readonly cargando = this.servicio.cargando;
  protected readonly error = this.servicio.error;

  private readonly indice = signal(0);
  protected readonly salto = signal<0 | 1 | 2>(0);
  // El índice se ajusta si la lista se acorta tras una recarga.
  protected readonly actual = computed(() =>
    Math.min(this.indice(), Math.max(0, this.noticias().length - 1)),
  );

  protected readonly autoplay = signal(!this.reducirMovimiento);
  private readonly pausaRaton = signal(false);
  private readonly pausaFoco = signal(false);
  protected readonly enMarcha = computed(
    () =>
      this.noticias().length > 1 && this.autoplay() && !this.pausaRaton() && !this.pausaFoco(),
  );

  private readonly imagenesFallidas = signal<ReadonlySet<string>>(new Set());

  constructor() {
    // Cada vez que cambia la noticia visible (sola o a mano) o el estado de pausa,
    // se reinicia la cuenta atrás. El temporizador anterior se cancela en onCleanup.
    effect((onCleanup) => {
      this.actual();
      if (!this.enMarcha()) {
        return;
      }
      const id = setTimeout(() => this.siguiente(), INTERVALO_MS);
      onCleanup(() => clearTimeout(id));
    });

    // Si la persona sale de la página antes de que llegue la respuesta, se cancela la cuenta de 30 s.
    this.destruccion.onDestroy(() => clearTimeout(this.temporizadorCarga));
  }

  ngOnInit(): void {
    this.cargarNoticias();
  }

  // Pide las noticias y arranca la cuenta de 30 s. Si la respuesta llega después, el carrusel aparece igualmente.
  private cargarNoticias(): void {
    this.servicio.cargar();
    this.tiempoAgotado.set(false);
    clearTimeout(this.temporizadorCarga);
    this.temporizadorCarga = setTimeout(() => {
      if (this.servicio.cargando()) {
        this.tiempoAgotado.set(true);
      }
    }, TIEMPO_MAXIMO_CARGA_MS);
  }

  protected siguiente(): void {
    const total = this.noticias().length;
    if (total > 0) {
      this.cambiarA((this.actual() + 1) % total);
    }
  }

  protected anterior(): void {
    const total = this.noticias().length;
    if (total > 0) {
      this.cambiarA((this.actual() - 1 + total) % total);
    }
  }

  protected irA(posicion: number): void {
    this.cambiarA(posicion);
  }

  // Cambio de a una noticia: desliza. Salto de varias (p. ej. de la última a la primera): en lugar de
  // recorrer todas las diapositivas, aparece la nueva con un fundido suave. El valor alterna entre 1 y 2
  // para que la animación CSS se reinicie en saltos consecutivos; 0 = sin salto (deslizamiento normal).
  private cambiarA(nuevo: number): void {
    const salto = Math.abs(nuevo - this.actual()) > 1;
    this.salto.update((valor) => (salto ? (valor === 1 ? 2 : 1) : 0));
    this.indice.set(nuevo);
  }

  // Si la persona navega a mano (flechas del carrusel o del teclado), se desactiva el avance automático.
  protected navegarAnterior(): void {
    this.autoplay.set(false);
    this.anterior();
  }

  protected navegarSiguiente(): void {
    this.autoplay.set(false);
    this.siguiente();
  }

  protected recargar(): void {
    this.cargarNoticias();
  }

  // Solo el ratón pausa: en pantallas táctiles "pointerleave" no siempre llega y se quedaría pausado.
  protected alEntrarPuntero(evento: PointerEvent): void {
    if (evento.pointerType === 'mouse') {
      this.pausaRaton.set(true);
    }
  }

  protected alSalirPuntero(): void {
    this.pausaRaton.set(false);
  }

  // Solo pausa el foco de teclado (:focus-visible), no el que deja un clic de ratón.
  protected alEnfocar(evento: FocusEvent): void {
    if ((evento.target as HTMLElement).matches(':focus-visible')) {
      this.pausaFoco.set(true);
    }
  }

  protected alDesenfocar(): void {
    this.pausaFoco.set(false);
  }

  protected mostrarImagen(noticia: Noticia): boolean {
    return noticia.imagenUrl !== null && !this.imagenesFallidas().has(noticia.imagenUrl);
  }

  // Si una imagen no carga (borrada, bloqueada por la web de origen...), se muestra el recuadro de relleno.
  protected imagenFallida(url: string | null): void {
    if (url) {
      this.imagenesFallidas.update((fallidas) => new Set(fallidas).add(url));
    }
  }

  protected formatearFecha(iso: string): string {
    const fecha = new Date(iso);
    return Number.isNaN(fecha.getTime()) ? '' : FORMATO_FECHA.format(fecha);
  }
}
