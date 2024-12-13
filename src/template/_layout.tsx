import type { FC, PropsWithChildren } from "hono/jsx";

interface LayoutProps extends PropsWithChildren {
  title: string;
  header?: FC;
}

export const Layout: FC<LayoutProps> = (props) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{props.title}</title>
        <link href="https://cdn.jsdelivr.net/npm/daisyui@4.12.14/dist/full.min.css" rel="stylesheet" type="text/css" />
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://cdn.jsdelivr.net/npm/@@tailwindcss/typography@0.5.15/src/index.min.js"></script>
        <link href="/static/style.css" rel="stylesheet" />
        {props.header}
      </head>
      <body>
        <div class="navbar bg-base-100">
          <a class="btn btn-ghost text-xl" href="#">MyApp</a>
        </div>
        {props.children}
      </body>
    </html>
  );
};

// {/* <link href="/static/live/main.css" rel="stylesheet" /> */}
