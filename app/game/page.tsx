// app/game/page.tsx
"use client";

import LeaguePage from "@/components/LeaguePage";
import React from "react";

export const dynamic = 'force-dynamic';

const Game = () => {
  return <LeaguePage />;
};

export default Game;