# Grizzlies Practice Planner

GitHub-to-Netlify deployment package. No local Node.js or Netlify CLI is required.

## Repository structure

- `public/` — the deployed static website
- `netlify/functions/` — Netlify Functions used by the app
- `netlify.toml` — tells Netlify to publish `public/` and deploy the Functions directory

## First-time setup using only your browser

### 1. Create a GitHub repository

1. Sign in to GitHub.
2. Create a new repository, for example `grizzlies-practice-planner`.
3. The repository can be private if your Netlify plan/GitHub permissions support private repositories.
4. Do not add starter files if GitHub offers to create a README, `.gitignore`, or license; this package already contains the files you need.

### 2. Upload this project to GitHub

1. Extract the ZIP containing this project.
2. In the new GitHub repository, choose **Add file > Upload files**.
3. Upload the **contents** of the extracted folder so that `netlify.toml`, `public`, and `netlify` are at the repository root.
4. Commit the files to the main branch.

The repository root should look like this:

```text
netlify.toml
README.md
public/
netlify/
  functions/
```

### 3. Link the existing Netlify site to the GitHub repository

To keep using the existing Netlify site/domain:

1. Open the existing Grizzlies Practice Planner project in Netlify.
2. Go to **Project configuration > Developer settings > Continuous deployment > Repository**.
3. Select **Link repository**.
4. Choose GitHub and authorize access if prompted.
5. Select the GitHub repository you created above.

`netlify.toml` contains the deployment settings, so Netlify should use:

- Build command: **none / blank**
- Publish directory: `public`
- Functions directory: `netlify/functions`

### 4. Deploy

After the repository is linked, Netlify will build and deploy automatically from the main branch. Future GitHub commits will also trigger a new deployment.

After the first successful deployment, hard-refresh the app (`Ctrl+Shift+R`) so the updated service worker is loaded.

## Included application fixes

This repository includes the current planner version with:

- **Sketch my own drill** rink templates
- Thin default sketch width
- X/O placement tools with the reduced marker size
- Versioned replacement sketch filenames to prevent stale image caching
- Supabase direct image upload with a Netlify Function fallback
- Existing Print/PDF behavior and Hockey Canada PDF proxy Function
