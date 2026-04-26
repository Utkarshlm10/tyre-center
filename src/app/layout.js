import { Inter, Bebas_Neue, Pacifico } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/store";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: ["400"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata = {
  title: 'Tyre Centre | Bilaspur Atelier',
  description: 'Premium tyre configurator',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Tyre Centre',
  },
  icons: {
    apple: '/logo.png',
  },
  themeColor: '#00254d',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bebasNeue.variable} ${pacifico.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Clash Display from Fontshare — primary heading font */}
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      </head>
      <body className="h-full bg-surface text-on-surface overflow-hidden m-0 p-0">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
