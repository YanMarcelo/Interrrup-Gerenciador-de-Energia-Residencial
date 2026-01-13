"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { toast } from "sonner"

// Tipos
export type SensorData = {
  tensao: number
  corrente: number
  potencia: number
  isConnected: boolean // Diz se é dado real ou simulado
}

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
  sensorData: SensorData // <--- DADO GLOBAL DO ESP32
  isLoading: boolean
  addRoom: (room: Omit<Room, "id" | "slug" | "consumption" | "level">) => void
  removeRoom: (id: string) => void
  getRoomBySlug: (slug: string) => Room | undefined
}

const RoomContext = createContext<RoomContextType | undefined>(undefined)

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // ESTADO GLOBAL DO SENSOR (Começa zerado)
  const [sensorData, setSensorData] = useState<SensorData>({
    tensao: 0,
    corrente: 0,
    potencia: 0,
    isConnected: false
  })

  // -----------------------------------------------------------
  // CONFIGURAÇÃO DO IP (Coloque o IP do seu ESP32 aqui)
  // -----------------------------------------------------------
  const ESP32_IP = "http://192.168.1.15"; 

  // 1. Carregar Lista de Cômodos
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("interrup-rooms")
      if (saved) {
        setRooms(JSON.parse(saved))
      } else {
        setRooms([
          { id: "1", name: "Sala Principal", slug: "sala-principal", type: "living", consumption: "---", level: "medium" },
        ])
      }
      setIsLoading(false)
    }
  }, [])

  // 2. Salvar Lista de Cômodos
  useEffect(() => {
    if (typeof window !== "undefined" && !isLoading) {
        localStorage.setItem("interrup-rooms", JSON.stringify(rooms))
    }
  }, [rooms, isLoading])

  // 3. BUSCAR DADOS DO ESP32 (Polling Global)
  useEffect(() => {
    const fetchData = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 800); // 800ms timeout

      try {
        // Tenta conectar no ESP32
        const response = await fetch(`${ESP32_IP}/api/leitura`, { 
            signal: controller.signal 
        });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error("Erro HTTP");
        
        const data = await response.json();
        
        // SUCESSO: Atualiza com dados reais
        setSensorData({
            tensao: data.tensao,
            corrente: data.corrente,
            potencia: data.potencia,
            isConnected: true
        });

      } catch (error) {
        // FALHA: Entra no Modo Simulação (Para você apresentar o projeto)
        // Gera valores matemáticos que "parecem" reais
        const tensaoSim = 127 + (Math.random() * 3 - 1.5); 
        const correnteSim = Math.random() * 8; 
        const potenciaSim = Math.floor(tensaoSim * correnteSim);

        setSensorData({
            tensao: parseFloat(tensaoSim.toFixed(1)),
            corrente: parseFloat(correnteSim.toFixed(2)),
            potencia: potenciaSim,
            isConnected: false // Marca que está simulando
        });
      }
    }

    fetchData(); // Chama na hora
    const interval = setInterval(fetchData, 2000); // Repete a cada 2s

    return () => clearInterval(interval);
  }, []);

  // --- Funções de Gerenciamento ---
  const addRoom = (newRoomData: { name: string, type: string }) => {
    const slug = newRoomData.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "")
    
    if (rooms.some(r => r.slug === slug)) {
        toast.error("Já existe um cômodo com esse nome!"); return;
    }

    const newRoom: Room = {
      id: crypto.randomUUID(),
      slug,
      consumption: "---", 
      level: "low",
      ...newRoomData
    }
    setRooms((prev) => [...prev, newRoom])
    toast.success("Cômodo adicionado!")
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
    <RoomContext.Provider value={{ rooms, sensorData, isLoading, addRoom, removeRoom, getRoomBySlug }}>
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