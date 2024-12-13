const WebSocket = require("ws");
const setupWSConnection = require("./utils").setupWSConnection;

import { Hono } from 'hono';
import { type ServerType } from '@hono/node-server'

export function setupYConnection(app: Hono, server: ServerType) {
  const wss = new WebSocket.Server({ noServer: true });

  wss.on("connection", setupWSConnection);

  // app.get("/api/yws", async (c, next) => {
  //     if (c.req.header("upgrade")?.toLowerCase() !== "websocket") {
  //         await next();
  //         return;
  //     }
  // });

  server.on("upgrade", (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, (ws: any) => {
      wss.emit("connection", ws, req);
    });
  });

  return server;
}
