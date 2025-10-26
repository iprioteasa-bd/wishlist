// GitHub Configuration
// Update these values with your actual GitHub repository details

export const GITHUB_CONFIG = {
  // Your GitHub username
  REPO_OWNER: 'iprioteasa-bd', // ⚠️ CHANGE THIS to your GitHub username
  
  // Repository name (should be 'wishlist' if following the setup guide)
  REPO_NAME: 'wishlist',
  
  // Branch name (usually 'main' or 'master')
  BRANCH: 'main',
  
  // GitHub API base URL
  API_BASE: 'https://api.github.com/repos',
  
  // Default GitHub token for automatic real-time updates
  // This token should have 'repo' scope for write access
  DEFAULT_TOKEN: 'ghp_your_default_token_here' // ⚠️ REPLACE with your actual token
};

// Instructions for setup:
// 1. Replace 'iprioteasa-bd' above with your actual GitHub username
// 2. Make sure your repository is named 'wishlist'
// 3. Ensure the repository is public
// 4. Generate a GitHub Personal Access Token with 'repo' scope
// 5. Replace 'ghp_your_default_token_here' with your actual token
// 6. The JSON files should be in src/assets/ directory
//
// Note: The default token allows all users to make real-time updates
// without any configuration. Keep this token secure!
