import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GitHubAuthService } from '../services/github-auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  githubToken = '';
  showInstructions = false;
  isAuthenticated = false;

  constructor(
    private router: Router,
    private githubAuth: GitHubAuthService
  ) {
    this.githubAuth.authToken$.subscribe(token => {
      this.isAuthenticated = token !== null;
      this.githubToken = token || '';
    });
  }

  saveToken() {
    if (this.githubToken.trim()) {
      this.githubAuth.setToken(this.githubToken.trim());
      alert('GitHub token saved! You can now make real-time updates.');
    }
  }

  clearToken() {
    if (confirm('Are you sure you want to remove your GitHub token?')) {
      this.githubAuth.clearToken();
      this.githubToken = '';
    }
  }

  toggleInstructions() {
    this.showInstructions = !this.showInstructions;
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
