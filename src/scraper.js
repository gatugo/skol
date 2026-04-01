const fs = require('fs');
const path = require('path');

/**
 * Extracts the text and title from a Skool module page and saves it as Markdown.
 * Prepares the output directory for Phase 3 and Phase 4 video/audio files.
 * @param {import('puppeteer').Page} page
 */
async function scrapeModuleText(page) {
    console.log('📝 Beginning Phase 2: Extracting Text Content...');

    const data = await page.evaluate(() => {
        const titleRaw = document.title;
        // Skool titles typically are: "Module Name - Section Name · Community Name"
        const moduleTitle = titleRaw.split(' - ')[0].trim().replace(/[\\/:*?"<>|]/g, '');

        // Extract paragraphs
        const paragraphs = Array.from(document.querySelectorAll('p'))
            .map(p => p.innerText.trim())
            .filter(text => text.length > 0);

        return { moduleTitle, paragraphs };
    });

    if (!data.moduleTitle) {
        console.error('❌ Could not parse module title from the page.');
        return;
    }

    console.log(`📌 Found Module: "${data.moduleTitle}"`);

    // Create the output directory for this module
    const outputDir = path.join(__dirname, '..', 'output', data.moduleTitle);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate markdown text
    let markdownContent = `# ${data.moduleTitle}\n\n`;
    data.paragraphs.forEach(p => {
        markdownContent += `${p}\n\n`;
    });

    // Save markdown file
    const mdPath = path.join(outputDir, 'module_text.md');
    fs.writeFileSync(mdPath, markdownContent, 'utf-8');

    console.log(`✅ Saved module text to: ${mdPath}`);
    console.log(`📂 Prepared directory for Phase 3/4 media: ${outputDir}`);
    
    return data;
}

module.exports = {
    scrapeModuleText
};
