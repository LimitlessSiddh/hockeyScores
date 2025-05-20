import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  loading = true;
  todayGames: any[] = [];
  pastGames: any[] = [];

  ngOnInit(): void {
    const today = this.formatDate(new Date());
    const yesterday = this.formatDate(new Date(Date.now() - 86400000));
    const twoDaysAgo = this.formatDate(new Date(Date.now() - 2 * 86400000));

    const urls = [
      `https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard?dates=${twoDaysAgo}`,
      `https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard?dates=${yesterday}`,
      `https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard?dates=${today}`
    ];

    Promise.all(urls.map(url => this.http.get<any>(url).toPromise()))
      .then(results => {
        const allEvents = results.flatMap(res => res.events || []);

        const allGames = allEvents.map((game: any) => {
          const gameDate = new Date(game.date);
          const home = game.competitions[0].competitors.find((t: any) => t.homeAway === 'home');
          const away = game.competitions[0].competitors.find((t: any) => t.homeAway === 'away');

          return {
            name: game.name,
            date: gameDate,
            homeTeam: home?.team?.displayName,
            awayTeam: away?.team?.displayName,
            homeScore: home?.score,
            awayScore: away?.score,
            homeLogo: home?.team?.logo,
            awayLogo: away?.team?.logo,
            isLive: game.status?.type?.state === 'in',
            isToday: this.isSameDay(gameDate, new Date())
          };
        });

        this.todayGames = allGames.filter(g => g.isToday)
                                  .sort((a, b) => b.date.getTime() - a.date.getTime());

        this.pastGames = allGames.filter(g => !g.isToday)
                                  .sort((a, b) => b.date.getTime() - a.date.getTime());

        // ✅ Fallback: show latest game if no recent ones
        if (this.todayGames.length === 0 && this.pastGames.length === 0 && allGames.length > 0) {
          const latest = allGames.sort((a, b) => b.date.getTime() - a.date.getTime())[0];
          this.pastGames = [latest];
        }

        this.loading = false;
      });
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0].replace(/-/g, '');
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}

