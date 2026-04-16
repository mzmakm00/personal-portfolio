import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import type { Project } from "@/lib/portfolio-data";

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

export function ProjectGallery({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <p className="text-center text-muted-foreground">No projects yet — add some to your database.</p>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="grid gap-6 md:grid-cols-2"
    >
      {projects.map((p) => (
        <motion.article
          key={p.id}
          variants={cardVariants}
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
        >
          {p.featured && (
            <span className="absolute right-4 top-4 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-primary">
              Featured
            </span>
          )}

          <h3 className="text-xl font-semibold tracking-tight text-foreground">{p.title}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{p.description}</p>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {p.tags.map((t) => (
              <span
                key={t}
                className="rounded-md border border-border bg-secondary/60 px-2 py-1 font-mono text-[11px] text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
            {p.github_url && (
              <a
                href={p.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <Github className="h-3.5 w-3.5" /> GitHub
              </a>
            )}
            {p.demo_url && (
              <a
                href={p.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primary/80"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Live demo
              </a>
            )}
          </div>
        </motion.article>
      ))}
    </motion.div>
  );
}
