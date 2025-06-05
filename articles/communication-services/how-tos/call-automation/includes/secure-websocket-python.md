---
title: include file
description: Python websocket callback security
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

This sample demonstrates how to configure an OIDC-compliant client to validate WebSocket connection requests using JWT.

Make sure to install the required package:
`pip install cryptography`

```python
JWKS_URL = "https://acscallautomation.communication.azure.com/calling/keys"
ISSUER = "https://acscallautomation.communication.azure.com"
AUDIENCE = "ACS resource ID”

@app.websocket('/ws')
async def ws():
    try:
        auth_header = websocket.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            await websocket.close(1008)  # Policy violation
            return

        token = auth_header.split()[1]

        jwks_client = PyJWKClient(JWKS_URL)
        signing_key = jwks_client.get_signing_key_from_jwt(token)

        decoded = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            issuer=ISSUER,
            audience=AUDIENCE,
        )

        app.logger.info(f"Authenticated WebSocket connection with decoded JWT payload: {decoded}")
        await websocket.send("Connection authenticated.")

        while True:
            data = await websocket.receive()
            # Process incoming data

    except InvalidTokenError as e:
        app.logger.warning(f"Invalid token: {e}")
        await websocket.close(1008)
    except Exception as e:
        app.logger.error(f"Uncaught exception: {e}")
        await websocket.close(1011)  # Internal error
```
