import { db } from "@/app/_lib/prisma";
import { TransactionType } from "@prisma/client";
import { TotalExpensePerCategory, TransactionsPercentages } from "./types";

export const getDashboard = async (month: string) => {
  const where = {
    date: {
      gte: new Date(`2024-${month}-01`),
      lt: new Date(`2024-${month}-31`),
    },
  };

  const depositsTotal = Number(
    (
      await db.transaction.aggregate({
        where: {
          ...where,
          type: "DEPOSIT",
        },
        _sum: {
          amount: true,
        },
      })
    )._sum.amount,
  );

  const investmentsTotal = Number(
    (
      await db.transaction.aggregate({
        where: {
          ...where,
          type: "INVESTMENT",
        },
        _sum: {
          amount: true,
        },
      })
    )._sum.amount,
  );

  const expensesTotal = Number(
    (
      await db.transaction.aggregate({
        where: {
          ...where,
          type: "EXPENSE",
        },
        _sum: {
          amount: true,
        },
      })
    )._sum.amount,
  );

  const balance = depositsTotal - investmentsTotal - expensesTotal;

  const transactionsTotal = Number(
    (
      await db.transaction.aggregate({
        where,
        _sum: {
          amount: true,
        },
      })
    )._sum.amount,
  );

  const typesPercentages: TransactionsPercentages = {
    [TransactionType.DEPOSIT]: Math.round(
      (depositsTotal / transactionsTotal) * 100,
    ),
    [TransactionType.EXPENSE]: Math.round(
      (expensesTotal / transactionsTotal) * 100,
    ),
    [TransactionType.INVESTMENT]: Math.round(
      (investmentsTotal / transactionsTotal) * 100,
    ),
  };

  const totalExpensePerCategory: TotalExpensePerCategory[] = (
    await db.transaction.groupBy({
      by: ["category"],
      where: {
        ...where,
        type: "EXPENSE",
      },
      _sum: {
        amount: true,
      },
    })
  ).map((category) => ({
    category: category.category,
    totalAmount: Number(category._sum.amount),
    percentageOfTotal: Math.round(
      (Number(category._sum.amount) / expensesTotal) * 100,
    ),
  }));

  const lastTransactions = await db.transaction.findMany({
    where,
    orderBy: {
      date: "desc",
    },
    take: 10,
  });

  return {
    balance,
    depositsTotal,
    investmentsTotal,
    expensesTotal,
    typesPercentages,
    totalExpensePerCategory,
    lastTransactions,
  };
};
