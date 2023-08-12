---
title: include file
description: Python webhook callback security
services: azure-communication-services
author: Richard Cho
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 06/08/2023
ms.topic: include
ms.topic: include file
ms.author: richardcho
---

## Improving Call Automation webhook callback security

Each mid-call webhook callback sent by Call Automation uses a signed JSON Web Token (JWT) in the Authentication header of the inbound HTTPS request. You can use standard Open ID Connect (OIDC) JWT validation techniques to ensure the integrity of the token as follows. The lifetime of the JWT is five (5) minutes and a new token is created for every event sent to the callback URI.

1. Obtain the Open ID configuration URL: <https://acscallautomation.communication.azure.com/calling/.well-known/acsopenidconfiguration>
2. Install the following packages:
    - [flask pypi](https://pypi.org/project/Flask/)
    - [PyJWT pypi](https://pypi.org/project/PyJWT/)

```console
pip install flask pyjwt
```

3. Configure your application to validate the JWT and the configuration of your ACS resource. You need the `audience` values as it is present in the JWT payload.
4. Validate the issuer, audience and the JWT token.
   - The audience is your ACS resource ID you used to set up your Call Automation client. Refer [here](../../../quickstarts/voice-video-calling/get-resource-id.md) about how to get it.
   - The JSON Web Key Set (JWKS) endpoint in the OpenId configuration contains the keys used to validate the JWT token. When the signature is valid and the token hasn't expired (within 5 minutes of generation), the client can use the token for authorization.

This sample code demonstrates how to configure OIDC client to validate webhook payload using JWT

```Python
from flask import Flask, jsonify, abort, request
import jwt

app = Flask(__name__)


@app.route("/api/callback", methods=["POST"])
def handle_callback_event():
    token = request.headers.get("authorization").split()[1]

    if not token:
        abort(401)

    try:
        jwks_client = jwt.PyJWKClient(
            "https://acscallautomation.communication.azure.com/calling/keys"
        )
        jwt.decode(
            token,
            jwks_client.get_signing_key_from_jwt(token).key,
            algorithms=["RS256"],
            issuer="https://acscallautomation.communication.azure.com",
            audience="ACS resource ID",
        )
        # Your implementation on the callback event
        return jsonify(success=True)
    except jwt.InvalidTokenError:
        print("Token is invalid")
        abort(401)
    except Exception as e:
        print("uncaught exception" + e)
        abort(500)


if __name__ == "__main__":
    app.run()
```
