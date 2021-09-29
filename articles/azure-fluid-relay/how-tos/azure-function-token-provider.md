---
title: "How to: Write a TokenProvider with an Azure Function"
description: How to write a custom token provider as an Azure Function and deploy it.
services: azure-fluid
author: sdeshpande3
ms.author: sdeshpande
ms.date: 09/28/2021
ms.topic: article
ms.service: azure-fluid
fluid.url: https://fluidframework.com/docs/build/tokenproviders/
---

# How to: Write a TokenProvider with an Azure Function

The token provider is responsible for creating and signing tokens that the `@fluidframework/azure-client` uses to make
requests to the Azure Fluid Relay service. There are two ways by which you can generate the token:

- `InsecureTokenProvider`
- Implement your own `TokenProvider` class for fetching the token and a backend for token generation

Fluid provides an `InsecureTokenProvider` that accepts your tenant secret, then locally generates and returns a signed token. This type of token provider is only useful for development purpose. For production scenarios, you must use a secure token provider.

## Implementing your own TokenProvider class

The `TokenProvider` class can be created by extending the `ITokenProvider` interface, thereby not exposing the tenant key secret in the client-side bundle code. While the tenant ID, orderer and storage URLs are fine to be on client-side code, the tenant key itself should not be exposed as it would allow malicious users to gain access to your tenant. The `TokenProvider` class would fetch the token from your very own backend service, thus providing a secure way for token resolution.

The `ITokenProvider` interface has two token calls: `fetchOrdererToken` and `fetchStorageToken`. They are responsible for fetching the orderer and storage URLs from the host respectively. Both functions return `TokenResponse` objects representing the token value.

There are few possible ways through which you can setup your own backend service for token generation such as a backend API endpoint that will handle the token generation, etc. One of the possible backend service which you can setup is an `Azure Function`. This lets you run your code in a serverless environment without having to create a virtual machine or publish a web application. It allows you to write less code, maintain less infrastructure, and save on costs.

## TokenProvider class example

In the example below, the token provider class is called `AzureFunctionTokenProvider`. This class would be fetching the token from your very own backend Azure Function. It accepts the URL to your Azure Function, `userId` and`userName`. This specific implementation is also provided for you as an export from the `@fluidframework/azure-client` package.

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

The below code snippet can help you with creating your own `HTTPTrigger Azure Function` for fetching the token by passing in your tenant key.

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

The `generateToken` function will generate a token for the given user that is signed using the tenant's secret key. This allows the token to be returned to the client without ever exposing the secret itself to it. Instead, the token is generated using it to provide scoped access to the given document. This token can be returned by an `ITokenProvider` implementation to use with the `AzureClient`.

## Adding custom data to tokens

You can add custom data such as email address, address, etc. for your token generation. See [the token providers
section here](connect-fluid-azure-service.md#token-providers) for more information.
