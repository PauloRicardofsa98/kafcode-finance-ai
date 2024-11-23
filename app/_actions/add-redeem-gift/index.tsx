"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const addRedeemGift = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const clientsClerk = await clerkClient();

  await clientsClerk.users.updateUser(userId, {
    publicMetadata: {
      subscriptionPlan: "premium",
    },
  });
  revalidatePath("/subscription");
  revalidatePath("/transactions");
  revalidatePath("/");
};
