SMO-specific extension that adds images on Bingosync.

<p>
  <img src="https://github.com/user-attachments/assets/50788279-c6a6-47ea-a8e3-cd70de20b489" width="300px">
  <img src="https://github.com/user-attachments/assets/e80e9c45-3c50-43c6-93c8-323fe300fc36" width="300px">
</p>

How to install:

Only Chrome and Edge have been tested but the extension should work in all Chromium‑based browsers (Chrome, Edge, Brave, Opera, Vivaldi) under Manifest V3. Trying to use it with Firefox results in major issues.

1. Clone or download (Code -> Download ZIP) this repo.  
2. Open your browser and navigate to its extensions page:  
   - Chrome/Edge: `chrome://extensions/`  
   - Opera: `opera://extensions/`  
3. Enable **Developer mode**.  
4. Click **Load unpacked** (or **Load temporary extension** in Opera) and select the project folder.  

Features:
- **Replace tile text** with images (32 px height) defined in a JSON mapping.  
- **Add colored badges** (e.g. `CASADE`, `SAND`, `LAKE`, `ALL`) to each tile based on its “kingdom.”  
- **“Load Images”** button lets you manually (re‑)apply the image/badge overlay.  

Additional Notes:
- The button may appear on other games, but it won’t have any functionality there.
- It won’t do anything while the board cover is still active.
- To switch back to the standard text-only squares, simply refresh your browser.
- The extension might not play nicely with all other extensions — it’s only been tested with Bingosync counters, which seem to work fine alongside it.

Planned Features:
- Automatically update the board when it’s generated or revealed
- Allow users to customize kingdom badge color coding
- Let users choose which types of goals should be replaced with images (e.g., only regional coins)
