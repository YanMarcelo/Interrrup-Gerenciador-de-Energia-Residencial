import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="flex h-full w-full items-center justify-center grid p-0 md:grid-cols-2 h-[688px]">
          <form className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Crie sua conta</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Digite seu e-mail abaixo para criar sua conta
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@exemplo.com"
                  required
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Senha</FieldLabel>
                    <Input id="password" type="password" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirmar Senha
                    </FieldLabel>
                    <Input id="confirm-password" type="password" required />
                  </Field>
                </Field>
                <FieldDescription>
                  Deve ter pelo menos 8 caracteres.
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit">Criar Conta</Button>
              </Field>
              <FieldDescription className="text-center">
                Já tem uma conta? <a href="/">Entrar</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="flex h-full w-full items-center justify-center bg-[var(--primary-color)] rounded-xl">
            <img src="icon2.png" alt="icone" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
