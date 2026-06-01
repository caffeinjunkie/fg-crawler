import type { Metadata } from 'next';

export const siteMetadata: Metadata = {
  title: {
    default: 'FitGirl Repack FuckingFast Downloader',
    template: '%s | FitGirl Repack FuckingFast Downloader',
  },
  description: 'FitGirl Repack FuckingFast Downloader - Download games from FitGirl Repack with ease.',
  applicationName: 'FitGirl Repack FuckingFast Downloader',
  authors: [{ name: 'Dev Team', url: 'https://example.com' }],
  keywords: ['TypeScript', 'App', 'Software'],
  openGraph: {
    title: 'FitGirl Repack FuckingFast Downloader',
    description: 'FitGirl Repack FuckingFast Downloader - Download games from FitGirl Repack with ease.',
    url: 'https://fg-crawler.vercel.app',
    siteName: 'FitGirl Repack FuckingFast Downloader',
    images: [
      {
        url: 'https://example.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Open Graph Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  }
};