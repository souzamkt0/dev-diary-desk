import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, GripVertical, Clock, User, Eye } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Project {
  id: string;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  value: number;
  paid_value?: number;
  payment_status: string;
  total_hours?: number;
}

interface ProjectCardProps {
  project: Project;
  clientName?: string;
  onEdit?: (project: Project) => void;
}

export function ProjectCard({ project, clientName, onEdit }: ProjectCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusMap = {
      paid: { label: "✅ Pago", color: "bg-green-500 text-white" },
      will_pay: { label: "⏳ Vai Pagar", color: "bg-blue-500 text-white" },
      pending: { label: "🔄 Pendente", color: "bg-orange-500 text-white" },
      not_paid: { label: "❌ Não Pago", color: "bg-red-500 text-white" },
      cancelled: { label: "🚫 Cancelado", color: "bg-gray-500 text-white" },
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return (
      <Badge className={statusInfo.color}>
        {statusInfo.label}
      </Badge>
    );
  };

  const getRemainingValue = () => {
    const paid = project.paid_value || 0;
    return project.value - paid;
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="cursor-grab active:cursor-grabbing border-border/50 hover:border-primary/50 transition-all hover:shadow-lg group"
    >
      <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-3">
        <div {...attributes} {...listeners} className="mt-1">
          <GripVertical className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
        </div>
        <div className="flex-1 space-y-1">
          <CardTitle className="text-base line-clamp-1">{project.name}</CardTitle>
          {clientName && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span>{clientName}</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        )}
        
        {/* Datas */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {project.start_date || project.end_date ? (
            <span>
              {project.start_date && format(new Date(project.start_date + 'T00:00:00'), "dd/MM/yy", { locale: ptBR })}
              {project.start_date && project.end_date && " - "}
              {project.end_date && format(new Date(project.end_date + 'T00:00:00'), "dd/MM/yy", { locale: ptBR })}
            </span>
          ) : (
            <span>Sem prazo definido</span>
          )}
        </div>

        {/* Horas trabalhadas */}
        {project.total_hours && project.total_hours > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{project.total_hours.toFixed(1)}h trabalhadas</span>
          </div>
        )}

        {/* Valores e Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
              <DollarSign className="h-4 w-4" />
              R$ {project.value.toFixed(2)}
            </div>
            {getPaymentStatusBadge(project.payment_status)}
          </div>
          
          {project.paid_value && project.paid_value > 0 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Pago: R$ {project.paid_value.toFixed(2)}</span>
              <span className="text-orange-600 font-medium">
                Resta: R$ {getRemainingValue().toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-8 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(project);
            }}
          >
            <Eye className="h-3 w-3 mr-1" />
            Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
