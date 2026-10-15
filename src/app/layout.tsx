import type { ReactNode } from "react";

import "./globals.css";

export const metadata = {
  title: "next-late-run",
  description: "A sentence that lands after the budget is not a run.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
