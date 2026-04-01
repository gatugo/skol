## Phase 0: Project Migration & Git Fixes
- [x] Identify conflicting architecture. (Node scripts vs Chrome Extension files).
- [x] Relocate the generated Chrome Extension files to isolated `c:\Users\mela\.aiprojects\skool-extension-reference` folder so they don't pollute the workspace.
- [x] Wipe the corrupted nested `.git` setup to reset the VS Code Source Control tree.
- [x] Initialize Git at the correct root workspace (`c:\Users\mela\.aiprojects\skol`).
- [x] Generate safe Node.js `package.json` with Puppeteer plugins.
- [x] Run `npm install` gracefully and verify successful download of Chromium binaries.
- [x] Create `.env` template.

## Phase 1: Authentication & Session Management
- [x] Investigate Skool.com login flow.
- [x] Set up Puppeteer Stealth instance with user credentials in `.env` inside `src/index.js`.
- [x] User needs to provide actual credentials in `.env` to validate the script execution.
- [x] Run `npm start` and save validation cookies correctly.

## Phase 2: Text & Layout Scraper
- [x] Navigate to specific course modules or community posts.
- [x] Extract markdown text, post metadata, and structural course hierarchy.
- [x] Log format to `implementation_plan.md`.

## Phase 3: Video Extraction (In Progress)
- [x] Implement initial network interception for native Skool HLS streams (.m3u8).
- [/] Refactor into a modular Extractor pattern for Skool, YouTube, Wistia, and Vimeo.
- [ ] Verify discovery of embedded iframe IDs.

## Phase 4: Transcripts & Subtitles (In Progress)
- [x] Intercept `.vtt` and `subtitles.m3u8` network requests.
- [/] Standardize subtitle output to `media_links.json`.
- [ ] Convert VTT to clean `.txt` transcripts.
