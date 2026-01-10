"use client"

import React, { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  IconArrowLeft, 
  IconBolt, 
  IconAlertCircle, 
  IconArmchair, 
  IconBath, 
  IconBed, 
  IconChefHat, 
  IconSun, 
  IconBox,
  IconTrash,
  IconActivity,
  IconLoader2,
  IconTrendingUp,
  IconTrendingDown
} from "@tabler/icons-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useRooms } from "@/contexts/room-context"
import { cn } from "@/lib/utils"

// --- Helpers Visuais ---
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
  const { getRoomBySlug, removeRoom, isLoading } = useRooms()
  
  // --- ESTADO PARA DADOS REAIS DO ESP32 ---
  const [realData, setRealData] = useState({
    tensao: 0,
    corrente: 0,
    potencia: 0
  })

  // -------------------------------------------------------------
  // CONFIGURAÇÃO DO ESP32
  // Troque pelo IP que aparece no Monitor Serial do Arduino
  // Mantenha o "http://" antes do número.
  // -------------------------------------------------------------
  const ESP32_IP = "http://192.168.1.15"; // <--- ALTERE AQUI O SEU IP

  // EFEITO DE POLLING (Busca dados a cada 2 segundos)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${ESP32_IP}/api/leitura`)
        if (!response.ok) throw new Error("Falha na conexão")
        
        const data = await response.json()
        console.log("Dados recebidos:", data)
        
        setRealData({
            tensao: data.tensao,
            corrente: data.corrente,
            potencia: data.potencia
        })
      } catch (error) {
        console.warn("ESP32 desconectado ou IP incorreto.", error)
      }
    }

    // Chama imediatamente e define intervalo
    fetchData()
    const interval = setInterval(fetchData, 2000) // 2000ms = 2 segundos

    return () => clearInterval(interval)
  }, [])


  // --- Lógica de Renderização ---
  const room = getRoomBySlug(slug as string)

  if (isLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center flex-col gap-4 bg-background">
            <IconLoader2 className="size-8 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm font-medium">Carregando sistema...</p>
        </div>
    )
  }

  if (!room) {
    return (
        <div className="flex h-screen w-full items-center justify-center flex-col gap-4 bg-muted/10">
            <h1 className="text-xl font-bold">Cômodo não encontrado</h1>
            <Button asChild variant="secondary" size="sm"><Link href="/dashboard/comodos">Voltar</Link></Button>
        </div>
    )
  }

  const Icon = getIconByType(room.type)
  const colorClass = getRoomTypeColor(room.type)
  
  // Define lógica de alerta baseado no consumo real
  const isHigh = realData.potencia > 400 // Exemplo: Alerta se passar de 400W

  const handleDelete = () => {
      removeRoom(room.id)
      router.push("/dashboard/comodos")
  }

  return (
    <SidebarProvider
      style={{
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        
        <div className="flex flex-1 flex-col gap-6 p-6 md:p-8 max-w-6xl mx-auto w-full">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <Link href="/dashboard/comodos">
                        <IconArrowLeft className="size-4" />
                    </Link>
                </Button>
                <div className="flex items-center gap-3">
                    <div className={cn("flex size-10 items-center justify-center rounded-lg border", colorClass)}>
                        <Icon className="size-5" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold leading-none">{room.name}</h1>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                           <span className="relative flex size-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                              <span className="relative inline-flex rounded-full size-2 bg-green-500"></span>
                           </span>
                           Conectado ao Sensor IoT
                        </p>
                    </div>
                </div>
            </div>
            
            <Button 
                variant="ghost" 
                size="sm"
                onClick={handleDelete} 
                className="text-muted-foreground hover:text-red-500 hover:bg-red-50"
            >
                <IconTrash className="size-4 mr-2" /> Excluir
            </Button>
          </div>

          {/* Cards Principais */}
          <div className="grid gap-4 md:grid-cols-2">
            
            {/* Card Consumo (DADOS REAIS) */}
            <Card className="h-60 flex flex-col justify-between shadow-sm border-muted/60">
                <CardHeader className="pb-0 pt-6 px-8">
                    <CardTitle className="text-base font-medium text-muted-foreground flex items-center justify-between">
                        <span>Potência em Tempo Real</span>
                        <IconBolt className="size-5 text-yellow-500" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-6 flex flex-col gap-2 flex-1 justify-center">
                    <div className="flex items-baseline gap-1 mt-2">
                        {/* Exibindo a Potência Real */}
                        <span className="text-5xl font-bold tracking-tight">{realData.potencia}</span>
                        <span className="text-2xl text-muted-foreground font-medium">W</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Tensão: <strong>{realData.tensao} V</strong> • Corrente: <strong>{realData.corrente} A</strong>
                    </p>
                    
                    <div className="mt-auto pt-2">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-600 border border-yellow-500/20">
                            <IconActivity className="size-3.5" />
                            <span>Atualizando via Wi-Fi</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Card Status (DINÂMICO) */}
            <Card className="h-60 flex flex-col justify-between shadow-sm border-muted/60">
                <CardHeader className="pb-0 pt-6 px-8">
                    <CardTitle className="text-base font-medium text-muted-foreground flex items-center justify-between">
                        <span>Status do Circuito</span>
                        {isHigh ? (
                             <IconTrendingDown className="size-5 text-red-500" />
                        ) : (
                             <IconTrendingUp className="size-5 text-green-500" />
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-6 flex flex-col gap-2 flex-1 justify-center">
                    <div className="flex items-baseline gap-1 mt-2">
                        <span className={cn("text-5xl font-bold tracking-tight", isHigh ? "text-red-600" : "text-green-600")}>
                            {isHigh ? "Alerta" : "Normal"}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {isHigh ? "Consumo acima de 400W detectado." : "Consumo dentro dos parâmetros seguros."}
                    </p>

                    <div className="mt-auto pt-2">
                        <div className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border",
                            isHigh 
                                ? "bg-red-500/10 text-red-600 border-red-500/20" 
                                : "bg-green-500/10 text-green-600 border-green-500/20"
                        )}>
                            <IconAlertCircle className="size-3.5" />
                            <span>{isHigh ? "Verifique Aparelhos" : "Circuito Estável"}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
          </div>
          
          {/* Gráfico Visual (Estético) */}
          <Card className="shadow-sm border-muted/60">
              <CardHeader className="pb-2 border-b border-dashed">
                  <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-semibold">Perfil de Carga (Simulado)</CardTitle>
                        <p className="text-xs text-muted-foreground">Histórico das últimas 24 horas.</p>
                    </div>
                  </div>
              </CardHeader>
              <CardContent className="pt-6">
                  <div className="h-[220px] w-full flex items-end gap-1.5 relative">
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
                          <div className="border-t border-dashed border-muted/50 w-full h-px"></div>
                          <div className="border-t border-dashed border-muted/50 w-full h-px"></div>
                          <div className="border-t border-dashed border-muted/50 w-full h-px"></div>
                      </div>

                      {Array.from({ length: 24 }).map((_, i) => {
                          const base = isHigh ? 30 : 10
                          const height = Math.min(base + Math.random() * 40, 100)
                          return (
                            <div key={i} className="flex-1 group relative z-10 flex flex-col justify-end h-full">
                                <div 
                                    className={cn(
                                        "w-full rounded-t-sm opacity-80 transition-all duration-500",
                                        isHigh ? "bg-gradient-to-t from-red-500/50 to-red-500" : "bg-gradient-to-t from-blue-500/50 to-blue-500"
                                    )}
                                    style={{ height: `${height}%` }}
                                ></div>
                            </div>
                          )
                      })}
                  </div>
                  <div className="flex justify-between mt-3 text-[10px] font-medium text-muted-foreground px-1">
                      <span>00h</span><span>06h</span><span>12h</span><span>18h</span><span>23h</span>
                  </div>
              </CardContent>
          </Card>

        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}