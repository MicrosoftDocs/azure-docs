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

This sample code demonstrates how to configure OIDC client to validate websocket payload using JWT

```python
from quart import Quart, websocket, abort, request import jwt from jwt import PyJWKClient, InvalidTokenError
app = Quart(name)
JWKS_URL = "https://acscallautomation.communication.azure.com/calling/keys" EXPECTED_ISSUER = "https://acscallautomation.communication.azure.com" EXPECTED_AUDIENCE = "ACS resource ID" # replace with actual audience
async def validate_token(token: str): try: jwks_client = PyJWKClient(JWKS_URL) signing_key = jwks_client.get_signing_key_from_jwt(token).key
   decoded_token = jwt.decode(
        token,
        signing_key,
        algorithms=["RS256"],
        audience=EXPECTED_AUDIENCE,
        issuer=EXPECTED_ISSUER,
    )

    return decoded_token  # Could return claims if needed
except InvalidTokenError:
    print("Token is invalid.")
    return None
except Exception as e:
    print(f"Uncaught exception during token validation: {e}")
    return None
 
@app.websocket("/ws") async def ws(): auth_header = websocket.headers.get("Authorization")
if not auth_header or not auth_header.startswith("Bearer "):
    await websocket.close(code=4401, reason="Missing or invalid Authorization header")
    return

token = auth_header.split(" ")[1]

claims = await validate_token(token)
if not claims:
    await websocket.close(code=4401, reason="Invalid token")
    return

correlation_id = websocket.headers.get("x-ms-call-correlation-id", "not provided")
call_connection_id = websocket.headers.get("x-ms-call-connection-id", "not provided")
print(f"Authenticated WebSocket - Correlation ID: {correlation_id}")
print(f"Authenticated WebSocket - CallConnection ID: {call_connection_id}")

try:
    while True:
        message = await websocket.receive()
        print(f"Received: {message}")
        # TODO: process message
except Exception as e:
    print(f"WebSocket closed: {e}")
 
if name == "main": app.run()

```
