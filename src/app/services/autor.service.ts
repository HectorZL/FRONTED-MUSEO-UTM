import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Autor {
  id?: number;
  nombre: string;
  apellido: string;
  ocupacion: string;
  foto_url: string | null;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AutorService {
  private baseApiUrl = environment.apiUrl;
  private publicApiUrl = `${this.baseApiUrl}/autores`;
  private adminApiUrl = `${this.baseApiUrl}/admin/autores`;

  constructor(private http: HttpClient) {}

  createAutor(autorData: FormData): Observable<Autor> {
    // No need to set Content-Type header, let Angular set it with the correct boundary
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      // 'Authorization' header will be added by the auth interceptor
    });

    return this.http.post<Autor>(this.adminApiUrl, autorData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtener todos los autores
   */
  /**
   * Obtener todos los autores (público)
   */
  getAutores(): Observable<Autor[]> {
    console.log('Fetching public autores from:', this.publicApiUrl);
    return this.http.get<Autor[] | { data: Autor[] }>(this.publicApiUrl, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        // 'Authorization' header will be added by the auth interceptor
      })
    }).pipe(
      map(response => {
        try {
          console.log('API Response:', response);
          // Si la respuesta es un array, devolverlo directamente
          if (Array.isArray(response)) {
            return response;
          }
          // Si la respuesta tiene una propiedad 'data' que es un array, devolverlo
          if (response && typeof response === 'object' && 'data' in response) {
            return Array.isArray((response as any).data) ? (response as any).data : [];
          }
          const errorMessage = 'Formato de respuesta inesperado del servidor';
          console.warn(errorMessage, response);
          throw new Error(errorMessage);
        } catch (error) {
          console.error('Error al procesar la respuesta:', error);
          throw error; // Re-lanzar el error para que sea manejado por el catchError
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error en la petición de autores:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          url: error.url
        });
        
        let errorMessage = 'Error al cargar los autores';
        if (error.status === 0) {
          errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión a internet.';
        } else if (error.status) {
          errorMessage = `Error del servidor: ${error.status} ${error.statusText}`;
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }
  
  /**
   * Helper para crear FormData a partir de un objeto Autor
   */
  createAutorFormData(autor: Partial<Autor>, file?: File): FormData {
    const formData = new FormData();
    
    // Agregar campos del autor
    if (autor.nombre) formData.append('nombre', autor.nombre);
    if (autor.apellido) formData.append('apellido', autor.apellido);
    if (autor.ocupacion) formData.append('ocupacion', autor.ocupacion);
    
    // Agregar archivo de imagen si está presente
    if (file) {
      formData.append('foto', file);
    }
    
    return formData;
  }

  getAutorById(id: number): Observable<Autor> {
    return this.http.get<{data: Autor}>(`${this.publicApiUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  getAutorByIdAdmin(id: number): Observable<Autor> {
    return this.http.get<{data: Autor}>(`${this.adminApiUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  updateAutor(id: number, autorData: FormData): Observable<Autor> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
    });
    
    // Use post with _method=PUT for Laravel API if needed
    if (environment.apiUrl.includes('laravel')) {
      autorData.append('_method', 'PUT');
      return this.http.post<{data: Autor}>(`${this.adminApiUrl}/${id}`, autorData, { headers }).pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
    }
    
    return this.http.put<{data: Autor}>(`${this.adminApiUrl}/${id}`, autorData, { headers }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  deleteAutor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminApiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.status === 401) {
        errorMessage = 'No autorizado. Por favor inicie sesión nuevamente.';
      } else if (error.status === 403) {
        errorMessage = 'No tiene permisos para realizar esta acción.';
      } else if (error.status === 404) {
        errorMessage = 'El recurso solicitado no fue encontrado.';
      } else {
        errorMessage = 'Error en la solicitud. Por favor verifique los datos e intente nuevamente.';
      }
    } else if (error.status >= 500) {
      errorMessage = 'Error en el servidor. Por favor intente más tarde.';
    }

    return throwError(() => new Error(errorMessage));
  }
}