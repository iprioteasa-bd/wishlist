import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { WishlistData, WishlistItem } from '../models/wishlist.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-iulian-wishlist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './iulian-wishlist.component.html',
  styleUrls: ['./iulian-wishlist.component.scss']
})
export class IulianWishlistComponent implements OnInit {
  userName = 'Iulian';
  wishlistData: WishlistData | null = null;
  loading = true;
  error: string | null = null;
  editingItem: WishlistItem | null = null;
  showAddForm = false;
  newItem: Partial<WishlistItem> = {
    name: '',
    link: '',
    priority: 'medium'
  };
  
  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.loadWishlistData();
  }

  loadWishlistData() {
    // First try to load from localStorage
    const savedData = localStorage.getItem('iulian-wishlist');
    if (savedData) {
      try {
        this.wishlistData = JSON.parse(savedData);
        this.loading = false;
        return;
      } catch (e) {
        console.error('Error parsing saved data:', e);
      }
    }

    // If no saved data, load from JSON file
    this.http.get<WishlistData>('assets/iulian-wishlist.json').subscribe({
      next: (data) => {
        this.wishlistData = data;
        this.saveToLocalStorage();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load wishlist data';
        this.loading = false;
        console.error('Error loading wishlist:', err);
      }
    });
  }

  saveToLocalStorage() {
    if (this.wishlistData) {
      localStorage.setItem('iulian-wishlist', JSON.stringify(this.wishlistData));
    }
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
        this.saveToLocalStorage();
        this.editingItem = null;
      }
    }
  }

  deleteItem(itemId: number) {
    if (this.wishlistData && confirm('Are you sure you want to delete this item?')) {
      this.wishlistData.items = this.wishlistData.items.filter(item => item.id !== itemId);
      this.wishlistData.lastUpdated = new Date().toLocaleDateString('en-GB');
      this.saveToLocalStorage();
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
      this.saveToLocalStorage();
      this.showAddForm = false;
      this.resetNewItem();
    }
  }

  goBack() {
    this.router.navigate(['/']);
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
