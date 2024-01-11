---
title: "How to: Write a TokenProvider with an Azure Function"
description: How to write a custom token provider as an Azure Function and deploy it.
ms.date: 02/05/2023
ms.topic: article
ms.service: azure-fluid
fluid.url: https://fluidframework.com/docs/build/tokenproviders/
---

# How to: Write a TokenProvider with an Azure Function

> [!NOTE]
> This preview version is provided without a service-level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.

In the [Fluid Framework](https://fluidframework.com/), TokenProviders are responsible for creating and signing tokens that the `@fluidframework/azure-client` uses to make requests to the Azure Fluid Relay service. The Fluid Framework provides a simple, insecure TokenProvider for development purposes, aptly named **InsecureTokenProvider**. Each Fluid service must implement a custom TokenProvider based on the particular service's authentication and security considerations.

Each Azure Fluid Relay resource you create is assigned a **tenant ID** and its own unique **tenant secret key**. The secret key is a **shared secret**. Your app/service knows it, and the Azure Fluid Relay service knows it. TokenProviders must know the secret key to sign requests, but the secret key can't be included in client code.

## Implement an Azure Function to sign tokens

One option for building a secure token provider is to create HTTPS endpoint and create a TokenProvider implementation that makes authenticated HTTPS requests to that endpoint to retrieve tokens. This path enables you to store the *tenant secret key* in a secure location, such as [Azure Key Vault](../../key-vault/general/overview.md).

The complete solution has two pieces:

1. An HTTPS endpoint that accepts requests and returns Azure Fluid Relay tokens.
1. An ITokenProvider implementation that accepts a URL to an endpoint, then makes requests to that endpoint to retrieve tokens.

### Create an endpoint for your TokenProvider using Azure Functions

Using [Azure Functions](../../azure-functions/functions-overview.md) is a fast way to create such an HTTPS endpoint.

This example demonstrates how to create your own **HTTPTrigger Azure Function** that fetches the token by passing in your tenant key.

# [TypeScript](#tab/typescript)

```typescript
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { ScopeType } from "@fluidframework/azure-client";
import { generateToken } from "@fluidframework/azure-service-utils";

// NOTE: retrieve the key from a secure location.
const key = "myTenantKey";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    // tenantId, documentId, userId and userName are required parameters
    const tenantId = (req.query.tenantId || (req.body && req.body.tenantId)) as string;
    const documentId = (req.query.documentId || (req.body && req.body.documentId)) as string | undefined;
    const userId = (req.query.userId || (req.body && req.body.userId)) as string;
    const userName = (req.query.userName || (req.body && req.body.userName)) as string;
    const scopes = (req.query.scopes || (req.body && req.body.scopes)) as ScopeType[];

    if (!tenantId) {
        context.res = {
            status: 400,
            body: "No tenantId provided in query params",
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

    let user = { name: userName, id: userId };

    // Will generate the token and returned by an ITokenProvider implementation to use with the AzureClient.
    const token = generateToken(
        tenantId,
        documentId,
        key,
        scopes ?? [ScopeType.DocRead, ScopeType.DocWrite, ScopeType.SummaryWrite],
        user
    );

    context.res = {
        status: 200,
        body: token
    };
};

export default httpTrigger;
```

The `generateToken` function, found in the `@fluidframework/azure-service-utils` package, generates a token for the given user that is signed using the tenant's secret key. This method enables the token to be returned to the client without exposing the secret. Instead, the token is generated server-side using the secret to provide scoped access to the given document. The example ITokenProvider below makes HTTP requests to this Azure Function to retrieve the tokens.

# [C#](#tab/csharp)

```cs
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Text;

using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace dotnet_tokenprovider_functionsapp
{
    public static class AzureFunction
    {
        // NOTE: retrieve the key from a secure location.
        private static readonly string key = "myTenantKey";

        [FunctionName("AzureFunction")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req, ILogger log)
        {
            string content = await new StreamReader(req.Body).ReadToEndAsync();
            JObject body = !string.IsNullOrEmpty(content) ? JObject.Parse(content) : null;

            string tenantId = (req.Query["tenantId"].ToString() ?? body["tenantId"]?.ToString()) as string;
            string documentId = (req.Query["documentId"].ToString() ?? body["documentId"]?.ToString() ?? null) as string;
            string userId = (req.Query["userId"].ToString() ?? body["userId"]?.ToString()) as string;
            string userName = (req.Query["userName"].ToString() ?? body["userName"]?.ToString()) as string;
            string[] scopes = (req.Query["scopes"].ToString().Split(",") ?? body["scopes"]?.ToString().Split(",") ?? null) as string[];

            if (string.IsNullOrEmpty(tenantId))
            {
                return new BadRequestObjectResult("No tenantId provided in query params");
            }

            if (string.IsNullOrEmpty(key))
            {
                return new NotFoundObjectResult($"No key found for the provided tenantId: ${tenantId}");
            }

            //  If a user is not specified, the token will not be associated with a user, and a randomly generated mock user will be used instead
            var user = (string.IsNullOrEmpty(userName) || string.IsNullOrEmpty(userId)) ? 
                new { name = Guid.NewGuid().ToString(), id = Guid.NewGuid().ToString() } :
                new { name = userName, id = userId };

            // Will generate the token and returned by an ITokenProvider implementation to use with the AzureClient.
            string token = GenerateToken(
                tenantId,
                key,
                scopes ?? new string[] { "doc:read", "doc:write", "summary:write" },
                documentId,
                user
            );

            return new OkObjectResult(token);
        }

        private static string GenerateToken(string tenantId, string key, string[] scopes, string? documentId, dynamic user, int lifetime = 3600, string ver = "1.0")
        {
            string docId = documentId ?? "";
            DateTime now = DateTime.Now;

            SigningCredentials credentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)), SecurityAlgorithms.HmacSha256);

            JwtHeader header = new JwtHeader(credentials);
            JwtPayload payload = new JwtPayload
            {
                { "documentId", docId },
                { "scopes", scopes },
                { "tenantId", tenantId },
                { "user", user },
                { "iat", new DateTimeOffset(now).ToUnixTimeSeconds() },
                { "exp", new DateTimeOffset(now.AddSeconds(lifetime)).ToUnixTimeSeconds() },
                { "ver", ver },
                { "jti", Guid.NewGuid() }
            };

            JwtSecurityToken token = new JwtSecurityToken(header, payload);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
```

The `GenerateToken` function is built off of the `@fluidframework/azure-service-utils` npm package, and it generates a token for the given user that is signed using the tenant's secret key. This function enables the token to be returned to the client without exposing the secret. Instead, the token is generated server-side using the secret to provide scoped access to the given document. The example ITokenProvider below makes HTTP requests to this Azure Function to retrieve the tokens.

---

### Deploy the Azure Function

Azure Functions can be deployed in several ways. For more information, see the **Deploy** section of the [Azure Functions documentation](../../azure-functions/functions-continuous-deployment.md) for more information about deploying Azure Functions.

### Implement the TokenProvider

TokenProviders can be implemented in many ways, but must implement two separate API calls: `fetchOrdererToken` and `fetchStorageToken`. These APIs are responsible for fetching tokens for the Fluid orderer and storage services respectively. Both functions return `TokenResponse` objects representing the token value. The Fluid Framework runtime calls these two APIs as needed to retrieve tokens. Note that while your application code is using only one service endpoint to establish connectivity with the Azure Fluid Relay service, the azure-client internally in conjunction with the service translate that one endpoint to an orderer and storage endpoint pair. Those two endpoints are used from that point on for that session which is why you need to implement the two separate functions for fetching tokens, one for each.

To ensure that the tenant secret key is kept secure, it's stored in a secure backend location and is only accessible from within the Azure Function. To retrieve tokens, you need to make a `GET` or `POST` request to your deployed Azure Function, providing the `tenantID` and `documentId`, and `userID`/`userName`. The Azure Function is responsible for the mapping between the tenant ID and a tenant key secret to appropriately generate and sign the token.

The example implementation below handles making these requests to your Azure Function. It uses the [axios](https://www.npmjs.com/package/axios) library to make HTTP requests. You can use other libraries or approaches to making an HTTP request from server code. This specific implementation is also provided for you as an export from the `@fluidframework/azure-client` package.

```typescript
import { ITokenProvider, ITokenResponse } from "@fluidframework/routerlicious-driver";
import axios from "axios";
import { AzureMember } from "./interfaces";

/**
 * Token Provider implementation for connecting to an Azure Function endpoint for
 * Azure Fluid Relay token resolution.
 */
export class AzureFunctionTokenProvider implements ITokenProvider {
    /**
     * Creates a new instance using configuration parameters.
     * @param azFunctionUrl - URL to Azure Function endpoint
     * @param user - User object
     */
    constructor(
        private readonly azFunctionUrl: string,
        private readonly user?: Pick<AzureMember, "userId" | "userName" | "additionalDetails">,
    ) { }

    public async fetchOrdererToken(tenantId: string, documentId?: string): Promise<ITokenResponse> {
        return {
            jwt: await this.getToken(tenantId, documentId),
        };
    }

    public async fetchStorageToken(tenantId: string, documentId: string): Promise<ITokenResponse> {
        return {
            jwt: await this.getToken(tenantId, documentId),
        };
    }

    private async getToken(tenantId: string, documentId: string | undefined): Promise<string> {
        const response = await axios.get(this.azFunctionUrl, {
            params: {
                tenantId,
                documentId,
                userId: this.user?.userId,
                userName: this.user?.userName,
                additionalDetails: this.user?.additionalDetails,
            },
        });
        return response.data as string;
    }
}
```

### Add efficiency and error handling

The `AzureFunctionTokenProvider` is a simple implementation of `TokenProvider` which should be treated as a starting point when implementing your own custom token provider. For the implementation of a production-ready token provider, you should consider various failure scenarios which the token provider needs to handle. For example, the `AzureFunctionTokenProvider` implementation fails to handle network disconnect situations because it doesn't cache the token on the client side. 

When the container disconnects, the connection manager attempts to get a new token from the TokenProvider before reconnecting to the container. While the network is disconnected, the API get request made in `fetchOrdererToken` will fail and throw a non-retryable error. This in turn leads to the container being disposed and not being able to reconnect even if a network connection is re-established. 

A potential solution for this disconnect issue is to cache valid tokens in [Window.localStorage](https://developer.mozilla.org/docs/Web/API/Window/localStorage). With token-caching the container will retrieve a valid stored token instead of making an API get request while the network is disconnected. Note that a locally stored token could expire after a certain period of time and you would still need to make an API request to get a new valid token. In this case, additional error handling and retry logic would be required to prevent the container from disposing after a single failed attempt. 

How you choose to implement these improvements is completely up to you and the requirements of your application. Note that with the `localStorage` token solution, you'll also see performance improvements in your application because you're removing a network request on each `getContainer` call. 

Token-caching with something like `localStorage` may come with security implications, and it is up to your discretion when deciding what solution is appropriate for your application. Whether or not you implement token-caching, you should add error-handling and retry logic in `fetchOrdererToken` and `fetchStorageToken` so that the container isn't disposed after a single failed call. Consider, for example, wrapping the call of `getToken` in a `try` block with a `catch` block that retries and throws an error only after a specified number of retries.

## See also

- [Add custom data to an auth token](connect-fluid-azure-service.md#adding-custom-data-to-tokens)
- [How to: Deploy Fluid applications using Azure Static Web Apps](deploy-fluid-static-web-apps.md)
- [How to: Validate a User Created a Document](validate-document-creator.md)
