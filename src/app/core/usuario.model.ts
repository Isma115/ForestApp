/** Usuario con sesión iniciada, tal y como lo devuelve la API (`/api/auth/login` y `/api/auth/yo`). */
export interface Usuario {
  nombre: string;
  email: string;
}

/** Cuerpo de `POST /api/auth/registro`. */
export interface RegistroPeticion {
  nombre: string;
  email: string;
  password: string;
  confirmarPassword: string;
}

/** Cuerpo de `POST /api/auth/login`. */
export interface LoginPeticion {
  email: string;
  password: string;
}

/** Códigos de error que envía la API en la propiedad `codigo` de sus respuestas de error. */
export type CodigoErrorAuth = 'credenciales_invalidas' | 'cuenta_pendiente' | 'cuenta_bloqueada';

/** Error de autenticación ya interpretado, listo para mostrarlo en pantalla. */
export interface ErrorAuth {
  /** Código de la API, o `null` si es un error sin código (validación, red caída...). */
  codigo: CodigoErrorAuth | null;
  /** Mensaje para el usuario. */
  mensaje: string;
  /** Errores de validación por campo (respuestas 400), p. ej. `{ Password: ['...'] }`. */
  errores: Record<string, string[]>;
}
