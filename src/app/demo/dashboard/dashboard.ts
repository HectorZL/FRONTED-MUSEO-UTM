import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  isActive: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class DashboardComponent implements OnInit, OnDestroy {
  private routerSubscription!: Subscription;
  
  isSidebarOpen = true;
  currentPageTitle = 'Dashboard';
  user = {
    name: 'Juan Pérez',
    email: 'juan.perez@empresa.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  };

  menuItems: MenuItem[] = [
    { label: 'Inicio', icon: 'home', route: '/dashboard', isActive: true },
    { label: 'Obras de Arte', icon: 'palette', route: '/dashboard/obras', isActive: false },
    { label: 'Colecciones', icon: 'collections', route: '/dashboard/colecciones', isActive: false },
    { label: 'Autores', icon: 'person', route: '/dashboard/autores', isActive: false },
    { label: 'Exposiciones', icon: 'photo_library', route: '/dashboard/exposiciones', isActive: false },
    { label: 'Eventos', icon: 'event', route: '/dashboard/eventos', isActive: false },
    { label: 'Usuarios', icon: 'people', route: '/dashboard/usuarios', isActive: false },
    { label: 'Configuración', icon: 'settings', route: '/dashboard/configuracion', isActive: false }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.setActiveMenuItem(this.router.url);
    
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.setActiveMenuItem(event.url);
        this.updatePageTitle(event.url);
      });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private setActiveMenuItem(currentUrl: string): void {
    this.menuItems.forEach(item => {
      item.isActive = currentUrl === item.route || currentUrl.startsWith(item.route + '/');
    });
  }

  private updatePageTitle(url: string): void {
    const currentItem = this.menuItems.find(item => 
      url === item.route || url.startsWith(item.route + '/')
    );
    
    if (currentItem) {
      this.currentPageTitle = currentItem.label;
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    // Lógica de logout aquí
    console.log('Cerrando sesión...');
    this.router.navigate(['/login']);
  }

  getIconClass(icon: string): string {
    // All icons will use the outlined variant
    return 'material-icons-outlined';
  }
}