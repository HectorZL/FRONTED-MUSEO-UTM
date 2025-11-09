import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Autor {
  id: number;
  nombre: string;
  apellido: string;
  ocupacion: string;
  foto_url: string;
  created_at: string;
}

@Component({
  selector: 'app-autores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './autor.html',
  styleUrls: ['./autor.scss']
})
export class AutoresComponent implements OnInit {
  // Datos de ejemplo
  autores: Autor[] = [
    {
      id: 1,
      nombre: 'Ana',
      apellido: 'García',
      ocupacion: 'Pintora',
      foto_url: 'https://randomuser.me/api/portraits/women/44.jpg',
      created_at: '2024-01-15'
    },
    {
      id: 2,
      nombre: 'Carlos',
      apellido: 'Rodríguez',
      ocupacion: 'Escultor',
      foto_url: 'https://randomuser.me/api/portraits/men/32.jpg',
      created_at: '2024-01-16'
    },
    {
      id: 3,
      nombre: 'María',
      apellido: 'López',
      ocupacion: 'Fotógrafa',
      foto_url: 'https://randomuser.me/api/portraits/women/65.jpg',
      created_at: '2024-01-17'
    }
  ];

  // Filtros
  searchTerm: string = '';
  autoresFiltrados: Autor[] = [];
  
  // Estados
  showAddForm: boolean = false;
  selectedAutor: Autor | null = null;

  ngOnInit() {
    this.autoresFiltrados = [...this.autores];
  }

  // Filtrar artistas
  filterAutores() {
    if (!this.searchTerm) {
      this.autoresFiltrados = [...this.autores];
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.autoresFiltrados = this.autores.filter(autor => 
      autor.nombre.toLowerCase().includes(term) ||
      autor.apellido.toLowerCase().includes(term) ||
      autor.ocupacion.toLowerCase().includes(term)
    );
  }

  // Seleccionar artista para ver detalles
  selectAutor(autor: Autor) {
    this.selectedAutor = autor;
  }

  // Cerrar vista de detalles
  closeDetails() {
    this.selectedAutor = null;
  }

  // Formatear fecha
  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  }

  // Obtener iniciales
  getInitials(nombre: string, apellido: string): string {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  }

  // Mostrar/ocultar formulario
  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.selectedAutor = null;
    }
  }

  // Inicializar nuevo artista
  initNewAutor() {
    this.selectedAutor = {
      id: 0,
      nombre: '',
      apellido: '',
      ocupacion: '',
      foto_url: '',
      created_at: new Date().toISOString().split('T')[0]
    };
    this.showAddForm = true;
  }

  // Editar artista
  editAutor(autor: Autor) {
    this.selectedAutor = { ...autor };
    this.showAddForm = true;
  }

  // Eliminar artista
  deleteAutor(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este autor?')) {
      this.autores = this.autores.filter(a => a.id !== id);
      this.filterAutores();
    }
  }

  // Guardar artista (crear o actualizar)
  saveAutor() {
    if (!this.selectedAutor) return;

    if (!this.selectedAutor.nombre || !this.selectedAutor.apellido || !this.selectedAutor.ocupacion) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    if (this.selectedAutor.id === 0) {
      // Nuevo autor
      const newId = Math.max(0, ...this.autores.map(a => a.id)) + 1;
      const newAutor: Autor = {
        ...this.selectedAutor,
        id: newId,
        created_at: new Date().toISOString().split('T')[0]
      };
      this.autores.push(newAutor);
    } else {
      // Actualizar autor existente
      const index = this.autores.findIndex(a => a.id === this.selectedAutor?.id);
      if (index !== -1) {
        this.autores[index] = { ...this.selectedAutor };
      }
    }

    this.filterAutores();
    this.showAddForm = false;
    this.selectedAutor = null;
  }
}