import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "@/visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "ZetaZen – Youth Mental Wellness",
  description: "Confidential, empathetic AI support for youth mental wellness with anonymous chat, mood journal, culturally sensitive resources, and crisis help.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "ZetaZen", "version": "1.0.0", "greeting": "hi"}'
        />
        {/* Simple header navigation */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b">
          <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
            <Link href="/" className="font-semibold">ZetaZen</Link>
            <NavBar />
          </div>
        </header>
        {children}
        <VisualEditsMessenger />
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}