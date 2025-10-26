import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, interval, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { WishlistData } from '../models/wishlist.model';
import { GITHUB_CONFIG } from '../config/github.config';

@Injectable({
  providedIn: 'root'
})
export class GitHubWishlistService {
  private readonly GITHUB_API_BASE = GITHUB_CONFIG.API_BASE;
  private readonly REPO_OWNER = GITHUB_CONFIG.REPO_OWNER;
  private readonly REPO_NAME = GITHUB_CONFIG.REPO_NAME;
  private readonly BRANCH = GITHUB_CONFIG.BRANCH;
  
  private ioanaWishlistSubject = new BehaviorSubject<WishlistData | null>(null);
  private iulianWishlistSubject = new BehaviorSubject<WishlistData | null>(null);
  
  public ioanaWishlist$ = this.ioanaWishlistSubject.asObservable();
  public iulianWishlist$ = this.iulianWishlistSubject.asObservable();

  constructor(private http: HttpClient) {
    this.startPolling();
  }

  private startPolling() {
    // Only poll if we have a real GitHub token
    if (GITHUB_CONFIG.DEFAULT_TOKEN === 'ghp_your_default_token_here') {
      console.log('Local development mode - skipping GitHub API polling');
      return;
    }

    // Poll for updates every 30 seconds
    interval(30000).subscribe(() => {
      this.loadIoanaWishlist();
      this.loadIulianWishlist();
    });
  }

  private getApiUrl(filePath: string): string {
    return `${this.GITHUB_API_BASE}/${this.REPO_OWNER}/${this.REPO_NAME}/contents/${filePath}`;
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'WishlistApp',
      'Authorization': `token ${GITHUB_CONFIG.DEFAULT_TOKEN}`
    });
  }

  private loadFromLocalJson(user: 'ioana' | 'iulian'): void {
    // Try localStorage first
    const savedData = localStorage.getItem(`${user}-wishlist`);
    if (savedData) {
      try {
        const data = JSON.parse(savedData) as WishlistData;
        if (user === 'ioana') {
          this.ioanaWishlistSubject.next(data);
        } else {
          this.iulianWishlistSubject.next(data);
        }
        return;
      } catch (e) {
        console.error('Error parsing saved data:', e);
      }
    }

    // Fallback to local JSON file
    const fileName = `${user}-wishlist.json`;
    this.http.get<WishlistData>(`assets/${fileName}`)
      .subscribe({
        next: (data) => {
          if (user === 'ioana') {
            this.ioanaWishlistSubject.next(data);
          } else {
            this.iulianWishlistSubject.next(data);
          }
          // Save to localStorage for next time
          localStorage.setItem(`${user}-wishlist`, JSON.stringify(data));
        },
        error: (error) => {
          console.error(`Error loading ${user} wishlist from local file:`, error);
          // Create empty wishlist as last resort
          const emptyWishlist: WishlistData = {
            user: user === 'ioana' ? 'Ioana' : 'Iulian',
            lastUpdated: new Date().toISOString().split('T')[0],
            items: []
          };
          if (user === 'ioana') {
            this.ioanaWishlistSubject.next(emptyWishlist);
          } else {
            this.iulianWishlistSubject.next(emptyWishlist);
          }
        }
      });
  }

  loadIoanaWishlist(): void {
    // For local development, try local JSON first
    if (GITHUB_CONFIG.DEFAULT_TOKEN === 'ghp_your_default_token_here') {
      this.loadFromLocalJson('ioana');
      return;
    }

    const url = this.getApiUrl('src/assets/ioana-wishlist.json');
    this.http.get<any>(url, { headers: this.getHeaders() })
      .pipe(
        map(response => {
          const content = atob(response.content.replace(/\n/g, ''));
          return JSON.parse(content) as WishlistData;
        }),
        catchError(error => {
          console.error('Error loading Ioana wishlist from GitHub:', error);
          // Fallback to local JSON file
          this.loadFromLocalJson('ioana');
          return of(null);
        })
      )
      .subscribe({
        next: (data) => {
          if (data) {
            this.ioanaWishlistSubject.next(data);
            // Update localStorage as backup
            localStorage.setItem('ioana-wishlist', JSON.stringify(data));
          }
        },
        error: (error) => {
          console.error('Failed to load Ioana wishlist:', error);
        }
      });
  }

  loadIulianWishlist(): void {
    // For local development, try local JSON first
    if (GITHUB_CONFIG.DEFAULT_TOKEN === 'ghp_your_default_token_here') {
      this.loadFromLocalJson('iulian');
      return;
    }

    const url = this.getApiUrl('src/assets/iulian-wishlist.json');
    this.http.get<any>(url, { headers: this.getHeaders() })
      .pipe(
        map(response => {
          const content = atob(response.content.replace(/\n/g, ''));
          return JSON.parse(content) as WishlistData;
        }),
        catchError(error => {
          console.error('Error loading Iulian wishlist from GitHub:', error);
          // Fallback to local JSON file
          this.loadFromLocalJson('iulian');
          return of(null);
        })
      )
      .subscribe({
        next: (data) => {
          if (data) {
            this.iulianWishlistSubject.next(data);
            // Update localStorage as backup
            localStorage.setItem('iulian-wishlist', JSON.stringify(data));
          }
        },
        error: (error) => {
          console.error('Failed to load Iulian wishlist:', error);
        }
      });
  }

  updateWishlist(user: 'ioana' | 'iulian', wishlistData: WishlistData): Observable<any> {
    // For local development, just save to localStorage
    if (GITHUB_CONFIG.DEFAULT_TOKEN === 'ghp_your_default_token_here') {
      localStorage.setItem(`${user}-wishlist`, JSON.stringify(wishlistData));
      return of({ success: true });
    }

    const filePath = `src/assets/${user}-wishlist.json`;
    const url = this.getApiUrl(filePath);
    
    // Get the current file to get the SHA
    return this.http.get<any>(url, { headers: this.getHeaders() })
      .pipe(
        map(currentFile => {
          const content = btoa(JSON.stringify(wishlistData, null, 2));
          const updatePayload = {
            message: `Update ${user} wishlist - ${new Date().toISOString()}`,
            content: content,
            sha: currentFile.sha,
            branch: this.BRANCH
          };
          
          return this.http.put(url, updatePayload, { headers: this.getHeaders() });
        }),
        catchError(error => {
          console.error(`Error updating ${user} wishlist:`, error);
          // Fallback to localStorage
          localStorage.setItem(`${user}-wishlist`, JSON.stringify(wishlistData));
          return of({ success: true });
        })
      );
  }

  // Get current wishlist data
  getCurrentIoanaWishlist(): WishlistData | null {
    return this.ioanaWishlistSubject.value;
  }

  getCurrentIulianWishlist(): WishlistData | null {
    return this.iulianWishlistSubject.value;
  }
}
