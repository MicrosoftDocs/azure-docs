---
title: Include file
description: JavaScript webhook callback security
services: azure-communication-services
author: Richard Cho
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 06/08/2023
ms.topic: include
ms.topic: include file
ms.author: richardcho
---

## Improve Call Automation webhook callback security

Each mid-call webhook callback sent by Call Automation uses a signed JSON Web Token (JWT) in the Authentication header of the inbound HTTPS request. You can use standard OpenID Connect (OIDC) JWT validation techniques to ensure the integrity of the token. The lifetime of the JWT is five minutes, and a new token is created for every event sent to the callback URI.

1. Obtain the OpenID configuration URL: `<https://acscallautomation.communication.azure.com/calling/.well-known/acsopenidconfiguration>`
1. Install the following packages:
    - [express npm](https://www.npmjs.com/package/express)
    - [jwks-rsa npm](https://www.npmjs.com/package/jwks-rsa)
    - [jsonwebtoken npm](https://www.npmjs.com/package/jsonwebtoken)
    
    ```console
    npm install express jwks-rsa jsonwebtoken
    ```

1. Configure your application to validate the JWT and the configuration of your Azure Communication Services resource. You need the `audience` value as it appears in the JWT payload.
1. Validate the issuer, the audience, and the JWT:
   - The audience is your Azure Communication Services resource ID that you used to set up your Call Automation client. For information about how to get it, see [Get your Azure resource ID](../../../quickstarts/voice-video-calling/get-resource-id.md).
   - The JSON Web Key Set endpoint in the OpenID configuration contains the keys that are used to validate the JWT. When the signature is valid and the token hasn't expired (within five minutes of generation), the client can use the token for authorization.

This sample code demonstrates how to configure the OIDC client to validate a webhook payload by using JWT:

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
