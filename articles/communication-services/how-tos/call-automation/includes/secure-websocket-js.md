---
title: include file
description: JavaScript websocket callback security
services: azure-communication-services
author: Kunaal Punjabi
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 05/06/2025
ms.topic: include
ms.topic: include file
ms.author: kpunjabi
---

## Websocket code sample

This sample code demonstrates how to configure OIDC client to validate webhook payload using JWT

```JavaScript
import { createServer } from "http";
import WebSocket from "ws";
import { JwksClient } from "jwks-rsa";
import { verify } from "jsonwebtoken";
import url from "url";
 
const port = 3000;
const audience = "ACS resource ID";
const issuer = "https://acscallautomation.communication.azure.com";
const jwksUri = `${issuer}/calling/keys`;
 
const server = createServer();
const wss = new WebSocket.Server({ noServer: true });
 
const jwksClient = new JwksClient({ jwksUri });
 
function verifyToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
        verify(
            token,
            (header, cb) => {
                jwksClient.getSigningKey(header.kid, (err, key) => {
                    const signingKey = key?.getPublicKey();
                    cb(err, signingKey);
                });
            },
            { audience, issuer, algorithms: ["RS256"] },
            (err, decoded) => (err ? reject(err) : resolve(decoded))
        );
    });
}
 
// Upgrade HTTP to WebSocket only if token is valid
server.on("upgrade", async (req, socket, head) => {
    const tokenHeader = req.headers["authorization"];
    const token = tokenHeader?.toString().split(" ")[1];
 
    if (!token) {
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
        return;
    }
 
    try {
        const decoded = await verifyToken(token);
        (req as any).user = decoded;
 
        wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit("connection", ws, req);
        });
    } catch (e) {
        console.error("WebSocket token validation failed:", e);
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
    }
});
 
// Handle accepted WebSocket connections
wss.on("connection", async (ws: WebSocket, req) => {
    const user = (req as any).user;
    console.log("Authenticated WebSocket connection from:", user);
 
    await initWebsocket(ws);
    await startConversation();
 
    ws.on("message", async (packetData: ArrayBuffer) => {
        try {
            if (ws.readyState === WebSocket.OPEN) {
                await processWebsocketMessageAsync(packetData);
            }
        } catch (err) {
1.	            console.error("WebSocket message error:", err);
        }
    });
 
    ws.on("close", () => {
        console.log("WebSocket connection closed");
    });
});
 
server.listen(port, () => {
    console.log(`WebSocket server running on port ${port}`);
});
```
