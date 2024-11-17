import { auth, clerkClient } from "@clerk/nextjs/server";
import { getCurrentMonthTransactions } from "../get-current-month-transactions";

export const canUserAddTransaction = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const clientClerk = await clerkClient();
  const user = await clientClerk.users.getUser(userId);
  if (user.publicMetadata.subscriptionPlan === "premium") {
    return true;
  }
  const currentMonthTransactions = await getCurrentMonthTransactions();
  if (currentMonthTransactions >= 10) {
    return false;
  }
  return true;
};
