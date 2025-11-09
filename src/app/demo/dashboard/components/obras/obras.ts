import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

export interface Artwork {
  id: number;
  title: string;
  description: string;
  year: number;
  createdAt: Date;
  updatedAt: Date;
  status: boolean;
}

@Component({
  selector: 'app-artwork',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './obras.html',
  styleUrl: './obras.scss'
})
export class ObrasComponent implements OnInit {
  // Signals para el estado reactivo
  artworks = signal<Artwork[]>([]);
  filteredArtworks = computed(() => {
    const artworks = this.artworks();
    const searchTerm = this.searchTerm().toLowerCase();
    const yearFilter = this.yearFilter();

    return artworks.filter(artwork => {
      const matchesSearch = !searchTerm || 
        artwork.title.toLowerCase().includes(searchTerm) ||
        artwork.description.toLowerCase().includes(searchTerm);
      
      const matchesYear = !yearFilter || artwork.year === yearFilter;

      return matchesSearch && matchesYear;
    });
  });

  // Filtros
  searchTerm = signal('');
  yearFilter = signal<number | null>(null);

  // Formulario de nueva obra
  newArtwork: Partial<Artwork> = {
    title: '',
    description: '',
    year: new Date().getFullYear(),
    status: true
  };

  // Estados de UI
  showForm = signal(false);
  isEditing = signal(false);
  editingId = signal<number | null>(null);
  isLoading = signal(false);

  // Opciones para los selects
  years = Array.from({ length: 200 }, (_, i) => new Date().getFullYear() - i);

  ngOnInit() {
    this.loadSampleData();
  }

  private loadSampleData() {
    const sampleArtworks: Artwork[] = [
      {
        id: 1,
        title: 'La noche estrellada',
        description: 'Pintura al óleo sobre lienzo de Vincent van Gogh',
        year: 1889,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20'),
        status: true
      },
      {
        id: 2,
        title: 'El grito',
        description: 'Obra expresionista de Edvard Munch',
        year: 1893,
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-02-15'),
        status: true
      },
      {
        id: 3,
        title: 'La persistencia de la memoria',
        description: 'Famoso cuadro de Salvador Dalí con relojes derritiéndose',
        year: 1931,
        createdAt: new Date('2024-03-05'),
        updatedAt: new Date('2024-03-10'),
        status: false
      }
    ];

    this.artworks.set(sampleArtworks);
  }

  // Métodos para los filtros
  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  onYearChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.yearFilter.set(value ? parseInt(value) : null);
  }

  // Métodos del formulario
  openCreateForm() {
    this.showForm.set(true);
    this.isEditing.set(false);
    this.editingId.set(null);
    this.resetForm();
  }

  openEditForm(artwork: Artwork) {
    this.showForm.set(true);
    this.isEditing.set(true);
    this.editingId.set(artwork.id);
    this.newArtwork = { 
      title: artwork.title,
      description: artwork.description,
      year: artwork.year,
      status: artwork.status
    };
  }

  closeForm() {
    this.showForm.set(false);
    this.isEditing.set(false);
    this.editingId.set(null);
    this.resetForm();
  }

  resetForm() {
    this.newArtwork = {
      title: '',
      description: '',
      year: new Date().getFullYear(),
      status: true
    };
  }

  // Crear o actualizar obra
  saveArtwork() {
    if (!this.newArtwork.title || !this.newArtwork.year) {
      alert('Por favor, completa todos los campos obligatorios');
      return;
    }

    this.isLoading.set(true);

    // Simular una petición HTTP
    setTimeout(() => {
      if (this.isEditing() && this.editingId()) {
        this.artworks.update(artworks => 
          artworks.map(artwork => 
            artwork.id === this.editingId() 
              ? { ...artwork, ...this.newArtwork, updatedAt: new Date() } 
              : artwork
          )
        );
      } else {
        const newId = Math.max(0, ...this.artworks().map(a => a.id)) + 1;
        const newArtwork: Artwork = {
          id: newId,
          title: this.newArtwork.title || '',
          description: this.newArtwork.description || '',
          year: this.newArtwork.year || new Date().getFullYear(),
          status: this.newArtwork.status ?? true,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.artworks.update(artworks => [...artworks, newArtwork]);
      }
      
      this.isLoading.set(false);
      this.closeForm();
    }, 500);
  }

  // Getters computados para UI
  get totalArtworks() {
    return this.artworks().length;
  }

  get filteredCount() {
    return this.filteredArtworks().length;
  }

  getStatusText(status: boolean): string {
    return status ? 'Activo' : 'Inactivo';
  }

  getStatusBadgeClass(status: boolean): string {
    return status 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-gray-100 text-gray-800 border-gray-200';
  }

}