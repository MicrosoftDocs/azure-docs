---
title: Authentication and authorization in your app
description: Overview of how to use authentication and authorization with an Azure Fluid Relay service. 
ms.date: 10/05/2021
ms.topic: article
ms.service: azure-fluid
fluid.url: https://fluidframework.com/docs/build/auth/
---

# Authentication and authorization in your app

Security is critical to modern web applications. Fluid Framework, as a part of your web application architecture is an important piece of infrastructure to secure. Fluid Framework is a layered architecture, and auth-related concepts are implemented based on the Fluid service it's connecting to. This means that, although there are common authentication themes across all Fluid services, the details and specifics will differ for each service.

## Azure Fluid Relay service

Each Azure Fluid Relay service tenant you create is assigned a **tenant ID** and its own unique **tenant secret key**.

The secret key is a **shared secret**. Your app/service knows it, and the Azure Fluid Relay service knows it. Since the tenant secret key is uniquely tied to your tenant, using it to sign requests guarantees to the Azure Fluid Relay service that the requests are coming from an authorized user of the tenant.

The secret key is how the Azure Fluid Relay service knows that requests are coming from your app or service. This is critical, because once the Azure Fluid Relay service can trust that it's *your app* making the requests, it can trust the data you send. This is also why it's important that the secret is handled securely.

> [!CAUTION]
> Anyone with access to the secret can impersonate your application when communicating with Azure Fluid Relay service.

## JSON Web Tokens and Azure Fluid Relay service

Azure Fluid Relay uses [JSON Web Tokens (JWTs)](https://jwt.io/) to encode and verify data signed with your secret key. JSON Web Tokens are a signed bit of JSON that can include additional information about rights and permissions.

> [!NOTE]
> The specifics of JWTs are beyond the scope of this article. For more information about the JWT standard, see [Introduction to JSON Web Tokens](https://jwt.io/introduction).

Though the details of authentication differ between Fluid services, several values must always be present.

- **containerId**  The Fluid service needs the container ID to identify which service corresponds to the calling container. *Note*: JWT calls this field documentId, but the Fluid service expects a container ID in this field.
- **tenantId**: The Azure Fluid Relay service uses the tenant ID to retrieve the shared secret that it will use to authenticate your request. 
- **scopes**: Scopes define the calling container's permissions. The contents of the scopes field is flexible, allowing you to create your own custom permissions.

```json {linenos=inline,hl_lines=["5-6",13]}
{
  "alg": "HS256",
  "typ": "JWT"
}.{
  "documentId": "azureFluidDocumentId",
  "scopes": [ "doc:read", "doc:write", "summary:write" ],
  "user": {
    "name": "TestUser",
    "id": "Test-Id-123"
  },
  "iat": 1599098963,
  "exp": 1599098963,
  "tenantId": "AzureFluidTenantId",
  "ver": "1.0"
}.[Signature]
```

The mode of the user indicates whether the connection is in read or read/write mode. This can be viewed from the `connections` field in `AzureAudience`. The token scope permissions can be updated in your serverless Azure Function under the `generateToken` function.

```ts
const token = generateToken(
  tenantId,
  documentId,
  key,
  scopes ?? [ "Token Scope" ],
  user
);
```

The token scopes along with the container behavior and modes are as follows:

| Token Scope | My Document Behavior | Audience Document Behavior | 
|-------------|----------------------|----------------------------|
| DocRead     | Read and write to the document. Changes made to the document are not reflected in any other audience document. <br /> Mode: Read | Read and write to document. Changes not reflected in any other audience document. <br /> Mode: Write | 
| DocWrite    | Read and write to the document. Changes made are reflected in all other audience document. <br />Mode: Write | Read and write to the document. Changes made are reflected in all other audience document. <br />Mode: Write |
| DocRead, DocWrite | Read and write to the document. Changes made are reflected in all other audience document. <br />Mode: Write | Read and write to the document. Changes made are reflected in all other audience document. <br />Mode: Write |

> [!NOTE]
> Note that the token also includes user information (see lines 7-9 above). You can use this to augment the user information that is automatically available to Fluid code using the [audience](../how-tos/connect-fluid-azure-service.md#getting-audience-details) feature. See [Adding custom data to tokens](../how-tos/connect-fluid-azure-service.md#adding-custom-data-to-tokens) for more information.

## The token provider

Every request to Azure Fluid Relay must be signed with a valid JWT. Fluid delegates the responsibility of creating and signing these tokens to token providers.

A token provider is responsible for creating and signing tokens that the `@fluidframework/azure-client` uses to make requests to the Azure Fluid Relay service. You are required to provide your own secure token provider implementation. However, Fluid provides an `InsecureTokenProvider` that accepts your tenant secret, then locally generates and returns a signed token. This token provider is useful for testing, but cannot be used in production scenarios.

### A secure serverless token provider

One option for building a secure token provider is to create a serverless Azure Function and expose it as a token provider. This enables you to store the *tenant secret key* on a secure server. Your application would then call the Azure Function to generate tokens rather than signing them locally like the `InsecureTokenProvider` does. For more information, see [How to: Write a TokenProvider with an Azure Function](../how-tos/azure-function-token-provider.md).

## Connecting user auth to Fluid service auth

Fluid services authenticate incoming calls using a shared client secret, which is not tied to a specific user. User authentication can be added based on the details of your Fluid service. 

One simple option for user authentication would be to simply use an [Azure Function](../../azure-functions/index.yml) as your token provider, and enforce user authentication as a condition of obtaining a token. If an application tries to call the Function it would fail unless authenticated with your auth system. If you're using Azure Active Directory (Azure AD), for example, you might create an Azure AD application for your Azure Function, and tie it to your organization's auth system.

In this case the user would sign into your application using Azure AD, through which you would obtain a token to use to call your Azure Function. The Azure Function itself behaves the same, but it's now only accessible to people who have also authenticated with Azure AD.

Since the Azure Function is now your entry point into obtaining a valid token, only users who have properly authenticated to the Function will then be able to provide that token to the Azure Fluid Relay service from their client application. This two-step approach enables you to use your own custom authentication process in conjunction with the Azure Fluid Relay service.

## See also

- [Introduction to JWTs](https://jwt.io/introduction)
- [How to create a JSON Web Token](../how-tos/fluid-json-web-token.md)
- [Payload claims in Azure Fluid Relay](../how-tos/fluid-json-web-token.md#payload-claims)
