# Certificate Portal

A modern web application for managing and generating certificates with a cyberpunk theme.

## Features

- User authentication with Supabase
- Certificate generation and management
- CSV bulk upload for participants
- Admin dashboard for managing users and certificates
- Responsive design with mobile support
- Dark cyberpunk theme

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- Zustand for state management
- React Router for navigation
- jsPDF for certificate generation

## Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

The project is configured for deployment on Netlify. Simply connect your GitHub repository to Netlify and it will automatically deploy when you push to the main branch.

Make sure to set the following environment variables in your Netlify dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## License

MIT 