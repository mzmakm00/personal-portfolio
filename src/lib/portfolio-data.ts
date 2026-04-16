import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image_url: string | null;
  github_url: string | null;
  demo_url: string | null;
  featured: boolean;
  display_order: number;
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  display_order: number;
};

export const getPortfolioData = createServerFn({ method: "GET" }).handler(async () => {
  const [projectsRes, experienceRes] = await Promise.all([
    supabase.from("projects").select("*").order("display_order"),
    supabase.from("experience").select("*").order("display_order"),
  ]);

  if (projectsRes.error) {
    console.error("Failed to load projects:", projectsRes.error);
  }
  if (experienceRes.error) {
    console.error("Failed to load experience:", experienceRes.error);
  }

  return {
    projects: (projectsRes.data ?? []) as Project[],
    experience: (experienceRes.data ?? []) as Experience[],
  };
});
