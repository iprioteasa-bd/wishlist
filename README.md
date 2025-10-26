# Wishlist App

A beautiful, responsive wishlist application built with Angular that allows users to create and manage their personal wishlists with **full editing capabilities and real-time synchronization**.

## Features

- **User Selection**: Choose between different users (Ioana and Iulian)
- **Dynamic Wishlists**: Wishlist data is loaded from JSON files for easy updates
- **🆕 In-Browser Editing**: Users can edit their wishlists directly on the website
- **🆕 Add/Edit/Delete Items**: Full CRUD operations with beautiful forms
- **🆕 Real-Time Sync**: See each other's changes instantly via GitHub API
- **🆕 Local Storage**: Changes are automatically saved in the browser
- **🆕 GitHub Integration**: Free real-time updates using GitHub's API
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Priority System**: Items are color-coded by priority (high, medium, low)
- **GitHub Pages Ready**: Automatically deploys to GitHub Pages

## Live Demo

Visit the live application at: `https://yourusername.github.io/wishlist/`

## 🚀 Real-Time Features

### **How Real-Time Sync Works**
1. **GitHub as Database**: Uses GitHub repository files as shared storage
2. **API Updates**: Users can update each other's JSON files via GitHub API
3. **Automatic Polling**: App checks for updates every 30 seconds
4. **Instant Sync**: Changes appear for all users without refresh
5. **🆕 Zero Configuration**: Works automatically without any setup!

### **Setup for Real-Time Updates**
1. **Generate GitHub Token**: Create a Personal Access Token with 'repo' scope
2. **Update Configuration**: Add your token to `src/app/config/github.config.ts`
3. **Deploy**: Push to GitHub and real-time updates work automatically!

### **Benefits**
- ✅ **Free**: Uses GitHub's free API (no backend costs)
- ✅ **Real-Time**: See changes from other users instantly
- ✅ **Zero Setup**: Users don't need to configure anything
- ✅ **Secure**: Uses GitHub's secure authentication
- ✅ **Reliable**: GitHub's infrastructure ensures uptime
- ✅ **Version Control**: All changes are tracked in Git history

## How Users Can Edit Their Wishlists

### ✨ **Direct Browser Editing (NEW!)**
Users can now edit their wishlists directly on the website:

1. **Add New Items**: Click the "+ Add New Item" button
2. **Edit Existing Items**: Click the ✏️ edit button on any item
3. **Delete Items**: Click the 🗑️ delete button (with confirmation)
4. **Automatic Saving**: All changes are saved automatically in the browser

### **Features Available:**
- ✅ Add new wishlist items with full details
- ✅ Edit existing items (name, description, price, category, priority, link)
- ✅ Delete items with confirmation dialog
- ✅ Priority levels (High/Medium/Low) with color coding
- ✅ Categories for better organization
- ✅ External links to products
- ✅ Automatic timestamp updates
- ✅ Data persistence across browser sessions

## How to Update Wishlists (For Administrators)

### For Ioana's Wishlist:
1. Navigate to `src/assets/ioana-wishlist.json`
2. Edit the JSON file with new items
3. Update the `lastUpdated` field with the current date
4. Commit and push changes to trigger automatic deployment

### For Iulian's Wishlist:
1. Navigate to `src/assets/iulian-wishlist.json`
2. Edit the JSON file with new items
3. Update the `lastUpdated` field with the current date
4. Commit and push changes to trigger automatic deployment

### JSON Structure

```json
{
  "user": "User Name",
  "lastUpdated": "YYYY-MM-DD",
  "items": [
    {
      "id": 1,
      "name": "Item Name",
      "description": "Item description",
      "link": "https://example.com/item",
      "price": "$99.99",
      "priority": "high|medium|low",
      "category": "Category Name"
    }
  ]
}
```

### Priority Colors
- **High Priority**: Red border
- **Medium Priority**: Orange border  
- **Low Priority**: Green border

## Setup Instructions

### **1. Configure GitHub Repository**
1. Update `src/app/config/github.config.ts`:
   ```typescript
   export const GITHUB_CONFIG = {
     REPO_OWNER: 'yourusername', // ⚠️ CHANGE THIS to your GitHub username
     REPO_NAME: 'wishlist',
     BRANCH: 'main',
     API_BASE: 'https://api.github.com/repos'
   };
   ```

### **2. Deploy to GitHub Pages**
1. Create a public repository named `wishlist`
2. Push your code to the main branch
3. Enable GitHub Pages in repository settings
4. Your app will be live at `https://yourusername.github.io/wishlist/`

### **3. Get GitHub Personal Access Token**
1. Go to GitHub.com → Settings → Developer settings → Personal access tokens
2. Click "Generate new token (classic)"
3. Give it a name like "Wishlist App"
4. Select scope: **"repo"** (full control of private repositories)
5. Click "Generate token"
6. Copy the token

### **4. Configure Real-Time Updates**
1. Open `src/app/config/github.config.ts`
2. Replace `'ghp_your_default_token_here'` with your actual token
3. Save the file
4. Deploy to GitHub - real-time updates work automatically!

## Data Storage

### **Real-Time Sync (GitHub API)**
- Changes are saved to GitHub repository files via API
- All users see updates in real-time (every 30 seconds)
- Uses default token for automatic authentication
- Free and reliable using GitHub's infrastructure

### **Local Storage (Client-Side Backup)**
- User edits are automatically saved in the browser's localStorage
- Data persists across browser sessions
- Each user has their own separate storage (`ioana-wishlist`, `iulian-wishlist`)
- Used as fallback when GitHub API is unavailable

### **JSON Files (Default Data)**
- Initial/default data loaded from JSON files
- Perfect for first-time visitors
- Can be updated by administrators via Git

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
│   ├── user-selection/          # User selection component
│   ├── ioana-wishlist/          # Ioana's wishlist component (with editing)
│   ├── iulian-wishlist/         # Iulian's wishlist component (with editing)
│   └── app.routes.ts            # Application routing
├── assets/
│   ├── ioana-wishlist.json      # Ioana's default wishlist data
│   └── iulian-wishlist.json     # Iulian's default wishlist data
└── main.ts                      # Application bootstrap
```

## Technologies Used

- Angular 17
- TypeScript
- SCSS
- Angular Forms (Template-driven forms)
- LocalStorage API
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