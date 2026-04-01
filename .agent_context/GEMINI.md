# Skool Course Scraper — Node/Playwright Project

## Project Goal
A Node.js backend scraper for Skool.com that extracts text, raw video files (Direct Skool hosting, YouTube, Wistia, Vimeo), and transcripts/subtitles.

## Tech Stack
* Core: Node.js (package.json inside `C:\Users\mela\.aiprojects\skol`)
* Scraping Engine: Playwright / Puppeteer with Stealth Plugin
* Environment Variables: `dotenv` for auth
* Run with: `npm start`

## System Context & Rules
* Windows natively with PowerShell only.
* Refer to `.agent_context/skills.md` for strict behavioral rules.
