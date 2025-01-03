// components/providers-wrapper.tsx
"use client";

import { Web3Provider } from "@/components/web3-provider";
import { Toaster } from "sonner";

export default function ProvidersWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster />
      <Web3Provider>
        {children}
      </Web3Provider>
    </>
  );
}