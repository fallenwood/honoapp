import type { FC, PropsWithChildren } from "hono/jsx";

interface LayoutProps extends PropsWithChildren {
  title: string;
  header?: FC;
  body?: FC;
}

export const Layout: FC<LayoutProps> = (props) => {
  return (
    <html>
      <head>
        <title>{props.title}</title>
        {props.header}
      </head>
      <body>
        {props.children}
        {props.body}
      </body>
    </html>
  );
};
