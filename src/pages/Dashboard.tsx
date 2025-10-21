import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FolderKanban, DollarSign, Clock } from "lucide-react";

interface Stats {
  clients: number;
  projects: number;
  monthlyRevenue: number;
  hoursToday: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    clients: 0,
    projects: 0,
    monthlyRevenue: 0,
    hoursToday: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [clientsRes, projectsRes, financialRes, timeRes] = await Promise.all([
      supabase.from("clients").select("id", { count: "exact" }),
      supabase.from("projects").select("id", { count: "exact" }).neq("status", "done"),
      supabase.from("projects").select("value").eq("payment_status", "paid"),
      supabase.from("time_entries").select("duration_minutes").gte("start_time", new Date().toISOString().split("T")[0]),
    ]);

    const totalRevenue = financialRes.data?.reduce((sum, p) => sum + (Number(p.value) || 0), 0) || 0;
    const totalMinutes = timeRes.data?.reduce((sum, t) => sum + (t.duration_minutes || 0), 0) || 0;

    setStats({
      clients: clientsRes.count || 0,
      projects: projectsRes.count || 0,
      monthlyRevenue: totalRevenue,
      hoursToday: Math.round(totalMinutes / 60 * 10) / 10,
    });
  };

  const statCards = [
    {
      title: "Clientes",
      value: stats.clients,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Projetos Ativos",
      value: stats.projects,
      icon: FolderKanban,
      color: "text-purple-500",
    },
    {
      title: "Receita Total",
      value: `R$ ${stats.monthlyRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      title: "Horas Hoje",
      value: `${stats.hoursToday}h`,
      icon: Clock,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Visão geral dos seus projetos e atividades</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
