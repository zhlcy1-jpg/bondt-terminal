import type { Metadata } from "next";
import { readFileSync } from "fs";
import { join } from "path";
import "./globals.css";

// Read metadata
const metadataFile = join(process.cwd(), "metadata.json");
let siteMeta = { title: "BondTerminal PRO", description: "Professional Bond Trading Terminal" };

try {
  const metaContent = readFileSync(metadataFile, "utf-8");
  siteMeta = JSON.parse(metaContent);
} catch (e) {
  console.log("Using default metadata");
}

export const metadata: Metadata = {
  title: siteMeta.title,
  description: siteMeta.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-slate-950">
        {children}
      </body>
    </html>
  );
}
