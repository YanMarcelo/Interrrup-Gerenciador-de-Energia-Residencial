"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  IconArmchair, 
  IconBath, 
  IconBed, 
  IconBolt, 
  IconChefHat, 
  IconPlus, 
  IconSun,
  IconTrash,
  IconBox,
  IconX
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRooms } from "@/contexts/room-context"

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
    case "living": return "text-blue-600 bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
    case "kitchen": return "text-orange-600 bg-orange-100 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800";
    case "bedroom": return "text-purple-600 bg-purple-100 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800";
    case "bathroom": return "text-cyan-600 bg-cyan-100 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-400 dark:border-cyan-800";
    case "outdoor": return "text-green-600 bg-green-100 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
    default: return "text-slate-600 bg-slate-100 border-slate-200 dark:bg-slate-800 dark:text-slate-400";
  }
}

function RoomCard({ room, onDelete }: { room: any, onDelete: () => void }) {
  const Icon = getIconByType(room.type)
  const colorClass = getRoomTypeColor(room.type)

  return (
    // ADICIONADO: h-48 para altura fixa e w-full para preencher a grid
    <div className="group relative flex flex-col items-center justify-center rounded-xl border border-muted-foreground/20 bg-card transition-all hover:shadow-lg hover:border-primary/50 hover:scale-[1.02] h-48 w-full">
        <Link 
          href={`/dashboard/comodos/${room.slug}`}
          className="flex h-full w-full flex-col items-center justify-center gap-4 p-6"
        >
          <div className={cn(
            "flex size-14 shrink-0 items-center justify-center rounded-full transition-colors border",
            colorClass
          )}>
            <Icon className="size-7" />
          </div>

          <div className="text-center w-full space-y-1">
            {/* ADICIONADO: truncate para não quebrar linha e px-2 para margem lateral */}
            <h3 className="font-semibold text-lg text-foreground truncate px-2 w-full" title={room.name}>
                {room.name}
            </h3>
            <div className="pt-1 flex items-center justify-center gap-1">
              <IconBolt className="size-4 text-muted-foreground" /> 
              <span className="text-sm font-bold">{room.consumption}</span>
            </div>
          </div>
        </Link>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onDelete();
          }}
          className="absolute top-3 right-3 rounded-full p-2 text-muted-foreground opacity-0 hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100 transition-all"
          title="Excluir cômodo"
        >
          <IconTrash className="size-5" />
        </button>
    </div>
  )
}

export default function ComodosPage() {
  const { rooms, addRoom, removeRoom } = useRooms()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const [newType, setNewType] = useState("")

  function handleAddRoom(e: React.FormEvent) {
    e.preventDefault()
    if (!newName || !newType) return
    addRoom({ name: newName, type: newType })
    setNewName("")
    setNewType("")
    setIsModalOpen(false)
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
        
        <div className="flex flex-1 flex-col gap-8 p-6 md:p-10 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold tracking-tight">Meus Cômodos</h1>
              <p className="text-muted-foreground">
                Gerencie as áreas da sua residência.
              </p>
            </div>
            
            <Button 
                onClick={() => setIsModalOpen(true)}
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
                <IconPlus className="size-4" /> Adicionar Cômodo
            </Button>
          </div>

          {/* Grid responsiva garantindo simetria */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
               {rooms.map(room => (
                   <RoomCard 
                      key={room.id}
                      room={room}
                      onDelete={() => removeRoom(room.id)}
                   />
               ))}
               {rooms.length === 0 && (
                   <div className="col-span-full flex flex-col items-center justify-center py-16 text-muted-foreground border-2 border-dashed rounded-xl bg-muted/30 h-48">
                       <p>Nenhuma área cadastrada.</p>
                       <Button variant="link" onClick={() => setIsModalOpen(true)}>Adicionar a primeira área</Button>
                   </div>
               )}
          </div>
        </div>

        {/* Modal Centralizado */}
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="w-full max-w-md bg-background rounded-xl border shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
                    
                    <button 
                        onClick={() => setIsModalOpen(false)} 
                        className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <IconX className="size-5" />
                    </button>

                    <div className="mb-6">
                        <h2 className="text-xl font-bold">Adicionar Novo Ambiente</h2>
                        <p className="text-sm text-muted-foreground">Preencha os dados da nova área.</p>
                    </div>

                    <form onSubmit={handleAddRoom} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome da Área</Label>
                            <Input 
                                id="name" 
                                placeholder="Ex: Escritório, Varanda..." 
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Tipo de Ícone</Label>
                            <Select onValueChange={setNewType} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="living">Sala de Estar</SelectItem>
                                    <SelectItem value="bedroom">Quarto</SelectItem>
                                    <SelectItem value="kitchen">Cozinha</SelectItem>
                                    <SelectItem value="bathroom">Banheiro</SelectItem>
                                    <SelectItem value="outdoor">Área Externa</SelectItem>
                                    <SelectItem value="other">Outro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit">
                                Salvar Área
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        )}

      </SidebarInset>
    </SidebarProvider>
  )
}