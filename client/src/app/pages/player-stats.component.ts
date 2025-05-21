import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-player-stats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player-stats.component.html',
  styleUrls: ['./player-stats.component.css']
})
export class PlayerStatsComponent implements OnInit {
  private http = inject(HttpClient);

  players: any[] = [];
  filteredPlayers: any[] = [];
  loading = true;
  page = 1;
  limit = 10;
  searchTerm = '';
  sortField = 'points';
  sortAsc = false;
  teams: string[] = [];
  selectedTeam = 'All';

  ngOnInit() {
    this.fetchPlayoffPlayerStats();
  }

  fetchPlayoffPlayerStats() {
    this.loading = true;

    this.http.get<any[]>(`${environment.API_URL}/api/stats/playoff-players`)
      .subscribe(data => {
        this.players = data;
        this.teams = ['All', ...Array.from(new Set(data.map(p => p.team)))];
        this.applyFilters();
        this.loading = false;
      }, err => {
        console.error('Failed to fetch playoff player stats:', err);
        this.loading = false;
      });
  }

  applyFilters() {
    const filtered = this.players.filter(player =>
      (this.selectedTeam === 'All' || player.team === this.selectedTeam) &&
      (player.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       player.team.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );

    this.filteredPlayers = [...filtered].sort((a, b) => {
      const valA = a[this.sortField];
      const valB = b[this.sortField];
      return (valA < valB ? -1 : 1) * (this.sortAsc ? 1 : -1);
    }).slice((this.page - 1) * this.limit, this.page * this.limit);
  }

  onSearch() {
    this.page = 1;
    this.applyFilters();
  }

  onTeamChange() {
    this.page = 1;
    this.applyFilters();
  }

  sortBy(field: string) {
    if (this.sortField === field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortField = field;
      this.sortAsc = true;
    }
    this.applyFilters();
  }

  nextPage() {
    this.page++;
    this.applyFilters();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.applyFilters();
    }
  }
}
