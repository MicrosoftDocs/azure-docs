---
title: "How to: Write a TokenProvider with an Azure Function"
description: How to write a custom token provider as an Azure Function and deploy it.
services: azure-fluid
author: hickeys
ms.author: hickeys
ms.date: 10/05/2021
ms.topic: article
ms.service: azure-fluid
fluid.url: https://fluidframework.com/docs/build/tokenproviders/
---

# How to: Write a TokenProvider with an Azure Function

> [!NOTE]
> This preview version is provided without a service-level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.

In the [Fluid Framework](https://fluidframework.com/), TokenProviders are responsible for creating and signing tokens that the `@fluidframework/azure-client` uses to make requests to the Azure Fluid Relay service. The Fluid Framework provides a simple, insecure TokenProvider for development purposes, aptly named **InsecureTokenProvider**. Each Fluid service must implement a custom TokenProvider based on the particulars service's authentication and security considerations.

## Implementing your own TokenProvider class

Each Azure Fluid Relay service tenant you create is assigned a **tenant ID** and its own unique **tenant secret key**. The secret key is a **shared secret**. Your app/service knows it, and the Azure Fluid Relay service knows it. 

TokenProviders must know the secret key to sign requests, but the secret key cannot be included in client code. TokenProviders contact the Fluid server at runtime to securely obtain the secret key without exposing it to the client. This is accomplished through two separate API calls: `fetchOrdererToken` and `fetchStorageToken`. They are responsible for fetching the orderer and storage URLs from the host respectively. Both functions return `TokenResponse` objects representing the token value.

## TokenProvider class example

One option for building a secure token provider is to create a serverless Azure Function and expose it as a token provider. This enables you to store the *tenant secret key* on a secure server. Your application would then call the Azure Function to generate tokens.

This example implements that pattern in a class called **AzureFunctionTokenProvider**. It accepts the URL to your Azure Function, `userId` and`userName`. This specific implementation is also provided for you as an export from the `@fluidframework/azure-client` package.

```typescript
import { ITokenProvider, ITokenResponse } from "@fluidframework/azure-client";

export class AzureFunctionTokenProvider implements ITokenProvider {
  constructor(
    private readonly azFunctionUrl: string,
    private readonly userId: string,
    private readonly userName: string,
  );

  public async fetchOrdererToken(tenantId: string, documentId: string): Promise<ITokenResponse> {
        return {
            jwt: await this.getToken(tenantId, documentId),
        };
    }

    public async fetchStorageToken(tenantId: string, documentId: string): Promise<ITokenResponse> {
        return {
            jwt: await this.getToken(tenantId, documentId),
        };
    }
}
```

To ensure that the tenant secret key is kept secure, it is stored in a secure backend location and is only accessible from within the Azure Function. One way to fetch a signed token is to make a `GET` request to your Azure Function, providing the `tenantID` and `documentId`, and `userID`/`userName`. The Azure Function is responsible for the mapping between the tenant ID and a tenant key secret to appropriately generate and sign the token such that the Azure Fluid Relay service will accept it.

```typescript
private async getToken(tenantId: string, documentId: string): Promise<string> {
    const params = {
        tenantId,
        documentId,
        userId: this.userId,
        userName: this.userName,
    };
    const token = this.getTokenFromServer(params);
    return token;
}
```

The example below uses the [`axios`](https://www.npmjs.com/package/axios) library to make HTTP requests. You can use other libraries or approaches to making an HTTP request.

```typescript
private async getTokenFromServer(input: any): Promise<string> {
    return axios.get(this.azFunctionUrl, {
        params: input,
    }).then((response) => {
        return response.data as string;
    }).catch((err) => {
        return err as string;
    });
}
```

This example demonstrates how to create your own **HTTPTrigger Azure Function** that fetches the token by passing in your tenant key.

```typescript
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { ScopeType } from "@fluidframework/azure-client";
import { generateToken } from "@fluidframework/azure-service-utils";

//Replace "myTenantKey" with your key here.
const key = "myTenantKey";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    // tenantId, documentId, userId and userName are required parameters
    const tenantId = (req.query.tenantId || (req.body && req.body.tenantId)) as string;
    const documentId = (req.query.documentId || (req.body && req.body.documentId)) as string;
    const userId = (req.query.userId || (req.body && req.body.userId)) as string;
    const userName = (req.query.userName || (req.body && req.body.userName)) as string;
    const scopes = (req.query.scopes || (req.body && req.body.scopes)) as ScopeType[];

    if (!tenantId) {
        context.res = {
            status: 400,
            body: "No tenantId provided in query params",
        };
    }

    if (!key) {
        context.res = {
            status: 404,
            body: `No key found for the provided tenantId: ${tenantId}`,
        };
    }

    if (!documentId) {
        context.res = {
            status: 400,
            body: "No documentId provided in query params"
        };
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

The `generateToken` function generates a token for the given user that is signed using the tenant's secret key. This allows the token to be returned to the client without ever exposing the secret itself to it. Instead, the token is generated using it to provide scoped access to the given document. This token can be returned by an `ITokenProvider` implementation to use with the `AzureClient`.

## See also

- [Add custom data to an auth token](connect-fluid-azure-service.md#adding-custom-data-to-tokens)
