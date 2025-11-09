import { Routes } from '@angular/router';
import { LoginComponent } from './demo/login/login';
import { DashboardComponent } from './demo/dashboard/dashboard';
import { ArtistasComponent } from './demo/dashboard/components/artistas/artistas';
import { ObrasComponent } from './demo/dashboard/components/obras/obras';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { 
    path: 'login', 
    loadComponent: () => import('./demo/login/login').then(m => m.LoginComponent),
    title: 'Iniciar Sesión - Museo UTM'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'inicio'
      },
      {
        path: 'inicio',
        data: { title: 'Inicio' },
        children: []
      },
      {
        path: 'artistas',
        component: ArtistasComponent,
        data: { title: 'Artistas' }
      },
      {
        path: 'obras',
        component: ObrasComponent,
        title: 'Obras - Museo UTM',
        data: { title: 'Obras' }
      }
      // Agrega más rutas hijas del dashboard aquí
    ]
  },
  { 
    path: '', 
    redirectTo: '/dashboard', 
    pathMatch: 'full' 
  },
  { 
    path: '**', 
    redirectTo: '/dashboard' 
  }
];
