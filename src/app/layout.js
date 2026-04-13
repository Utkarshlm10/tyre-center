import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/store";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Tyre Center Bilaspur by Rajesh Pamnani and Sons",
  description: "Premium Tyre Kiosk",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00254d" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Tyre Center" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className="h-full bg-surface text-on-surface overflow-hidden m-0 p-0">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
