---
title: Authenticate to Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn about the various ways an app or service can authenticate to Communication Services.
author: mikben

manager: jken
services: azure-communication-services

ms.author: mikben
ms.date: 03/10/2021
ms.topic: conceptual
ms.service: azure-communication-services
---

# Authenticate to Azure Communication Services

Every client interaction with Azure Communication Services needs to be authenticated. In a typical architecture, see [client and server architecture](./client-and-server-architecture.md), *access keys* or *managed identities* are used for authentication.

Another type of authentication uses *user access tokens* to authenticate against services that require user participation. For example, the chat or calling service utilizes *user access tokens* to allow users to be added in a thread and have conversations with each other.

## Authentication Options

The following table shows the Azure Communication Services client libraries and their authentication options:

| Client Library    | Authentication option                               |
| ----------------- | ----------------------------------------------------|
| Identity          | Access Key or Managed Identity                      |
| SMS               | Access Key or Managed Identity                      |
| Phone Numbers     | Access Key or Managed Identity                      |
| Calling           | User Access Token                                   |
| Chat              | User Access Token                                   |

Each authorization option is briefly described below:

### Access Key

Access key authentication is suitable for service applications running in a trusted service environment. Your access key can be found in the Azure Communication Services portal. The service application uses it as a credential to initialize the corresponding client libraries. See an example of how it is used in the [Identity client library](../quickstarts/access-tokens.md). 

Since the access key is part of the connection string of your resource, authentication with a connection string is equivalent to authentication with an access key.

If you wish to call ACS' APIs manually using an access key, then you will need to sign the request. Signing the request is explained, in detail, within a [tutorial](../tutorials/hmac-header-tutorial.md).

### Managed Identity

Managed Identities, provides superior security and ease of use over other authorization options. For example, by using Azure AD, you avoid having to store your account access key within your code, as you do with Access Key authorization. While you can continue to use Access Key authorization with communication services applications, Microsoft recommends moving to Azure AD where possible. 

To set up a managed identity, [create a registered application from the Azure CLI](../quickstarts/managed-identity-from-cli.md). Then, the endpoint and credentials can be used to authenticate the client libraries. See examples of how [managed identity](../quickstarts/managed-identity.md) is used.

### User Access Tokens

User access tokens are generated using the Identity client library and are associated with users created in the Identity client library. See an example of how to [create users and generate tokens](../quickstarts/access-tokens.md). Then, user access tokens are used to authenticate participants added to conversations in the Chat or Calling SDK. For more information, see [add chat to your app](../quickstarts/chat/get-started.md). User access token authentication is different compared to access key and managed identity authentication in that it is used to authenticate a user rather than a secured Azure resource.

## Next steps

> [!div class="nextstepaction"]
> [Create and manage Communication Services resources](../quickstarts/create-communication-resource.md)
> [Create an Azure Active Directory managed identity application from the Azure CLI](../quickstarts/managed-identity-from-cli.md)
> [Create User Access Tokens](../quickstarts/access-tokens.md)

For more information, see the following articles:
- [Learn about client and server architecture](../concepts/client-and-server-architecture.md)
