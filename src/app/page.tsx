import { Suspense } from "react";
import { Client } from "./components/Client";

export default function LinkCrawler() {
  return (
    <Suspense>
      <div className="justify-center w-full flex">
        <h1 className="text-2xl font-bold">FitGirl Repack FuckingFast Downloader</h1>
      </div>
      <Client />
    </Suspense>
  );
}
