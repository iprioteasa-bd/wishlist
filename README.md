# Wishlist App

A beautiful, responsive wishlist application built with Angular that allows users to create and manage their personal wishlists with **full editing capabilities and real-time synchronization using Firebase**.

## Features

- **User Selection**: Choose between different users (Ioana and Iulian)
- **🆕 Firebase Integration**: Real-time database with Firestore
- **🆕 In-Browser Editing**: Users can edit their wishlists directly on the website
- **🆕 Add/Edit/Delete Items**: Full CRUD operations with beautiful forms
- **🆕 Real-Time Sync**: See each other's changes instantly via Firebase
- **🆕 Link Management**: Optional links with checkbox control
- **🆕 Priority System**: Items are color-coded by priority (high, medium, low)
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **GitHub Pages Ready**: Automatically deploys to GitHub Pages

## Live Demo

Visit the live application at: `https://yourusername.github.io/wishlist/`

## 🚀 Real-Time Features

### **How Real-Time Sync Works**
1. **Firebase Firestore**: Uses Firebase as the backend database
2. **Real-Time Listeners**: Changes appear instantly across all devices
3. **Automatic Sync**: No manual refresh needed
4. **Offline Support**: Works offline and syncs when connection is restored
5. **🆕 Zero Configuration**: Works automatically without any setup!

### **Benefits**
- ✅ **Real-Time**: See changes from other users instantly
- ✅ **Reliable**: Firebase's infrastructure ensures uptime
- ✅ **Scalable**: Handles multiple users seamlessly
- ✅ **Secure**: Firebase handles authentication and security
- ✅ **Offline**: Works even without internet connection

## Setup Instructions

### **1. Firebase Setup**
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Update `src/app/config/firebase.config.ts` with your Firebase config
4. Set up Firestore security rules (test mode for development)

### **2. Deploy to GitHub Pages**
1. Create a public repository named `wishlist`
2. Push your code to the main branch
3. Enable GitHub Pages in repository settings
4. Your app will be live at `https://yourusername.github.io/wishlist/`

## Data Storage

### **Firebase Firestore (Primary)**
- Real-time database with automatic synchronization
- Changes appear instantly across all devices
- Handles offline scenarios gracefully
- Secure and scalable

### **Local Storage (Backup)**
- User edits are automatically saved in the browser's localStorage
- Data persists across browser sessions
- Each user has their own separate storage
- Used as fallback when Firebase is unavailable

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm start`
4. Open `http://localhost:4200` in your browser

## Deployment

The application automatically deploys to GitHub Pages when changes are pushed to the main branch. The deployment is handled by GitHub Actions.

### Manual Deployment
If you need to deploy manually:
```bash
npm run deploy
```

## Project Structure

```
src/
├── app/
│   ├── models/
│   │   └── wishlist.model.ts    # TypeScript interfaces
│   ├── config/
│   │   └── firebase.config.ts   # Firebase configuration
│   ├── services/
│   │   ├── firebase-wishlist.service.ts      # Firebase service
│   │   └── firebase-initialization.service.ts # Initialization service
│   ├── user-selection/          # User selection component
│   ├── ioana-wishlist/          # Ioana's wishlist component (with editing)
│   ├── iulian-wishlist/         # Iulian's wishlist component (with editing)
│   └── app.routes.ts            # Application routing
└── main.ts                      # Application bootstrap
```

## Technologies Used

- Angular 17
- TypeScript
- SCSS
- Angular Forms (Template-driven forms)
- Firebase Firestore
- Firebase Analytics
- GitHub Actions
- GitHub Pages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## License

This project is open source and available under the MIT License.