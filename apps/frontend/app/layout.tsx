import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Image Cook",
  description: "Select your favorite enemy images",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
