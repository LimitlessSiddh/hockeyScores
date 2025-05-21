import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentRoute = '';
  showNav = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
        const hiddenRoutes = ['/login', '/register'];
        const token = localStorage.getItem('token') || localStorage.getItem('firebaseToken');
        this.showNav = !!token && !hiddenRoutes.includes(this.currentRoute);
      });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('firebaseToken');
    this.router.navigate(['/login']);
  }
}
