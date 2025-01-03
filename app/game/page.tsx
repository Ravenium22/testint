// app/game/page.tsx
"use client";

import LeaguePageWrapper from "@/components/LeaguePageWrapper";
import React from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const Game = () => {
  return <LeaguePageWrapper />;
};

export default Game;