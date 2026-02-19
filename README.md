# Vexture TikTok Command Center

A private single-page app for organizing multi-account TikTok management in one place.

## What this app can do

- Manage multiple TikTok account profiles in one dashboard
- Plan and schedule post ideas per account
- Track followers and average views with a view-rate estimate
- Lock the dashboard with your own local passcode
- Save data locally in your browser (auto-saved) and export/import JSON backups

## Quick start

```bash
cd /workspace/Vexture
python3 -m http.server 4173
```

Open `http://localhost:4173` in your browser.

## How to use

1. **Set passcode**
   - On first load, enter a passcode and click **Create passcode**.
   - Next time, enter the same passcode to unlock.
2. **Add accounts**
   - In the Accounts panel, add account name + niche.
3. **Schedule content**
   - In Content Planner, pick the account, write a post idea, choose a date, then schedule.
4. **Update growth**
   - In Growth Tracker, pick account and set followers + avg views.
5. **Backup data**
   - Use **Export JSON** to save your data and **Import JSON** to restore it anywhere.

## Notes

- This is a local productivity tool and does not directly connect to TikTok APIs.
- Your passcode and data are stored in local browser storage on that device.
