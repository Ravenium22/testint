// app/layout.tsx
import ProvidersWrapper from "@/components/providers-wrapper";
import { Metadata } from "next";
import { Suspense } from "react";
import "../styles/globals.css";
import "../styles/tailwind.css";

export const metadata: Metadata = {
  title: "",
  description: "",
  openGraph: {
    type: "website",
    title: "Bullas of Berachain",
    description: "OOGA BULLAS",
    images: [
      {
        url: "https://res.cloudinary.com/honeyjar/image/upload/v1714618932/bullas/ogimage.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <Suspense fallback={<div>Loading...</div>}>
          <ProvidersWrapper>
            <div className="mx-auto">{children}</div>
          </ProvidersWrapper>
        </Suspense>
      </body>
    </html>
  );
}