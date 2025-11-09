import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    nombre: string;  // Note: backend uses 'nombre' instead of 'name'
    email: string;
    rol: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private jwtKey = environment.jwtKey;

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    const url = `${this.apiUrl}/auth/login`;
    
    // Asegurar que no se envíe token en el login
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    
    // Validar que las credenciales no estén vacías
    if (!credentials.email || !credentials.password) {
      return throwError(() => new Error('Email y contraseña son requeridos'));
    }
    
    // Prepare the exact data structure the backend expects
    const body = {
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password
    };
    
    console.log('Sending login request to:', url);
    console.log('Request body:', body);
    console.log('Headers:', headers.keys());
    
    return this.http.post<LoginResponse>(url, body, { headers }).pipe(
      tap((response) => {
        if (!response) {
          throw new Error('Empty response from server');
        }
        
        if (response.token) {
          // Store token and user data
          localStorage.setItem(this.jwtKey, response.token);
          localStorage.setItem('user', JSON.stringify({
            id: response.user.id,
            name: response.user.nombre,
            email: response.user.email,
            role: response.user.rol
          }));
          
          console.log('User authenticated successfully');
        } else {
          console.error('No token in response:', response);
          throw new Error('No authentication token received');
        }
      }),
      catchError((error) => {
        console.error('Login error in service:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error error (body):', error.error);
        console.error('Error headers:', error.headers);
        // Propagar el error con más información
        return throwError(() => error);
      })
    );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.jwtKey);
    return !!token;
  }

  logout(): void {
    localStorage.removeItem(this.jwtKey);
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem(this.jwtKey);
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
