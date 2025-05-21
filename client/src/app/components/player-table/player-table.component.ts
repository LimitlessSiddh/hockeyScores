import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-player-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player-table.component.html',
  styleUrls: ['./player-table.component.css']
})
export class PlayerTableComponent implements OnInit {
  players: any[] = [];
  sortBy: string = 'points';
  page: number = 1;
  limit: number = 10;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPlayers();
  }

  fetchPlayers() {
    this.http.get<any[]>(`http://localhost:5050/api/stats/playoff-players?sort=${this.sortBy}&page=${this.page}&limit=${this.limit}`)
      .subscribe(data => {
        this.players = data;
      });
  }

  onSortChange() {
    this.page = 1;
    this.fetchPlayers();
  }

  nextPage() {
    this.page++;
    this.fetchPlayers();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.fetchPlayers();
    }
  }
}
