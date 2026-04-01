const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.skool.com/login', { waitUntil: 'networkidle2' });
  const html = await page.content();
  require('fs').writeFileSync('skool_login.html', html);
  await browser.close();
  console.log('Done mapping DOM.');
})();
