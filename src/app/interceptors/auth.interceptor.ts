import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Excluir rutas de autenticación del interceptor
  const authRoutes = ['/auth/login', '/auth/register'];
  const isAuthRoute = authRoutes.some(route => req.url.includes(route));
  
  // Si es una ruta de autenticación, no agregar el token
  if (isAuthRoute) {
    console.log('Auth interceptor: Skipping token for auth route:', req.url);
    console.log('Auth interceptor: Request headers:', req.headers.keys());
    return next(req);
  }
  
  const token = localStorage.getItem(environment.jwtKey);
  
  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned);
  }
  
  return next(req);
};
