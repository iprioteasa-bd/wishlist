import { Injectable } from '@angular/core';
import { FirebaseWishlistService } from './firebase-wishlist.service';

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
        console.log('Initializing Firebase wishlist data...');
        const success = await this.firebaseWishlistService.initializeWishlists().toPromise();
        
        if (success) {
          console.log('Firebase wishlist data initialized successfully!');
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
