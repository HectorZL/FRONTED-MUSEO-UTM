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
        
        // Aquí iría tu llamada real al servicio de autenticación
        console.log('Login attempt:', credentials);
        
        // Simulación de éxito/error
        if (credentials.email === 'usuario@ejemplo.com' && credentials.password === '123456') {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage.set('Credenciales incorrectas. Intenta con usuario@ejemplo.com / 123456');
        }
        
        this.isLoading.set(false);
      }, 1500);
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