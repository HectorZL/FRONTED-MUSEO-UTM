import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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

      // Simular llamada API
      setTimeout(() => {
        const credentials = this.loginForm.value as LoginRequest;
        
        // Credenciales de ejemplo
        if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
          // Guardar estado de autenticación
          localStorage.setItem('isAuthenticated', 'true');
          // Redirigir al dashboard
          this.router.navigate(['/dashboard']).then(success => {
            if (!success) {
              console.error('Error al navegar al dashboard');
              this.errorMessage.set('Error al redirigir al panel de control');
            }
          });
        } else {
          this.errorMessage.set('Credenciales incorrectas. Intenta con admin@example.com / admin123');
        }
        
        this.isLoading.set(false);
      }, 500);
    } else {
      this.loginForm.markAllAsTouched();
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