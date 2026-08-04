import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Free E-Ink Image Converter | Floyd-Steinberg Dithering Tool",
  description: "Convert images to 1-bit black and white dithered format optimized for E-Paper and E-Ink displays. Fast, free, and runs securely in your browser.",
  keywords: "e-ink image converter, 1-bit bmp dither online, image to e-paper display, floyd-steinberg online tool, black and white converter",
  openGraph: {
    title: "Free E-Ink Image Converter | Floyd-Steinberg Dithering Tool",
    description: "Convert images to 1-bit black and white dithered format optimized for E-Paper and E-Ink displays. Fast, free, and runs securely in your browser.",
    url: "https://eink-tools.vercel.app",
    siteName: "E-Ink Image Converter",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free E-Ink Image Converter | Floyd-Steinberg Dithering Tool",
    description: "Convert images to 1-bit black and white dithered format optimized for E-Paper and E-Ink displays. Fast, free, and runs securely in your browser.",
  },
  verification: {
    google: "zKLUOesbx1kp3h9sz7UCrStho9CgubDtcpPMqtgiYo0",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-TX2GKBNZWX" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TX2GKBNZWX');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
