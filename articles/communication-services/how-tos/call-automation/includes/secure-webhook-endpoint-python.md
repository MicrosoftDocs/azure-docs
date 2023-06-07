## Improving Call Automation webhook callback security

Each mid-call webhook callback sent by Call Automation uses a signed JSON Web Token (JWT) in the Authentication header of the inbound HTTPS request. You can use standard Open ID Connect (OIDC) JWT validation techniques to ensure the integrity of the token as follows. The lifetime of the JWT is five (5) minutes and a new token is created for every event sent to the callback URI.

1. Obtain the Open ID configuration URL: <https://acscallautomation.communication.azure.com/calling/.well-known/acsopenidconfiguration>
2. Install the [Microsoft.AspNetCore.Authentication.JwtBearer NuGet](https://www.nuget.org/packages/Microsoft.AspNetCore.Authentication.JwtBearer) package.
3. Configure your application to validate the JWT using the NuGet package and the configuration of your ACS resource. You need the `audience` values as it is present in the JWT payload.
4. Validate the issuer, audience and the JWT token.
   - The audience is your ACS resource ID you used to setup your Call Automation client. Refer [here](../../quickstarts/voice-video-calling/get-resource-id.md) about how to get it.
   - The JSON Web Key Set (JWKS) endpoint in the OpenId configuration contains the keys used to validate the JWT token. When the signature is valid and the token hasn't expired (within 5 minutes of generation), the client can use the token for authorization.

This sample code demonstrates how to use `Microsoft.IdentityModel.Protocols.OpenIdConnect` to validate webhook payload

```JavaScript
import express from "express";
import { JwksClient } from "jwks-rsa";
import { verify } from "jsonwebtoken";

const app = express();
const port = 3000;
const audience = "resource_id";
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
                    const signingKey = key?.getPublicKey() || key?.rsaPublicKey;

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
