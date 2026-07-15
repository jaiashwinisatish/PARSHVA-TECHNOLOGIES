-- Create table for Contact Messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    service TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create table for Newsletter
CREATE TABLE IF NOT EXISTS public.newsletter (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create table for Careers (Job Applications)
CREATE TABLE IF NOT EXISTS public.careers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    resume_url TEXT NOT NULL,
    cover_letter TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create table for Project / Consultation Requests
CREATE TABLE IF NOT EXISTS public.project_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    company TEXT,
    email TEXT NOT NULL,
    budget TEXT,
    service TEXT NOT NULL,
    project_details TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================================

-- Enable Row Level Security on all tables
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_requests ENABLE ROW LEVEL SECURITY;

-- Contact Messages Policies
CREATE POLICY "Allow public insert to contact_messages" 
ON public.contact_messages FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow authenticated read/write/delete to contact_messages" 
ON public.contact_messages FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Newsletter Policies
CREATE POLICY "Allow public insert to newsletter" 
ON public.newsletter FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow authenticated read/write/delete to newsletter" 
ON public.newsletter FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Careers Policies
CREATE POLICY "Allow public insert to careers" 
ON public.careers FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow authenticated read/write/delete to careers" 
ON public.careers FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Project Requests Policies
CREATE POLICY "Allow public insert to project_requests" 
ON public.project_requests FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow authenticated read/write/delete to project_requests" 
ON public.project_requests FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- ========================================================
-- STORAGE BUCKETS CONFIGURATION (PRIVATE RESUMES BUCKET)
-- ========================================================

-- Insert resumes bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'resumes', 
    'resumes', 
    false, -- Private bucket
    10485760, -- 10MB file size limit
    '{"application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"}'
)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies on Storage objects for "resumes" bucket
CREATE POLICY "Allow public uploads to resumes" 
ON storage.objects FOR INSERT 
TO public 
WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Allow authenticated read of resumes" 
ON storage.objects FOR SELECT 
TO authenticated 
USING (bucket_id = 'resumes');

CREATE POLICY "Allow authenticated delete of resumes" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'resumes');
