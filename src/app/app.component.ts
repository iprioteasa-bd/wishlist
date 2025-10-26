import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FirebaseInitializationService } from './services/firebase-initialization.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  title = 'wishlist-app';

  constructor(private firebaseInitService: FirebaseInitializationService) {}

  ngOnInit() {
    // Delay initialization to allow Firebase listeners to set up first
    setTimeout(() => {
      this.firebaseInitService.initializeFirebaseData();
    }, 2000); // 2 second delay
  }
}
