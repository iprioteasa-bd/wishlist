import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GitHubAuthService {
  private authTokenSubject = new BehaviorSubject<string | null>(null);
  public authToken$ = this.authTokenSubject.asObservable();

  constructor() {
    // Load token from localStorage on init
    const savedToken = localStorage.getItem('github-token');
    if (savedToken) {
      this.authTokenSubject.next(savedToken);
    }
  }

  setToken(token: string): void {
    localStorage.setItem('github-token', token);
    this.authTokenSubject.next(token);
  }

  getToken(): string | null {
    return this.authTokenSubject.value;
  }

  clearToken(): void {
    localStorage.removeItem('github-token');
    this.authTokenSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.authTokenSubject.value !== null;
  }

  // Instructions for users to get a GitHub token
  getTokenInstructions(): string {
    return `
To enable real-time updates, you need a GitHub Personal Access Token:

1. Go to GitHub.com → Settings → Developer settings → Personal access tokens
2. Click "Generate new token (classic)"
3. Give it a name like "Wishlist App"
4. Select scopes: "repo" (full control of private repositories)
5. Click "Generate token"
6. Copy the token and paste it below

⚠️ Keep your token private and don't share it!
    `.trim();
  }
}
