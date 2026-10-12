import type { ReactNode } from "react";

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
