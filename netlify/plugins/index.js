// Netlify build plugin for Certificate Portal
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  onPreBuild: async ({ utils }) => {
    console.log('Certificate Portal Plugin: Starting pre-build...');
    
    // Check environment variables
    const requiredEnvVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
    const missingEnvVars = requiredEnvVars.filter(name => !process.env[name]);
    
    if (missingEnvVars.length > 0) {
      utils.build.failBuild(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    }
  },
  
  onBuild: async ({ utils }) => {
    console.log('Certificate Portal Plugin: Building...');
    try {
      // Verify dist directory exists after build
      const distPath = path.join(process.cwd(), 'dist');
      
      if (!fs.existsSync(distPath)) {
        utils.build.failBuild('Build failed: dist directory not found');
      }
      
      // Check for critical files
      const criticalFiles = ['index.html', 'assets'];
      for (const file of criticalFiles) {
        const filePath = path.join(distPath, file);
        if (!fs.existsSync(filePath)) {
          utils.build.failBuild(`Build failed: Critical file/directory missing: ${file}`);
        }
      }
    } catch (error) {
      utils.build.failBuild(`Build failed: ${error.message}`);
    }
  },
  
  onPostBuild: async ({ utils }) => {
    console.log('Certificate Portal Plugin: Build complete!');
  }
} 