const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    const filePath = 'file:///' + path.resolve('skool_module_dump.html').replace(/\\/g, '/');
    await page.goto(filePath);

    // Get an overview of the DOM structure focusing on content
    const structure = await page.evaluate(() => {
        const title = document.title;
        // Group all paragraphs into a markdown-like block
        const paragraphs = Array.from(document.querySelectorAll('p')).map(p => p.innerText);
        
        return { title, paragraphs };
    });

    console.log(JSON.stringify(structure, null, 2));
    await browser.close();
})();
