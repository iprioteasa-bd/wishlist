import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { WishlistData, WishlistItem } from '../models/wishlist.model';
import { FirebaseWishlistService } from '../services/firebase-wishlist.service';

@Component({
  selector: 'app-ioana-wishlist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ioana-wishlist.component.html',
  styleUrls: ['./ioana-wishlist.component.scss']
})
export class IoanaWishlistComponent implements OnInit, OnDestroy {
  userName = 'Ioana';
  wishlistData: WishlistData | null = null;
  loading = true;
  error: string | null = null;
  editingItem: WishlistItem | null = null;
  showAddForm = false;
  private subscription = new Subscription();
  
  newItem: Partial<WishlistItem> = {
    name: '',
    link: '',
    priority: 'medium',
    hasLink: false
  };
  
  constructor(
    private router: Router, 
    private firebaseService: FirebaseWishlistService
  ) {}

  ngOnInit() {
    // Subscribe to real-time updates from Firebase
    this.subscription.add(
      this.firebaseService.ioanaWishlist$.subscribe(data => {
        console.log('Ioana component received data:', data);
        if (data) {
          this.wishlistData = data;
          this.loading = false;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  startEdit(item: WishlistItem) {
    this.editingItem = { ...item };
    this.showAddForm = false;
  }

  cancelEdit() {
    this.editingItem = null;
    this.showAddForm = false;
    this.resetNewItem();
  }

  saveEdit() {
    if (this.editingItem && this.wishlistData) {
      // Update the item using Firebase service
      this.firebaseService.updateWishlistItem('ioana', this.editingItem.id, this.editingItem)
        .subscribe({
          next: (success) => {
            if (success) {
              console.log('Wishlist item updated in Firebase');
              this.editingItem = null;
            } else {
              console.error('Failed to update wishlist item');
            }
          },
          error: (error) => {
            console.error('Error updating wishlist item:', error);
          }
        });
    }
  }

  deleteItem(itemId: number) {
    if (this.wishlistData && confirm('Are you sure you want to delete this item?')) {
      this.firebaseService.removeWishlistItem('ioana', itemId)
        .subscribe({
          next: (success) => {
            if (success) {
              console.log('Wishlist item deleted from Firebase');
            } else {
              console.error('Failed to delete wishlist item');
            }
          },
          error: (error) => {
            console.error('Error deleting wishlist item:', error);
          }
        });
    }
  }

  showAddItemForm() {
    this.showAddForm = true;
    this.editingItem = null;
    this.resetNewItem();
  }

  resetNewItem() {
    this.newItem = {
      name: '',
      link: '',
      priority: 'medium',
      hasLink: false
    };
  }

  onLinkCheckboxChange() {
    if (!this.newItem.hasLink) {
      this.newItem.link = '';
    }
  }

  addNewItem() {
    if (this.wishlistData && this.newItem.name) {
      const item: WishlistItem = {
        id: Date.now(), // Firebase service will handle ID generation
        name: this.newItem.name!,
        link: this.newItem.hasLink && this.newItem.link ? this.newItem.link : '',
        priority: this.newItem.priority as 'high' | 'medium' | 'low'
      };
      
      this.firebaseService.addWishlistItem('ioana', item)
        .subscribe({
          next: (success) => {
            if (success) {
              console.log('Wishlist item added to Firebase');
              this.showAddForm = false;
              this.resetNewItem();
            } else {
              console.error('Failed to add wishlist item');
            }
          },
          error: (error) => {
            console.error('Error adding wishlist item:', error);
          }
        });
    }
  }


  goBack() {
    this.router.navigate(['/']);
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }

  loadWishlistData() {
    this.loading = true;
    this.firebaseService.loadWishlist('ioana').subscribe({
      next: (data) => {
        if (data) {
          this.wishlistData = data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading wishlist:', error);
        this.loading = false;
      }
    });
  }


  getPriorityClass(priority: string): string {
    return `priority-${priority}`;
  }

  getSortedItems(): WishlistItem[] {
    if (!this.wishlistData) return [];
    
    const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };
    return this.wishlistData.items.sort((a, b) => {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    // If already in dd.mm.yyyy format, return as is
    if (dateString.includes('.')) {
      return dateString;
    }
    
    // Convert from YYYY-MM-DD to dd.mm.yyyy
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}.${month}.${year}`;
  }
}
