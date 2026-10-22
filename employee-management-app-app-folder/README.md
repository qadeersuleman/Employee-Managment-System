# Employee Management App (Next.js App Router)

This is an `app/` folder only, intended to be copied into an existing Next.js project. It uses localStorage as a temporary demo database, so data persists in the same browser on the same device. It is not suitable for real employee data or multi-user production use.

## Included
- Dashboard with summary cards and department breakdown
- Employee search, department/status filters
- Add, edit, view, and delete employees
- Employee profile drawer/modal
- Salary, joining date, role, department, status fields
- Attendance quick action (mark present/absent for today)
- CSV export
- Responsive layout and localStorage persistence

## Setup
1. Unzip this archive.
2. Copy the included `app` folder into your existing Next.js project, merging/replacing files only if you want to.
3. Ensure Tailwind CSS is already configured in your project (this app uses Tailwind utility classes).
4. Install icons:
   ```bash
   npm install lucide-react
   ```
5. Run:
   ```bash
   npm run dev
   ```
6. Open `http://localhost:3000`.

## Notes
- The app expects a Tailwind-enabled Next.js App Router project.
- The app folder includes `layout.tsx` and `globals.css`; if your project already has these, you can merge the font import/body styles and keep your existing layout if preferred.
- Demo data is seeded in the browser on first visit. Use the Reset Demo button to restore sample data.
- Next step after you test: replace the localStorage data layer with Supabase tables, auth, and Row Level Security.
