import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // ✅ Import CommonModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule], // ✅ Add CommonModule here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hockeyScores';

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token') || !!localStorage.getItem('firebaseToken');
  }
}
