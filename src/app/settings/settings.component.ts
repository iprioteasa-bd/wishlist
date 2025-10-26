import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FirebaseWishlistService } from '../services/firebase-wishlist.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  isMigrating = false;

  constructor(
    private router: Router,
    private firebaseService: FirebaseWishlistService
  ) {}

  async migrateSampleData() {
    if (confirm('This will replace any existing wishlist data with sample data. Continue?')) {
      this.isMigrating = true;
      try {
        const success = await this.firebaseService.migrateSampleData().toPromise();
        if (Boolean(success)) {
          alert('Sample data migrated successfully! Refresh the page to see the changes.');
        } else {
          alert('Failed to migrate sample data. Please try again.');
        }
      } catch (error) {
        console.error('Migration error:', error);
        alert('Error during migration. Please try again.');
      } finally {
        this.isMigrating = false;
      }
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
