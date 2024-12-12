const WebSocket = require("ws");
const setupWSConnection = require("./utils").setupWSConnection;
import { createNodeWebSocket } from '@hono/node-ws';
import { Hono } from 'hono';
import { serve, type ServerType } from '@hono/node-server'


import { createBunWebSocket } from 'hono/bun'
import type { IncomingMessage } from 'http'
// import type { ServerWebSocket } from 'bun';


export function setupYConnection(app: Hono, server: ServerType) {
    const wss = new WebSocket.Server({ noServer: true });

    // app.get("/api/y", upgradeWebSocket((c) => {
    //     return {
    //         onMessage(event, ws) {
    //             console.log(`Message from client: ${event.data}`)
    //             ws.send('Hello from server!')
    //         },
    //         onClose: () => {
    //             console.log('Connection closed')
    //         },
    //     }
    // }));

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