import { Routes } from '@angular/router';
import { LoginComponent } from './demo/login/login';
import { DashboardComponent } from './demo/dashboard/dashboard';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent,
    title: 'Iniciar Sesión - Museo UTM'
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: DashboardComponent,
        pathMatch: 'full'
      },
      {
        path: 'inicio',
        redirectTo: '/dashboard',
        pathMatch: 'full'
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
