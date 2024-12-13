import type { FC } from "hono/jsx";
import { Layout } from "./_layout.js";

export interface LiveProps {
  title: string;
}

const live: FC<LiveProps> = (props) => {
  return (
    <Layout
      title="Live"
    >
      <div>
        <div id="monaco-editor" />
        <script src="/static/live/main.js" type="module" />
      </div>
    </Layout>
  );
}

export const liveTemplates = {
  live,
};
