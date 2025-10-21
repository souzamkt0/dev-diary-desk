import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DndContext, closestCorners, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { KanbanColumn } from "@/components/kanban/KanbanColumn";
import { ProjectCard } from "@/components/kanban/ProjectCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: "todo" | "in_progress" | "done";
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

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    loadProjects();
    loadClients();
  }, []);

  const loadProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar projetos");
    } else {
      setProjects((data || []) as Project[]);
    }
  };

  const loadClients = async () => {
    const { data } = await supabase.from("clients").select("id, name");
    setClients(data || []);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const projectId = active.id as string;
    const newStatus = over.id as "todo" | "in_progress" | "done";

    const { error } = await supabase
      .from("projects")
      .update({ status: newStatus })
      .eq("id", projectId);

    if (error) {
      toast.error("Erro ao atualizar status");
    } else {
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, status: newStatus } : p))
      );
      toast.success("Status atualizado!");
    }
  };

  const columns = [
    { id: "todo", title: "A Fazer", status: "todo" as const },
    { id: "in_progress", title: "Em Progresso", status: "in_progress" as const },
    { id: "done", title: "Concluído", status: "done" as const },
  ];

  const activeProject = projects.find((p) => p.id === activeId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projetos</h2>
          <p className="text-muted-foreground">Gerencie seus projetos no estilo Kanban</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              projects={projects.filter((p) => p.status === column.status)}
              clients={clients}
            />
          ))}
        </div>

        <DragOverlay>
          {activeProject && (
            <ProjectCard
              project={activeProject}
              clientName={clients.find((c) => c.id === activeProject.client_id)?.name}
            />
          )}
        </DragOverlay>
      </DndContext>

      <CreateProjectDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        clients={clients}
        onSuccess={loadProjects}
      />
    </div>
  );
}
