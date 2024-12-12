import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { html } from 'hono/html';
import { serveStatic } from '@hono/node-server/serve-static'

import { liveTemplates, type LiveProps } from "./template/live.js";


const WebSocket = require('ws')

const APPNAME = "p";

import {
  getCookie,
  getSignedCookie,
  setCookie,
  setSignedCookie,
  deleteCookie,
} from 'hono/cookie'
import { setupYConnection } from './y/index.js';
import { title } from 'process';
import path from 'path';

const app = new Hono();

// health check
app.get('/health', c => c.text('Healthy'));
app.get('/healthz', c => c.text('Healthy'));

app.get("/live/:key", async (c) => {
  const username = c.req.param("key");
  // return c.html(
  //   html`<!doctype html>
  //     <h1>Hello! ${username}!</h1>`
  // );
  const content = await liveTemplates.live({} as LiveProps);

  return c.html(content || "");
});

app.post("/live/:key", (c) => {
  return c.text("TODO");
});

app.get("/:key", (c) => {
  return c.text(`Hello! ${c.req.param("key")}!`);
});

// index
app.get('/', (c) => {
  return c.text('Hello Hono!')
});

app.use('/static/*', serveStatic({
  root: ".",
  onNotFound: (path, c) => {
    console.log(`${path} is not found, you access ${c.req.path}`)
  }
}));

const port = parseInt(process.env[`${APPNAME}_PORT`] || "1234", 10);

console.log(`Server is running on http://localhost:${port}`);

const server = serve({
  fetch: app.fetch,
  port,
});

console.log("Serving...");

setupYConnection(app, server);
