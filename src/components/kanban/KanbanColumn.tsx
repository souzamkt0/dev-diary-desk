import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ProjectCard } from "./ProjectCard";

interface Project {
  id: string;
  name: string;
  description: string | null;
  client_id: string | null;
  start_date: string | null;
  end_date: string | null;
  value: number;
  payment_status: string;
}

interface Client {
  id: string;
  name: string;
}

interface KanbanColumnProps {
  id: string;
  title: string;
  projects: Project[];
  clients: Client[];
  onEditProject?: (project: Project) => void;
}

export function KanbanColumn({ id, title, projects, clients, onEditProject }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{title}</h3>
        <span className="text-sm text-muted-foreground">
          {projects.length} {projects.length === 1 ? "projeto" : "projetos"}
        </span>
      </div>

      <SortableContext items={projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className="flex flex-col gap-3 min-h-[500px] p-4 rounded-lg bg-muted/20 border border-border/30"
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              clientName={clients.find((c) => c.id === project.client_id)?.name}
              onEdit={onEditProject}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
