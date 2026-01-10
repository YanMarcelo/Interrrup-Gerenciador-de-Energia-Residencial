"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { 
  IconArmchair, 
  IconBath, 
  IconBed, 
  IconBolt, 
  IconChefHat, 
  IconPlus, 
  IconSun 
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { toast } from "sonner"

// --- Componentes Auxiliares ---

const getConsumptionColor = (level: "low" | "medium" | "high") => {
  if (level === "high") return "text-red-500 bg-red-500/10 border-red-200";
  if (level === "medium") return "text-yellow-500 bg-yellow-500/10 border-yellow-200";
  return "text-green-500 bg-green-500/10 border-green-200";
}

function RoomCard({ 
  name, 
  slug, 
  icon: Icon, 
  className, 
  consumption, 
  cost, 
  level = "low" 
}: { 
  name: string; 
  slug: string;
  icon: any; 
  className?: string; 
  consumption: string;
  cost: string;
  level?: "low" | "medium" | "high"
}) {
  return (
    <Link 
      href={`/dashboard/comodos/${slug}`}
      className={cn(
        "group relative flex flex-col items-center justify-center gap-2 rounded-xl border border-muted-foreground/20 bg-card p-6 transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99]",
        className
      )}
    >
      <div className={cn(
        "flex size-12 items-center justify-center rounded-full transition-colors",
        getConsumptionColor(level).split(" ")[1], 
        getConsumptionColor(level).split(" ")[0]
      )}>
        <Icon className="size-6" />
      </div>

      <div className="text-center">
        <h3 className="font-semibold text-foreground">{name}</h3>
        <div className="mt-1 flex items-center justify-center gap-1">
          <IconBolt className="size-3 text-muted-foreground" /> 
          <span className="text-sm font-bold">{consumption}</span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Est. {cost}</p>
      </div>
      
      <span className={cn(
        "absolute top-4 right-4 flex size-2.5 rounded-full",
        level === "high" ? "bg-red-500" : level === "medium" ? "bg-yellow-500" : "bg-green-500"
      )}>
        {level === "high" && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
        )}
      </span>
    </Link>
  )
}

// --- Página Principal ---

export default function ComodosPage() {
  function handleAddRoom(e: React.FormEvent) {
    e.preventDefault()
    toast.success("Cômodo adicionado!", {
      description: "O novo ambiente já pode ser monitorado."
    })
  }

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
          
          {/* Cabeçalho com Botão de Adicionar (Sheet) */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Gerenciar Cômodos</h1>
              <p className="text-muted-foreground">
                Visualize e controle seus ambientes.
              </p>
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button className="gap-2">
                  <IconPlus className="size-4" /> Adicionar Cômodo
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Novo Cômodo</SheetTitle>
                  <SheetDescription>
                    Adicione um novo ambiente para monitoramento de energia.
                  </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleAddRoom} className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" placeholder="Ex: Escritório" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="living">Sala</SelectItem>
                        <SelectItem value="bedroom">Quarto</SelectItem>
                        <SelectItem value="kitchen">Cozinha</SelectItem>
                        <SelectItem value="bathroom">Banheiro</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="limit">Limite de Consumo (W)</Label>
                    <Input id="limit" type="number" placeholder="Ex: 500" />
                  </div>
                  <SheetFooter className="mt-4">
                    <SheetClose asChild>
                      <Button type="submit">Salvar</Button>
                    </SheetClose>
                  </SheetFooter>
                </form>
              </SheetContent>
            </Sheet>
          </div>

          {/* Grid de Cômodos */}
          <Card className="overflow-hidden bg-muted/30 border-none shadow-none">
            <CardContent className="px-0">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:grid-rows-3 h-[600px] w-full">
                
                <div className="col-span-2 row-span-2">
                   <RoomCard 
                      name="Sala de Estar" 
                      slug="sala-de-estar"
                      icon={IconArmchair} 
                      consumption="350 W"
                      cost="R$ 0,32/h"
                      level="medium"
                      className="h-full w-full"
                   />
                </div>

                <div className="col-span-1 row-span-2">
                  <RoomCard 
                      name="Cozinha" 
                      slug="cozinha"
                      icon={IconChefHat} 
                      consumption="1.2 kW"
                      cost="R$ 1,10/h"
                      level="high"
                      className="h-full w-full border-red-200 bg-red-50 dark:bg-red-950/20"
                   />
                </div>

                <div className="col-span-1 row-span-1">
                   <RoomCard 
                      name="Banheiro" 
                      slug="banheiro"
                      icon={IconBath} 
                      consumption="0 W"
                      cost="R$ 0,00/h"
                      level="low"
                      className="h-full w-full opacity-70"
                   />
                </div>

                <div className="col-span-1 row-span-1">
                   <RoomCard 
                      name="Suíte Master" 
                      slug="suite-master"
                      icon={IconBed} 
                      consumption="80 W"
                      cost="R$ 0,08/h"
                      level="low"
                      className="h-full w-full"
                   />
                </div>

                <div className="col-span-2 md:col-span-4 row-span-1">
                   <RoomCard 
                      name="Área Externa" 
                      slug="area-externa"
                      icon={IconSun} 
                      consumption="400 W"
                      cost="R$ 0,38/h"
                      level="medium"
                      className="h-full w-full flex-row gap-6"
                   />
                </div>

              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}