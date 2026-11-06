import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ErrorAuth, LoginPeticion, RegistroPeticion, Usuario } from './usuario.model';

const URL_API = '/api/auth';

/**
 * Gestiona la sesión del usuario contra la API.
 *
 * La sesión real vive en una cookie HttpOnly que JavaScript no puede leer (ni necesita):
 * el navegador la envía sola en cada petición a /api. Aquí solo guardamos en memoria
 * quién es el usuario, para pintar la interfaz y para los guards.
 *
 * IMPORTANTE REVISAR: esta señal es solo para la interfaz. Quien decide de verdad si hay
 * permiso es siempre el backend; nunca confíes en el frontend para proteger datos.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly _usuario = signal<Usuario | null>(null);

  /** Usuario con sesión iniciada, o `null` si no hay sesión. */
  readonly usuario = this._usuario.asReadonly();

  /** `true` si hay sesión iniciada. Se recalcula solo cuando cambia `usuario`. */
  readonly autenticado = computed(() => this._usuario() !== null);

  /**
   * Pregunta a la API si la cookie sigue siendo válida. Se ejecuta al arrancar la aplicación
   * (ver `app.config.ts`), así que nunca debe lanzar un error: si falla, no hay sesión.
   */
  async comprobarSesion(): Promise<void> {
    try {
      this._usuario.set(await firstValueFrom(this.http.get<Usuario>(`${URL_API}/yo`)));
    } catch {
      // 401 (sin sesión) o backend caído: en ambos casos, sin sesión
      this._usuario.set(null);
    }
  }

  /** Inicia sesión. Si la API la rechaza, lanza un `ErrorAuth`. */
  async iniciarSesion(datos: LoginPeticion): Promise<Usuario> {
    try {
      const usuario = await firstValueFrom(this.http.post<Usuario>(`${URL_API}/login`, datos));
      this._usuario.set(usuario);
      return usuario;
    } catch (error) {
      throw interpretarError(error);
    }
  }

  /** Registra una cuenta (queda pendiente de aprobación). Devuelve el mensaje de la API. */
  async registrar(datos: RegistroPeticion): Promise<string> {
    try {
      const respuesta = await firstValueFrom(
        this.http.post<{ mensaje: string }>(`${URL_API}/registro`, datos),
      );
      return respuesta.mensaje;
    } catch (error) {
      throw interpretarError(error);
    }
  }

  /** Cierra la sesión. Aunque la API falle (p. ej. la sesión ya había caducado), se olvida al usuario. */
  async cerrarSesion(): Promise<void> {
    try {
      await firstValueFrom(this.http.post<void>(`${URL_API}/logout`, null));
    } catch {
      // Sin sesión en el servidor ya: no hay nada más que hacer
    } finally {
      this._usuario.set(null);
    }
  }

  /** Olvida al usuario sin llamar a la API. Lo usa el interceptor cuando la sesión ha caducado. */
  olvidarSesion(): void {
    this._usuario.set(null);
  }
}

/** Convierte cualquier error de HttpClient en un `ErrorAuth` con un mensaje comprensible. */
function interpretarError(error: unknown): ErrorAuth {
  if (!(error instanceof HttpErrorResponse)) {
    return { codigo: null, mensaje: 'Ha ocurrido un error inesperado.', errores: {} };
  }

  if (error.status === 0) {
    return { codigo: null, mensaje: 'No se puede conectar con el servidor. Inténtalo más tarde.', errores: {} };
  }

  // La API responde con ProblemDetails: { detail, codigo } o { errors: { Campo: [...] } }
  const cuerpo = (error.error ?? {}) as { detail?: string; codigo?: ErrorAuth['codigo']; errors?: Record<string, string[]> };

  return {
    codigo: cuerpo.codigo ?? null,
    mensaje: cuerpo.detail ?? (cuerpo.errors ? 'Revisa los datos del formulario.' : 'Ha ocurrido un error inesperado.'),
    errores: cuerpo.errors ?? {},
  };
}
