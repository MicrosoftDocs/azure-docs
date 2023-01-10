---
title: "How to: Validate a User Created a Document"
description: How to validate that the user who created a document is the same user who is claiming to be creating the document.
services: azure-fluid
author: hickeys
ms.author: hickeys
ms.date: 04/05/2022
ms.topic: reference
ms.service: azure-fluid
fluid.url: https://fluidframework.com/docs/apis/azure-client/itokenprovider/
---

# How to: Validate a User Created a Document

When you create a document in Azure Fluid Relay, the JWT provided by the [ITokenProvider](https://fluidframework.com/docs/apis/azure-client/itokenprovider-interface) for the creation request can only be used once. After creating a document, the client must generate a new JWT that contains the document ID provided by the service at creation time. If an application has an authorization service that manages document access control, it will need to know who created a document with a given ID in order to authorize the generation of a new JWT for access to that document.

## Inform an Authorization Service when a document is Created

An application can tie into the document creation lifecycle by implementing a public [documentPostCreateCallback()](https://fluidframework.com/docs/apis/azure-client/itokenprovider-interface#documentpostcreatecallback-methodsignature) method in its `TokenProvider`. This callback will be triggered directly after creating the document, before a client requests the new JWT it needs to gain read/write permissions to the document that was created.

The `documentPostCreateCallback()` receives two parameters: 1) the ID of the document that was created and 2) a JWT signed by the service with no permission scopes. The authorization service can verify the given JWT and use the information in the JWT to grant the correct user permissions for the newly created document.

### Create an endpoint for your document creation callback

This example below is an [Azure Function](../../azure-functions/functions-overview.md) based off the example in [How to: Write a TokenProvider with an Azure Function](azure-function-token-provider.md#create-an-endpoint-for-your-tokenprovider-using-azure-functions).

```typescript
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { ITokenClaims, IUser } from "@fluidframework/protocol-definitions";
import * as jwt from "jsonwebtoken";

// NOTE: retrieve the key from a secure location.
const key = "myTenantKey";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const token = (req.query.token || (req.body && req.body.token)) as string;
    const documentId = (req.query.documentId || (req.body && req.body.documentId)) as string;

    if (!token) {
        context.res = {
            status: 400,
            body: "No token provided in request",
        };
        return;
    }
    if (!documentId) {
        context.res = {
            status: 400,
            body: "No documentId provided in request",
        };
        return;
    }
    
    const claims = jwt.decode(token) as ITokenClaims;
    if (!claims) {
        context.res = {
            status: 403,
            body: "Missing token claims",
        };
        return;
    }

    const tenantId = claims.tenantId;
    if (!claims) {
        context.res = {
            status: 400,
            body: "No tenantId provided in token claims",
        };
        return;
    }
    if (!key) {
        context.res = {
            status: 404,
            body: `No key found for the provided tenantId: ${tenantId}`,
        };
        return;
    }
    try {
        jwt.verify(token, key);
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
            context.res = {
                status: 401,
                body: `Token is expired`,
            };
            return
        }
        context.res = {
            status: 403,
            body: `Token signed with invalid key`,
        }
        return;
    }

    const user: IUser = claims.user;
    // Pseudo-function: implement according to your needs
    giveUserPermissionsForDocument(documentId, user);

    context.res = {
        status: 200,
        body: "OK",
    };
};

export default httpTrigger;
```

### Implement the `documentPostCreateCallback`

This example implementation below extends the [AzureFunctionTokenProvider](https://fluidframework.com/docs/apis/azure-client/azurefunctiontokenprovider-class) and uses the [axios](https://www.npmjs.com/package/axios) library to make a HTTP request to the Azure Function used for generating tokens.

```typescript
import { AzureFunctionTokenProvider, AzureMember } from "@fluidframework/azure-client";
import axios from "axios";

/**
 * Token Provider implementation for connecting to an Azure Function endpoint for
 * Azure Fluid Relay token resolution.
 */
export class AzureFunctionTokenProviderWithDocumentCreateCallback extends AzureFunctionTokenProvider {
    /**
     * Creates a new instance using configuration parameters.
     * @param azFunctionUrl - URL to Azure Function endpoint
     * @param user - User object
     */
    constructor(
        private readonly authAzFunctionUrl: string,
        azFunctionUrl: string,
        user?: Pick<AzureMember, "userId" | "userName" | "additionalDetails">,
    ) {
        super(azFunctionUrl, user);
    }

    public async documentPostCreateCallback?(documentId: string, creationToken: string): Promise<void> {
        await axios.post(this.authAzFunctionUrl, {
            params: {
                documentId,
                token: creationToken,
            },
        });
    }
}
```

## See also

- [Add custom data to an auth token](connect-fluid-azure-service.md#adding-custom-data-to-tokens)
- [Azure Fluid Relay token contract](fluid-json-web-token.md)
