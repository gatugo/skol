# Active & Completed Tasks

## Phase 1: Authentication & Setup
- [ ] Set up the authentication bypass or session token management required to log into Skool.com without triggering anti-bot protection.
- [ ] Scaffold the base Node + Playwright/Puppeteer Stealth script.

## Phase 2: Text Extractor
- [ ] Navigate to specific course modules or community posts.
- [ ] Extract markdown text, post metadata, and structural hierarchy.

## Phase 3: Video Extractor
- [ ] Write dynamic extractor for Native Skool hosted videos.
- [ ] Write dynamic extractor for Embedded YouTube iframes.
- [ ] Write dynamic extractor for Wistia player wrappers.
- [ ] Write dynamic extractor for Vimeo embedded players.

## Phase 4: Transcripts
- [ ] Intercept .vtt or .srt network requests from the video players.
- [ ] Fallback: Scrape raw transcript text from DOM reading pane.
