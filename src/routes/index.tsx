import { createFileRoute } from "@tanstack/react-router";
import { getPortfolioData } from "@/lib/portfolio-data";
import { Nav } from "@/components/portfolio/nav";
import { Hero } from "@/components/portfolio/hero";
import { TechStack } from "@/components/portfolio/tech-stack";
import { ProjectGallery } from "@/components/portfolio/project-gallery";
import { ExperienceTimeline } from "@/components/portfolio/experience-timeline";
import { ContactForm } from "@/components/portfolio/contact-form";
import { FadeInUp } from "@/components/portfolio/fade-in-up";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Full-Stack Engineer · Portfolio" },
      {
        name: "description",
        content:
          "Selected work, experience and contact for a full-stack engineer building resilient web systems with TypeScript, React, Go and Postgres.",
      },
      { property: "og:title", content: "Full-Stack Engineer · Portfolio" },
      {
        property: "og:description",
        content: "Selected work, experience and contact for a full-stack engineer.",
      },
    ],
  }),
  loader: () => getPortfolioData(),
  component: Index,
});

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-6 py-28 md:py-36">
      <FadeInUp>
        <div className="mb-12 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">{eyebrow}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
        </div>
      </FadeInUp>
      {children}
    </section>
  );
}

function Index() {
  const { projects, experience } = Route.useLoaderData();

  return (
    <div id="top" className="relative">
      <Nav />
      <main>
        <Hero />

        <Section id="stack" eyebrow="Tech stack" title="Tools I reach for daily">
          <TechStack />
        </Section>

        <Section id="work" eyebrow="Selected work" title="Things I've shipped">
          <ProjectGallery projects={projects} />
        </Section>

        <Section id="experience" eyebrow="Experience" title="Where I've been">
          <ExperienceTimeline experience={experience} />
        </Section>

        <Section id="contact" eyebrow="Contact" title="Let's build something">
          <FadeInUp>
            <p className="mx-auto mb-10 max-w-md text-center text-sm leading-relaxed text-muted-foreground">
              Have an idea, a project, or just want to chat about systems design? Drop a line — I read every message.
            </p>
          </FadeInUp>
          <ContactForm />
        </Section>

        <footer className="border-t border-border py-10 text-center font-mono text-xs text-muted-foreground">
          © {new Date().getFullYear()} · Crafted with care.
        </footer>
      </main>
    </div>
  );
}
