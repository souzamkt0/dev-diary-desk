import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Client {
  id: string;
  name: string;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  client_id: string | null;
  start_date: string | null;
  end_date: string | null;
  value: number;
  payment_status: 'paid' | 'pending' | 'will_pay' | 'not_paid' | 'cancelled';
  status: 'todo' | 'in_progress' | 'done';
}

interface EditProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  clients: Client[];
  onSuccess: () => void;
}

export function EditProjectDialogBackup({
  open,
  onOpenChange,
  project,
  clients,
  onSuccess,
}: EditProjectDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    client_id: "",
    start_date: "",
    end_date: "",
    value: "",
    payment_status: "pending" as 'paid' | 'pending' | 'will_pay' | 'not_paid' | 'cancelled',
    status: "todo" as 'todo' | 'in_progress' | 'done',
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        description: project.description || "",
        client_id: project.client_id || "",
        start_date: project.start_date || "",
        end_date: project.end_date || "",
        value: project.value?.toString() || "",
        payment_status: project.payment_status || "pending",
        status: project.status || "todo",
      });
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    // Validação básica
    if (!formData.name.trim()) {
      toast.error("Nome do projeto é obrigatório");
      return;
    }

    if (formData.value && parseFloat(formData.value) < 0) {
      toast.error("Valor não pode ser negativo");
      return;
    }

    setLoading(true);

    // Versão sem paid_value para teste
    const updateData: any = {
      name: formData.name,
      description: formData.description || null,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      value: parseFloat(formData.value) || 0,
      payment_status: formData.payment_status,
      status: formData.status,
    };

    // Só adiciona client_id se não estiver vazio
    if (formData.client_id && formData.client_id.trim() !== "") {
      updateData.client_id = formData.client_id;
    } else {
      updateData.client_id = null;
    }

    console.log("Dados a serem enviados (SEM paid_value):", updateData);
    console.log("ID do projeto:", project.id);

    const { data, error } = await supabase
      .from("projects")
      .update(updateData)
      .eq("id", project.id)
      .select();

    setLoading(false);

    if (error) {
      console.error("Erro completo:", error);
      console.error("Código do erro:", error.code);
      console.error("Detalhes:", error.details);
      console.error("Hint:", error.hint);
      console.error("Message:", error.message);
      
      toast.error(`Erro ao atualizar projeto: ${error.message}`);
    } else {
      console.log("Projeto atualizado com sucesso:", data);
      toast.success("Projeto atualizado com sucesso!");
      onOpenChange(false);
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Projeto (Versão de Teste)</DialogTitle>
          <DialogDescription>
            Versão sem paid_value para testar se o problema é específico dessa coluna
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Projeto *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Cliente</Label>
              <Select
                value={formData.client_id}
                onValueChange={(value) => setFormData({ ...formData, client_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status do Projeto</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'todo' | 'in_progress' | 'done') => 
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">🔄 A Fazer</SelectItem>
                  <SelectItem value="in_progress">⚡ Em Progresso</SelectItem>
                  <SelectItem value="done">✅ Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">Valor Total (R$)</Label>
            <Input
              id="value"
              type="number"
              step="0.01"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_status">Status de Pagamento</Label>
            <Select
              value={formData.payment_status}
              onValueChange={(value: 'paid' | 'pending' | 'will_pay' | 'not_paid' | 'cancelled') => 
                setFormData({ ...formData, payment_status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">🔄 Pendente</SelectItem>
                <SelectItem value="will_pay">⏳ Cliente Vai Pagar</SelectItem>
                <SelectItem value="paid">✅ Pago</SelectItem>
                <SelectItem value="not_paid">❌ Não Pago</SelectItem>
                <SelectItem value="cancelled">🚫 Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Data de Início</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="[&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">Data de Término</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="[&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Alterações (Teste)
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
