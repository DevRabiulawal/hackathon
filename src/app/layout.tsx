import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Captionly | Content workspace",
  description: "A lightweight social content workspace",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />{children}</body></html>;
}
