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
    const body = await req.json();
    console.log("Received request body:", body);

    const { token, address, discord } = updateWalletSchema.parse(body);

    // First verify the token
    const { data: tokenData, error: tokenError } = await supabase
      .from("tokens")
      .select("used")
      .eq("token", token)
      .eq("discord_id", discord)
      .single();

    console.log("Token lookup result:", { tokenData, tokenError });

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    if (tokenData.used) {
      return NextResponse.json(
        { message: "Token already used" },
        { status: 401 }
      );
    }

    // Check if the address is already associated with an account
    const { data: existingUserWithAddress } = await supabase
      .from("users")
      .select("*")
      .eq("address", address)
      .single();

    if (existingUserWithAddress) {
      // If this address exists but has no discord_id, update it
      if (!existingUserWithAddress.discord_id) {
        const { error: updateError } = await supabase
          .from("users")
          .update({ discord_id: discord })
          .eq("address", address);

        if (updateError) {
          console.error("Error updating user:", updateError);
          return NextResponse.json(
            { message: "Failed to update user" },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json(
          { message: "This wallet address is already linked to another Discord account" },
          { status: 400 }
        );
      }
    } else {
      // Check if the discord_id exists
      const { data: existingUserWithDiscord } = await supabase
        .from("users")
        .select("*")
        .eq("discord_id", discord)
        .single();

      if (existingUserWithDiscord) {
        // Update the existing user's address
        const { error: updateError } = await supabase
          .from("users")
          .update({ address: address })
          .eq("discord_id", discord);

        if (updateError) {
          console.error("Error updating user:", updateError);
          return NextResponse.json(
            { message: "Failed to update user" },
            { status: 500 }
          );
        }
      } else {
        // Create new user
        const { error: createError } = await supabase
          .from("users")
          .insert({
            address: address,
            discord_id: discord,
            points: 0,
          });

        if (createError) {
          console.error("Error creating user:", createError);
          return NextResponse.json(
            { message: "Failed to create user" },
            { status: 500 }
          );
        }
      }
    }

    // Mark token as used
    await supabase
      .from("tokens")
      .update({ used: true })
      .eq("token", token);

    return NextResponse.json({ message: "Wallet updated successfully" });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}