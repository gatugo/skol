const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
require('dotenv').config();

// Add stealth plugin to avoid anti-bot detection from Skool
puppeteer.use(StealthPlugin());

(async () => {
  console.log('🚀 Starting Skool Authentication Sequence...');

  const email = process.env.SKOOL_EMAIL;
  const password = process.env.SKOOL_PASSWORD;

  if (!email || !password || email === 'your_email@example.com') {
    console.error('❌ Missing Credentials! Please update the .env file with your Skool login.');
    process.exit(1);
  }

  // Launch the browser headful for debugging the login sequence
  const browser = await puppeteer.launch({ 
    headless: false, // Set to true after validation
    defaultViewport: null,
    args: ['--start-maximized']
  });

  const page = await browser.newPage();

  try {
    console.log(' Navigate to Skool login page...');
    await page.goto('https://www.skool.com/login', { waitUntil: 'networkidle2' });

    console.log(' Entering credentials...');
    await page.waitForSelector('#email');
    await page.type('#email', email, { delay: 55 });
    
    await page.waitForSelector('#password');
    await page.type('#password', password, { delay: 65 });

    console.log(' Submitting login...');
    await page.click('button[type="submit"]');

    // Wait 8 seconds for the React app to authenticate and set local cookies
    await new Promise(r => setTimeout(r, 8000));

    console.log('✅ Authentication Successful!');

    // Saving cookies to maintain session for yt-dlp / API calls later
    const cookies = await page.cookies();
    const fs = require('fs');
    fs.writeFileSync('skool_cookies.json', JSON.stringify(cookies, null, 2));
    console.log('🍪 Session cookies saved to skool_cookies.json');
    
    const { setupMediaInterceptor, scrapeModuleText } = require('./scraper');

    // Set up network interceptor for media URLs (Phase 3 & 4)
    console.log('\n📡 Setting up network interceptor for Phase 3 and 4...');
    const mediaData = setupMediaInterceptor(page);

    // Phrase 2: Navigate to target module URL
    const targetUrl = 'https://www.skool.com/group-juice/classroom/ac29b470?md=011169e957ae445a90dc4913b6039fc9';
    console.log(`Navigation to Target Module: ${targetUrl}`);
    await page.goto(targetUrl, { waitUntil: 'networkidle2' });
    
    // Wait for the React module content to render
    console.log(' Waiting 5 seconds for React hydration of module content...');
    await new Promise(r => setTimeout(r, 5000));
    
    // Attempt to initialize video player to trigger HLS network traffic
    console.log('▶️ Attempting to initialize video stream (Clicking play)...');
    try {
        await page.waitForSelector('media-controller', { timeout: 3000 });
        await page.click('media-controller');
        console.log('🖱️ Clicked video player. Waiting 4 seconds for streams to load...');
        await new Promise(r => setTimeout(r, 4000));
    } catch (e) {
        console.log('⚠️ No video player found or it could not be clicked. Proceeding...');
    }
    
    // Run the scraper logic
    await scrapeModuleText(page, mediaData);

  } catch (error) {
    console.error('❌ Failed during authentication sequence:', error);
  } finally {
    console.log('Closing browser instance.');
    await browser.close();
  }
})();
