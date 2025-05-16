import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'; 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  error: string = '';
  success: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  register(): void {
    const trimmedEmail = this.email.trim();
    const trimmedPassword = this.password.trim();

    this.http.post<any>(`${environment.API_URL}/api/auth/register`, {
      email: trimmedEmail,
      password: trimmedPassword
    }).subscribe({
      next: () => {
        this.http.post<any>(`${environment.API_URL}/api/auth/login`, {
          email: trimmedEmail,
          password: trimmedPassword
        }).subscribe({
          next: (res) => {
            localStorage.setItem('token', res.token);
            this.router.navigate(['/home']);
          },
          error: (err) => {
            this.error = "Registered, but login failed: " + (err.error.message || 'Unknown error');
          }
        });
      },
      error: (err) => {
        this.error = err.error.message || "Registration failed";
      }
    });
  }
}
