import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, GripVertical } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Project {
  id: string;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  value: number;
  payment_status: string;
}

interface ProjectCardProps {
  project: Project;
  clientName?: string;
}

export function ProjectCard({ project, clientName }: ProjectCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="cursor-grab active:cursor-grabbing border-border/50 hover:border-primary/50 transition-all hover:shadow-lg"
    >
      <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-3">
        <div {...attributes} {...listeners} className="mt-1">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1 space-y-1">
          <CardTitle className="text-base">{project.name}</CardTitle>
          {clientName && (
            <p className="text-xs text-muted-foreground">{clientName}</p>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        )}
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {project.start_date && project.end_date ? (
            <span>
              {format(new Date(project.start_date), "dd/MM", { locale: ptBR })} -{" "}
              {format(new Date(project.end_date), "dd/MM/yy", { locale: ptBR })}
            </span>
          ) : (
            <span>Sem prazo definido</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm font-semibold text-green-500">
            <DollarSign className="h-4 w-4" />
            R$ {project.value.toFixed(2)}
          </div>
          <Badge variant={project.payment_status === "paid" ? "default" : "secondary"}>
            {project.payment_status === "paid" ? "Pago" : "Pendente"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
