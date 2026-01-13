"use client"

import React, { useEffect, useState, useMemo } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  IconArrowLeft, IconBolt, IconAlertCircle, IconArmchair, IconBath, IconBed, 
  IconChefHat, IconSun, IconBox, IconTrash, IconLoader2, 
  IconTrendingUp, IconTrendingDown, IconWifi, IconWifiOff, IconClock
} from "@tabler/icons-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useRooms } from "@/contexts/room-context"
import { cn } from "@/lib/utils"

// Helpers Visuais
const getIconByType = (type: string) => {
  switch (type) {
    case "living": return IconArmchair;
    case "kitchen": return IconChefHat;
    case "bedroom": return IconBed;
    case "bathroom": return IconBath;
    case "outdoor": return IconSun;
    default: return IconBox;
  }
}
const getRoomTypeColor = (type: string) => {
  switch (type) {
    case "living": return "text-blue-500 bg-blue-500/10 border-blue-200/50";
    case "kitchen": return "text-orange-500 bg-orange-500/10 border-orange-200/50";
    case "bedroom": return "text-purple-500 bg-purple-500/10 border-purple-200/50";
    case "bathroom": return "text-cyan-500 bg-cyan-500/10 border-cyan-200/50";
    case "outdoor": return "text-green-500 bg-green-500/10 border-green-200/50";
    default: return "text-slate-500 bg-slate-500/10 border-slate-200/50";
  }
}

export default function RoomDetailPage() {
  const { slug } = useParams()
  const router = useRouter()
  const { getRoomBySlug, removeRoom, isLoading, sensorData } = useRooms()
  
  // Estado para armazenar o "Passado" fixo (para não ficar piscando)
  const [pastData, setPastData] = useState<number[]>([]);

  // 1. Gera o histórico do passado apenas UMA vez ao carregar a página
  useEffect(() => {
    // Cria 24 valores aleatórios para servir de base histórica
    const staticHistory = Array.from({ length: 24 }).map((_, i) => {
        // Simula: Madrugada baixo consumo, Noite alto consumo
        const base = (i > 18 && i < 22) ? 600 : (i > 0 && i < 6) ? 50 : 200; 
        return Math.floor(Math.random() * 300) + base; 
    });
    setPastData(staticHistory);
  }, []);

  // 2. Monta o Array Final do Gráfico (Passado + Presente + Futuro)
  const chartData = useMemo(() => {
    const currentHour = new Date().getHours();
    
    return Array.from({ length: 24 }).map((_, hourIndex) => {
        if (hourIndex < currentHour) {
            // PASSADO: Usa o dado estático gerado no início
            return pastData[hourIndex] || 0;
        } 
        else if (hourIndex === currentHour) {
            // PRESENTE: Usa o dado REAL do ESP32
            return sensorData.potencia;
        } 
        else {
            // FUTURO: Zero (vazio)
            return 0;
        }
    });
  }, [pastData, sensorData.potencia]); // Recalcula sempre que a potência mudar

  const room = getRoomBySlug(slug as string)

  if (isLoading) return <div className="flex h-screen w-full items-center justify-center"><IconLoader2 className="animate-spin" /></div>
  if (!room) return <div className="p-10">Cômodo não encontrado. <Link href="/dashboard/comodos">Voltar</Link></div>

  const Icon = getIconByType(room.type)
  const colorClass = getRoomTypeColor(room.type)
  const isHigh = sensorData.potencia > 800
  const currentHour = new Date().getHours();

  const handleDelete = () => {
      removeRoom(room.id)
      router.push("/dashboard/comodos")
  }

  return (
    <SidebarProvider style={{ "--sidebar-width": "18rem", "--header-height": "3rem" } as React.CSSProperties}>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        
        <div className="flex flex-1 flex-col gap-6 p-6 md:p-8 max-w-6xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" asChild><Link href="/dashboard/comodos"><IconArrowLeft className="size-4" /></Link></Button>
                <div className="flex items-center gap-3">
                    <div className={cn("flex size-10 items-center justify-center rounded-lg border", colorClass)}><Icon className="size-5" /></div>
                    <div>
                        <h1 className="text-lg font-bold leading-none">{room.name}</h1>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                           <span className={cn("relative flex size-2 rounded-full", !sensorData.isConnected ? "bg-orange-400" : "bg-green-500")}>
                              <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", !sensorData.isConnected ? "bg-orange-400" : "bg-green-500")}></span>
                           </span>
                           {!sensorData.isConnected ? "Simulação Ativa" : "Conectado ao ESP32"}
                        </p>
                    </div>
                </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleDelete} className="text-muted-foreground hover:text-red-500"><IconTrash className="size-4 mr-2" /> Excluir</Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Card Consumo */}
            <Card className="h-60 flex flex-col justify-between shadow-sm border-muted/60">
                <CardHeader className="pb-0 pt-6 px-8">
                    <CardTitle className="text-base font-medium text-muted-foreground flex items-center justify-between">
                        <span>Potência Instantânea</span>
                        <IconBolt className="size-5 text-yellow-500" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-6 flex flex-col gap-2 flex-1 justify-center">
                    <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-5xl font-bold tracking-tight">{sensorData.potencia}</span>
                        <span className="text-2xl text-muted-foreground font-medium">W</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {sensorData.tensao} V • {sensorData.corrente} A
                    </p>
                    <div className="mt-auto pt-2">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-600 border border-yellow-500/20">
                            {!sensorData.isConnected ? <IconWifiOff className="size-3.5" /> : <IconWifi className="size-3.5" />}
                            <span>{!sensorData.isConnected ? "Modo Offline" : "Sinal Wi-Fi Recebido"}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Card Status */}
            <Card className="h-60 flex flex-col justify-between shadow-sm border-muted/60">
                <CardHeader className="pb-0 pt-6 px-8">
                    <CardTitle className="text-base font-medium text-muted-foreground flex items-center justify-between">
                        <span>Status Operacional</span>
                        {isHigh ? <IconTrendingDown className="size-5 text-red-500" /> : <IconTrendingUp className="size-5 text-green-500" />}
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-6 flex flex-col gap-2 flex-1 justify-center">
                    <div className="flex items-baseline gap-1 mt-2">
                        <span className={cn("text-5xl font-bold tracking-tight", isHigh ? "text-red-600" : "text-green-600")}>{isHigh ? "Alerta" : "Normal"}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{isHigh ? "Consumo atípico detectado." : "Dentro da média diária."}</p>
                    <div className="mt-auto pt-2">
                        <div className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border", isHigh ? "bg-red-500/10 text-red-600 border-red-500/20" : "bg-green-500/10 text-green-600 border-green-500/20")}>
                            <IconAlertCircle className="size-3.5" />
                            <span>{isHigh ? "Inspecionar Carga" : "Funcionamento Ideal"}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
          </div>
          
          {/* GRÁFICO DIÁRIO (00h - 23h) */}
          <Card className="shadow-sm border-muted/60">
              <CardHeader className="pb-2 border-b border-dashed">
                  <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-semibold">Consumo Diário (00h - 23h)</CardTitle>
                        <p className="text-xs text-muted-foreground">Monitoramento hora a hora.</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-medium text-muted-foreground">Hora Atual</p>
                        <div className="flex items-center gap-1 justify-end text-lg font-bold text-primary">
                             <IconClock className="size-4" />
                             {currentHour}:00
                        </div>
                    </div>
                  </div>
              </CardHeader>
              <CardContent className="pt-6">
                  {/* Container do Gráfico */}
                  <div className="h-[220px] w-full flex items-end gap-1 relative">
                      
                      {/* Grid de Fundo */}
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
                          <div className="border-t border-dashed border-muted/50 w-full h-px"></div>
                          <div className="border-t border-dashed border-muted/50 w-full h-px"></div>
                          <div className="border-t border-muted/20 w-full h-px"></div>
                      </div>

                      {chartData.map((val, i) => {
                          const percent = Math.min((val / 1500) * 100, 100);
                          const isPast = i < currentHour;
                          const isNow = i === currentHour;
                          
                          return (
                            <div key={i} className="flex-1 group relative z-10 flex flex-col justify-end h-full">
                                <div 
                                    className={cn(
                                        "w-full rounded-sm transition-all duration-500", 
                                        isPast ? "bg-muted/40 hover:bg-muted/60" : // Passado (Cinza)
                                        isNow  ? "bg-primary animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" : // Agora (Azul Brilhante)
                                        "bg-transparent" // Futuro (Invisível)
                                    )}
                                    // Se for futuro, altura 0. Se for presente/passado, altura real.
                                    style={{ height: val === 0 && !isNow ? "0px" : `${Math.max(percent, 2)}%` }}
                                ></div>
                                
                                {/* Tooltip */}
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] font-bold px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 border whitespace-nowrap z-20 pointer-events-none">
                                    {i}h • {val} W
                                </div>
                                
                                {/* Labels Eixo X (Apenas algumas horas para não poluir) */}
                                {(i === 0 || i === 6 || i === 12 || i === 18 || i === 23) && (
                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground font-medium">
                                        {i}h
                                    </div>
                                )}
                            </div>
                          )
                      })}
                  </div>
                  {/* Espaço extra para labels */}
                  <div className="h-6"></div> 
              </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}