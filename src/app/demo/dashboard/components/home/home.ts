import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Bienvenido al Panel de Administración</h2>
      <p class="text-gray-600">Selecciona una opción del menú para comenzar.</p>
    </div>
  `,
  styles: []
})
export class DashboardHomeComponent {}
