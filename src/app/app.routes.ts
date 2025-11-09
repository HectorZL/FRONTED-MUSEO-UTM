import { Routes } from '@angular/router';
import { LoginComponent } from './demo/login/login';

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent,
    title: 'Iniciar Sesión - Museo UTM'
  },
  { 
    path: '', 
    redirectTo: '/login', 
    pathMatch: 'full' 
  },
  { 
    path: '**', 
    redirectTo: '/login' 
  }
];
