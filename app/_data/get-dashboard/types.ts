import { TransactionType } from "@prisma/client";

export type TransactionsPercentages = {
  [key in TransactionType]: number;
};
