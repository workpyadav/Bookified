import type { Metadata } from "next";
import { Geist, IBM_Plex_Serif, Inter, Mona_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const geistHeading = Geist({subsets:['latin'],variable:'--font-heading'});

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const ibmPlexSerif = IBM_Plex_Serif({

  variable: "--font-ibm-plex-serif",
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap'
});

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ['latin'],
  display: 'swap'
})

export const metadata: Metadata = {
  title: "Bookified",
  description: "Transform your books into interactive AI conversations. Uplaod PDFs, and chat with your books using voice.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", " relative font-sans antialiased", ibmPlexSerif.variable, monaSans.variable, "font-sans", inter.variable, geistHeading.variable)}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <Navbar />
          <Toaster />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
