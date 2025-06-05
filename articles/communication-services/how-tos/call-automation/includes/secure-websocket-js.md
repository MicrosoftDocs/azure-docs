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
import express from "express";
import { JwksClient } from "jwks-rsa";
import { verify } from "jsonwebtoken";

const app = express();
const port = 3000;
const audience = "ACS resource ID";
const issuer = "https://acscallautomation.communication.azure.com";

app.use(express.json());

app.post("/api/callback", (req, res) => {
    const token = req?.headers?.authorization?.split(" ")[1] || "";

    if (!token) {
        res.sendStatus(401);

        return;
    }

    try {
        verify(
            token,
            (header, callback) => {
                const client = new JwksClient({
                    jwksUri: "https://acscallautomation.communication.azure.com/calling/keys",
                });

                client.getSigningKey(header.kid, (err, key) => {
                    const signingKey = key?.publicKey || key?.rsaPublicKey;

                    callback(err, signingKey);
                });
            },
            {
                audience,
                issuer,
                algorithms: ["RS256"],
            });
        // Your implementation on the callback event
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(401);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
```
