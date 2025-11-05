import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseInitializationService } from './services/firebase-initialization.service';
import { UserSelectionComponent } from './user-selection/user-selection.component';
import { WishlistComponent } from './wishlist/wishlist.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, UserSelectionComponent, WishlistComponent],
  template: `
    <div class="app-container">
      <app-user-selection 
        *ngIf="!selectedUser" 
        (userSelected)="onUserSelected($event)">
      </app-user-selection>
      <app-wishlist 
        *ngIf="selectedUser" 
        [user]="selectedUser">
      </app-wishlist>
      <button 
        *ngIf="selectedUser" 
        class="switch-user-button" 
        (click)="clearSelection()">
        ← Switch User
      </button>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      position: relative;
    }
    .switch-user-button {
      position: fixed;
      top: 1rem;
      left: 1rem;
      background: rgba(255, 255, 255, 0.9);
      border: 2px solid rgba(0, 0, 0, 0.1);
      color: #333;
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 600;
      transition: all 0.3s ease;
      z-index: 1000;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .switch-user-button:hover {
      background: rgba(255, 255, 255, 1);
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'wishlist-app';
  selectedUser: 'ioana' | 'iulian' | null = null;

  constructor(private firebaseInitService: FirebaseInitializationService) {}

  ngOnInit() {
    // Delay initialization to allow Firebase listeners to set up first
    setTimeout(() => {
      this.firebaseInitService.initializeFirebaseData();
    }, 2000); // 2 second delay

    // Check if there's a saved user selection
    const savedUser = localStorage.getItem('selectedUser');
    if (savedUser) {
      const userKey = savedUser.toLowerCase() as 'ioana' | 'iulian';
      if (userKey === 'ioana' || userKey === 'iulian') {
        this.selectedUser = userKey;
      }
    }
  }

  onUserSelected(user: 'ioana' | 'iulian') {
    this.selectedUser = user;
  }

  clearSelection() {
    this.selectedUser = null;
    localStorage.removeItem('selectedUser');
  }
}
