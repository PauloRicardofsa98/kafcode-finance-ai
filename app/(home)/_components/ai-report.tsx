"use client";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { BotIcon, DownloadIcon, Loader2Icon } from "lucide-react";
import { generateAiReport } from "../_actions/generate-ai-reposrt";
import { useState } from "react";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import MarkDown from "react-markdown";
import Link from "next/link";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { marked } from "marked";

interface AiReportProps {
  hasPremiumPlan: boolean;
  month: string;
}

const AiReport = ({ month, hasPremiumPlan }: AiReportProps) => {
  const [report, setReport] = useState<string | null>(null);

  const [reportIsLoading, setReportIsLoading] = useState(false);

  const handleGenerateReportClick = async () => {
    try {
      setReportIsLoading(true);
      const report = await generateAiReport({ month });
      setReport(report);
      console.log(report);
    } catch (error) {
      console.error(error);
    } finally {
      setReportIsLoading(false);
    }
  };

  const exportToPdf = async () => {
    try {
      const divElement = document.createElement("div");
      const styleElement = document.createElement("style");

      const logoUrl = "/logo.svg";

      const htmlContent = `
        <div class="header">
          <img src="${logoUrl}" alt="Logo"" />
        </div>
        ${await marked(report || "")}
      `;

      divElement.className = "container";
      divElement.innerHTML = htmlContent;
      styleElement.innerHTML = `
      .container {
    overflow: auto;
    background-color: white;
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    color: black;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }
  .header {
  background-color: black;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  
}
  h3 {
    font-size: 1.8rem;
    margin: 20px 0;
    color: #2c3e50;
    border-bottom: 2px solid #3498db;
    padding-bottom: 5px;
  }
  
  p {
    margin: 10px 0;
  }
  
  strong {
    color: #2c3e50;
    font-weight: bold;
  }
  
  ol,
  ul {
    padding-left: 20px;
    margin: 10px 0;
  }
  
  li {
    margin-bottom: 10px;
  }
  
  ul li {
    list-style-type: disc;
  }
  
  ol li {
    list-style-type: decimal;
  }
  
  ul ul {
    list-style-type: circle;
    margin-left: 20px;
  }
  
  ul ul ul {
    list-style-type: square;
    margin-left: 20px;
  }
  
  .container ul li strong,
  .container ol li strong {
    color: #16a085;
  }
  
  .container ul li:last-child,
  .container ol li:last-child {
    margin-bottom: 0;
  }
  
  .container ul li p,
  .container ol li p {
    margin-bottom: 0;
  }
  
  .container ul ul li,
  .container ol ul li {
    margin-bottom: 5px;
  }
  
  code {
    background-color: #ecf0f1;
    padding: 2px 4px;
    font-size: 0.9rem;
    border-radius: 4px;
  }
  
  a {
    color: #3498db;
    text-decoration: none;
  }
  
      `;

      document.body.appendChild(styleElement);
      document.body.appendChild(divElement);

      const canvas = await html2canvas(divElement, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");

      document.body.removeChild(divElement);
      document.body.removeChild(styleElement);

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      const imgHeight = (pdfWidth * canvasHeight) / canvasWidth;

      let position = 0;

      while (position < imgHeight) {
        pdf.addImage(imgData, "PNG", 0, -position, pdfWidth, imgHeight);

        position += pdfHeight;

        if (position < imgHeight) {
          pdf.addPage();
        }
      }

      pdf.save(
        `Relatório Financeiro - ${new Date().toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}.pdf`,
      );
    } catch (error) {
      console.error("Erro ao gerar o PDF:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
          Relatório IA
          <BotIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[600px]">
        {hasPremiumPlan ? (
          <>
            <DialogHeader>
              <DialogTitle>Relatório IA</DialogTitle>
              <DialogDescription>
                Use inteligência artificial para gerar um relatório com insights
                sobre suas finanças.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea
              id="contentToExport"
              className="prose max-h-[450px] text-white prose-h3:text-white prose-h4:text-white prose-strong:text-white"
            >
              <MarkDown>{report}</MarkDown>
            </ScrollArea>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"ghost"}>Cancelar</Button>
              </DialogClose>

              {report && (
                <Button onClick={exportToPdf} variant={"outline"}>
                  Exportar PDF
                  <DownloadIcon />
                </Button>
              )}

              <Button
                onClick={handleGenerateReportClick}
                disabled={reportIsLoading}
              >
                {reportIsLoading && <Loader2Icon className="animate-spin" />}
                Gerar relatório
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Relatório IA</DialogTitle>
              <DialogDescription>
                Você precisa de um plano premium para gerar relatórios com IA.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"ghost"}>Cancelar</Button>
              </DialogClose>
              <Button asChild>
                <Link href="/subscription">Assinar plano premium</Link>
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AiReport;
