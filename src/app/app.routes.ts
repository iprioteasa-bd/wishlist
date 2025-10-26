import { Routes } from '@angular/router';
import { UserSelectionComponent } from './user-selection/user-selection.component';
import { IoanaWishlistComponent } from './ioana-wishlist/ioana-wishlist.component';
import { IulianWishlistComponent } from './iulian-wishlist/iulian-wishlist.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
  { path: '', component: UserSelectionComponent },
  { path: 'ioana', component: IoanaWishlistComponent },
  { path: 'iulian', component: IulianWishlistComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', redirectTo: '' }
];
