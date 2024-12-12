import type { FC, PropsWithChildren } from "hono/jsx";
import { Layout } from "./_layout.js";
import { html, raw } from "hono/html";

export interface LiveProps {
  title: string;
}

const body: FC = () => {
  return (
    <>
      <script src="/static/yjs.mjs" type="module" />
      <script src="/static/y-websocket.cjs" />
      <script src="/static/live.js" />
    </>
  );
};

const live: FC<LiveProps> = (props) => {
  return (
    <Layout
      title="Live"
      body={body}
    >
      <div>
        <h1>Hello!</h1>
        <div id="monaco-editor" />
      <script src="/static/yjs.mjs" type="module" />
      <script src="/static/y-websocket.cjs" />
      <script src="/static/live.js" />
      </div>
    </Layout>
  );
}

export const liveTemplates = {
  live,
};
