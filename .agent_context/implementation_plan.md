# Skool Scraper Implementation Ledger

This file contains the running memory of all validated features and how they operate. Reference this document before making any architectural changes to prevent breaking old functionality.

## Core Setup (Phase 0) [COMPLETED]
- Initialized Node.js project targeting Skool scraping (`c:\Users\mela\.aiprojects\skol`).
- Extracted and safely removed old Chrome extension architecture to avoid conflicts.
- NPM dependencies (`puppeteer`, `puppeteer-extra`, `puppeteer-extra-plugin-stealth`, `dotenv`) fully installed.
- Agent context files generated for state preservation and rule enforcement.
- `.env` setup correctly for authentication.

## Phase 1: Planning & Auth [COMPLETED]
- `src/index.js` securely launches a Stealth Puppeteer instance, navigates to Skool's login, and uses `.env` credentials to log in.
- Wait delays were adjusted to account for React Hydration and SPAs.
- Automatically exports an authenticated `skool_cookies.json` which will be used in subsequent phases to forge GET requests for native Skool and Wistia videos.

## Phase 2: Text & Layout Scraper [COMPLETED]
- **Target**: Navigate to specific course module (e.g., `https://www.skool.com/group-juice/classroom...`).
- **Logic**: Use Puppeteer's `page.evaluate` to extract the main module text/markdown content.
- **Output**: The text content will be saved as a Markdown (`.md`) file to a module-specific directory.

## Phase 3 & 4: Multimedia Interception (Refactoring In Progress)
- **Target**: Cleanly extract HLS video streams, VTT subtitles, and Embedded Video URLs (YouTube, Wistia, Vimeo) into `media_links.json`.
- **Proposed Architecture**: We will migrate away from the hardcoded `setupMediaInterceptor` in `scraper.js` and implement a clean **Extractor / Provider Pattern**.
- **Refactoring Steps**:
  1. Create a `src/extractors/` directory.
  2. Implement `src/extractors/skool.js` to handle `stream.video.skool.com` network interception for both video (`.m3u8`) and subtitles (`.vtt`, `subtitles.m3u8`).
  3. Implement `src/extractors/youtube.js` to scan the DOM for embedded IFRAMEs (`*youtube.com/embed/*`).
  4. Implement `src/extractors/wistia.js` to intercept network loads of `fast.wistia.net/embed/medias/*.json` or scan for Wistia IFRAMEs.
  5. Implement `src/extractors/vimeo.js` to scan for `<iframe src="*player.vimeo.com/video/*">`.
  6. Create a `MediaExtractorManager` (e.g., `src/extractors/index.js`) that binds these providers to Puppeteer's `page.on('request')` and DOM evaluations.

> [!IMPORTANT]
> User Review Required: Does this clean Provider pattern match what you want for handling different classes/modules with different video sources? Once approved, I will build out the `src/extractors/` directory!
