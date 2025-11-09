import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

export interface Artista {
  id: number;
  nombre: string;
  apellido: string;
  rol_academico: string;
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
export class ArtistasComponent implements OnInit, OnDestroy {
  // Datos de ejemplo
  artistas: Artista[] = [
    {
      id: 1,
      nombre: 'Ana',
      apellido: 'García',
      rol_academico: 'Profesor Titular',
      foto_url: 'https://via.placeholder.com/50',
      created_at: '2024-01-15'
    },
    {
      id: 2,
      nombre: 'Carlos',
      apellido: 'Rodríguez',
      rol_academico: 'Investigador',
      foto_url: 'https://via.placeholder.com/50',
      created_at: '2024-01-16'
    },
    {
      id: 3,
      nombre: 'María',
      apellido: 'López',
      rol_academico: 'Profesor Asociado',
      foto_url: 'https://via.placeholder.com/50',
      created_at: '2024-01-17'
    }
  ];

  // Filtros
  filtroNombre: string = '';
  filtroApellido: string = '';
  filtroRol: string = '';
  
  // Nuevo artista
  nuevoArtista: Omit<Artista, 'id' | 'created_at'> = {
    nombre: '',
    apellido: '',
    rol_academico: '',
    foto_url: ''
  };

  // Estados
  mostrarFormulario: boolean = false;
  artistasFiltrados: Artista[] = [];
  rolesUnicos: string[] = [];

  private subscriptions = new Subscription();

  ngOnInit() {
    this.actualizarFiltros();
    this.extraerRolesUnicos();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  // Filtrar artistas
  actualizarFiltros() {
    this.artistasFiltrados = this.artistas.filter(artista => {
      const coincideNombre = !this.filtroNombre || 
        artista.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase());
      const coincideApellido = !this.filtroApellido || 
        artista.apellido.toLowerCase().includes(this.filtroApellido.toLowerCase());
      const coincideRol = !this.filtroRol || 
        artista.rol_academico === this.filtroRol;

      return coincideNombre && coincideApellido && coincideRol;
    });
  }

  // Extraer roles únicos para el filtro
  extraerRolesUnicos() {
    const roles = this.artistas.map(artista => artista.rol_academico);
    this.rolesUnicos = [...new Set(roles)];
  }

  // Agregar nuevo artista
  agregarArtista() {
    if (this.validarFormulario()) {
      const nuevoId = Math.max(...this.artistas.map(a => a.id)) + 1;
      const artista: Artista = {
        ...this.nuevoArtista,
        id: nuevoId,
        created_at: new Date().toISOString()
      };

      this.artistas.unshift(artista);
      this.limpiarFormulario();
      this.actualizarFiltros();
      this.extraerRolesUnicos();
      this.mostrarFormulario = false;
    }
  }

  // Validar formulario
  validarFormulario(): boolean {
    return !!this.nuevoArtista.nombre && 
           !!this.nuevoArtista.apellido && 
           !!this.nuevoArtista.rol_academico;
  }

  // Limpiar formulario
  limpiarFormulario() {
    this.nuevoArtista = {
      nombre: '',
      apellido: '',
      rol_academico: '',
      foto_url: ''
    };
  }

  // Limpiar filtros
  limpiarFiltros() {
    this.filtroNombre = '';
    this.filtroApellido = '';
    this.filtroRol = '';
    this.actualizarFiltros();
  }

  // Eliminar artista
  eliminarArtista(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este artista?')) {
      this.artistas = this.artistas.filter(artista => artista.id !== id);
      this.actualizarFiltros();
      this.extraerRolesUnicos();
    }
  }

  // Formatear fecha
  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }
}