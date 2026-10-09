import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Great_Vibes,
  Outfit,
  Patrick_Hand,
} from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const script = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script",
});

const hand = Patrick_Hand({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-hand",
});

const body = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "A Birthday Surprise ❤️",
  description: "A personalized romantic birthday journey made just for you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${script.variable} ${hand.variable} ${body.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
