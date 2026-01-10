"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconHome,
  IconLayoutGrid,
  IconChartHistogram,
  // IconBolt (Pode remover se não for usar em outros lugares)
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Yan Marcelo",
    email: "yan@exemplo.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Visão Geral",
      url: "/dashboard",
      icon: IconHome,
    },
    {
      title: "Cômodos",
      url: "/dashboard/comodos",
      icon: IconLayoutGrid,
    },
    {
      title: "Estatísticas",
      url: "/dashboard/estatisticas",
      icon: IconChartHistogram,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  {/* AQUI: Trocamos o IconBolt pela sua imagem */}
                  {/* Se seu arquivo for .png, troque /favicon.ico por /seu-logo.png */}
                  <img 
                    src="/favicon.ico" 
                    alt="Logo" 
                    className="size-5 object-contain invert brightness-0" // "invert" deixa branco se o ícone for preto
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Interrup</span>
                  <span className="truncate text-xs">Gerenciador de Energia</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}