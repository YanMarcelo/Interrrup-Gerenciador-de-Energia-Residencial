"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconArrowRight, IconBolt, IconLeaf, IconUsers, IconChevronLeft, IconChevronRight } from "@tabler/icons-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

// ... (Mantenha o código dos membros/carrossel igual, vou omitir aqui para economizar espaço) ...
const members = [
  {
    name: "Yan Marcelo",
    role: "Desenvolvedor Fullstack",
    image: "https://github.com/shadcn.png",
    description: "Líder técnico focado na arquitetura escalável e experiência do usuário."
  },
  {
    name: "Membro 2",
    role: "Engenheiro de Dados",
    image: "https://github.com/vercel.png",
    description: "Responsável pela lógica de análise de consumo e otimização de algoritmos."
  },
  {
    name: "Membro 3",
    role: "UI/UX Designer",
    image: "https://github.com/nextjs.png",
    description: "Criativo por trás da interface intuitiva e acessível do Interrup."
  },
  {
    name: "Membro 4",
    role: "Backend Developer",
    image: "https://github.com/reactjs.png",
    description: "Especialista em segurança e integração de dispositivos IoT."
  }
]

function TeamCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % members.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + members.length) % members.length)
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div 
          className="flex transition-transform duration-500 ease-in-out" 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {members.map((member, index) => (
            <div key={index} className="w-full flex-shrink-0 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
               <div className="relative size-32 md:size-40 shrink-0 overflow-hidden rounded-full border-4 border-primary/10">
                  <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
               </div>
               <div className="text-center md:text-left space-y-2">
                  <h3 className="text-2xl font-bold">{member.name}</h3>
                  <p className="text-sm font-medium text-primary">{member.role}</p>
                  <p className="text-muted-foreground leading-relaxed max-w-md">
                    "{member.description}"
                  </p>
               </div>
            </div>
          ))}
        </div>
      </div>
      <Button variant="outline" size="icon" className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 rounded-full shadow-lg bg-background hover:bg-accent" onClick={prevSlide}>
        <IconChevronLeft className="size-5" />
      </Button>
      <Button variant="outline" size="icon" className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 rounded-full shadow-lg bg-background hover:bg-accent" onClick={nextSlide}>
        <IconChevronRight className="size-5" />
      </Button>
      <div className="flex justify-center gap-2 mt-4">
        {members.map((_, idx) => (
          <button key={idx} onClick={() => setCurrentIndex(idx)} className={cn("size-2.5 rounded-full transition-colors", idx === currentIndex ? "bg-primary" : "bg-primary/20 hover:bg-primary/40")} />
        ))}
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
             <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground overflow-hidden">
                <img src="/favicon.ico" alt="Logo" className="size-5 object-contain invert brightness-0" />
             </div>
             Interrup
          </div>
          <nav className="flex items-center gap-4">
            {/* LINK CORRIGIDO: Vai para Login */}
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
               Entrar no Sistema
            </Link>
            {/* LINK CORRIGIDO: Vai para Cadastro */}
            <Button asChild>
               <Link href="/cadastro">Começar Agora</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 md:py-32 text-center container mx-auto px-6">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-primary/10 text-primary hover:bg-primary/20 mb-6">
               Inovação em IoT Residencial
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto">
               Controle Inteligente para um <br/>
               <span className="text-primary">Futuro Sustentável</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
               O Interrup não é apenas um painel de controle. É a solução definitiva para monitorar, gerenciar e economizar energia na sua residência.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               {/* LINK CORRIGIDO: Vai para Login */}
               <Button size="lg" className="h-12 px-8 text-base gap-2" asChild>
                  <Link href="/login">
                    Acessar Dashboard <IconArrowRight className="size-4" />
                  </Link>
               </Button>
               <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                  Saiba Mais
               </Button>
            </div>
        </section>

        {/* ... (Seções Sobre Nós e Equipe mantidas iguais) ... */}
        <section className="py-20 bg-muted/30">
           <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                 <h2 className="text-3xl font-bold tracking-tight">Por que criamos o Interrup?</h2>
                 <p className="text-muted-foreground leading-relaxed">
                    Em um mundo onde a eficiência energética é crucial, percebemos que a maioria das casas inteligentes focava apenas em "ligar e desligar" luzes. Faltava inteligência real.
                 </p>
                 <p className="text-muted-foreground leading-relaxed">
                    Nossa missão é <strong>democratizar o controle de consumo</strong>. Criamos uma plataforma que traduz dados complexos (kWh) em informações úteis (Reais), ajudando famílias a reduzirem seus gastos e seu impacto ambiental sem perder o conforto.
                 </p>
                 <div className="flex gap-4 pt-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <IconLeaf className="text-green-500 size-5" /> Sustentabilidade
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <IconBolt className="text-yellow-500 size-5" /> Economia Real
                    </div>
                 </div>
              </div>
              <div className="relative h-[400px] rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border flex items-center justify-center overflow-hidden">
                 <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
                 <img src="/favicon.ico" alt="Logo Grande" className="size-32 opacity-20 animate-pulse object-contain" />
              </div>
           </div>
        </section>

        <section className="py-24 container mx-auto px-6">
           <div className="text-center mb-12">
              <div className="mx-auto bg-primary/10 w-fit p-3 rounded-full mb-4">
                 <IconUsers className="size-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Quem faz acontecer</h2>
              <p className="text-muted-foreground">Conheça as mentes por trás do projeto.</p>
           </div>
           <TeamCarousel />
        </section>
      </main>

      <footer className="border-t py-8 bg-muted/10">
         <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Interrup Inc. Todos os direitos reservados.</p>
         </div>
      </footer>
    </div>
  )
}