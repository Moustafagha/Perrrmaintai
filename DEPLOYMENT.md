# Deployment Instructions

## Quick Start

1. **Extract the zip file**
   ```bash
   unzip machine-failure-predictor.zip
   cd machine-failure-predictor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Vercel Deployment

### Method 1: Vercel CLI
1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from project directory:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name: `machine-failure-predictor`
   - Directory: `./` (current directory)
   - Override settings? **N**

### Method 2: GitHub + Vercel Dashboard
1. Push code to GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure build settings:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

## Other Deployment Options

### Netlify
1. Build the project: `npm run build`
2. Drag and drop the `dist` folder to [netlify.com/drop](https://netlify.com/drop)

### GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts:
   ```json
   "homepage": "https://yourusername.github.io/machine-failure-predictor",
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```
3. Deploy: `npm run deploy`

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

## Environment Variables

Create a `.env` file for configuration:

```env
VITE_API_BASE_URL=https://your-api-url.com
VITE_ENABLE_QUANTUM=true
VITE_ENABLE_ROBOTICS=true
VITE_DEBUG_MODE=false
```

## Build Optimization

The application includes several large dependencies. Consider:

1. **Code Splitting**: Already implemented with React.lazy()
2. **Bundle Analysis**: Run `npm run build -- --analyze`
3. **Compression**: Enable gzip compression on your server
4. **CDN**: Use a CDN for static assets

## Troubleshooting

### Common Issues

1. **Build Errors**: Ensure all dependencies are installed
2. **Tailwind CSS Warnings**: These don't affect functionality
3. **Large Bundle Size**: Expected due to TensorFlow.js and Three.js
4. **Memory Issues**: Increase Node.js memory limit:
   ```bash
   export NODE_OPTIONS="--max-old-space-size=4096"
   ```

### Performance Tips

1. **Lazy Loading**: Components are already lazy-loaded
2. **Service Worker**: Consider adding for caching
3. **Image Optimization**: Optimize any images you add
4. **Tree Shaking**: Vite automatically removes unused code

## Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **HTTPS**: Always use HTTPS in production
3. **CSP Headers**: Configure Content Security Policy
4. **CORS**: Configure CORS for API endpoints

## Monitoring

Consider adding:
- Error tracking (Sentry)
- Analytics (Google Analytics)
- Performance monitoring (Web Vitals)
- Uptime monitoring

## Support

For deployment issues:
1. Check the build logs
2. Verify all dependencies are installed
3. Ensure Node.js version compatibility (16+)
4. Check the deployment platform documentation

---

The application is ready for production deployment with all features functional!

