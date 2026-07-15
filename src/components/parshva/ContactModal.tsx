import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, UploadCloud, CheckCircle2, AlertCircle } from "lucide-react";
import { useContactModal } from "@/context/ContactModalContext";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

// ----------------- Validation Schemas -----------------

const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

const projectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  service: z.string().min(1, "Please select a service"),
  budget: z.string().min(1, "Please select a budget range"),
  project_details: z.string().min(10, "Please provide some more details about your project"),
});

const messageSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(phoneRegex, "Invalid phone number format").or(z.literal("")),
  company: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const careerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(phoneRegex, "Invalid phone number format"),
  cover_letter: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;
type MessageFormData = z.infer<typeof messageSchema>;
type CareerFormData = z.infer<typeof careerSchema>;

// ----------------- Services and Budgets -----------------

const SERVICES = [
  "Venture Studio",
  "Custom Web Application",
  "Mobile App Development",
  "AI & Advanced Analytics",
  "Cloud & DevOps Infrastructure",
  "UI/UX Digital Design",
  "Other Consulting",
];

const BUDGETS = [
  "Under $10,000",
  "$10,000 - $25,000",
  "$25,000 - $50,000",
  "$50,000 - $100,000",
  "$100,000+",
];

export function ContactModal() {
  const { isOpen, activeTab, closeModal, setActiveTab } = useContactModal();
  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [resumeFile, setResumeFile] = React.useState<File | null>(null);
  const [resumeError, setResumeError] = React.useState<string | null>(null);

  // Forms
  const projectForm = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: { name: "", email: "", company: "", service: "", budget: "", project_details: "" },
  });

  const messageForm = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: { full_name: "", email: "", phone: "", company: "", service: "", message: "" },
  });

  const careerForm = useForm<CareerFormData>({
    resolver: zodResolver(careerSchema),
    defaultValues: { name: "", email: "", phone: "", cover_letter: "" },
  });

  // Reset states when modal is opened/closed
  React.useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setSuccess(false);
        setSubmitting(false);
        setResumeFile(null);
        setResumeError(null);
        projectForm.reset();
        messageForm.reset();
        careerForm.reset();
      }, 300);
    }
  }, [isOpen, projectForm, messageForm, careerForm]);

  // Handle Resume Drop/Change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setResumeError("File size must be under 10MB");
      setResumeFile(null);
      return;
    }

    // Validate type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      setResumeError("Only PDF, DOC, and DOCX files are allowed");
      setResumeFile(null);
      return;
    }

    setResumeError(null);
    setResumeFile(file);
  };

  // Submit Handlers
  const onProjectSubmit = async (data: ProjectFormData) => {
    setSubmitting(true);
    try {
      const { error } = await supabase.from("project_requests").insert([
        {
          name: data.name,
          email: data.email,
          company: data.company || null,
          service: data.service,
          budget: data.budget,
          project_details: data.project_details,
        },
      ]);

      if (error) throw error;
      setSuccess(true);
      toast.success("Consultation request submitted successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const onMessageSubmit = async (data: MessageFormData) => {
    setSubmitting(true);
    try {
      const { error } = await supabase.from("contact_messages").insert([
        {
          full_name: data.full_name,
          email: data.email,
          phone: data.phone || null,
          company: data.company || null,
          service: data.service || null,
          message: data.message,
        },
      ]);

      if (error) throw error;
      setSuccess(true);
      toast.success("Contact message sent successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const onCareerSubmit = async (data: CareerFormData) => {
    if (!resumeFile) {
      setResumeError("Resume file is required");
      return;
    }
    setSubmitting(true);

    try {
      // 1. Upload file to Supabase Storage bucket 'resumes'
      const fileExt = resumeFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `resumes/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, resumeFile);

      if (uploadError) throw uploadError;

      // 2. Insert career entry into DB
      const { error: dbError } = await supabase.from("careers").insert([
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
          resume_url: filePath, // Save storage path rather than public URL for security
          cover_letter: data.cover_letter || null,
        },
      ]);

      if (dbError) throw dbError;

      setSuccess(true);
      toast.success("Application submitted successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="glass-strong border border-border/40 max-w-lg p-0 overflow-hidden shadow-[var(--shadow-float)] sm:rounded-2xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="font-editorial text-3xl font-semibold text-gradient">
            {success ? "Success" : "Get in Touch"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {success
              ? "We've received your submission and will get back to you shortly."
              : "Let's explore how Parshva Technologies can help accelerate your venture."}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <CheckCircle2 className="h-16 w-16 text-accent mb-6 animate-bounce" />
            <h3 className="font-editorial text-2xl font-bold mb-2">Thank You!</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-8">
              Your inquiry has been stored securely in our system. A senior partner will review your
              submission and reach out within 24 hours.
            </p>
            <Button
              onClick={closeModal}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 py-2.5 transition-all"
            >
              Close Window
            </Button>
          </div>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as any)}
            className="w-full"
          >
            <div className="px-6 border-b border-border/20">
              <TabsList className="grid grid-cols-3 bg-secondary/30 p-1 rounded-xl mb-4">
                <TabsTrigger value="project" className="rounded-lg text-xs py-2">
                  Start Project
                </TabsTrigger>
                <TabsTrigger value="message" className="rounded-lg text-xs py-2">
                  Inquiry
                </TabsTrigger>
                <TabsTrigger value="career" className="rounded-lg text-xs py-2">
                  Careers
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
              {/* TAB 1: PROJECT REQUEST */}
              <TabsContent value="project" className="m-0 focus-visible:outline-none">
                <form onSubmit={projectForm.handleSubmit(onProjectSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Your Name *
                      </label>
                      <input
                        {...projectForm.register("name")}
                        className="w-full rounded-xl border border-border/30 bg-secondary/10 px-3.5 py-2.5 text-sm transition-all focus:border-accent/50 focus:bg-background focus:outline-none"
                        placeholder="John Doe"
                      />
                      {projectForm.formState.errors.name && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {projectForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Email Address *
                      </label>
                      <input
                        {...projectForm.register("email")}
                        className="w-full rounded-xl border border-border/30 bg-secondary/10 px-3.5 py-2.5 text-sm transition-all focus:border-accent/50 focus:bg-background focus:outline-none"
                        placeholder="john@example.com"
                      />
                      {projectForm.formState.errors.email && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {projectForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Company Name
                    </label>
                    <input
                      {...projectForm.register("company")}
                      className="w-full rounded-xl border border-border/30 bg-secondary/10 px-3.5 py-2.5 text-sm transition-all focus:border-accent/50 focus:bg-background focus:outline-none"
                      placeholder="Acme Corp"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Required Service *
                      </label>
                      <select
                        {...projectForm.register("service")}
                        className="w-full rounded-xl border border-border/30 bg-secondary/10 px-3.5 py-2.5 text-sm transition-all focus:border-accent/50 focus:bg-background focus:outline-none"
                      >
                        <option value="">Select service...</option>
                        {SERVICES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      {projectForm.formState.errors.service && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {projectForm.formState.errors.service.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Budget Range *
                      </label>
                      <select
                        {...projectForm.register("budget")}
                        className="w-full rounded-xl border border-border/30 bg-secondary/10 px-3.5 py-2.5 text-sm transition-all focus:border-accent/50 focus:bg-background focus:outline-none"
                      >
                        <option value="">Select budget...</option>
                        {BUDGETS.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                      {projectForm.formState.errors.budget && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {projectForm.formState.errors.budget.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Project Details *
                    </label>
                    <textarea
                      {...projectForm.register("project_details")}
                      rows={4}
                      className="w-full rounded-xl border border-border/30 bg-secondary/10 px-3.5 py-2.5 text-sm transition-all focus:border-accent/50 focus:bg-background focus:outline-none resize-none"
                      placeholder="Describe what you want to build..."
                    />
                    {projectForm.formState.errors.project_details && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {projectForm.formState.errors.project_details.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary hover:bg-primary/95 text-primary-foreground py-3 rounded-xl transition-all cursor-pointer font-medium"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                      </span>
                    ) : (
                      "Submit Project Request"
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* TAB 2: INQUIRY */}
              <TabsContent value="message" className="m-0 focus-visible:outline-none">
                <form onSubmit={messageForm.handleSubmit(onMessageSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Full Name *
                      </label>
                      <input
                        {...messageForm.register("full_name")}
                        className="w-full rounded-xl border border-border/30 bg-secondary/10 px-3.5 py-2.5 text-sm transition-all focus:border-accent/50 focus:bg-background focus:outline-none"
                        placeholder="John Doe"
                      />
                      {messageForm.formState.errors.full_name && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {messageForm.formState.errors.full_name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Email Address *
                      </label>
                      <input
                        {...messageForm.register("email")}
                        className="w-full rounded-xl border border-border/30 bg-secondary/10 px-3.5 py-2.5 text-sm transition-all focus:border-accent/50 focus:bg-background focus:outline-none"
                        placeholder="john@example.com"
                      />
                      {messageForm.formState.errors.email && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {messageForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Phone Number
                      </label>
                      <input
                        {...messageForm.register("phone")}
                        className="w-full rounded-xl border border-border/30 bg-secondary/10 px-3.5 py-2.5 text-sm transition-all focus:border-accent/50 focus:bg-background focus:outline-none"
                        placeholder="+1 (555) 123-4567"
                      />
                      {messageForm.formState.errors.phone && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {messageForm.formState.errors.phone.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Company Name
                      </label>
                      <input
                        {...messageForm.register("company")}
                        className="w-full rounded-xl border border-border/30 bg-secondary/10 px-3.5 py-2.5 text-sm transition-all focus:border-accent/50 focus:bg-background focus:outline-none"
                        placeholder="Acme Corp"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Service of Interest
                    </label>
                    <select
                      {...messageForm.register("service")}
                      className="w-full rounded-xl border border-border/30 bg-secondary/10 px-3.5 py-2.5 text-sm transition-all focus:border-accent/50 focus:bg-background focus:outline-none"
                    >
                      <option value="">Select option...</option>
                      {SERVICES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Your Message *
                    </label>
                    <textarea
                      {...messageForm.register("message")}
                      rows={4}
                      className="w-full rounded-xl border border-border/30 bg-secondary/10 px-3.5 py-2.5 text-sm transition-all focus:border-accent/50 focus:bg-background focus:outline-none resize-none"
                      placeholder="Write your message here..."
                    />
                    {messageForm.formState.errors.message && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {messageForm.formState.errors.message.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary hover:bg-primary/95 text-primary-foreground py-3 rounded-xl transition-all cursor-pointer font-medium"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                      </span>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* TAB 3: CAREERS */}
              <TabsContent value="career" className="m-0 focus-visible:outline-none">
                <form onSubmit={careerForm.handleSubmit(onCareerSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Full Name *
                      </label>
                      <input
                        {...careerForm.register("name")}
                        className="w-full rounded-xl border border-border/30 bg-secondary/10 px-3.5 py-2.5 text-sm transition-all focus:border-accent/50 focus:bg-background focus:outline-none"
                        placeholder="John Doe"
                      />
                      {careerForm.formState.errors.name && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {careerForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Email Address *
                      </label>
                      <input
                        {...careerForm.register("email")}
                        className="w-full rounded-xl border border-border/30 bg-secondary/10 px-3.5 py-2.5 text-sm transition-all focus:border-accent/50 focus:bg-background focus:outline-none"
                        placeholder="john@example.com"
                      />
                      {careerForm.formState.errors.email && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {careerForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Phone Number *
                    </label>
                    <input
                      {...careerForm.register("phone")}
                      className="w-full rounded-xl border border-border/30 bg-secondary/10 px-3.5 py-2.5 text-sm transition-all focus:border-accent/50 focus:bg-background focus:outline-none"
                      placeholder="+1 (555) 123-4567"
                    />
                    {careerForm.formState.errors.phone && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {careerForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* File Upload Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Upload Resume (PDF, DOC, DOCX - Max 10MB) *
                    </label>
                    <div className="relative border border-dashed border-border/40 rounded-xl bg-secondary/5 p-6 hover:bg-secondary/15 transition-all text-center flex flex-col items-center justify-center cursor-pointer">
                      <input
                        type="file"
                        id="resume-upload"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <UploadCloud className="h-8 w-8 text-muted-foreground/80 mb-2" />
                      {resumeFile ? (
                        <p className="text-sm font-medium text-accent truncate max-w-xs">
                          {resumeFile.name}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          Drag & drop or click to upload
                        </p>
                      )}
                    </div>
                    {resumeError && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {resumeError}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Cover Letter or Message
                    </label>
                    <textarea
                      {...careerForm.register("cover_letter")}
                      rows={3}
                      className="w-full rounded-xl border border-border/30 bg-secondary/10 px-3.5 py-2.5 text-sm transition-all focus:border-accent/50 focus:bg-background focus:outline-none resize-none"
                      placeholder="Why do you want to join our studio?"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary hover:bg-primary/95 text-primary-foreground py-3 rounded-xl transition-all cursor-pointer font-medium"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Submitting Application...
                      </span>
                    ) : (
                      "Apply for Position"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </div>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
