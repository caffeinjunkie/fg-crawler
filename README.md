# 🕸️ Next.js Archive Crawler & Auto-Downloader

A high-performance, full-stack web application designed to crawl, filter, and automatically download multi-part archive links from dynamically rendered websites (specifically optimized for repack sites like FitGirl).

Built with **Next.js (App Router)**, **React**, and **Puppeteer**, this tool bypasses CORS restrictions and JavaScript-obfuscated download buttons by utilizing a headless browser backend coupled with a responsive frontend queue manager.

## 🚀 Features

- **Headless DOM Extraction:** Uses Puppeteer to fully render target pages, executing JavaScript before extraction to capture obfuscated links and event-driven buttons.
- **Advanced Filtration Matrix:** \* **Strict AND Logic:** Input multiple comma-separated keywords (e.g., `part, setup`) to instantly filter the scraped payload.
  - **Regex Range Targeting:** Automatically detects and filters multi-part archive formats (e.g., `part1.rar` to `part5.rar`) based on user-defined numerical ranges.
- **Staggered Auto-Downloading:** Bypasses modern browser spam/popup protections by executing sequential, time-delayed DOM clicks (`<a>` tag injection with `download` attributes).

## 🛠️ Tech Stack

- **Frontend:** React, Next.js (TypeScript), Tailwind CSS
- **Backend:** Next.js API Routes (Node.js edge)
- **Automation:** Puppeteer (Headless Chromium)
- **Parsing:** Cheerio (for static HTML fallback)

## ⚙️ Installation & Setup

**Prerequisites:** Node.js (v18+) and npm/yarn installed.

1. **Clone the repository:**

   ```bash
   git clone [https://github.com/yourusername/archive-crawler.git](https://github.com/yourusername/archive-crawler.git)
   cd archive-crawler

   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

This will also install the necessary local Chromium binaries for Puppeteer

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open the application:**
   Open http://localhost:3000 in your browser.
