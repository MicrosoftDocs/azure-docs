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

This sample demonstrates how to configure an OpenID Connect (OIDC) client to validate WebSocket connection requests using a JSON Web Token (JWT).

```JavaScript
const audience = "ACS resource ID";
const issuer = "https://acscallautomation.communication.azure.com";

const jwksClient = new JwksClient({
  jwksUri: "https://acscallautomation.communication.azure.com/calling/keys",
});

wss.on("connection", async (ws, req) => {
  try {
    const authHeader = req.headers?.authorization || "";
    const token = authHeader.split(" ")[1];

    if (!token) {
      ws.close(1008, "Unauthorized");
      return;
    }

    verify(
      token,
      async (header, callback) => {
        try {
          const key = await jwksClient.getSigningKey(header.kid);
          const signingKey = key.getPublicKey();
          callback(null, signingKey);
        } catch (err) {
          callback(err);
        }
      },
      {
        audience,
        issuer,
        algorithms: ["RS256"],
      },
      (err, decoded) => {
        if (err) {
          console.error("WebSocket authentication failed:", err);
          ws.close(1008, "Unauthorized");
          return;
        }

        console.log(
          "Authenticated WebSocket connection with decoded JWT payload:",
          decoded
        );

        ws.on("message", async (message) => {
          // Process message
        });

        ws.on("close", () => {
          console.log("WebSocket connection closed");
        });
      }
    );
  } catch (err) {
    console.error("Unexpected error during WebSocket setup:", err);
    ws.close(1011, "Internal Server Error"); // 1011 = internal error
  }
});
```
