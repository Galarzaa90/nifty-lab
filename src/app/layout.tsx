import "@mantine/core/styles.css";
import type { Metadata } from "next";
import {
  Anchor,
  ColorSchemeScript,
  Container,
  MantineProvider,
  Text,
  createTheme,
} from "@mantine/core";
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

const theme = createTheme({
  primaryColor: "violet",
  defaultRadius: "sm",
  fontFamily: "var(--font-geist-sans)",
  fontFamilyMonospace: "var(--font-geist-mono)",
});

const currentYear = new Date().getFullYear();

export const metadata: Metadata = {
  title: {
    default: "Nifty Lab | Everyday Calculators",
    template: "%s | Nifty Lab",
  },
  description:
    "Quick calculators for every day use.",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-180.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MantineProvider defaultColorScheme="dark" theme={theme}>
          <div className="site-frame">
            {children}
            <footer className="site-footer">
              <Container size="xl">
                <Text size="sm" className="quiet-text">
                  © {currentYear} Allan Galarza |{" "}
                  <Anchor
                    className="site-footer-link"
                    href="https://github.com/Galarzaa90/nifty-lab"
                    rel="noreferrer"
                    target="_blank"
                  >
                    GitHub
                  </Anchor>
                </Text>
              </Container>
            </footer>
          </div>
        </MantineProvider>
      </body>
    </html>
  );
}
