// components/LeaguePageWrapper.tsx
"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import components that need browser APIs
const DynamicLeaguePage = dynamic(() => import('./LeaguePage'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center bg-[#275933]">
      <div className="text-xl font-bold text-white">Loading Game...</div>
    </div>
  ),
});

export default function LeaguePageWrapper() {
  return <DynamicLeaguePage />;
}