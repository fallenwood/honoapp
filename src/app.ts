import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static'

import { setupYConnection } from './y/index.js';
import { indexTemplates } from './template/index.js';
import { liveTemplates } from "./template/live.js";

const APPNAME = "APP";
const app = new Hono();

const rooms = new Set<string>();

// health check
app.get('/health', c => c.text('Healthy'));
app.get('/healthz', c => c.text('Healthy'));

app.get("/live/:key", async (c) => {
  const roomKey = c.req.param("key");

  const content = await liveTemplates.live({
    title: `App - ${roomKey}`,
  });

  return c.html(content || "");
});

// index
app.get('/', (c) => {
  return c.html(indexTemplates.index({}) || "");
});

app.get('/create', (c) => {
  let room = Math.random().toString(36).substring(7);

  while (rooms.has(room)) {
    room = Math.random().toString(36).substring(7);
  }

  rooms.add(room);

  return c.redirect(`/live/${room}`);
});

app.use('/static/*', serveStatic({
  root: ".",
}));

const port = parseInt(process.env[`${APPNAME}_PORT`] || "1234", 10);

console.log(`Server is running on http://0.0.0.0:${port}`);

const server = serve({
  fetch: app.fetch,
  port,
  hostname: "0.0.0.0",
});

console.log("Serving...");

setupYConnection(app, server);
