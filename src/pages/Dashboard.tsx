import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, FolderKanban, DollarSign, Clock, TrendingUp, Calendar, Target, Zap } from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

interface Stats {
  clients: number;
  projects: number;
  activeProjects: number;
  completedProjects: number;
  monthlyRevenue: number;
  totalRevenue: number;
  hoursToday: number;
  hoursThisMonth: number;
  pendingPayments: number;
}

interface RecentProject {
  id: string;
  name: string;
  status: string;
  client_name: string;
  value: number;
  start_date: string;
}

interface ChartData {
  month: string;
  revenue: number;
  hours: number;
  projects: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    clients: 0,
    projects: 0,
    activeProjects: 0,
    completedProjects: 0,
    monthlyRevenue: 0,
    totalRevenue: 0,
    hoursToday: 0,
    hoursThisMonth: 0,
    pendingPayments: 0,
  });
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];
    const monthStart = startOfMonth(new Date()).toISOString().split("T")[0];
    const monthEnd = endOfMonth(new Date()).toISOString().split("T")[0];

    const [
      clientsRes, 
      projectsRes, 
      activeProjectsRes, 
      completedProjectsRes,
      monthlyRevenueRes, 
      totalRevenueRes,
      pendingPaymentsRes,
      timeTodayRes, 
      timeMonthRes,
      recentProjectsRes,
      chartDataRes
    ] = await Promise.all([
      supabase.from("clients").select("id", { count: "exact" }),
      supabase.from("projects").select("id", { count: "exact" }),
      supabase.from("projects").select("id", { count: "exact" }).in("status", ["todo", "in_progress"]),
      supabase.from("projects").select("id", { count: "exact" }).eq("status", "done"),
      supabase.from("projects").select("paid_value").eq("payment_status", "paid").gte("start_date", monthStart),
      supabase.from("projects").select("paid_value").eq("payment_status", "paid"),
      supabase.from("projects").select("value", "paid_value").in("payment_status", ["pending", "will_pay"]),
      supabase.from("time_entries").select("duration_minutes").gte("start_time", today),
      supabase.from("time_entries").select("duration_minutes").gte("start_time", monthStart),
      supabase.from("projects").select("id, name, status, start_date, value, clients(name)").order("created_at", { ascending: false }).limit(5),
      loadChartData()
    ]);

    const monthlyRevenue = monthlyRevenueRes.data?.reduce((sum, p) => sum + (Number(p.paid_value) || 0), 0) || 0;
    const totalRevenue = totalRevenueRes.data?.reduce((sum, p) => sum + (Number(p.paid_value) || 0), 0) || 0;
    const pendingPayments = pendingPaymentsRes.data?.reduce((sum, p) => sum + (Number(p.value) - Number(p.paid_value || 0)), 0) || 0;
    
    const hoursToday = timeTodayRes.data?.reduce((sum, t) => sum + (t.duration_minutes || 0), 0) || 0;
    const hoursThisMonth = timeMonthRes.data?.reduce((sum, t) => sum + (t.duration_minutes || 0), 0) || 0;

    setStats({
      clients: clientsRes.count || 0,
      projects: projectsRes.count || 0,
      activeProjects: activeProjectsRes.count || 0,
      completedProjects: completedProjectsRes.count || 0,
      monthlyRevenue,
      totalRevenue,
      hoursToday: Math.round(hoursToday / 60 * 10) / 10,
      hoursThisMonth: Math.round(hoursThisMonth / 60 * 10) / 10,
      pendingPayments,
    });

    setRecentProjects(recentProjectsRes.data?.map(p => ({
      id: p.id,
      name: p.name,
      status: p.status,
      client_name: p.clients?.name || "Sem cliente",
      value: p.value,
      start_date: p.start_date
    })) || []);

    setChartData(chartDataRes);
  };

  const loadChartData = async (): Promise<ChartData[]> => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthStart = startOfMonth(date).toISOString().split("T")[0];
      const monthEnd = endOfMonth(date).toISOString().split("T")[0];
      
      const [revenueRes, hoursRes, projectsRes] = await Promise.all([
        supabase.from("projects").select("paid_value").eq("payment_status", "paid").gte("start_date", monthStart).lte("start_date", monthEnd),
        supabase.from("time_entries").select("duration_minutes").gte("start_time", monthStart).lte("start_time", monthEnd),
        supabase.from("projects").select("id").gte("start_date", monthStart).lte("start_date", monthEnd)
      ]);

      const revenue = revenueRes.data?.reduce((sum, p) => sum + (Number(p.paid_value) || 0), 0) || 0;
      const hours = hoursRes.data?.reduce((sum, t) => sum + (t.duration_minutes || 0), 0) || 0;
      const projects = projectsRes.data?.length || 0;

      months.push({
        month: format(date, "MMM", { locale: ptBR }),
        revenue,
        hours: Math.round(hours / 60 * 10) / 10,
        projects
      });
    }
    return months;
  };

  const statCards = [
    {
      title: "Clientes",
      value: stats.clients,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Projetos Ativos",
      value: stats.activeProjects,
      icon: FolderKanban,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Receita do Mês",
      value: `R$ ${stats.monthlyRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Horas Hoje",
      value: `${stats.hoursToday}h`,
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Projetos Concluídos",
      value: stats.completedProjects,
      icon: Target,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Total Recebido",
      value: `R$ ${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-600/10",
    },
    {
      title: "Horas do Mês",
      value: `${stats.hoursThisMonth}h`,
      icon: Calendar,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
    {
      title: "Pendente Receber",
      value: `R$ ${stats.pendingPayments.toFixed(2)}`,
      icon: Zap,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      todo: { label: "A Fazer", variant: "secondary" as const, color: "bg-gray-500" },
      in_progress: { label: "Em Progresso", variant: "default" as const, color: "bg-blue-500" },
      done: { label: "Concluído", variant: "default" as const, color: "bg-green-500" },
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.todo;
    return (
      <Badge variant={statusInfo.variant} className={`${statusInfo.color} text-white`}>
        {statusInfo.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Visão geral dos seus projetos e atividades • {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="border-border/50 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Gráfico de Receita */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Evolução da Receita (6 meses)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`R$ ${value.toFixed(2)}`, "Receita"]}
                  labelFormatter={(label) => `Mês: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Horas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Horas Trabalhadas (6 meses)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`${value}h`, "Horas"]}
                  labelFormatter={(label) => `Mês: ${label}`}
                />
                <Bar dataKey="hours" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Projetos Recentes e Resumo */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Projetos Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5" />
              Projetos Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="text-sm text-muted-foreground">{project.client_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(project.status)}
                        <span className="text-sm text-muted-foreground">
                          R$ {project.value.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FolderKanban className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum projeto encontrado</p>
                  <p className="text-sm">Crie seu primeiro projeto para começar</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Resumo de Atividades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Resumo de Atividades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-700">Receita do Mês</p>
                    <p className="text-sm text-green-600">R$ {stats.monthlyRevenue.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-700">Horas Trabalhadas</p>
                    <p className="text-sm text-blue-600">{stats.hoursThisMonth}h este mês</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Target className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-purple-700">Projetos Ativos</p>
                    <p className="text-sm text-purple-600">{stats.activeProjects} em andamento</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-yellow-500/20">
                    <Zap className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-yellow-700">A Receber</p>
                    <p className="text-sm text-yellow-600">R$ {stats.pendingPayments.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
