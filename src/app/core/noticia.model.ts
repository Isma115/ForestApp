/** Una noticia tal y como la devuelve la API (`GET /api/noticias`). */
export interface Noticia {
  titulo: string;
  resumen: string;
  /** URL absoluta de la imagen, o `null` si la noticia no tiene. */
  imagenUrl: string | null;
  fuente: string;
  /** Fecha de publicación en formato ISO 8601. */
  fecha: string;
  /** URL del artículo original. */
  enlace: string;
}

/** Respuesta completa de `GET /api/noticias`. */
export interface NoticiasRespuesta {
  /** Última actualización correcta en el servidor, o `null` si aún no hay datos. */
  actualizadoEn: string | null;
  noticias: Noticia[];
}
