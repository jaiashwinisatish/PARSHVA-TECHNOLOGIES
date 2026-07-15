import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  LogOut,
  Mail,
  Briefcase,
  Layers,
  MessageSquare,
  Trash2,
  Download,
  Calendar,
  Building2,
  DollarSign,
  User,
  Phone,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
});

type TabType = "projects" | "contacts" | "newsletter" | "careers";

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState<TabType>("projects");
  const [loading, setLoading] = React.useState(true);
  const [authenticated, setAuthenticated] = React.useState(false);

  // Submissions state
  const [projects, setProjects] = React.useState<any[]>([]);
  const [contacts, setContacts] = React.useState<any[]>([]);
  const [newsletter, setNewsletter] = React.useState<any[]>([]);
  const [careers, setCareers] = React.useState<any[]>([]);

  // Verify Auth Session
  const checkAuth = React.useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Access denied. Please log in first.");
      navigate({ to: "/login" });
      return;
    }
    setAuthenticated(true);
    fetchData();
  }, [navigate]);

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Fetch Data from Supabase
  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        { data: projectsData, error: errProj },
        { data: contactsData, error: errCont },
        { data: newsData, error: errNews },
        { data: careersData, error: errCar },
      ] = await Promise.all([
        supabase.from("project_requests").select("*").order("created_at", { ascending: false }),
        supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
        supabase.from("newsletter").select("*").order("subscribed_at", { ascending: false }),
        supabase.from("careers").select("*").order("created_at", { ascending: false }),
      ]);

      if (errProj) throw errProj;
      if (errCont) throw errCont;
      if (errNews) throw errNews;
      if (errCar) throw errCar;

      setProjects(projectsData || []);
      setContacts(contactsData || []);
      setNewsletter(newsData || []);
      setCareers(careersData || []);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Sign out Handler
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Successfully logged out");
      navigate({ to: "/login" });
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to log out");
    }
  };

  // Delete Handler
  const handleDelete = async (table: string, id: string, listSetter: React.Dispatch<React.SetStateAction<any[]>>) => {
    if (!window.confirm("Are you sure you want to permanently delete this submission?")) return;

    try {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;

      listSetter((prev) => prev.filter((item) => item.id !== id));
      toast.success("Submission deleted successfully");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to delete record: " + err.message);
    }
  };

  // Signed URL Downloader for Resumes
  const handleDownloadResume = async (resumePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("resumes")
        .createSignedUrl(resumePath, 300); // 5 min expiry

      if (error) throw error;

      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank");
      } else {
        throw new Error("No download URL generated");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to download resume: " + err.message);
    }
  };

  // Formatter for UTC strings
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Header Bar */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="grid h-8 w-8 place-items-center rounded-lg text-primary-foreground"
              style={{ background: "var(--gradient-accent)" }}
            >
              <span className="font-display text-lg font-bold">P</span>
            </span>
            <div>
              <h1 className="font-display text-sm font-semibold tracking-[0.18em]">
                PARSHVA <span className="text-muted-foreground">TECHNOLOGIES</span>
              </h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider -mt-0.5">
                Venture Studio Dashboard
              </p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors cursor-pointer border border-border/30 rounded-xl px-4 py-2 hover:bg-secondary/20"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Dashboard Space */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-6 py-10 flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-2">
          <h2 className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4 px-3 font-sans font-semibold">
            Manage Entries
          </h2>
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all cursor-pointer ${
              activeTab === "projects"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/20"
            }`}
          >
            <span className="flex items-center gap-3">
              <Layers className="h-4 w-4" />
              Project Requests
            </span>
            <span className="text-xs font-semibold bg-accent/20 text-accent rounded-full px-2 py-0.5 border border-accent/20">
              {projects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("contacts")}
            className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all cursor-pointer ${
              activeTab === "contacts"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/20"
            }`}
          >
            <span className="flex items-center gap-3">
              <MessageSquare className="h-4 w-4" />
              General Inquiries
            </span>
            <span className="text-xs font-semibold bg-accent/20 text-accent rounded-full px-2 py-0.5 border border-accent/20">
              {contacts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("careers")}
            className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all cursor-pointer ${
              activeTab === "careers"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/20"
            }`}
          >
            <span className="flex items-center gap-3">
              <Briefcase className="h-4 w-4" />
              Careers Applications
            </span>
            <span className="text-xs font-semibold bg-accent/20 text-accent rounded-full px-2 py-0.5 border border-accent/20">
              {careers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("newsletter")}
            className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all cursor-pointer ${
              activeTab === "newsletter"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/20"
            }`}
          >
            <span className="flex items-center gap-3">
              <Mail className="h-4 w-4" />
              Newsletter List
            </span>
            <span className="text-xs font-semibold bg-accent/20 text-accent rounded-full px-2 py-0.5 border border-accent/20">
              {newsletter.length}
            </span>
          </button>
        </aside>

        {/* Content Area */}
        <section className="flex-1 min-w-0">
          <div className="rounded-3xl border border-border/40 bg-card/40 p-6 backdrop-blur-xl shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/20">
              <div>
                <h3 className="font-editorial text-2xl font-semibold capitalize tracking-tight text-gradient">
                  {activeTab.replace("-", " ")} Submissions
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Showing list of all records received from the Parshva Technologies website.
                </p>
              </div>
              <Button
                onClick={fetchData}
                disabled={loading}
                variant="outline"
                className="rounded-xl border border-border/30 px-4 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/20"
              >
                {loading ? <Loader2 className="h-3 w-3 animate-spin mr-1.5" /> : null}
                Refresh Data
              </Button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-accent mb-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Loading Submissions...
                </span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {/* 1. PROJECTS TAB */}
                {activeTab === "projects" && (
                  projects.length === 0 ? (
                    <p className="text-sm text-center text-muted-foreground py-10">No project requests found.</p>
                  ) : (
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="border-b border-border/10 text-xs font-semibold uppercase text-muted-foreground tracking-wider pb-3">
                          <th className="py-3 px-4">Contact</th>
                          <th className="py-3 px-4">Details</th>
                          <th className="py-3 px-4">Budget</th>
                          <th className="py-3 px-4">Submitted</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map((p) => (
                          <tr key={p.id} className="border-b border-border/5 hover:bg-secondary/5 text-sm transition-all">
                            <td className="py-4 px-4 font-medium">
                              <div className="flex items-center gap-2">
                                <User className="h-3.5 w-3.5 text-accent shrink-0" />
                                <span>{p.name}</span>
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                <Mail className="h-3 w-3" />
                                <span>{p.email}</span>
                              </div>
                              {p.company && (
                                <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                  <Building2 className="h-3 w-3" />
                                  <span>{p.company}</span>
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-4 max-w-sm">
                              <span className="inline-block text-xs font-semibold uppercase bg-secondary px-2 py-0.5 rounded-lg border border-border/20 mb-1.5">
                                {p.service}
                              </span>
                              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                                {p.project_details}
                              </p>
                            </td>
                            <td className="py-4 px-4">
                              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-accent/15 text-accent rounded-lg border border-accent/20 px-2 py-0.5">
                                <DollarSign className="h-3 w-3" />
                                {p.budget}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5 shrink-0" />
                                <span>{formatDate(p.created_at)}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <button
                                onClick={() => handleDelete("project_requests", p.id, setProjects)}
                                className="text-destructive hover:bg-destructive/10 p-2 rounded-xl transition-all cursor-pointer inline-flex"
                                title="Delete record"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )
                )}

                {/* 2. CONTACT MESSAGES TAB */}
                {activeTab === "contacts" && (
                  contacts.length === 0 ? (
                    <p className="text-sm text-center text-muted-foreground py-10">No general inquiries found.</p>
                  ) : (
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="border-b border-border/10 text-xs font-semibold uppercase text-muted-foreground tracking-wider pb-3">
                          <th className="py-3 px-4">Contact</th>
                          <th className="py-3 px-4">Message</th>
                          <th className="py-3 px-4">Interest</th>
                          <th className="py-3 px-4">Submitted</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contacts.map((c) => (
                          <tr key={c.id} className="border-b border-border/5 hover:bg-secondary/5 text-sm transition-all">
                            <td className="py-4 px-4 font-medium">
                              <div className="flex items-center gap-2">
                                <User className="h-3.5 w-3.5 text-accent shrink-0" />
                                <span>{c.full_name}</span>
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                <Mail className="h-3 w-3" />
                                <span>{c.email}</span>
                              </div>
                              {c.phone && (
                                <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                  <Phone className="h-3 w-3" />
                                  <span>{c.phone}</span>
                                </div>
                              )}
                              {c.company && (
                                <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                  <Building2 className="h-3 w-3" />
                                  <span>{c.company}</span>
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-4 max-w-sm">
                              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                                {c.message}
                              </p>
                            </td>
                            <td className="py-4 px-4">
                              {c.service ? (
                                <span className="inline-block text-xs font-semibold uppercase bg-secondary px-2 py-0.5 rounded-lg border border-border/20">
                                  {c.service}
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5 shrink-0" />
                                <span>{formatDate(c.created_at)}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <button
                                onClick={() => handleDelete("contact_messages", c.id, setContacts)}
                                className="text-destructive hover:bg-destructive/10 p-2 rounded-xl transition-all cursor-pointer inline-flex"
                                title="Delete record"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )
                )}

                {/* 3. CAREERS APPLICATIONS TAB */}
                {activeTab === "careers" && (
                  careers.length === 0 ? (
                    <p className="text-sm text-center text-muted-foreground py-10">No applications found.</p>
                  ) : (
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="border-b border-border/10 text-xs font-semibold uppercase text-muted-foreground tracking-wider pb-3">
                          <th className="py-3 px-4">Applicant</th>
                          <th className="py-3 px-4">Cover Letter</th>
                          <th className="py-3 px-4">Resume</th>
                          <th className="py-3 px-4">Applied At</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {careers.map((c) => (
                          <tr key={c.id} className="border-b border-border/5 hover:bg-secondary/5 text-sm transition-all">
                            <td className="py-4 px-4 font-medium">
                              <div className="flex items-center gap-2">
                                <User className="h-3.5 w-3.5 text-accent shrink-0" />
                                <span>{c.name}</span>
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                <Mail className="h-3 w-3" />
                                <span>{c.email}</span>
                              </div>
                              <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                <Phone className="h-3 w-3" />
                                <span>{c.phone}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 max-w-xs">
                              {c.cover_letter ? (
                                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                                  {c.cover_letter}
                                </p>
                              ) : (
                                <span className="text-xs text-muted-foreground italic">None provided</span>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              <button
                                onClick={() => handleDownloadResume(c.resume_url)}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-2 transition-colors cursor-pointer border border-accent/20 rounded-lg bg-accent/5 px-2.5 py-1.5 hover:bg-accent/10"
                              >
                                <Download className="h-3.5 w-3.5" />
                                Download Resume
                              </button>
                            </td>
                            <td className="py-4 px-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5 shrink-0" />
                                <span>{formatDate(c.created_at)}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <button
                                onClick={async () => {
                                  // Delete DB entry and also try to delete storage object
                                  if (window.confirm("Are you sure you want to permanently delete this application?")) {
                                    try {
                                      // Delete storage file
                                      await supabase.storage.from("resumes").remove([c.resume_url]);
                                      // Delete db
                                      const { error } = await supabase.from("careers").delete().eq("id", c.id);
                                      if (error) throw error;
                                      setCareers((prev) => prev.filter((item) => item.id !== c.id));
                                      toast.success("Application deleted successfully");
                                    } catch (err: any) {
                                      toast.error("Failed to delete application: " + err.message);
                                    }
                                  }
                                }}
                                className="text-destructive hover:bg-destructive/10 p-2 rounded-xl transition-all cursor-pointer inline-flex"
                                title="Delete record"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )
                )}

                {/* 4. NEWSLETTER TAB */}
                {activeTab === "newsletter" && (
                  newsletter.length === 0 ? (
                    <p className="text-sm text-center text-muted-foreground py-10">No newsletter subscribers found.</p>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-border/10 text-xs font-semibold uppercase text-muted-foreground tracking-wider pb-3">
                          <th className="py-3 px-4">Email Address</th>
                          <th className="py-3 px-4">Subscribed At</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {newsletter.map((n) => (
                          <tr key={n.id} className="border-b border-border/5 hover:bg-secondary/5 text-sm transition-all">
                            <td className="py-4 px-4 font-medium">
                              <div className="flex items-center gap-2">
                                <Mail className="h-3.5 w-3.5 text-accent shrink-0" />
                                <span>{n.email}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-xs text-muted-foreground font-medium">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5 shrink-0" />
                                <span>{formatDate(n.subscribed_at)}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <button
                                onClick={() => handleDelete("newsletter", n.id, setNewsletter)}
                                className="text-destructive hover:bg-destructive/10 p-2 rounded-xl transition-all cursor-pointer inline-flex"
                                title="Unsubscribe"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
