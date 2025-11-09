import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

export interface Artwork {
  id: number;
  title: string;
  artist: string;
  category: string;
  year: number;
  price: number;
  status: 'available' | 'sold' | 'reserved';
  description: string;
  imageUrl?: string;
  createdAt: Date;
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
    const categoryFilter = this.categoryFilter();
    const statusFilter = this.statusFilter();
    const yearFilter = this.yearFilter();

    return artworks.filter(artwork => {
      const matchesSearch = !searchTerm || 
        artwork.title.toLowerCase().includes(searchTerm) ||
        artwork.artist.toLowerCase().includes(searchTerm) ||
        artwork.description.toLowerCase().includes(searchTerm);
      
      const matchesCategory = !categoryFilter || artwork.category === categoryFilter;
      const matchesStatus = !statusFilter || artwork.status === statusFilter;
      const matchesYear = !yearFilter || artwork.year === yearFilter;

      return matchesSearch && matchesCategory && matchesStatus && matchesYear;
    });
  });

  // Filtros
  searchTerm = signal('');
  categoryFilter = signal('');
  statusFilter = signal('');
  yearFilter = signal<number | null>(null);

  // Formulario de nueva obra
  newArtwork: Partial<Artwork> = {
    title: '',
    artist: '',
    category: '',
    year: new Date().getFullYear(),
    price: 0,
    status: 'available',
    description: ''
  };

  // Estados de UI
  showForm = signal(false);
  isEditing = signal(false);
  editingId = signal<number | null>(null);
  isLoading = signal(false);

  // Opciones para los selects
  categories = ['Pintura', 'Escultura', 'Fotografía', 'Digital', 'Mixta', 'Otros'];
  statuses = ['available', 'sold', 'reserved'];
  years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

  ngOnInit() {
    this.loadSampleData();
  }

  private loadSampleData() {
    const sampleArtworks: Artwork[] = [
      {
        id: 1,
        title: 'Noche estrellada',
        artist: 'Van Gogh',
        category: 'Pintura',
        year: 1889,
        price: 1500000,
        status: 'available',
        description: 'Una de las obras más famosas del postimpresionismo',
        createdAt: new Date('2024-01-15')
      },
      {
        id: 2,
        title: 'El pensador',
        artist: 'Rodin',
        category: 'Escultura',
        year: 1904,
        price: 800000,
        status: 'sold',
        description: 'Escultura en bronce representando la reflexión humana',
        createdAt: new Date('2024-02-20')
      },
      {
        id: 3,
        title: 'Serie floral',
        artist: 'María García',
        category: 'Fotografía',
        year: 2023,
        price: 1200,
        status: 'available',
        description: 'Colección de fotografías macro de flores silvestres',
        createdAt: new Date('2024-03-10')
      }
    ];

    this.artworks.set(sampleArtworks);
  }

  // Métodos para los filtros
  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  onCategoryChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.categoryFilter.set(value || '');
  }

  onStatusChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value as Artwork['status'];
    this.statusFilter.set(value || '');
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
    this.newArtwork = { ...artwork };
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
      artist: '',
      category: '',
      year: new Date().getFullYear(),
      price: 0,
      status: 'available',
      description: ''
    };
  }

  // Crear o actualizar obra
  saveArtwork() {
    if (!this.isFormValid()) {
      alert('Por favor, completa todos los campos obligatorios');
      return;
    }

    this.isLoading.set(true);

    // Simular una petición HTTP
    setTimeout(() => {
      if (this.isEditing()) {
        this.updateArtwork();
      } else {
        this.createArtwork();
      }
      
      this.isLoading.set(false);
      this.closeForm();
    }, 500);
  }

  private isFormValid(): boolean {
    return !!(this.newArtwork.title?.trim() && 
              this.newArtwork.artist?.trim() && 
              this.newArtwork.category?.trim());
  }

  private createArtwork() {
    const newArtwork: Artwork = {
      ...this.newArtwork as Artwork,
      id: Math.max(0, ...this.artworks().map(a => a.id)) + 1,
      createdAt: new Date()
    };

    this.artworks.update(artworks => [...artworks, newArtwork]);
  }

  private updateArtwork() {
    this.artworks.update(artworks => 
      artworks.map(artwork => 
        artwork.id === this.editingId() 
          ? { ...artwork, ...this.newArtwork }
          : artwork
      )
    );
  }

  // Eliminar obra
  deleteArtwork(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta obra?')) {
      this.artworks.update(artworks => 
        artworks.filter(artwork => artwork.id !== id)
      );
    }
  }

  // Limpiar filtros
  clearFilters() {
    this.searchTerm.set('');
    this.categoryFilter.set('');
    this.statusFilter.set('');
    this.yearFilter.set(null);
  }

  // Getters computados para UI
  get totalArtworks() {
    return this.artworks().length;
  }

  get filteredCount() {
    return this.filteredArtworks().length;
  }

  getStatusBadgeClass(status: Artwork['status']): string {
    const classes = {
      available: 'bg-green-100 text-green-800 border-green-200',
      sold: 'bg-red-100 text-red-800 border-red-200',
      reserved: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return classes[status];
  }

  getStatusText(status: string): string {
    const texts: Record<string, string> = {
      'available': 'Disponible',
      'sold': 'Vendida',
      'reserved': 'Reservada'
    };
    return texts[status] || status;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }
}