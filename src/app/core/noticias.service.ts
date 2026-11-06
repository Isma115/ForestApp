import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { switchMap, timer } from 'rxjs';
import { Noticia, NoticiasRespuesta } from './noticia.model';

const URL_API = '/api/noticias';
// TEMPORAL (prueba del indicador de carga): espera antes de pedir las noticias. Quitar al terminar la prueba.
const RETRASO_PRUEBA_MS = 3000;

/** Comprueba que un texto sea una URL absoluta http o https. */
function esUrlHttp(valor: string | null | undefined): valor is string {
  if (!valor) {
    return false;
  }
  try {
    const { protocol } = new URL(valor);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Obtiene las noticias forestales del backend y las expone como señales de solo lectura.
 * Es un servicio `providedIn: 'root'`: hay una única instancia compartida por toda la aplicación.
 */
@Injectable({ providedIn: 'root' })
export class NoticiasService {
  private readonly http = inject(HttpClient);

  private readonly _noticias = signal<Noticia[]>([]);
  private readonly _cargando = signal(false);
  private readonly _error = signal(false);

  readonly noticias = this._noticias.asReadonly();
  readonly cargando = this._cargando.asReadonly();
  readonly error = this._error.asReadonly();

  /** Pide las noticias al backend. Si ya hay una petición en curso, no lanza otra. */
  cargar(): void {
    if (this._cargando()) {
      return;
    }

    this._cargando.set(true);
    this._error.set(false);

    // TEMPORAL: timer(RETRASO_PRUEBA_MS) retrasa la petición 3 s para ver el indicador. Quitar con la prueba.
    timer(RETRASO_PRUEBA_MS)
      .pipe(switchMap(() => this.http.get<NoticiasRespuesta>(URL_API)))
      .subscribe({
        next: (respuesta) => {
          this._noticias.set(this.filtrarValidas(respuesta.noticias));
          this._cargando.set(false);
        },
        error: () => {
          // Se conservan las noticias que ya hubiera cargadas; solo se avisa del fallo.
          this._error.set(true);
          this._cargando.set(false);
        },
      });
  }

  /**
   * Segunda barrera de seguridad: aunque el backend ya valida, aquí se descartan las noticias
   * con enlaces que no sean http/https y se quitan las imágenes inválidas.
   */
  private filtrarValidas(noticias: Noticia[] | null | undefined): Noticia[] {
    return (noticias ?? [])
      .filter((n) => esUrlHttp(n.enlace))
      .map((n) => ({ ...n, imagenUrl: esUrlHttp(n.imagenUrl) ? n.imagenUrl : null }));
  }
}
