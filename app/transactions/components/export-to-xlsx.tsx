"use client";

import { Button } from "@/app/_components/ui/button";
import {
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_PAYMENT_METHOD_LABELS,
  TRANSACTION_TYPE_LABELS,
} from "@/app/_constants/transactions";
import { formatCurrency } from "@/app/utils/currency";
import { Transaction } from "@prisma/client";
import { FolderUp, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { write, utils } from "xlsx";
import { saveAs } from "file-saver";

interface ExportToXlsxProps {
  transactions: Transaction[];
}

const ExportToXlsx = ({ transactions }: ExportToXlsxProps) => {
  const [loading, setLoading] = useState(false);

  const exportToExcel = () => {
    try {
      setLoading(true);
      const mappedData = transactions.map((transaction) => {
        return {
          Nome: transaction.name,
          Tipo: TRANSACTION_TYPE_LABELS[transaction.type],
          Valor: formatCurrency(Number(transaction.amount)),
          Categoria: TRANSACTION_CATEGORY_LABELS[transaction.category],
          "Método de Pagamento":
            TRANSACTION_PAYMENT_METHOD_LABELS[transaction.paymentMethod],
          Data: new Date(transaction.date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
        };
      });

      const worksheet = utils.json_to_sheet(mappedData);
      const workbook = utils.book_new();

      worksheet["!cols"]?.push({ width: 50 });

      utils.book_append_sheet(workbook, worksheet, "Sheet2");

      const excelBuffer = write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      });

      saveAs(blob, `relatorio.xlsx`);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button
      className="rounded-full font-bold"
      variant={"outline"}
      onClick={exportToExcel}
      disabled={loading}
    >
      <span className="hidden lg:flex">Exportar Excel</span>
      {!loading ? <FolderUp /> : <Loader2Icon className="animate-spin" />}
    </Button>
  );
};

export default ExportToXlsx;
