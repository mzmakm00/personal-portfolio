import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Moazzam · Full-Stack Engineer building SaaS that converts" },
      {
        name: "description",
        content:
          "Moazzam — full-stack engineer shipping conversion-focused SaaS products with TypeScript, React, Go and Postgres.",
      },
      { name: "author", content: "Moazzam Akmal" },
      { property: "og:title", content: "Moazzam · Full-Stack Engineer" },
      {
        property: "og:description",
        content: "Selected work, skills and contact for a full-stack engineer building SaaS.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/moazzam-mark.svg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/moazzam-mark.svg" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/moazzam-mark.svg" },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
