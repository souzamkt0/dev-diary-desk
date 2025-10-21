import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Square, Clock } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Project {
  id: string;
  name: string;
}

interface TimeEntry {
  id: string;
  project_id: string;
  start_time: string;
  end_time: string | null;
  duration_minutes: number | null;
  projects: { name: string };
}

export default function Time() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);

  useEffect(() => {
    loadProjects();
    loadTimeEntries();
  }, []);

  const loadProjects = async () => {
    const { data } = await supabase
      .from("projects")
      .select("id, name")
      .neq("status", "done");
    setProjects(data || []);
  };

  const loadTimeEntries = async () => {
    const { data } = await supabase
      .from("time_entries")
      .select("*, projects(name)")
      .order("start_time", { ascending: false })
      .limit(10);

    if (data) {
      setTimeEntries(data as any);
      const active = data.find((e) => !e.end_time);
      setActiveEntry(active as any || null);
    }
  };

  const handleStartTimer = async () => {
    if (!selectedProject) {
      toast.error("Selecione um projeto");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("time_entries").insert({
      user_id: user.id,
      project_id: selectedProject,
      start_time: new Date().toISOString(),
    });

    if (error) {
      toast.error("Erro ao iniciar timer");
    } else {
      toast.success("Timer iniciado!");
      loadTimeEntries();
    }
  };

  const handleStopTimer = async () => {
    if (!activeEntry) return;

    const { error } = await supabase
      .from("time_entries")
      .update({ end_time: new Date().toISOString() })
      .eq("id", activeEntry.id);

    if (error) {
      toast.error("Erro ao parar timer");
    } else {
      toast.success("Timer parado!");
      loadTimeEntries();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Controle de Tempo</h2>
        <p className="text-muted-foreground">Registre o tempo gasto em cada projeto</p>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Timer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um projeto" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {activeEntry ? (
            <Button onClick={handleStopTimer} variant="destructive" className="w-full">
              <Square className="mr-2 h-4 w-4" />
              Parar Timer
            </Button>
          ) : (
            <Button onClick={handleStartTimer} className="w-full">
              <Play className="mr-2 h-4 w-4" />
              Iniciar Timer
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registros Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {timeEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border/50"
              >
                <div>
                  <p className="font-medium">{entry.projects.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(entry.start_time), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    {entry.end_time && ` - ${format(new Date(entry.end_time), "HH:mm", { locale: ptBR })}`}
                  </p>
                </div>
                <div className="text-right">
                  {entry.duration_minutes ? (
                    <p className="font-semibold">{Math.round(entry.duration_minutes / 60 * 10) / 10}h</p>
                  ) : (
                    <p className="text-sm text-green-500">Em andamento</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
