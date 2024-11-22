import { db } from "../_lib/prisma";
import { DataTable } from "../_components/ui/table/data-table";
import { transactionColumns } from "./_columns";
import AddTransactionButton from "../_components/add-transaction-button";
import NavBar from "../_components/navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";
import ExportToXlsx from "./components/export-to-xlsx";
const TransactionsPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const transactions = await db.transaction.findMany({
    where: {
      userId,
    },
    orderBy: {
      date: "desc",
    },
  });

  const userCanAddTransaction = await canUserAddTransaction();

  return (
    <>
      <NavBar />
      <div className="flex flex-col space-y-1 px-6 py-2 lg:overflow-hidden">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-xl font-bold lg:text-2xl">Transações</h1>
          <div className="flex space-x-1">
            <ExportToXlsx
              transactions={JSON.parse(JSON.stringify(transactions))}
            />
            <AddTransactionButton
              userCanAddTransaction={userCanAddTransaction}
            />
          </div>
        </div>

        <DataTable
          columns={transactionColumns}
          data={JSON.parse(JSON.stringify(transactions))}
        />
      </div>
    </>
  );
};

export default TransactionsPage;
