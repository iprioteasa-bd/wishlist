# Deployment Guide

## Quick Setup for GitHub Pages

### 1. Create GitHub Repository
1. Go to GitHub and create a new repository named `wishlist`
2. Make sure it's public (required for GitHub Pages)
3. Clone the repository locally

### 2. Push Your Code
```bash
git add .
git commit -m "Initial wishlist app setup"
git push origin main
```

### 3. Enable GitHub Pages
1. Go to your repository settings
2. Scroll down to "Pages" section
3. Under "Source", select "GitHub Actions"
4. The deployment will start automatically

### 4. Access Your Site
Your wishlist will be available at: `https://yourusername.github.io/wishlist/`

## Updating Wishlists

### Method 1: Direct File Edit (Easiest)
1. Go to your GitHub repository
2. Navigate to `src/assets/ioana-wishlist.json` or `src/assets/iulian-wishlist.json`
3. Click the pencil icon to edit
4. Update the JSON with new items
5. Update the `lastUpdated` field
6. Commit changes
7. The site will automatically redeploy

### Method 2: Local Development
1. Clone the repository locally
2. Edit the JSON files in `src/assets/`
3. Test locally with `npm start`
4. Push changes to trigger deployment

## JSON Format Example

```json
{
  "user": "Ioana",
  "lastUpdated": "2024-01-15",
  "items": [
    {
      "id": 1,
      "name": "Wireless Headphones",
      "description": "High-quality noise-cancelling wireless headphones",
      "link": "https://example.com/headphones",
      "price": "$199.99",
      "priority": "high",
      "category": "Electronics"
    }
  ]
}
```

## Priority Levels
- `"high"` - Red border (urgent items)
- `"medium"` - Orange border (important items)  
- `"low"` - Green border (nice-to-have items)

## Troubleshooting

### Build Issues
- Make sure all JSON files are valid
- Check that all required fields are present
- Ensure links are valid URLs

### Deployment Issues
- Check GitHub Actions tab for deployment logs
- Ensure repository is public
- Verify GitHub Pages is enabled

### Local Development
- Run `npm install` to install dependencies
- Use `npm start` for development server
- Use `npm run build:github` to test production build
