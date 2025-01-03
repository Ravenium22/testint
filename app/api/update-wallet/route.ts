// app/api/update-wallet/route.ts
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateWalletSchema = z.object({
  token: z.string(),
  discord: z.string(),
  address: z.string(),
});

export async function POST(req: NextRequest) {
  const { token, address, discord } = updateWalletSchema.parse(
    await req.json(),
  );

  // First verify the token is valid and unused
  const { data: tokenData, error: tokenError } = await supabase
    .from("tokens")
    .select("used")
    .eq("token", token)
    .eq("discord_id", discord)
    .single();

  if (tokenError || !tokenData) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  if (tokenData.used) {
    return NextResponse.json({ message: "Token already used" }, { status: 401 });
  }

  // Update the user's wallet address
  const { error: userError } = await supabase
    .from("users")
    .update({ address: address })
    .eq("discord_id", discord);

  if (userError) {
    return NextResponse.json({ message: "Failed to update wallet" }, { status: 500 });
  }

  // Mark token as used
  await supabase
    .from("tokens")
    .update({ used: true })
    .eq("token", token);

  return NextResponse.json({ message: "Wallet updated successfully" });
}