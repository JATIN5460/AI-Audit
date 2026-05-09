import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Spend Audit — Find Out If You're Overpaying for AI Tools",
  description:
    "Free audit tool for startups. Input your AI subscriptions and get an instant breakdown of where you're overspending and what to switch.",
  openGraph: {
    title: "AI Spend Audit",
    description: "Find out if you're overpaying for AI tools. Free, instant audit.",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "AI Spend Audit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Spend Audit",
    description: "Find out if you're overpaying for AI tools. Free, instant audit.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}