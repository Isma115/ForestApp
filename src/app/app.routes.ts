import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', title: 'Inicio | ForestApp', loadComponent: () => import('./pages/inicio/inicio').then((m) => m.Inicio) },
  { path: 'nosotros', title: 'Nosotros | ForestApp', loadComponent: () => import('./pages/nosotros/nosotros').then((m) => m.Nosotros) },
  { path: 'servicios', title: 'Servicios | ForestApp', loadComponent: () => import('./pages/servicios/servicios').then((m) => m.Servicios) },
  { path: 'contacto', title: 'Contacto | ForestApp', loadComponent: () => import('./pages/contacto/contacto').then((m) => m.Contacto) },
  { path: '**', redirectTo: '' },
];
