import { Component, effect, inject, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';
  currentRoute = '';
  isAuthenticated = signal(false);
  loading = signal(true);

  private router = inject(Router);
  private http = inject(HttpClient);

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
        this.checkNavbar();
      });

    this.validateToken();
  }

  validateToken(): void {
    const token = localStorage.getItem('token') || localStorage.getItem('firebaseToken');

    if (token) {
      this.http.post(`${environment.API_URL}/api/auth/validate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
        next: () => {
          this.isAuthenticated.set(true);
          this.loading.set(false);
        },
        error: () => {
          console.warn('❌ Invalid or expired token. Logging out.');
          localStorage.removeItem('token');
          localStorage.removeItem('firebaseToken');
          this.isAuthenticated.set(false);
          this.loading.set(false);
          this.router.navigate(['/login']);
        }
      });
    } else {
      this.isAuthenticated.set(false);
      this.loading.set(false);
      this.router.navigate(['/login']);
    }
  }

  checkNavbar(): void {
    const hiddenRoutes = ['/login', '/register'];
    if (hiddenRoutes.includes(this.currentRoute)) return;

    const token = localStorage.getItem('token') || localStorage.getItem('firebaseToken');
    if (token && !this.isAuthenticated()) {
      this.isAuthenticated.set(true);
    }
  }

  showNavbar(): boolean {
    const hiddenRoutes = ['/login', '/register'];
    return this.isAuthenticated() && !hiddenRoutes.includes(this.currentRoute);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('firebaseToken');
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }
}