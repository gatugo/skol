const fs = require('fs');
const path = require('path');

/**
 * Sets up a network interceptor to capture media URLs (Phase 3 & 4)
 * @param {import('puppeteer').Page} page
 * @returns {Object} mediaData object holding arrays of video and subtitle URLs
 */
function setupMediaInterceptor(page) {
    const mediaData = { videoUrls: [], subtitleUrls: [] };
    
    // Listen to all network requests passively to extract URLs
    page.on('request', request => {
        const url = request.url();
        // Identify Skool Master HLS Playlists
        if (url.includes('.m3u8') && url.includes('stream.video.skool.com') && url.includes('token=')) {
            if (!mediaData.videoUrls.includes(url)) {
                mediaData.videoUrls.push(url);
                console.log(`🎥 Intercepted Skool Master HLS Playlist: ${url.substring(0, 80)}...`);
            }
        } 
        // Identify Subtitle Streams (.m3u8 or .vtt)
        else if (url.includes('subtitles.m3u8') || url.includes('.vtt')) {
            if (!mediaData.subtitleUrls.includes(url)) {
                mediaData.subtitleUrls.push(url);
                console.log(`📝 Intercepted Skool Subtitles: ${url.substring(0, 80)}...`);
            }
        }
    });

    return mediaData;
}

/**
 * Extracts the text and title from a Skool module page and saves it as Markdown.
 * Prepares the output directory for Phase 3 and Phase 4 video/audio files.
 * @param {import('puppeteer').Page} page
 * @param {Object} mediaData - The intercepted media URLs
 */
async function scrapeModuleText(page, mediaData) {
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

    // If mediaData is provided, save the extracted URLs to a JSON file
    if (mediaData && (mediaData.videoUrls.length > 0 || mediaData.subtitleUrls.length > 0)) {
        const mediaPath = path.join(outputDir, 'media_links.json');
        fs.writeFileSync(mediaPath, JSON.stringify(mediaData, null, 2), 'utf-8');
        console.log(`✅ Saved intercepted media links to: ${mediaPath}`);
    }

    console.log(`📂 Prepared directory for Phase 3/4 media: ${outputDir}`);
    
    return data;
}

module.exports = {
    setupMediaInterceptor,
    scrapeModuleText
};
