import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-selection.component.html',
  styleUrls: ['./user-selection.component.scss']
})
export class UserSelectionComponent {
  @Output() userSelected = new EventEmitter<'ioana' | 'iulian'>();

  selectUser(user: string) {
    // Store selected user in localStorage for persistence
    localStorage.setItem('selectedUser', user);
    
    // Emit the selected user to parent component
    const userKey = user.toLowerCase() as 'ioana' | 'iulian';
    this.userSelected.emit(userKey);
  }
}
