# Deploying to cPanel

## Prerequisites
- Node.js 18.x or later installed locally
- Access to your cPanel account
- FTP client (optional)

## Build Steps

1. Install project dependencies:
```bash
npm install
```

2. Create static build:
```bash
npm run build
```

The build process will create a static version of your site in the `out` directory.

## Uploading to cPanel

### Method 1: Using File Manager
1. Log in to cPanel
2. Open File Manager
3. Navigate to `public_html` (or your subdomain directory)
4. Upload the entire contents of the `out` directory

### Method 2: Using FTP
1. Connect to your server via FTP
2. Navigate to `public_html`
3. Upload the contents of the `out` directory

## Important Settings

### 1. Configure .htaccess
Create or modify the .htaccess file in your root directory:
```apache
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-l
RewriteRule . /index.html [L]
</IfModule>

# Enable CORS for API requests
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
</IfModule>
```

### 2. Set up Error Pages
In cPanel:
1. Go to Error Pages
2. Set custom error page for 404 to `/404.html`

## Post-Deployment Checklist

1. Verify pages load without errors
   - Check homepage
   - Test menu navigation
   - Verify cart functionality

2. Test authentication
   - Login functionality
   - Session persistence
   - Token handling

3. Verify payment integration
   - Test order placement
   - Check payment processing
   - Verify currency handling

4. Mobile responsiveness
   - Test on different devices
   - Check layout adjustments

## Troubleshooting

### Common Issues and Solutions

1. **Blank Page After Deployment**
   - Check if all files were uploaded correctly
   - Verify .htaccess configuration
   - Clear browser cache

2. **API Connection Issues**
   - Verify API endpoints in the code
   - Check CORS settings
   - Confirm SSL certificate status

3. **Images Not Loading**
   - Verify image paths are correct
   - Check file permissions
   - Confirm image files were uploaded

4. **Authentication Problems**
   - Clear local storage
   - Check API token configuration
   - Verify SSL for secure connections

## Maintenance

### Regular Updates
1. Make changes in development
2. Test thoroughly
3. Run build process
4. Upload new files
5. Clear CDN cache if applicable

### Backup Process
1. Download current production files
2. Export any relevant databases
3. Keep dated backups

### Monitoring
- Check server logs regularly
- Monitor API response times
- Track error rates

## Support

For technical assistance:
- Review Next.js documentation: https://nextjs.org/docs
- Check cPanel documentation
- Contact hosting support for server-specific issues
