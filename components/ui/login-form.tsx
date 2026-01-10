import { cn } from "@/lib/utils";
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

export function LoginForm({
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
                <h1 className="text-2xl text-[var(--primary-color)] font-bold">
                  Bem-vindo de volta !
                </h1>
                <p className="text-muted-foreground text-balance">
                  Não perca a energia, fazemos as contas para você ;)
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Esqueceu sua senha?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </Field>
              <Field>
                <Button
                  className="bg-[var(--primary-color)] hover:bg-slate-950"
                  type="submit"
                >
                  <a className="w-full" href="/dashboard">
                    Login
                  </a>
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Não tem uma conta? <a href="/signup">Cadastre-se</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="flex h-full w-full items-center justify-center bg-[var(--primary-color)] rounded-xl">
            <img src="icon.png" alt="icone" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
