import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  IconBolt, 
  IconTrendingUp,
  IconArmchair,
  IconChefHat,
  IconBath,
  IconBed,
  IconSun,
  IconAlertTriangle,
  IconChartBar
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

// --- Componente MapRoom Atualizado ---
// Agora aceita 'consumption' e mostra o valor no card
function MapRoom({ name, icon: Icon, consumption, colorClass, className }: any) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-1.5 rounded-lg border bg-muted/20 p-4 text-center transition-colors hover:bg-muted/40", className)}>
      <div className={cn("flex size-8 items-center justify-center rounded-full bg-background shadow-sm mb-1", colorClass)}>
        <Icon className="size-4" />
      </div>
      <span className="text-xs font-medium text-muted-foreground leading-none">{name}</span>
      {/* Exibição do Consumo na Planta */}
      <div className="flex items-center gap-1 mt-1 bg-background/50 px-2 py-0.5 rounded-full border border-black/5 dark:border-white/5">
        <IconBolt className="size-3 text-foreground/70" />
        <span className="text-sm font-bold text-foreground">{consumption}</span>
      </div>
    </div>
  )
}

export default function Page() {
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
            <h1 className="text-3xl font-bold tracking-tight">Visão Geral da Residência</h1>
            <p className="text-muted-foreground">
              Monitoramento de consumo energético por ambiente.
            </p>
          </div>

          {/* KPIs Gerais */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Consumo Atual</CardTitle>
                <IconBolt className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.45 kW</div>
                <p className="text-xs text-muted-foreground">Somatório de todos os cômodos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Custo Estimado (Mês)</CardTitle>
                <IconTrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 280,50</div>
                <p className="text-xs text-muted-foreground">Baseado na tarifa atual</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Maior Gasto Agora</CardTitle>
                <IconAlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Cozinha</div>
                <p className="text-xs text-muted-foreground">Representa 48% do total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Média Diária</CardTitle>
                <IconChartBar className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18 kWh</div>
                <p className="text-xs text-muted-foreground">Estável vs. semana passada</p>
              </CardContent>
            </Card>
          </div>

          {/* Planta Baixa com Consumo */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Planta da Casa</CardTitle>
              <CardDescription>Visualização do consumo em tempo real por cômodo.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:grid-rows-2 h-[400px] w-full">
                  
                  <MapRoom 
                    name="Sala de Estar" 
                    icon={IconArmchair}
                    consumption="350 W" 
                    className="col-span-2 row-span-2 bg-blue-50/50 dark:bg-blue-900/10"
                    colorClass="text-blue-500"
                  />

                  <MapRoom 
                    name="Cozinha" 
                    icon={IconChefHat}
                    consumption="1.2 kW" 
                    className="col-span-1 row-span-2 bg-orange-50/50 dark:bg-orange-900/10"
                    colorClass="text-orange-500"
                  />

                  <MapRoom 
                    name="Suíte Master" 
                    icon={IconBed}
                    consumption="80 W" 
                    className="col-span-1 row-span-1 bg-purple-50/50 dark:bg-purple-900/10"
                    colorClass="text-purple-500"
                  />

                  <div className="col-span-1 row-span-1 grid grid-cols-2 gap-4">
                     <MapRoom 
                        name="Banheiro" 
                        icon={IconBath}
                        consumption="0 W" 
                        className="col-span-1 bg-cyan-50/50 dark:bg-cyan-900/10"
                        colorClass="text-cyan-500"
                      />
                       <MapRoom 
                        name="Jardim" 
                        icon={IconSun}
                        consumption="400 W" 
                        className="col-span-1 bg-green-50/50 dark:bg-green-900/10"
                        colorClass="text-green-500"
                      />
                  </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}