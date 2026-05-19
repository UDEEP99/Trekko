import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Providers from "./components/Providers";
import "./globals.css";
import WatsonAssistantChat from "./components/WatsonAssistantChat";


const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trekko — AI Trip Planner",
  description:
    "Plan your dream trip in seconds. Trekko AI builds personalized, day-by-day itineraries tailored to your budget and travel style.",
  keywords: ["trip planner", "AI travel", "itinerary generator", "travel AI", "Trekko"],
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Trekko — AI Trip Planner",
    description:
      "Plan your dream trip in seconds. Trekko AI builds personalized, day-by-day itineraries.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen landing-bg">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <Providers>
            {children}
            <WatsonAssistantChat />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
