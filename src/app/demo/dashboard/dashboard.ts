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
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard', isActive: true },
    { label: 'Usuarios', icon: 'people', route: '/dashboard/users', isActive: false },
    { label: 'Productos', icon: 'inventory_2', route: '/dashboard/products', isActive: false },
    { label: 'Pedidos', icon: 'shopping_cart', route: '/dashboard/orders', isActive: false },
    { label: 'Reportes', icon: 'bar_chart', route: '/dashboard/reports', isActive: false },
    { label: 'Configuración', icon: 'settings', route: '/dashboard/settings', isActive: false }
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
    const iconClasses: { [key: string]: string } = {
      dashboard: 'material-icons-outlined',
      people: 'material-icons-outlined',
      inventory_2: 'material-icons-outlined',
      shopping_cart: 'material-icons-outlined',
      bar_chart: 'material-icons-outlined',
      settings: 'material-icons-outlined'
    };
    return iconClasses[icon] || 'material-icons-outlined';
  }
}