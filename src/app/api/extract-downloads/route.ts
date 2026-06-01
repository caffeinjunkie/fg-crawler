import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req: Request) {
  try {
    const { urls } = await req.json();
    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json({ error: "Invalid URL array" }, { status: 400 });
    }

    // Launch a single browser instance
    const browser = await puppeteer.launch({ headless: true });

    // Process pages concurrently using Promise.all
    const extractionPromises = urls.map(async (url) => {
      const page = await browser.newPage();
      try {
        // Navigate and wait until the network traffic stabilizes
        await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

        // 1. Monitor the page for any navigation or URL changes caused by the click
        // 2. Locate and click the button containing the text "Download"
        const finalDownloadUrl = await page.evaluate(async () => {
          return new Promise((resolve) => {
            // Set up a listener to intercept window.location changes or direct assignments
            let interceptedUrl: string | URL = "";

            // Intercept standard window.open or location modifications
            // const originalOpen = window.open;
            window.open = (url) => {
              interceptedUrl = url || "";
              return null;
            };

            // Find the button by text content
            const buttons = Array.from(document.querySelectorAll("button"));
            const downloadBtn = buttons.find((b) =>
              b.textContent?.toLowerCase().includes("download"),
            );

            if (downloadBtn) {
              (downloadBtn as HTMLElement).click();

              // Give the JavaScript execution engine a brief window to process the event
              setTimeout(() => {
                resolve(interceptedUrl || window.location.href);
              }, 1000);
            } else {
              resolve(null);
            }
          });
        });

        await page.close();
        return finalDownloadUrl;
      } catch (err) {
        await page.close();
        return null;
      }
    });

    const directLinks = (await Promise.all(extractionPromises)).filter(Boolean);
    await browser.close();

    return NextResponse.json({ directLinks });
  } catch (error) {
    return NextResponse.json({ error: "Automation failed" }, { status: 500 });
  }
}
