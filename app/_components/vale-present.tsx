import { Gift } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { addRedeemGift } from "../_actions/add-redeem-gift";

const ValePresent = () => {
  const [code, setCode] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const handleRedeemGift = async () => {
    if (!code) {
      toast.error("Insira um código válido");
      return;
    }

    if (code.toUpperCase().trim() !== "SOUFSC") {
      toast.error("Código inválido");
      return;
    }

    await addRedeemGift();
    toast.success("Vale presente resgatado com sucesso!");
    setCode("");
    setOpenDialog(false);
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger>
        <Gift className="anim animate-pulse cursor-pointer text-primary hover:scale-105" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resgatar vale presente</DialogTitle>
          <DialogDescription>
            Insira o código do vale presente para resgatar.
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Insira o código"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <DialogFooter>
          <Button onClick={handleRedeemGift}>Resgatar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ValePresent;
