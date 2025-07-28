---
title: Include file
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

## Improve Call Automation webhook callback security

Each mid-call webhook callback sent by Call Automation uses a signed JSON Web Token (JWT) in the Authentication header of the inbound HTTPS request. You can use standard OpenID Connect (OIDC) JWT validation techniques to ensure the integrity of the token. The lifetime of the JWT is five minutes, and a new token is created for every event sent to the callback URI.

1. Obtain the OpenID configuration URL: `<https://acscallautomation.communication.azure.com/calling/.well-known/acsopenidconfiguration>`
1. Install the following packages:
    - [flask pypi](https://pypi.org/project/Flask/)
    - [PyJWT pypi](https://pypi.org/project/PyJWT/)

    ```console
    pip install flask pyjwt
    ```

1. Configure your application to validate the JWT and the configuration of your Azure Communication Services resource. You need the `audience` value as it appears in the JWT payload.
1. Validate the issuer, the audience, and the JWT:
   - The audience is your Azure Communication Services resource ID that you used to set up your Call Automation client. For information about how to get it, see [Get your Azure resource ID](../../../quickstarts/voice-video-calling/get-resource-id.md).
   - The JSON Web Key Set endpoint in the OpenId configuration contains the keys that are used to validate the JWT. When the signature is valid and the token hasn't expired (within five minutes of generation), the client can use the token for authorization.

This sample code demonstrates how to configure the OIDC client to validate a webhook payload by using JWT:

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
