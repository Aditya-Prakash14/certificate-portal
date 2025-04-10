// Netlify build plugin for TekronFest Certification Portal
module.exports = {
  onPreBuild: async ({ utils }) => {
    console.log('Certificate Portal Plugin: Starting pre-build...')
  },
  onBuild: async ({ utils }) => {
    console.log('Certificate Portal Plugin: Building...')
  },
  onPostBuild: async ({ utils }) => {
    console.log('Certificate Portal Plugin: Build complete!')
  }
}; 