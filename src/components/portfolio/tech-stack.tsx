import { motion } from "framer-motion";

const STACK = [
  "TypeScript",
  "React",
  "Next.js",
  "TanStack",
  "Node.js",
  "Go",
  "Rust",
  "PostgreSQL",
  "Supabase",
  "Tailwind",
  "Framer Motion",
  "Docker",
  "AWS",
  "tRPC",
  "GraphQL",
  "Redis",
];

export function TechStack() {
  return (
    <motion.ul
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
      className="flex flex-wrap justify-center gap-2.5"
    >
      {STACK.map((tech) => (
        <motion.li
          key={tech}
          variants={{
            hidden: { opacity: 0, y: 10, scale: 0.9 },
            show: { opacity: 1, y: 0, scale: 1 },
          }}
          whileHover={{ scale: 1.05, y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="cursor-default rounded-full border border-border bg-surface-elevated px-4 py-2 font-mono text-xs text-foreground/90 transition-colors hover:border-primary/50 hover:text-primary"
        >
          {tech}
        </motion.li>
      ))}
    </motion.ul>
  );
}
