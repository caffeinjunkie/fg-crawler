"use client";

import { useState, useMemo } from "react";

export default function LinkCrawler() {
  const [url, setUrl] = useState("");
  const [keywords, setKeywords] = useState("");
  const [rangeStart, setRangeStart] = useState<number | "">("");
  const [rangeEnd, setRangeEnd] = useState<number | "">("");

  const [allLinks, setAllLinks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      setAllLinks(data.links || []);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  // Dynamically filter links based on user input
  const filteredLinks = useMemo(() => {
    if (!allLinks.length) return [];

    let filtered = allLinks;

    // 1. Filter by Multiple Keywords (AND logic)
    if (keywords.trim()) {
      // Split by comma, remove whitespace, ignore empty strings
      const keywordArray = keywords
        .split(",")
        .map((k) => k.trim().toLowerCase())
        .filter(Boolean);

      if (keywordArray.length > 0) {
        filtered = filtered.filter((link) => {
          const lowerLink = link.toLowerCase();
          // The link MUST contain EVERY keyword in the array
          return keywordArray.every((kw) => lowerLink.includes(kw));
        });
      }
    }

    // 2. Filter by Part Range
    if (rangeStart !== "" && rangeEnd !== "") {
      filtered = filtered.filter((link) => {
        const match = link.match(/part(\d+)\.(rar|zip|7z)/i);
        if (match) {
          const partNumber = parseInt(match[1], 10);
          return (
            partNumber >= Number(rangeStart) && partNumber <= Number(rangeEnd)
          );
        }
        return false;
      });
    }

    return filtered;
  }, [allLinks, keywords, rangeStart, rangeEnd]);

  const handleAutoDownload = async () => {
    if (
      !confirm(
        `Scanning ${filteredLinks.length} pages for download links. This may take a moment.`,
      )
    )
      return;

    setLoading(true);

    try {
      // 1. Send target URLs to the backend crawler
      const res = await fetch("/api/extract-downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: filteredLinks }),
      });

      const data = await res.json();
      const { directLinks } = data;

      console.log(data, "dataa");

      if (!directLinks || directLinks.length === 0) {
        alert(
          "Crawler finished, but no 'Download' buttons were found on those pages.",
        );
        setLoading(false);
        return;
      }

      console.log(
        `Found ${directLinks.length} direct files. Starting downloads...`,
      );

      for (let i = 0; i < directLinks.length; i++) {
        const anchor = document.createElement("a");
        anchor.href = directLinks[i];

        // The 'download' attribute forces the browser to save the file rather than navigate
        anchor.setAttribute("download", "");

        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);

        // CRITICAL: You must stagger downloads by at least 1000ms.
        // If you fire 50 downloads at exactly 0ms, Chrome's "Automatic Downloads"
        // security feature will block everything after the first file.
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error("Failed to automate downloads", error);
    }

    setLoading(false);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-6">Archive Link Scraper</h1>

      <div className="flex flex-col gap-4 mb-8">
        <input
          className="border p-2 rounded"
          placeholder="Target URL (e.g., https://example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white p-2 rounded disabled:opacity-50"
          onClick={fetchLinks}
          disabled={loading || !url}
        >
          {loading ? "Scraping..." : "Fetch Links"}
        </button>
      </div>

      {allLinks.length > 0 && (
        <div className="p-4 rounded border mb-6">
          <h2 className="font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-3 gap-4">
            <input
              className="border p-2 rounded col-span-1 md:col-span-3"
              placeholder="Keywords (comma-separated, e.g., part, ubuntu, iso)"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
            <input
              className="border p-2 rounded"
              type="number"
              placeholder="Part Start (e.g., 1)"
              value={rangeStart}
              onChange={(e) =>
                setRangeStart(e.target.value ? Number(e.target.value) : "")
              }
            />
            <input
              className="border p-2 rounded"
              type="number"
              placeholder="Part End (e.g., 5)"
              value={rangeEnd}
              onChange={(e) =>
                setRangeEnd(e.target.value ? Number(e.target.value) : "")
              }
            />
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <p>
          Found: <strong>{filteredLinks.length}</strong> matching links
        </p>
        {filteredLinks.length > 0 && (
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={handleAutoDownload}
          >
            Open All Matching
          </button>
        )}
      </div>

      <ul className="text-sm space-y-2 break-all">
        {filteredLinks.map((link, idx) => (
          <li key={idx}>
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 hover:underline"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
