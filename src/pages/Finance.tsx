import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Project {
  id: string;
  name: string;
  value: number;
  payment_status: 'paid' | 'pending' | 'will_pay' | 'not_paid' | 'cancelled';
  start_date: string | null;
  clients: { name: string } | null;
}

export default function Finance() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState({ 
    total: 0, 
    paid: 0, 
    will_pay: 0, 
    pending: 0, 
    not_paid: 0, 
    cancelled: 0 
  });

  useEffect(() => {
    loadFinancialData();
  }, []);

  const loadFinancialData = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("id, name, value, payment_status, start_date, clients(name)")
      .order("start_date", { ascending: false });

    if (!error && data) {
      setProjects(data as any);
      
      const total = data.reduce((sum, p) => sum + Number(p.value), 0);
      const paid = data.filter((p) => p.payment_status === "paid").reduce((sum, p) => sum + Number(p.value), 0);
      const will_pay = data.filter((p) => p.payment_status === "will_pay").reduce((sum, p) => sum + Number(p.value), 0);
      const pending = data.filter((p) => p.payment_status === "pending").reduce((sum, p) => sum + Number(p.value), 0);
      const not_paid = data.filter((p) => p.payment_status === "not_paid").reduce((sum, p) => sum + Number(p.value), 0);
      const cancelled = data.filter((p) => p.payment_status === "cancelled").reduce((sum, p) => sum + Number(p.value), 0);
      
      setStats({ total, paid, will_pay, pending, not_paid, cancelled });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Controle Financeiro</h2>
        <p className="text-muted-foreground">Acompanhe receitas e pagamentos</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total em Projetos</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              R$ {stats.total.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">✅ Recebido</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              R$ {stats.paid.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">⏳ Cliente Vai Pagar</CardTitle>
            <DollarSign className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              R$ {stats.will_pay.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">🔄 Pendente</CardTitle>
            <DollarSign className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              R$ {stats.pending.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">❌ Não Pago</CardTitle>
            <DollarSign className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              R$ {stats.not_paid.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">🚫 Cancelado</CardTitle>
            <DollarSign className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-500">
              R$ {stats.cancelled.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Projetos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Projeto</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.clients?.name || "-"}</TableCell>
                  <TableCell>
                    {project.start_date
                      ? format(new Date(project.start_date + 'T00:00:00'), "dd/MM/yyyy", { locale: ptBR })
                      : "-"}
                  </TableCell>
                  <TableCell>R$ {Number(project.value).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        project.payment_status === "paid" ? "default" : 
                        project.payment_status === "will_pay" ? "secondary" :
                        project.payment_status === "pending" ? "secondary" :
                        project.payment_status === "not_paid" ? "destructive" :
                        "outline"
                      }
                      className={
                        project.payment_status === "paid" ? "bg-green-500 hover:bg-green-600" :
                        project.payment_status === "will_pay" ? "bg-blue-500 hover:bg-blue-600 text-white" :
                        project.payment_status === "pending" ? "bg-orange-500 hover:bg-orange-600 text-white" :
                        project.payment_status === "not_paid" ? "bg-red-500 hover:bg-red-600 text-white" :
                        "bg-gray-500 hover:bg-gray-600 text-white"
                      }
                    >
                      {project.payment_status === "paid" ? "✅ Pago" :
                       project.payment_status === "will_pay" ? "⏳ Cliente Vai Pagar" :
                       project.payment_status === "pending" ? "🔄 Pendente" :
                       project.payment_status === "not_paid" ? "❌ Não Pago" :
                       "🚫 Cancelado"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
