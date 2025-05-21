import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login(): void {
    console.log('🔐 Login function triggered');

    this.http.post<any>(`${environment.API_URL}/api/auth/login`, {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        console.log('✅ Login success:', res);
        localStorage.setItem('token', res.token);
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 100); // slight delay ensures localStorage is committed
      },
      error: (err) => {
        console.error('❌ Login error:', err);
        this.error = err.error?.message || 'Login failed';
      }
    });
  }
}
