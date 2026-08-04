import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
