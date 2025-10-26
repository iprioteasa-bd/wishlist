import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { WishlistData, WishlistItem } from '../models/wishlist.model';
import { GitHubWishlistService } from '../services/github-wishlist.service';

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
    priority: 'medium'
  };
  
  constructor(
    private router: Router, 
    private http: HttpClient,
    private githubService: GitHubWishlistService
  ) {}

  ngOnInit() {
    // Subscribe to real-time updates
    this.subscription.add(
      this.githubService.ioanaWishlist$.subscribe(data => {
        if (data) {
          this.wishlistData = data;
          this.loading = false;
        }
      })
    );

    // Load initial data
    this.loadWishlistData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadWishlistData() {
    this.loading = true;
    this.githubService.loadIoanaWishlist();
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
      const index = this.wishlistData.items.findIndex(item => item.id === this.editingItem!.id);
      if (index !== -1) {
        this.wishlistData.items[index] = { ...this.editingItem };
        this.wishlistData.lastUpdated = new Date().toLocaleDateString('en-GB');
        
        // Update via GitHub API for real-time sync
        this.githubService.updateWishlist('ioana', this.wishlistData)
          .subscribe({
            next: () => {
              console.log('Wishlist updated on GitHub');
              this.editingItem = null;
            },
            error: (error) => {
              console.error('Error updating wishlist:', error);
              // Fallback to localStorage
              this.saveToLocalStorage();
              this.editingItem = null;
            }
          });
      }
    }
  }

  deleteItem(itemId: number) {
    if (this.wishlistData && confirm('Are you sure you want to delete this item?')) {
      this.wishlistData.items = this.wishlistData.items.filter(item => item.id !== itemId);
      this.wishlistData.lastUpdated = new Date().toLocaleDateString('en-GB');
      
      // Update via GitHub API for real-time sync
      this.githubService.updateWishlist('ioana', this.wishlistData)
        .subscribe({
          next: () => {
            console.log('Wishlist updated on GitHub');
          },
          error: (error) => {
            console.error('Error updating wishlist:', error);
            // Fallback to localStorage
            this.saveToLocalStorage();
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
      priority: 'medium'
    };
  }

  addNewItem() {
    if (this.wishlistData && this.newItem.name) {
      const newId = Math.max(...this.wishlistData.items.map(item => item.id)) + 1;
      const item: WishlistItem = {
        id: newId,
        name: this.newItem.name!,
        link: this.newItem.link || '#',
        priority: this.newItem.priority as 'high' | 'medium' | 'low'
      };
      
      this.wishlistData.items.push(item);
      this.wishlistData.lastUpdated = new Date().toLocaleDateString('en-GB');
      
      // Update via GitHub API for real-time sync
      this.githubService.updateWishlist('ioana', this.wishlistData)
        .subscribe({
          next: () => {
            console.log('Wishlist updated on GitHub');
            this.showAddForm = false;
            this.resetNewItem();
          },
          error: (error) => {
            console.error('Error updating wishlist:', error);
            // Fallback to localStorage
            this.saveToLocalStorage();
            this.showAddForm = false;
            this.resetNewItem();
          }
        });
    }
  }

  saveToLocalStorage() {
    if (this.wishlistData) {
      localStorage.setItem('ioana-wishlist', JSON.stringify(this.wishlistData));
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }

  goToSettings() {
    this.router.navigate(['/settings']);
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
