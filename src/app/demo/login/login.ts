import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  get email(): AbstractControl | null {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      const { email, password } = this.loginForm.value;
      
      // Validar que los valores no estén vacíos
      if (!email || !password) {
        this.errorMessage.set('Por favor, completa todos los campos');
        this.isLoading.set(false);
        return;
      }
      
      console.log('Attempting login with email:', email);
      
      // Only send email and password to match backend expectations
      const loginData = {
        email: email.trim().toLowerCase(),
        password: password
      };
      
      console.log('Sending login request with:', { email: loginData.email, password: '***' });
      
      this.authService.login(loginData).subscribe({
        next: (response) => {
          console.log('Login successful, response:', response);
          console.log('Navigating to dashboard...');
          
          // Store user data in local storage for later use
          if (response?.user) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
          }
          
          // Redirect to dashboard
          this.router.navigate(['/dashboard'])
            .then(success => {
              if (!success) {
                console.error('Error navigating to dashboard');
                this.errorMessage.set('Error al redirigir al panel de control');
              }
              this.isLoading.set(false);
            })
            .catch(err => {
              console.error('Navigation error:', err);
              this.errorMessage.set('Error al redirigir después del inicio de sesión');
              this.isLoading.set(false);
            });
        },
        error: (error) => {
          console.error('Login error in component:', error);
          console.error('Full error object:', JSON.stringify(error, null, 2));
          console.error('Error status:', error.status);
          console.error('Error statusText:', error.statusText);
          console.error('Error error (response body):', error.error);
          console.error('Error url:', error.url);
          
          let errorMessage = 'Error en el inicio de sesión. Por favor, verifica tus credenciales.';
          
          // Manejar diferentes tipos de errores
          if (error.status === 401 || error.status === 403) {
            // Intentar obtener el mensaje del backend
            if (error.error?.message) {
              errorMessage = error.error.message;
            } else if (error.error?.error) {
              errorMessage = error.error.error;
            } else if (typeof error.error === 'string') {
              errorMessage = error.error;
            } else {
              errorMessage = 'Usuario o contraseña incorrectos. Por favor verifica tus credenciales.';
            }
            console.error('Authentication failed (401/403):', errorMessage);
          } else if (error.status === 0 || error.status === undefined) {
            errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión a internet.';
            console.error('Network error - server unreachable');
          } else if (error.status >= 500) {
            errorMessage = 'Error del servidor. Por favor, intenta más tarde.';
            console.error('Server error:', error.status);
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          console.log('Displaying error to user:', errorMessage);
          this.errorMessage.set(errorMessage);
          this.isLoading.set(false);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
      // Mostrar mensajes de error para campos inválidos
      if (this.email?.invalid) {
        this.errorMessage.set(this.getEmailErrorMessage());
      } else if (this.password?.invalid) {
        this.errorMessage.set(this.getPasswordErrorMessage());
      }
    }
  }

  getEmailErrorMessage(): string {
    if (this.email?.errors?.['required']) {
      return 'El email es requerido';
    }
    if (this.email?.errors?.['email']) {
      return 'Email no válido';
    }
    return '';
  }

  getPasswordErrorMessage(): string {
    if (this.password?.errors?.['required']) {
      return 'La contraseña es requerida';
    }
    if (this.password?.errors?.['minlength']) {
      return 'Mínimo 6 caracteres';
    }
    return '';
  }
}