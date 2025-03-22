# TekronFest Certification Portal

A futuristic cyberpunk-themed certification management system for TekronFest events, allowing organizers to create, manage, and distribute digital certificates to participants.

![TekronFest](https://example.com/techronfest-screenshot.png)

## Features

- 🔐 Secure authentication system
- 🏆 Digital certificate generation with cyberpunk design
- 🔍 Certificate verification for participants
- 📊 Admin dashboard for event management
- 🚀 CSV bulk upload for participant data
- 📱 Responsive design with animated UI elements

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Supabase
- jsPDF
- React Router
- Zustand

## Deployment on Netlify

### Option 1: Deploy Using Our Script

We've created a deployment script to simplify the process:

```bash
# Make the script executable (first time only)
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

The script will guide you through the deployment process, offering options to:
1. Deploy directly to production
2. Generate a preview URL
3. Exit without deploying

### Option 2: Manual Deployment

#### Prerequisites

1. Create a Netlify account at [netlify.com](https://www.netlify.com/)
2. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

#### Deployment Steps

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy using Netlify CLI:
   ```bash
   # Login to Netlify (first time only)
   netlify login
   
   # Initialize Netlify site (first time only)
   netlify init
   
   # Deploy to preview
   netlify deploy
   
   # Deploy to production
   netlify deploy --prod
   ```

3. Configure environment variables in the Netlify dashboard:
   - Go to Site settings > Build & deploy > Environment
   - Add the following variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

### Option 3: GitHub Integration

1. Push your code to a GitHub repository
2. In the Netlify dashboard, go to "Add new site" > "Import an existing project"
3. Select your GitHub repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy site"
6. Add environment variables in Site settings

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## License

MIT 