import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', title: 'Inicio | ForestApp', loadComponent: () => import('./pages/inicio/inicio').then((m) => m.Inicio) },
  { path: 'nosotros', title: 'Nosotros | ForestApp', loadComponent: () => import('./pages/nosotros/nosotros').then((m) => m.Nosotros) },
  { path: 'servicios', title: 'Servicios | ForestApp', loadComponent: () => import('./pages/servicios/servicios').then((m) => m.Servicios) },
  { path: 'mapa-de-espana', title: 'Mapa de España | ForestApp', loadComponent: () => import('./pages/mapa-de-espana/mapa-de-espana').then((m) => m.MapaDeEspana) },
  { path: 'contacto', title: 'Contacto | ForestApp', loadComponent: () => import('./pages/contacto/contacto').then((m) => m.Contacto) },
  { path: 'iniciar-sesion', title: 'Iniciar sesión | ForestApp', loadComponent: () => import('./pages/iniciar-sesion/iniciar-sesion').then((m) => m.IniciarSesion) },
  { path: 'registro', title: 'Crear cuenta | ForestApp', loadComponent: () => import('./pages/registro/registro').then((m) => m.Registro) },
  // Sin sesión, la propia página muestra un aviso con un botón para iniciar sesión
  { path: 'intranet', title: 'Intranet | ForestApp', loadComponent: () => import('./pages/intranet/intranet').then((m) => m.Intranet) },
  { path: '**', redirectTo: '' },
];
