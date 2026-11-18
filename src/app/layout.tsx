import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Captionly | Content workspace",
  description: "A lightweight social content workspace",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
