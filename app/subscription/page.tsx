import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import NavBar from "../_components/navbar";
import { Card, CardContent, CardHeader } from "../_components/ui/card";
import { CheckIcon, XIcon } from "lucide-react";
import AcquirePlanButton from "./components/acquire-plan-button";
import { Badge } from "../_components/ui/badge";

const SubscriptionPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const clientClerk = await clerkClient();
  const user = await clientClerk.users.getUser(userId);

  const hasPremiumPlan = user.publicMetadata.subscriptionPlan === "premium";

  return (
    <>
      <NavBar />
      <div className="space-y-6 p-6">
        <h1 className="text-2xl font-bold">Assinatura</h1>

        <div className="flex gap-6">
          <Card className="w-[450px]">
            <CardHeader className="relative border-b border-solid py-8">
              <h2 className="text-center text-2xl font-semibold">
                Plano Básico
              </h2>
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl">R$</span>
                <span className="text-6xl font-semibold">0</span>
                <div className="text-2xl text-muted-foreground">/mês</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 py-8">
              <div className="flex items-center gap-2">
                <CheckIcon className="text-primary" />
                <p>Apenas 10 transações por mês</p>
              </div>
              <div className="flex items-center gap-2">
                <XIcon />
                <p>Relatório de IA</p>
              </div>
            </CardContent>
          </Card>

          <Card className="w-[450px]">
            <CardHeader className="relative border-b border-solid py-8">
              {hasPremiumPlan && (
                <Badge className="absolute left-4 top-4 bg-primary/10 text-primary">
                  Ativo
                </Badge>
              )}
              <h2 className="text-center text-2xl font-semibold">
                Plano Premium
              </h2>
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl">R$</span>
                <span className="text-6xl font-semibold">19</span>
                <div className="text-2xl text-muted-foreground">/mês</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 py-8">
              <div className="flex items-center gap-2">
                <CheckIcon className="text-primary" />
                <p>Transações ilimitadas</p>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="text-primary" />
                <p>Relatório de IA</p>
              </div>

              <AcquirePlanButton />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default SubscriptionPage;