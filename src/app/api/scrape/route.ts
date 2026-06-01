import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

    const response = await fetch(url);
    const html = await response.text();
    
    const $ = cheerio.load(html);
    const links: string[] = [];
    
    $('a').each((_, element) => {
      const href = $(element).attr('href');
      if (href) {
        // Handle relative URLs by resolving them against the base URL
        try {
          const absoluteUrl = new URL(href, url).href;
          links.push(absoluteUrl);
        } catch {
          // Ignore malformed URLs
        }
      }
    });

    // Remove duplicates
    const uniqueLinks = Array.from(new Set(links));

    return NextResponse.json({ links: uniqueLinks });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to scrape URL' }, { status: 500 });
  }
}