import type { Metadata } from "next";
import Link from "next/link";
import { IBM_Plex_Sans, Manrope } from "next/font/google";
import "./globals.css";
import AnalyticsProvider from "@/app/components/AnalyticsProvider";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EcoMonitor — Моніторинг якості повітря",
  description: "Система моніторингу екологічних показників якості повітря",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className={`${manrope.variable} ${ibmPlexSans.variable}`}>
      <body>
        <AnalyticsProvider />
        <nav className="nav">
          <Link href="/" className="nav-logo">EcoMonitor</Link>
          <ul className="nav-links">
            <li><Link href="/">Станції</Link></li>
            <li><Link href="/about">Про проєкт</Link></li>
            <li><Link href="/pollutants">Забруднювачі</Link></li>
          </ul>
        </nav>
        {children}
        <footer className="footer">
          © 2026 EcoMonitor — Лабораторна робота №1
        </footer>
      </body>
    </html>
  );
}
