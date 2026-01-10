"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { toast } from "sonner"

export type Room = {
  id: string
  name: string
  slug: string
  type: string
  consumption: string 
  level: "low" | "medium" | "high"
}

interface RoomContextType {
  rooms: Room[]
  isLoading: boolean
  addRoom: (room: Omit<Room, "id" | "slug" | "consumption" | "level">) => void
  removeRoom: (id: string) => void
  getRoomBySlug: (slug: string) => Room | undefined
}

const RoomContext = createContext<RoomContextType | undefined>(undefined)

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("interrup-rooms")
      if (saved) {
        setRooms(JSON.parse(saved))
      } else {
        setRooms([
          { id: "1", name: "Sala de Estar", slug: "sala-de-estar", type: "living", consumption: "350 W", level: "medium" },
          { id: "2", name: "Cozinha", slug: "cozinha", type: "kitchen", consumption: "1.2 kW", level: "high" },
        ])
      }
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && !isLoading) {
        localStorage.setItem("interrup-rooms", JSON.stringify(rooms))
    }
  }, [rooms, isLoading])

  const addRoom = (newRoomData: { name: string, type: string }) => {
    // 1. Gera o Slug
    const slug = newRoomData.name
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")

    // 2. VERIFICAÇÃO DE DUPLICIDADE (NOVO)
    // Se já existir um slug igual, para tudo e avisa o usuário.
    const exists = rooms.some(r => r.slug === slug);
    if (exists) {
        toast.error("Já existe um cômodo com esse nome!", {
            description: "Tente usar um nome diferente (ex: Quarto 2)."
        })
        return; // Interrompe a função aqui
    }

    const randomCons = Math.floor(Math.random() * 500) + 50
    const level = randomCons > 400 ? "high" : randomCons > 200 ? "medium" : "low"

    const newRoom: Room = {
      id: crypto.randomUUID(),
      slug,
      consumption: `${randomCons} W`,
      level: level as "low" | "medium" | "high",
      ...newRoomData
    }

    setRooms((prev) => [...prev, newRoom])
    toast.success("Cômodo adicionado com sucesso!")
  }

  const removeRoom = (id: string) => {
    setRooms((prev) => prev.filter((room) => room.id !== id))
    toast.success("Cômodo removido.")
  }

  const getRoomBySlug = (slug: string) => {
    const normalizedSlug = decodeURIComponent(slug).toLowerCase();
    return rooms.find((r) => r.slug === normalizedSlug)
  }

  return (
    <RoomContext.Provider value={{ rooms, isLoading, addRoom, removeRoom, getRoomBySlug }}>
      {children}
    </RoomContext.Provider>
  )
}

export function useRooms() {
  const context = useContext(RoomContext)
  if (context === undefined) {
    throw new Error("useRooms deve ser usado dentro de um RoomProvider")
  }
  return context
}