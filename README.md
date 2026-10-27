# Noble Estates & Motors

- `frontend/` is the website (static files). It is hosted on Vercel.
- `backend/` is PocketBase (database, pictures, admin login). It is hosted on Railway.

## 1. Push to GitHub

```
cd noble
git init
git add .
git commit -m "Noble Estates & Motors"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/noble.git
git push -u origin main
```
Create the empty repository on github.com first (no README, no .gitignore).

## 2. Backend on Railway

1. railway.com, New Project, Deploy from GitHub repo, pick this repo.
2. Open the service, Settings, set **Root Directory** to `backend`. Railway finds the Dockerfile.
3. Variables tab, add:
   - `PB_ADMIN_EMAIL` your admin email
   - `PB_ADMIN_PASSWORD` a strong password (at least 10 characters)
4. **Add a volume**: right-click the service canvas (or press Ctrl/Cmd+K), Add Volume, mount path `/pb/pb_data`.
   Without this, every redeploy erases your listings and pictures.
5. Settings, Networking, **Generate Domain**. Copy the address, for example `https://noble-production.up.railway.app`.
6. Check `https://YOUR-DOMAIN/api/health` shows a "healthy" message, and `https://YOUR-DOMAIN/_/` opens the PocketBase dashboard.

## 3. Point the site at it

Edit `frontend/js/config.js`: set `LIVE_PB_URL` to the Railway address and `WA_NUMBER` to your WhatsApp number. Then:
```
git add . && git commit -m "Set live backend" && git push
```

## 4. Frontend on Vercel

1. vercel.com, Add New, Project, import the GitHub repo.
2. Set **Root Directory** to `frontend`. Framework preset: Other. Leave the build command and output directory empty.
3. Deploy. Every `git push` redeploys automatically.

## 5. Lock it down

- Back on Railway, add the variable `PB_ORIGINS` with your Vercel address (and custom domain if any), comma separated, for example `https://noble.vercel.app,https://www.noble.com`. Only your site can then call the API.
- In the PocketBase dashboard (`/_/`), Settings, Application, turn on rate limiting.
- Visit `your-site/admin.html`, sign in, and add your listings (or press "Load sample listings").

## Working on your computer

1. Download PocketBase into `backend/`, then in that folder run `./pocketbase superuser upsert you@email.com "password"` and `./pocketbase serve`.
2. Serve the `frontend` folder with any static server (VS Code Live Server, or `npx serve frontend`). On localhost the site automatically uses `http://127.0.0.1:8090`.

## Notes

- Railway is not free long term: you get trial credit, then a paid plan. Check current pricing.
- Back up your data: PocketBase dashboard, Settings, Backups, or download `pb_data` from the volume.
- To change PocketBase version, edit `PB_VERSION` in `backend/Dockerfile`.
