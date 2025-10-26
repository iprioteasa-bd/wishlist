import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-selection.component.html',
  styleUrls: ['./user-selection.component.scss']
})
export class UserSelectionComponent {
  constructor(private router: Router) {}

  selectUser(user: string) {
    // Store selected user in localStorage for persistence
    localStorage.setItem('selectedUser', user);
    
    // Navigate to the specific user's wishlist page
    const route = user.toLowerCase();
    this.router.navigate([`/${route}`]);
  }
}
