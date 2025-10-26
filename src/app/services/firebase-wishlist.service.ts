import { Injectable } from '@angular/core';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc,
  query,
  orderBy,
  onSnapshot,
  DocumentData,
  DocumentSnapshot,
  QuerySnapshot
} from 'firebase/firestore';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { db } from '../config/firebase.config';
import { WishlistData, WishlistItem } from '../models/wishlist.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseWishlistService {
  private readonly COLLECTION_NAME = 'wishlists';
  
  private ioanaWishlistSubject = new BehaviorSubject<WishlistData | null>(null);
  private iulianWishlistSubject = new BehaviorSubject<WishlistData | null>(null);
  
  public ioanaWishlist$ = this.ioanaWishlistSubject.asObservable();
  public iulianWishlist$ = this.iulianWishlistSubject.asObservable();

  constructor() {
    this.setupRealtimeListeners();
  }

  private setupRealtimeListeners(): void {
    console.log('Setting up Firebase real-time listeners...');
    
    // Listen to Ioana's wishlist changes
    const ioanaDocRef = doc(db, this.COLLECTION_NAME, 'ioana');
    onSnapshot(ioanaDocRef, (docSnapshot: DocumentSnapshot) => {
      console.log('Ioana wishlist snapshot received:', docSnapshot.exists());
      if (docSnapshot.exists()) {
        const data = docSnapshot.data() as WishlistData;
        console.log('Ioana wishlist data:', data);
        this.ioanaWishlistSubject.next(data);
      } else {
        console.log('Ioana wishlist document does not exist, creating empty wishlist');
        // Create empty wishlist if document doesn't exist
        const emptyWishlist: WishlistData = {
          user: 'Ioana',
          lastUpdated: new Date().toISOString().split('T')[0],
          items: []
        };
        this.ioanaWishlistSubject.next(emptyWishlist);
      }
    }, (error) => {
      console.error('Error listening to Ioana wishlist:', error);
    });

    // Listen to Iulian's wishlist changes
    const iulianDocRef = doc(db, this.COLLECTION_NAME, 'iulian');
    onSnapshot(iulianDocRef, (docSnapshot: DocumentSnapshot) => {
      console.log('Iulian wishlist snapshot received:', docSnapshot.exists());
      if (docSnapshot.exists()) {
        const data = docSnapshot.data() as WishlistData;
        console.log('Iulian wishlist data:', data);
        this.iulianWishlistSubject.next(data);
      } else {
        console.log('Iulian wishlist document does not exist, creating empty wishlist');
        // Create empty wishlist if document doesn't exist
        const emptyWishlist: WishlistData = {
          user: 'Iulian',
          lastUpdated: new Date().toISOString().split('T')[0],
          items: []
        };
        this.iulianWishlistSubject.next(emptyWishlist);
      }
    }, (error) => {
      console.error('Error listening to Iulian wishlist:', error);
    });
  }

  // Load wishlist data for a specific user
  loadWishlist(user: 'ioana' | 'iulian'): Observable<WishlistData | null> {
    const docRef = doc(db, this.COLLECTION_NAME, user);
    
    return from(getDoc(docRef)).pipe(
      map((docSnapshot: DocumentSnapshot) => {
        if (docSnapshot.exists()) {
          return docSnapshot.data() as WishlistData;
        } else {
          // Return empty wishlist if document doesn't exist
          return {
            user: user === 'ioana' ? 'Ioana' : 'Iulian',
            lastUpdated: new Date().toISOString().split('T')[0],
            items: []
          };
        }
      }),
      catchError(error => {
        console.error(`Error loading ${user} wishlist:`, error);
        return from([null]);
      })
    );
  }

  // Update wishlist data for a specific user
  updateWishlist(user: 'ioana' | 'iulian', wishlistData: WishlistData): Observable<boolean> {
    const docRef = doc(db, this.COLLECTION_NAME, user);
    
    // Update the lastUpdated timestamp
    const updatedData = {
      ...wishlistData,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    return from(setDoc(docRef, updatedData)).pipe(
      map(() => true),
      catchError(error => {
        console.error(`Error updating ${user} wishlist:`, error);
        return from([false]);
      })
    );
  }

  // Add a new item to a wishlist
  addWishlistItem(user: 'ioana' | 'iulian', item: WishlistItem): Observable<boolean> {
    console.log(`Adding item to ${user} wishlist:`, item);
    const docRef = doc(db, this.COLLECTION_NAME, user);
    
    // First, get the current document to ensure we have the latest data
    return from(getDoc(docRef)).pipe(
      map((docSnapshot: DocumentSnapshot) => {
        let currentWishlist: WishlistData;
        
        if (docSnapshot.exists()) {
          currentWishlist = docSnapshot.data() as WishlistData;
          console.log(`Current ${user} wishlist loaded:`, currentWishlist);
        } else {
          console.log(`No existing ${user} wishlist, creating new one`);
          // Create empty wishlist if document doesn't exist
          currentWishlist = {
            user: user === 'ioana' ? 'Ioana' : 'Iulian',
            lastUpdated: new Date().toISOString().split('T')[0],
            items: []
          };
        }

        // Generate a unique ID for the new item
        const newItem: WishlistItem = {
          ...item,
          id: Date.now() // Simple ID generation - in production you might want to use a more robust method
        };

        const updatedItems = [...currentWishlist.items, newItem];
        const updatedWishlist: WishlistData = {
          ...currentWishlist,
          items: updatedItems,
          lastUpdated: new Date().toISOString().split('T')[0]
        };

        console.log(`Updated ${user} wishlist to save:`, updatedWishlist);
        // Update the document
        return from(setDoc(docRef, updatedWishlist));
      }),
      map(() => {
        console.log(`Successfully added item to ${user} wishlist`);
        return true;
      }),
      catchError(error => {
        console.error(`Error adding item to ${user} wishlist:`, error);
        return from([false]);
      })
    );
  }

  // Update an existing item in a wishlist
  updateWishlistItem(user: 'ioana' | 'iulian', itemId: number, updatedItem: Partial<WishlistItem>): Observable<boolean> {
    const docRef = doc(db, this.COLLECTION_NAME, user);
    
    return from(getDoc(docRef)).pipe(
      map((docSnapshot: DocumentSnapshot) => {
        if (!docSnapshot.exists()) {
          console.error(`No wishlist found for ${user}`);
          return from([false]);
        }

        const currentWishlist = docSnapshot.data() as WishlistData;
        const updatedItems = currentWishlist.items.map(item => 
          item.id === itemId ? { ...item, ...updatedItem } : item
        );

        const updatedWishlist: WishlistData = {
          ...currentWishlist,
          items: updatedItems,
          lastUpdated: new Date().toISOString().split('T')[0]
        };

        return from(setDoc(docRef, updatedWishlist));
      }),
      map(() => true),
      catchError(error => {
        console.error(`Error updating item in ${user} wishlist:`, error);
        return from([false]);
      })
    );
  }

  // Remove an item from a wishlist
  removeWishlistItem(user: 'ioana' | 'iulian', itemId: number): Observable<boolean> {
    const docRef = doc(db, this.COLLECTION_NAME, user);
    
    return from(getDoc(docRef)).pipe(
      map((docSnapshot: DocumentSnapshot) => {
        if (!docSnapshot.exists()) {
          console.error(`No wishlist found for ${user}`);
          return from([false]);
        }

        const currentWishlist = docSnapshot.data() as WishlistData;
        const updatedItems = currentWishlist.items.filter(item => item.id !== itemId);
        const updatedWishlist: WishlistData = {
          ...currentWishlist,
          items: updatedItems,
          lastUpdated: new Date().toISOString().split('T')[0]
        };

        return from(setDoc(docRef, updatedWishlist));
      }),
      map(() => true),
      catchError(error => {
        console.error(`Error removing item from ${user} wishlist:`, error);
        return from([false]);
      })
    );
  }

  // Get current wishlist data (synchronous)
  getCurrentIoanaWishlist(): WishlistData | null {
    return this.ioanaWishlistSubject.value;
  }

  getCurrentIulianWishlist(): WishlistData | null {
    return this.iulianWishlistSubject.value;
  }

  // Initialize empty wishlists for both users (useful for first-time setup)
  initializeWishlists(): Observable<boolean> {
    const ioanaWishlist: WishlistData = {
      user: 'Ioana',
      lastUpdated: new Date().toISOString().split('T')[0],
      items: []
    };

    const iulianWishlist: WishlistData = {
      user: 'Iulian',
      lastUpdated: new Date().toISOString().split('T')[0],
      items: []
    };

    return from(Promise.all([
      setDoc(doc(db, this.COLLECTION_NAME, 'ioana'), ioanaWishlist),
      setDoc(doc(db, this.COLLECTION_NAME, 'iulian'), iulianWishlist)
    ])).pipe(
      map(() => true),
      catchError(error => {
        console.error('Error initializing wishlists:', error);
        return from([false]);
      })
    );
  }
}
