import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './auth/auth.guard';
import { PlayerStatsComponent } from './pages/player-stats.component';
import { GoalieStatsComponent } from './pages/goalie-stats.component';
import { PlayerTableComponent } from './components/player-table/player-table.component';
import { GoalieTableComponent } from './components/goalie-table/goalie-table.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'player-stats', component: PlayerStatsComponent, canActivate: [authGuard] },
  { path: 'goalie-stats', component: GoalieStatsComponent, canActivate: [authGuard] },
  { path: 'player-table', component: PlayerTableComponent, canActivate: [authGuard] },
  { path: 'goalie-table', component: GoalieTableComponent, canActivate: [authGuard] }
];
