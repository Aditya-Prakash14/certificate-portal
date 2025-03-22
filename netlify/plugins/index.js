// Netlify build plugin for TekronFest Certification Portal
module.exports = {
  onPreBuild: ({ utils }) => {
    console.log('⚡ TekronFest Build Plugin Activated');
    
    // Check that all required environment variables are set
    const requiredEnvVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
    const missingEnvVars = requiredEnvVars.filter(
      (name) => !process.env[name]
    );
    
    if (missingEnvVars.length) {
      utils.build.failBuild(
        `Missing required environment variables: ${missingEnvVars.join(', ')}`
      );
    }
  },
  
  onBuild: () => {
    console.log('🔍 Performing build verifications...');
  },
  
  onPostBuild: ({ constants }) => {
    const fs = require('fs');
    const path = require('path');
    
    console.log('🚀 Build completed, performing post-processing...');
    
    // Verify critical files exist
    const distDir = constants.PUBLISH_DIR;
    const criticalFiles = ['index.html', 'assets'];
    
    criticalFiles.forEach(file => {
      const filePath = path.join(distDir, file);
      
      if (!fs.existsSync(filePath)) {
        console.error(`⚠️ Critical file or directory missing: ${file}`);
      } else {
        console.log(`✅ Verified: ${file}`);
      }
    });
    
    // Create a robots.txt if it doesn't exist
    const robotsPath = path.join(distDir, 'robots.txt');
    if (!fs.existsSync(robotsPath)) {
      const robotsContent = `User-agent: *\nAllow: /\nSitemap: ${process.env.URL || ''}/sitemap.xml`;
      
      try {
        fs.writeFileSync(robotsPath, robotsContent);
        console.log('✅ Created robots.txt');
      } catch (error) {
        console.error('⚠️ Failed to create robots.txt', error);
      }
    }
    
    console.log('✨ Post-processing complete!');
  }
}; 