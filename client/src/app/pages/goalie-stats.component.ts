import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-goalie-stats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './goalie-stats.component.html',
  styleUrls: ['./goalie-stats.component.css']
})
export class GoalieStatsComponent implements OnInit {
  private http = inject(HttpClient);

  allGoalies: any[] = [];
  goalies: any[] = [];
  loading = true;
  page = 1;
  limit = 10;

  searchTerm = '';
  selectedTeam = '';
  teamOptions: string[] = [];

  sortField: string = 'savePct';
  sortAsc: boolean = false;

  ngOnInit() {
    this.fetchPlayoffGoalieStats();
  }

  fetchPlayoffGoalieStats() {
    this.loading = true;

    this.http.get<any[]>(`${environment.API_URL}/api/stats/playoff-goalies`)
      .subscribe(data => {
        this.allGoalies = data;
        this.teamOptions = Array.from(new Set(data.map(g => g.team))).sort();
        this.applyFilters();
        this.loading = false;
      }, err => {
        console.error('Failed to fetch playoff goalie stats:', err);
        this.loading = false;
      });
  }

  applyFilters() {
    let filtered = this.allGoalies;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(g =>
        g.name.toLowerCase().includes(term) || g.team.toLowerCase().includes(term)
      );
    }

    if (this.selectedTeam) {
      filtered = filtered.filter(g => g.team === this.selectedTeam);
    }

    this.goalies = this.paginate(this.sortData(filtered));
  }

  onSearch() {
    this.page = 1;
    this.applyFilters();
  }

  onTeamChange() {
    this.page = 1;
    this.applyFilters();
  }

  paginate(data: any[]): any[] {
    const start = (this.page - 1) * this.limit;
    return data.slice(start, start + this.limit);
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

  sortBy(field: string) {
    if (this.sortField === field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortField = field;
      this.sortAsc = true;
    }
    this.applyFilters();
  }

  sortData(data: any[]): any[] {
    return [...data].sort((a, b) => {
      const valA = a[this.sortField];
      const valB = b[this.sortField];

      if (valA < valB) return this.sortAsc ? -1 : 1;
      if (valA > valB) return this.sortAsc ? 1 : -1;
      return 0;
    });
  }
}
