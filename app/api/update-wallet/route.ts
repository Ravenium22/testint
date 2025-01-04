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
  try {
    // Parse and validate the request body
    const body = await req.json();
    console.log("Received request body:", body); // Debug log

    const { token, address, discord } = updateWalletSchema.parse(body);

    // First verify the token is valid and unused
    const { data: tokenData, error: tokenError } = await supabase
      .from("tokens")
      .select("used")
      .eq("token", token)
      .eq("discord_id", discord)
      .single();

    console.log("Token lookup result:", { tokenData, tokenError }); // Debug log

    if (tokenError) {
      console.error("Token validation error:", tokenError); // Debug log
      return NextResponse.json(
        { message: "Invalid token", error: tokenError.message },
        { status: 401 }
      );
    }

    if (!tokenData) {
      return NextResponse.json(
        { message: "Token not found" },
        { status: 401 }
      );
    }

    if (tokenData.used) {
      return NextResponse.json(
        { message: "Token already used" },
        { status: 401 }
      );
    }

    // Update the user's wallet address
    const { error: userError } = await supabase
      .from("users")
      .update({ address: address })
      .eq("discord_id", discord);

    console.log("User update result:", { userError }); // Debug log

    if (userError) {
      console.error("User update error:", userError); // Debug log
      return NextResponse.json(
        { message: "Failed to update wallet", error: userError.message },
        { status: 500 }
      );
    }

    // Mark token as used
    const { error: tokenUpdateError } = await supabase
      .from("tokens")
      .update({ used: true })
      .eq("token", token);

    console.log("Token update result:", { tokenUpdateError }); // Debug log

    if (tokenUpdateError) {
      console.error("Token update error:", tokenUpdateError); // Debug log
      // Still return success since the wallet was updated
      console.warn("Failed to mark token as used, but wallet was updated");
    }

    return NextResponse.json({ message: "Wallet updated successfully" });
  } catch (error) {
    console.error("Unexpected error:", error); // Debug log
    return NextResponse.json(
      { message: "Internal server error", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}