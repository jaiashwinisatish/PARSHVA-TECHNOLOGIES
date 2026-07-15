import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [checkingSession, setCheckingSession] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Check active session on mount
  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate({ to: "/admin" });
      } else {
        setCheckingSession(false);
      }
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.session) {
        toast.success("Successfully logged in!");
        navigate({ to: "/admin" });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Invalid login credentials");
      toast.error("Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
      {/* Aurora glow */}
      <div
        aria-hidden
        className="animate-aurora absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        style={{ background: "oklch(0.72 0.08 80 / 0.08)" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--background)_85%)]" />

      <div className="relative w-full max-w-md rounded-3xl border border-border/40 bg-card/60 p-8 shadow-[var(--shadow-float)] backdrop-blur-xl">
        <div className="flex flex-col items-center mb-8">
          <div
            className="grid h-10 w-10 place-items-center rounded-xl text-primary-foreground mb-4"
            style={{ background: "var(--gradient-accent)" }}
          >
            <span className="font-display text-xl font-bold">P</span>
          </div>
          <h2 className="font-editorial text-3xl font-semibold text-gradient">Admin Access</h2>
          <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">
            Parshva Technologies
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border/30 bg-secondary/10 px-4 py-3 text-sm transition-all focus:border-accent/50 focus:bg-background focus:outline-none"
              placeholder="admin@parshva.tech"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border/30 bg-secondary/10 px-4 py-3 text-sm transition-all focus:border-accent/50 focus:bg-background focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/95 text-primary-foreground py-3 rounded-xl transition-all cursor-pointer font-medium"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Verifying...
              </span>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to website
          </a>
        </div>
      </div>
    </div>
  );
}
