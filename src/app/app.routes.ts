import { Routes, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LoginComponent } from './demo/login/login';
import { DashboardComponent } from './demo/dashboard/dashboard';
import { AutoresComponent } from './demo/dashboard/components/autor/autor';
import { ObrasComponent } from './demo/dashboard/components/obras/obras';
import { authGuard, adminGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';

export const routes: Routes = [
  // Ruta de login (pública)
  { 
    path: 'login', 
    loadComponent: () => import('./demo/login/login').then(m => m.LoginComponent),
    title: 'Iniciar Sesión - Museo UTM',
    canActivate: [() => {
      const router = inject(Router);
      const authService = inject(AuthService);
      
      // Si ya está autenticado, redirigir al dashboard
      if (authService.isAuthenticated()) {
        router.navigate(['/dashboard']);
        return false;
      }
      return true;
    }]
  },
  
  // Ruta protegida para el dashboard - Solo admin
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    data: { 
      roles: ['admin'],
      title: 'Inicio'  // Default title
    },
    children: [
      {
        path: 'autores',
        component: AutoresComponent,
        data: { 
          title: 'Autores',
          roles: ['admin']
        },
        canActivate: [authGuard]
      },
      {
        path: 'obras',
        component: ObrasComponent,
        title: 'Obras - Museo UTM',
        data: { 
          title: 'Obras',
          roles: ['admin']
        },
        canActivate: [authGuard]
      }
    ]
  },
];
