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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, TrendingUp, Edit, Check, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  value: number;
  paid_value?: number;
  payment_status: 'paid' | 'pending' | 'will_pay' | 'not_paid' | 'cancelled';
  start_date: string | null;
  clients: { name: string } | null;
}

export default function Finance() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    payment_status: '' as 'paid' | 'pending' | 'will_pay' | 'not_paid' | 'cancelled',
    paid_value: ''
  });
  const [stats, setStats] = useState({ 
    total: 0, 
    paid: 0, 
    will_pay: 0, 
    pending: 0, 
    not_paid: 0, 
    cancelled: 0,
    remaining: 0
  });

  useEffect(() => {
    loadFinancialData();
  }, []);

  const loadFinancialData = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("id, name, value, paid_value, payment_status, start_date, clients(name)")
      .order("start_date", { ascending: false });

    if (!error && data) {
      setProjects(data as any);
      
      const total = data.reduce((sum, p) => sum + Number(p.value), 0);
      const paid = data.reduce((sum, p) => sum + Number(p.paid_value || 0), 0);
      const will_pay = data.filter((p) => p.payment_status === "will_pay").reduce((sum, p) => sum + Number(p.value), 0);
      const pending = data.filter((p) => p.payment_status === "pending").reduce((sum, p) => sum + Number(p.value), 0);
      const not_paid = data.filter((p) => p.payment_status === "not_paid").reduce((sum, p) => sum + Number(p.value), 0);
      const cancelled = data.filter((p) => p.payment_status === "cancelled").reduce((sum, p) => sum + Number(p.value), 0);
      const remaining = total - paid;
      
      setStats({ total, paid, will_pay, pending, not_paid, cancelled, remaining });
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project.id);
    setEditForm({
      payment_status: project.payment_status,
      paid_value: project.paid_value?.toString() || ''
    });
  };

  const handleSaveEdit = async (projectId: string) => {
    const { error } = await supabase
      .from("projects")
      .update({
        payment_status: editForm.payment_status,
        paid_value: editForm.paid_value ? parseFloat(editForm.paid_value) : 0
      })
      .eq("id", projectId);

    if (error) {
      toast.error("Erro ao atualizar projeto");
    } else {
      toast.success("Projeto atualizado com sucesso!");
      setEditingProject(null);
      loadFinancialData();
    }
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    setEditForm({ payment_status: '', paid_value: '' });
  };

  const getRemainingValue = (project: Project) => {
    const paid = project.paid_value || 0;
    return project.value - paid;
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

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">💰 Restante a Receber</CardTitle>
            <DollarSign className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">
              R$ {stats.remaining.toFixed(2)}
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
                <TableHead>Valor Total</TableHead>
                <TableHead>Valor Pago</TableHead>
                <TableHead>Restante</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
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
                  <TableCell className="font-semibold">R$ {Number(project.value).toFixed(2)}</TableCell>
                  
                  <TableCell>
                    {editingProject === project.id ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={editForm.paid_value}
                        onChange={(e) => setEditForm({ ...editForm, paid_value: e.target.value })}
                        className="w-24"
                      />
                    ) : (
                      <span className="font-medium text-green-600">
                        R$ {(project.paid_value || 0).toFixed(2)}
                      </span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <span className={`font-medium ${
                      getRemainingValue(project) > 0 ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      R$ {getRemainingValue(project).toFixed(2)}
                    </span>
                  </TableCell>
                  
                  <TableCell>
                    {editingProject === project.id ? (
                      <Select
                        value={editForm.payment_status}
                        onValueChange={(value: 'paid' | 'pending' | 'will_pay' | 'not_paid' | 'cancelled') => 
                          setEditForm({ ...editForm, payment_status: value })
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">🔄 Pendente</SelectItem>
                          <SelectItem value="will_pay">⏳ Cliente Vai Pagar</SelectItem>
                          <SelectItem value="paid">✅ Pago</SelectItem>
                          <SelectItem value="not_paid">❌ Não Pago</SelectItem>
                          <SelectItem value="cancelled">🚫 Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
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
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {editingProject === project.id ? (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          onClick={() => handleSaveEdit(project.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditProject(project)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
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
