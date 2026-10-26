# Serving Signal Wars
The game is static files in `public/`. ES modules require HTTP (not `file://`).

- **Node (recommended):** `npm start` → http://localhost:8080 (set `PORT` to override). Zero dependencies.
- **Python:** `cd public && python3 -m http.server 8080`
- **Production Node hosts (Railway / Render / Fly.io):** build command none, start command `npm start`; the host's `PORT` is honored.
- **Static hosts (Vercel / Netlify / GitHub Pages):** set publish/output directory to `public`, no build command.
