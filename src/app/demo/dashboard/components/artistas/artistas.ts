import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Artista {
  id: number;
  nombre: string;
  apellido: string;
  ocupacion: string;
  foto_url: string;
  created_at: string;
}

@Component({
  selector: 'app-artistas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './artistas.html',
  styleUrls: ['./artistas.scss']
})
export class ArtistasComponent implements OnInit {
  // Datos de ejemplo
  artistas: Artista[] = [
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
  artistasFiltrados: Artista[] = [];
  
  // Estados
  showAddForm: boolean = false;
  selectedArtista: Artista | null = null;

  ngOnInit() {
    this.artistasFiltrados = [...this.artistas];
  }

  // Filtrar artistas
  filterArtists() {
    if (!this.searchTerm) {
      this.artistasFiltrados = [...this.artistas];
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.artistasFiltrados = this.artistas.filter(artista => 
      artista.nombre.toLowerCase().includes(term) ||
      artista.apellido.toLowerCase().includes(term) ||
      artista.ocupacion.toLowerCase().includes(term)
    );
  }

  // Seleccionar artista para ver detalles
  selectArtista(artista: Artista) {
    this.selectedArtista = artista;
  }

  // Cerrar vista de detalles
  closeDetails() {
    this.selectedArtista = null;
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
      this.selectedArtista = null;
    }
  }

  // Inicializar nuevo artista
  initNewArtista() {
    this.selectedArtista = {
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
  editArtista(artista: Artista) {
    this.selectedArtista = { ...artista };
    this.showAddForm = true;
  }

  // Eliminar artista
  deleteArtista(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este artista?')) {
      this.artistas = this.artistas.filter(a => a.id !== id);
      this.filterArtists();
    }
  }

  // Guardar artista (crear o actualizar)
  saveArtista() {
    if (!this.selectedArtista) return;

    if (!this.selectedArtista.nombre || !this.selectedArtista.apellido || !this.selectedArtista.ocupacion) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    if (this.selectedArtista.id === 0) {
      // Nuevo artista
      const newId = Math.max(0, ...this.artistas.map(a => a.id)) + 1;
      const newArtista: Artista = {
        ...this.selectedArtista,
        id: newId,
        created_at: new Date().toISOString().split('T')[0]
      };
      this.artistas.push(newArtista);
    } else {
      // Actualizar artista existente
      const index = this.artistas.findIndex(a => a.id === this.selectedArtista?.id);
      if (index !== -1) {
        this.artistas[index] = { ...this.selectedArtista };
      }
    }

    this.filterArtists();
    this.showAddForm = false;
    this.selectedArtista = null;
  }
}