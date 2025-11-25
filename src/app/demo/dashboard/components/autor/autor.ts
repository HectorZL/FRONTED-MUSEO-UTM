import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutorService, Autor } from '../../../../services/autor.service';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AvatarModule } from 'primeng/avatar';
import { MessageService, ConfirmationService } from 'primeng/api';

interface NewAutor extends Omit<Autor, 'id' | 'created_at'> {
  // Extends Autor interface but makes id and created_at optional for new entries
}

@Component({
  selector: 'app-autores',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    FileUploadModule,
    ToastModule,
    ConfirmDialogModule,
    AvatarModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './autor.html',
  styleUrls: ['./autor.scss']
})
export class AutoresComponent implements OnInit {
  autores: Autor[] = [];
  filteredAutores: Autor[] = [];
  selectedAutor: Autor | null = null;
  showAddForm = false;
  isLoading = false;
  error: string | null = null;
  searchTerm = '';
  newAutor: NewAutor = {
    nombre: '',
    apellido: '',
    ocupacion: '',
    foto_url: null
  };
  selectedFile: File | null = null;

  // Default avatar as a data URL - SVG of a user icon
  readonly defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZiI+PHBhdGggZD0iTTEyIDJDNi40NzcgMiAyIDYuNDc3IDIgMTJzNC40NzcgMTAgMTAgMTAgMTAtNC40NzcgMTAtMTBTMTcuNTIzIDIgMTIgMnptMCAyYzQuNDEgMCA4IDMuNTkgOCA4cy0zLjU5IDgtOCA4LTgtMy41OS04LThzMy41OS04IDgtOHoiLz48cGF0aCBkPSJNMTIgNmMtMS45MzMgMC0zLjUgMS41NjctMy41IDMuNXMxLjU2NyAzLjUgMy41IDMuNSAzLjUtMS41NjcgMy41LTMuNVMxMy45MzMgNiAxMiA2em0wIDVjLS44MjggMC0xLjUtLjY3Mi0xLjUtMS41UzExLjE3MiA4IDEyIDhzMS41LjY3MiAxLjUgMS41UzEyLjgyOCAxMSAxMiAxMXoiLz48cGF0aCBkPSJNMTIgMTJjLTIuNzYgMC01IDEuNzktNSA0aDEwYzAtMi4yMS0yLjI0LTQtNS00eiIvPjwvc3ZnPg==';

  constructor(
    private autorService: AutorService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    console.log('ngOnInit() called');
    this.loadAutores();
  }

  loadAutores(): void {
    console.log('loadAutores() called - setting isLoading to true');
    this.isLoading = true;
    this.error = null;

    this.autorService.getAutores()
      .subscribe({
        next: (data: Autor[]) => {
          console.log('getAutores() success - received data:', data);
          // Asegurarse de que la foto_url siempre tenga un valor
          this.autores = data.map(autor => ({
            ...autor,
            foto_url: autor.foto_url || 'assets/images/default-avatar.png'
          }));
          this.filteredAutores = [...this.autores];
          console.log('Setting isLoading to false - autores count:', this.autores.length);
          this.isLoading = false;
          this.cdr.detectChanges(); // Forzar detección de cambios
        },
        error: (err: Error) => {
          console.error('getAutores() error:', err);
          this.error = err.message || 'Error al cargar los autores. Por favor, intente nuevamente.';
          this.autores = [];
          this.filteredAutores = [];
          console.log('Setting isLoading to false after error');
          this.isLoading = false;
          this.cdr.detectChanges(); // Forzar detección de cambios
        }
      });
  }

  /**
   * Filtra la lista de autores según el término de búsqueda
   */
  filterAutores(): void {
    if (!this.searchTerm) {
      this.filteredAutores = [...this.autores];
      return;
    }

    const searchTerm = this.searchTerm.toLowerCase().trim();
    this.filteredAutores = this.autores.filter(autor =>
      (autor.nombre?.toLowerCase().includes(searchTerm) || '') ||
      (autor.apellido?.toLowerCase().includes(searchTerm) || '') ||
      (autor.ocupacion?.toLowerCase().includes(searchTerm) || '')
    );
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';

    try {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      return new Date(dateString).toLocaleDateString('es-ES', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Fecha inválida';
    }
  }

  getInitials(nombre: string, apellido: string): string {
    const first = (nombre?.charAt(0) || '').toUpperCase();
    const last = (apellido?.charAt(0) || '').toUpperCase();
    return first + last || '??';
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {

    }
  }

  /**
   * Inicializa el formulario para un nuevo autor
   */
  initNewAutor(): void {
    this.selectedAutor = null;
    this.newAutor = {
      nombre: '',
      apellido: '',
      ocupacion: '',
      foto_url: null,
    };
    this.selectedFile = null;
    this.error = null;
    this.showAddForm = true;
  }

  cancelEdit(): void {
    this.selectedAutor = null;
    this.showAddForm = false;
    this.newAutor = {
      nombre: '',
      apellido: '',
      ocupacion: '',
      foto_url: null,
    };
    this.selectedFile = null;
  }

  editAutor(autor: Autor): void {
    this.selectedAutor = { ...autor };
    this.newAutor = {
      nombre: autor.nombre,
      apellido: autor.apellido,
      ocupacion: autor.ocupacion,
      foto_url: autor.foto_url
    };
    this.selectedFile = null;
    this.error = null;
    this.showAddForm = true;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail: 'Por favor, selecciona un archivo de imagen válido'
          });
          input.value = ''; // Reset the input
          return;
        }

        // Validate file size (e.g., 5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail: 'La imagen es demasiado grande. El tamaño máximo permitido es 5MB'
          });
          input.value = ''; // Reset the input
          return;
        }

        this.selectedFile = file;

        // If you want to show a preview of the selected image
        const reader = new FileReader();
        reader.onload = (e: any) => {
          // Update the preview if you have an image preview element
          // This is optional and can be removed if not needed
          const preview = document.getElementById('image-preview') as HTMLImageElement;
          if (preview) {
            preview.src = e.target.result;
            preview.style.display = 'block';
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }

  /**
   * Elimina un autor por su ID
   */
  deleteAutor(id: number): void {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar este autor?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.isLoading = true;
        this.autorService.deleteAutor(id).subscribe({
          next: () => {
            // Remove the deleted author from the list
            this.autores = this.autores.filter(autor => autor.id !== id);
            this.filterAutores(); // Update filtered list
            this.isLoading = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Autor eliminado correctamente'
            });
          },
          error: (error) => {
            console.error('Error al eliminar el autor:', error);
            this.isLoading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
            });
          }
        });
      }
    });
  }

  /**
   * Guarda un autor nuevo o existente
   */
  saveAutor(): void {
    // Validación básica
    if (!this.newAutor.nombre?.trim() || !this.newAutor.apellido?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'El nombre y apellido son campos obligatorios'
      });
      return;
    }

    this.isLoading = true;

    // Crear FormData para el envío
    const formData = this.autorService.createAutorFormData(this.newAutor, this.selectedFile || undefined);

    // Determinar si es una creación o actualización
    const saveOperation = this.selectedAutor?.id
      ? this.autorService.updateAutor(this.selectedAutor.id, formData)
      : this.autorService.createAutor(formData);

    // Ejecutar la operación
    saveOperation.subscribe({
      next: () => {
        // Cerrar el formulario y limpiar inmediatamente
        this.showAddForm = false;
        this.isLoading = false;

        this.selectedAutor = null;
        this.selectedFile = null;

        // Resetear el formulario
        this.newAutor = {
          nombre: '',
          apellido: '',
          ocupacion: '',
          foto_url: null
        };

        // Mostrar mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Autor ${this.selectedAutor ? 'actualizado' : 'creado'} correctamente`
        });

        // Recargar la lista de autores después de cerrar el modal
        this.loadAutores();
      },
      error: (err) => {
        console.error('Error al guardar el autor:', err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error'
        });
      }
    });
  }
}