"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  IconArrowUpRight, 
  IconArrowDownRight, 
  IconCurrencyReal, 
  IconLeaf,
  IconClock,
  IconCalendar,
  IconMapPin,
  IconSearch
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// --- Componentes Auxiliares ---

function ProgressBar({ value, colorClass }: { value: number, colorClass?: string }) {
  return (
    <div className="h-2 w-full rounded-full bg-muted/50 overflow-hidden">
      <div 
        className={cn("h-full rounded-full transition-all", colorClass || "bg-primary")} 
        style={{ width: `${value}%` }} 
      />
    </div>
  )
}

// Componente Visual dos Gráficos
function StatsView({ period, data, isLoading }: { period: string, data: any, isLoading?: boolean }) {
  if (isLoading) {
    return (
        <div className="h-[400px] w-full flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Carregando dados...</div>
        </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Seção 1: Resumo Financeiro e Impacto */}
        <div className="grid gap-4 md:grid-cols-3">
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Custo ({period})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{data.cost}</span>
                <span className={cn("text-sm font-medium flex items-center", data.trend === "up" ? "text-red-500" : "text-green-500")}>
                  {data.trend === "up" ? <IconArrowUpRight className="size-4" /> : <IconArrowDownRight className="size-4" />} 
                  {data.percentage}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Comparado ao período anterior</p>
              <div className="mt-4 flex items-center gap-2 text-sm">
                  <IconCurrencyReal className="size-4 text-green-600" />
                  <span>Meta: {data.target}</span>
              </div>
              <ProgressBar value={data.progress} colorClass="bg-yellow-500 mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Consumo Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{data.kwh}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Média de {data.avg}</p>
              
              <div className="mt-4 grid grid-cols-7 gap-1 h-12 items-end">
                  {data.chart.map((h: number, i: number) => (
                    <div key={i} className="w-full bg-blue-500/20 rounded-t-sm relative group">
                        <div 
                          className="absolute bottom-0 w-full bg-blue-500 rounded-t-sm transition-all hover:bg-blue-600" 
                          style={{ height: `${h}%` }}
                        ></div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Sustentabilidade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                  <IconLeaf className="size-8 text-green-500" />
                  <span className="text-2xl font-bold">{data.co2}</span>
              </div>
              <p className="text-sm font-medium mt-1">CO₂ evitado</p>
              <p className="text-xs text-muted-foreground mt-2">
                  Seu consumo consciente ajudou o planeta.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Seção 2: Detalhamento por CÔMODO */}
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                  <CardTitle>Ranking de Cômodos</CardTitle>
                  <CardDescription>Onde você mais gastou energia neste período.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                  {data.ranking.map((item: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold flex items-center gap-2">
                            <span className="flex size-5 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                                {index + 1}
                            </span> 
                            {item.name}
                          </span>
                          <span className="font-bold">{item.value}%</span>
                      </div>
                      <ProgressBar value={item.value} colorClass={item.color} />
                    </div>
                  ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                  <CardTitle>Insights do Período</CardTitle>
                  <CardDescription>Análise dos seus hábitos de consumo.</CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="flex flex-col gap-4">
                    
                    <div className="flex items-start gap-4 rounded-lg border p-4">
                        <div className="flex size-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                          <IconClock className="size-5 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Pico: {data.peakTime}</h4>
                          <p className="text-sm text-muted-foreground">Horário de maior intensidade.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 rounded-lg border p-4 bg-muted/20">
                        <div className="flex size-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                          <IconCalendar className="size-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Melhor Momento: {data.bestTime}</h4>
                          <p className="text-sm text-muted-foreground">Menor desperdício registrado.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 rounded-lg border p-4">
                         <div className="flex size-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                            <IconMapPin className="size-5 text-yellow-600" />
                         </div>
                         <div>
                            <h4 className="font-semibold">Atenção: {data.alertRoom}</h4>
                            <p className="text-sm text-muted-foreground">Consumo acima da média neste cômodo.</p>
                         </div>
                      </div>

                  </div>
              </CardContent>
            </Card>
        </div>
    </div>
  )
}

// --- Dados Simulados ---
const db = {
  day: {
    cost: "R$ 12,40", trend: "down", percentage: "-2%", target: "R$ 15,00", progress: 80,
    kwh: "14 kWh", avg: "0.8 kWh/h", chart: [20, 30, 15, 60, 80, 50, 30],
    co2: "2 kg", peakTime: "18:00 - 20:00", bestTime: "02:00 - 05:00", alertRoom: "Cozinha",
    ranking: [{ name: "Cozinha", value: 45, color: "bg-red-500" }, { name: "Sala", value: 30, color: "bg-yellow-500" }, { name: "Quartos", value: 15, color: "bg-blue-500" }, { name: "Banheiros", value: 10, color: "bg-green-500" }]
  },
  week: {
    cost: "R$ 98,00", trend: "up", percentage: "+5%", target: "R$ 90,00", progress: 95,
    kwh: "110 kWh", avg: "15 kWh/dia", chart: [50, 45, 60, 70, 80, 90, 60],
    co2: "15 kg", peakTime: "Sábado", bestTime: "Segunda", alertRoom: "Área Externa",
    ranking: [{ name: "Externa", value: 40, color: "bg-red-500" }, { name: "Cozinha", value: 30, color: "bg-yellow-500" }, { name: "Sala", value: 20, color: "bg-blue-500" }, { name: "Quartos", value: 10, color: "bg-green-500" }]
  },
  month: {
    cost: "R$ 280,50", trend: "down", percentage: "-10%", target: "R$ 300,00", progress: 85,
    kwh: "420 kWh", avg: "14 kWh/dia", chart: [40, 60, 35, 70, 50, 80, 45],
    co2: "45 kg", peakTime: "Semana 3", bestTime: "Semana 1", alertRoom: "Banheiros",
    ranking: [{ name: "Banheiros", value: 35, color: "bg-red-500" }, { name: "Cozinha", value: 30, color: "bg-yellow-500" }, { name: "Sala", value: 20, color: "bg-blue-500" }, { name: "Serviço", value: 15, color: "bg-green-500" }]
  },
  year: {
    cost: "R$ 3.450,00", trend: "up", percentage: "+12%", target: "R$ 3.200,00", progress: 98,
    kwh: "5.1 MWh", avg: "420 kWh/mês", chart: [30, 40, 60, 80, 90, 70, 50],
    co2: "500 kg", peakTime: "Janeiro", bestTime: "Junho", alertRoom: "Suíte Master",
    ranking: [{ name: "Suíte", value: 40, color: "bg-red-500" }, { name: "Cozinha", value: 30, color: "bg-yellow-500" }, { name: "Sala", value: 20, color: "bg-blue-500" }, { name: "Banheiros", value: 10, color: "bg-green-500" }]
  }
}

export default function StatisticsPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedDay, setSelectedDay] = React.useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = React.useState("janeiro");
  const [selectedYear, setSelectedYear] = React.useState("2024");

  // Simula o carregamento de dados quando o filtro muda
  const handleFilterChange = (type: string, value: string) => {
    setIsLoading(true);
    // Aqui você faria a chamada para o backend
    setTimeout(() => {
        setIsLoading(false);
        toast.success("Dados atualizados", {
            description: `Visualizando dados de ${value}`
        });
    }, 800);
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        
        <div className="flex flex-1 flex-col gap-8 p-6 md:p-10">
          
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Histórico de Consumo</h1>
            <p className="text-muted-foreground">
               Utilize os filtros abaixo para analisar períodos específicos.
            </p>
          </div>

          <Tabs defaultValue="month" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <TabsList className="grid w-full sm:w-auto grid-cols-4">
                <TabsTrigger value="day">Dia</TabsTrigger>
                <TabsTrigger value="week">Semana</TabsTrigger>
                <TabsTrigger value="month">Mês</TabsTrigger>
                <TabsTrigger value="year">Ano</TabsTrigger>
              </TabsList>
            </div>

            {/* --- ABA DIA --- */}
            <TabsContent value="day" className="space-y-4">
                <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-lg border">
                    <div className="grid gap-2">
                        <Label htmlFor="date">Selecionar Data</Label>
                        <Input 
                            type="date" 
                            id="date" 
                            className="w-[200px] bg-background" 
                            value={selectedDay}
                            onChange={(e) => {
                                setSelectedDay(e.target.value);
                                handleFilterChange("Dia", e.target.value);
                            }}
                        />
                    </div>
                </div>
                <StatsView period="Dia" data={db.day} isLoading={isLoading} />
            </TabsContent>
            
            {/* --- ABA SEMANA --- */}
            <TabsContent value="week" className="space-y-4">
                 <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-lg border">
                    <div className="grid gap-2">
                        <Label htmlFor="week">Selecionar Semana</Label>
                        <Input 
                            type="week" 
                            id="week" 
                            className="w-[200px] bg-background" 
                            onChange={(e) => handleFilterChange("Semana", e.target.value)}
                        />
                    </div>
                </div>
              <StatsView period="Semana" data={db.week} isLoading={isLoading} />
            </TabsContent>
            
            {/* --- ABA MÊS --- */}
            <TabsContent value="month" className="space-y-4">
                <div className="flex flex-wrap items-center gap-4 bg-muted/30 p-4 rounded-lg border">
                    <div className="grid gap-2 w-[180px]">
                        <Label>Mês</Label>
                        <Select 
                            defaultValue={selectedMonth} 
                            onValueChange={(v) => {
                                setSelectedMonth(v);
                                handleFilterChange("Mês", `${v}/${selectedYear}`);
                            }}
                        >
                            <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Mês" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="janeiro">Janeiro</SelectItem>
                                <SelectItem value="fevereiro">Fevereiro</SelectItem>
                                <SelectItem value="marco">Março</SelectItem>
                                <SelectItem value="abril">Abril</SelectItem>
                                <SelectItem value="maio">Maio</SelectItem>
                                <SelectItem value="junho">Junho</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2 w-[120px]">
                        <Label>Ano</Label>
                         <Select 
                            defaultValue={selectedYear}
                            onValueChange={(v) => {
                                setSelectedYear(v);
                                handleFilterChange("Ano", `${selectedMonth}/${v}`);
                            }}
                        >
                            <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Ano" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2024">2024</SelectItem>
                                <SelectItem value="2023">2023</SelectItem>
                                <SelectItem value="2022">2022</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
              <StatsView period="Mês" data={db.month} isLoading={isLoading} />
            </TabsContent>
            
            {/* --- ABA ANO --- */}
            <TabsContent value="year" className="space-y-4">
                 <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-lg border">
                    <div className="grid gap-2 w-[180px]">
                        <Label>Ano de Referência</Label>
                        <Select 
                            defaultValue="2024"
                            onValueChange={(v) => handleFilterChange("Ano", v)}
                        >
                            <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Selecione o ano" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2024">2024</SelectItem>
                                <SelectItem value="2023">2023</SelectItem>
                                <SelectItem value="2022">2022</SelectItem>
                                <SelectItem value="2021">2021</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
              <StatsView period="Ano" data={db.year} isLoading={isLoading} />
            </TabsContent>
          </Tabs>

        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}