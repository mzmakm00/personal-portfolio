import type { Experience } from "@/lib/portfolio-data";
import { FadeInUp } from "./fade-in-up";

export function ExperienceTimeline({ experience }: { experience: Experience[] }) {
  if (experience.length === 0) {
    return <p className="text-center text-muted-foreground">No experience entries yet.</p>;
  }
  return (
    <div className="relative mx-auto max-w-2xl">
      <div className="absolute bottom-0 left-3 top-2 w-px bg-gradient-to-b from-primary/60 via-border to-transparent md:left-4" />
      <ul className="space-y-10">
        {experience.map((e, i) => (
          <FadeInUp key={e.id} delay={i * 0.08}>
            <li className="relative pl-10 md:pl-14">
              <span className="absolute left-1.5 top-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-primary/15 md:left-2.5" />
              <div className="font-mono text-xs uppercase tracking-wider text-primary">{e.period}</div>
              <h3 className="mt-1 text-lg font-semibold text-foreground">
                {e.role} <span className="text-muted-foreground">· {e.company}</span>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{e.description}</p>
            </li>
          </FadeInUp>
        ))}
      </ul>
    </div>
  );
}
