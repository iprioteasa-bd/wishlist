import { Injectable } from '@angular/core';
import { FirebaseWishlistService } from './firebase-wishlist.service';
import { SAMPLE_WISHLIST_DATA } from '../data/sample-wishlist-data';

@Injectable({
  providedIn: 'root'
})
export class FirebaseInitializationService {
  constructor(private firebaseWishlistService: FirebaseWishlistService) {}

  async initializeFirebaseData(): Promise<void> {
    try {
      console.log('Checking if Firebase wishlist data needs initialization...');
      
      // Check if both wishlists already exist
      const ioanaData = this.firebaseWishlistService.getCurrentIoanaWishlist();
      const iulianData = this.firebaseWishlistService.getCurrentIulianWishlist();
      
      // Only initialize if both are null (meaning documents don't exist)
      if (!ioanaData && !iulianData) {
        console.log('Initializing Firebase wishlist data with sample data...');
        
        // Initialize with sample data instead of empty wishlists
        const ioanaSuccess = await this.firebaseWishlistService.updateWishlist('ioana', SAMPLE_WISHLIST_DATA.ioana).toPromise();
        const iulianSuccess = await this.firebaseWishlistService.updateWishlist('iulian', SAMPLE_WISHLIST_DATA.iulian).toPromise();
        
        if (Boolean(ioanaSuccess) && Boolean(iulianSuccess)) {
          console.log('Firebase wishlist data initialized successfully with sample data!');
        } else {
          console.error('Failed to initialize Firebase wishlist data');
        }
      } else {
        console.log('Firebase wishlist data already exists, skipping initialization');
      }
    } catch (error) {
      console.error('Error checking/initializing Firebase data:', error);
    }
  }
}
