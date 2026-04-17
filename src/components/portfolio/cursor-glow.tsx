import { useEffect, useState } from "react";

/**
 * A soft glowing orb that follows the cursor across the entire page.
 * Sits behind content (z-0 with pointer-events-none) so it never blocks clicks.
 */
export function CursorGlow() {
  const [pos, setPos] = useState({ x: -1000, y: -1000 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Disable on touch / coarse pointer devices
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setPos({ x: e.clientX, y: e.clientY });
        setVisible(true);
      });
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ contain: "strict" }}
    >
      <div
        className="absolute h-[520px] w-[520px] rounded-full transition-opacity duration-300"
        style={{
          left: pos.x,
          top: pos.y,
          transform: "translate(-50%, -50%)",
          opacity: visible ? 1 : 0,
          background:
            "radial-gradient(circle, oklch(0.84 0.16 195 / 0.18) 0%, oklch(0.84 0.16 195 / 0.06) 35%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />
    </div>
  );
}
