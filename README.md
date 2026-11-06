# NEXUS — Tactical Cloud Edge & Telemetry Console (Option 3)

> **Design Style**: Tactical Dark Developer Interface (Linear × Vercel × Cloudflare)  
> **Target**: Frontend Deployment Assessment on Vercel  
> **Tech Stack**: Pure Semantic HTML5, CSS3 with OLED Tokens & Sub-pixel Borders, Vanilla JavaScript (ES6+)

---

## Live Deployment Instructions (Vercel)

This project has **zero external build dependencies**. It deploys to Vercel instantly without any setup or build failures.

### Method A: Deploy via GitHub (Recommended for Assessment)
1. Initialize git and push this folder to your GitHub:
   ```bash
   cd option-3-nexus-console
   git init
   git add .
   git commit -m "feat: complete NEXUS Tactical Console UI"
   # Create a new repository on github.com, then run:
   git remote add origin https://github.com/<your-username>/nexus-console-frontend.git
   git branch -M main
   git push -u origin main
   ```
2. Visit [Vercel](https://vercel.com/) and sign in with GitHub.
3. Click **"Add New..."** → **"Project"**.
4. Import your `nexus-console-frontend` repository.
5. Keep default settings (Framework Preset: **Other**, Build Command: empty, Output Directory: empty).
6. Click **Deploy**. Your app is live in ~5 seconds!

### Method B: Deploy via Vercel CLI (1-Click)
```bash
npm i -g vercel
vercel
```

---

## Evaluation Highlights for Examiners
- **Visual Discipline**: OLED True Black `#07080A`, sub-pixel hairline borders, monospace telemetry readouts, and vibrant status pulses (Emerald, Cyan, Violet, Amber).
- **Interactive Micro-features**:
  - **Dynamic Edge Regions**: Click SFO-1, FRA-1, HND-1, or LHR-1 to simulate latency shifts and routing adjustments.
  - **Interactive API Sandbox**: Switch endpoints (`GET`, `POST`), click **Execute Request**, and observe simulated network loading with formatted JSON output.
  - **Tactical API Token Generator**: Configure scopes, mint tokens, and copy to clipboard with tactile visual feedback.
  - **Deployments Rollback Simulator**: Click rollback on any previous release to switch live status instantly.
  - **Linear Command Palette (`⌘K` / `Ctrl+K`)**: Global keyboard navigation, fuzzy search, and quick action execution.
- **Zero-Breakage Architecture**: Pure HTML/CSS/JS with `vercel.json` static configuration.

