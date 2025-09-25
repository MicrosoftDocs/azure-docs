---
title: Authenticate to Azure Communication Services
titleSuffix: An Azure Communication Services article
description: This article describes how you can use an app or service to authenticate to Azure Communication Services.
author: tophpalmer
manager: chpalm
services: azure-communication-services
ms.author: chpalm
ms.date: 09/05/2024
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: identity
---

# Authenticate to Azure Communication Services

Every client interaction with Azure Communication Services needs to be authenticated. In a typical architecture, see [client and server architecture](./client-and-server-architecture.md), *access keys* or *Microsoft Entra ID authentication* are used for server-side authentication.

Another type of authentication uses *user access tokens* to authenticate against services that require user participation. For example, the chat or calling service utilizes *user access tokens* to enable users to be added in a thread and have conversations with each other.

## Authentication Options

The following table shows the Azure Communication Services SDKs and their authentication options:

| SDK                | Authentication option                        |
|--------------------|----------------------------------------------|
| Identity           | Access Key or Microsoft Entra authentication |
| SMS                | Access Key or Microsoft Entra authentication |
| Phone Numbers      | Access Key or Microsoft Entra authentication |
| Call Automation    | Access Key or Microsoft Entra authentication |
| Email              | Access Key or Microsoft Entra authentication |
| Advanced Messaging | Access Key or Microsoft Entra authentication |
| Calling            | User Access Token                            |
| Chat               | User Access Token                            |

Each authorization option is briefly described as follows:

### Access Key

Access key authentication is suitable for service applications running in a trusted service environment. Your access key can be found in the Azure Communication Services portal. The service application uses it as a credential to initialize the corresponding SDKs. See an example of how it's used in the [Identity SDK](../quickstarts/identity/access-tokens.md). 

Since the access key is part of the connection string of your resource, authentication with a connection string is equivalent to authentication with an access key.

If you wish to call Azure Communication Services' APIs manually using an access key, then you need to sign the request. Signing the request is explained, in detail, within a [tutorial](../tutorials/hmac-header-tutorial.md).

<a name='azure-ad-authentication'></a>

To set up a service principal, [create a registered application from the Azure CLI](../quickstarts/identity/service-principal.md?pivots=platform-azcli). Then, the endpoint and credentials can be used to authenticate the SDKs. See examples of how [service principal](../quickstarts/identity/service-principal.md) is used.

Azure Communication services supports Microsoft Entra ID authentication for Communication Services resources. For more information about managed identity support, see [How to use Managed Identity with Azure Communication Services](/azure/communication-services/how-tos/managed-identity).

### Microsoft Entra ID Authentication

The Azure platform provides role-based access (Azure RBAC) to control access to resources. Azure RBAC security principal represents a user, group, service principal, or managed identity that is requesting access to Azure resources. Microsoft Entra ID authentication provides superior security and ease of use over other authorization options.

- **Managed Identity:**
  - By using managed identity, you avoid having to store your account access key within your code, as you do with Access Key authorization. The platform fully manages, rotates, and protects identity credentials, reducing the risk of credential exposure.
  - Managed identities can authenticate to Azure services and resources that support Microsoft Entra ID authentication. This method provides a seamless and secure way to manage credentials.
  - For more information about using Managed Identity with Azure Communication Services, see [Managed Identity](../how-tos/managed-identity.md). 

- **Service Principal:**
  - To set up a service principal, [create a registered application from the Azure CLI](../quickstarts/identity/service-principal.md?pivots=platform-azcli). Then use the endpoint and credentials to authenticate the SDKs.
  - For examples, see [service principal](../quickstarts/identity/service-principal.md).

Communication Services supports Microsoft Entra ID authentication for Communication Services resources, While you can continue to use Access Key authorization with communication services applications, Microsoft recommends moving to Microsoft Entra ID where possible.

Use our [Trusted authentication service hero sample](../samples/trusted-auth-sample.md) to map Azure Communication Services access tokens with your Microsoft Entra ID.

### User Access Tokens

User access tokens are generated using the Identity SDK and are associated with users created in the Identity SDK. See an example of how to [create users and generate tokens](../quickstarts/identity/access-tokens.md). Then, user access tokens are used to authenticate participants added to conversations in the Chat or Calling SDK. For more information, see [add chat to your app](../quickstarts/chat/get-started.md). User access token authentication is different compared to access key and Microsoft Entra authentication in that it's used to authenticate a user rather than a secured Azure resource.

## Using identity for monitoring and metrics

The user identity is intended to act as a primary key for logs and metrics collected through Azure Monitor. If you'd like to get a view of all of a specific user's calls, for example, you should set up your authentication in a way that maps a specific Azure Communication Services identity (or identities) to a singular user. Learn more about [log analytics](../concepts/analytics/query-call-logs.md), and [metrics](../concepts/authentication.md) available to you.

## Next steps

> [!div class="nextstepaction"]
> [Create and manage Communication Services resources](../quickstarts/create-communication-resource.md)

> [!div class="nextstepaction"]
> [Create a Microsoft Entra service principal application from the Azure CLI](../quickstarts/identity/service-principal.md?pivots=platform-azcli)

> [!div class="nextstepaction"]
> [Create user access tokens](../quickstarts/identity/access-tokens.md)

> [!div class="nextstepaction"]
> [Trusted authentication service hero sample](../samples/trusted-auth-sample.md)

## Related articles

- [Learn about client and server architecture](../concepts/identity-model.md#client-server-architecture-for-the-bring-your-own-identity-byoi-model)
