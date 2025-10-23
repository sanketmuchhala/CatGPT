import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CatGPT - Chat with a Playful AI Assistant",
  description:
    "CatGPT is a chat interface with a playful cat personality, powered by Claude AI",
  keywords: ["chat", "ai", "assistant", "cat", "claude"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
