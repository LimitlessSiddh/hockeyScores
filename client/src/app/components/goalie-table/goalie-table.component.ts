import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-goalie-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './goalie-table.component.html',
  styleUrls: ['./goalie-table.component.css']
})
export class GoalieTableComponent implements OnInit {
  goalies: any[] = [];
  sortBy: string = 'savePct';
  page: number = 1;
  limit: number = 10;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchGoalies();
  }

  fetchGoalies() {
    this.http.get<any[]>(`http://localhost:5050/api/stats/playoff-goalies?sort=${this.sortBy}&page=${this.page}&limit=${this.limit}`)
      .subscribe(data => {
        this.goalies = data;
      });
  }

  onSortChange() {
    this.page = 1;
    this.fetchGoalies();
  }

  nextPage() {
    this.page++;
    this.fetchGoalies();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.fetchGoalies();
    }
  }
}
