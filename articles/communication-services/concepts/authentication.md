---
title: Authenticate to Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn about the various ways an app or service can authenticate to Communication Services.
author: GrantMeStrength

manager: jken
services: azure-communication-services

ms.author: jken
ms.date: 07/24/2020
ms.topic: conceptual
ms.service: azure-communication-services
---

# Authenticate to Azure Communication Services

Every client interaction with Azure Communication Services needs to be authenticated. In a typical architecture, see [client and server architecture](./client-and-server-architecture.md), *access keys* or *managed identity* is used in the trusted user access service to create users and issue tokens. And *user access token* issued by the trusted user access service is used for client applications to access other communication services, for example, chat or calling service.

Azure Communication Services SMS service also accepts *access keys* or *managed identity* for authentication. This typically happens in a service application running in a trusted service environment.

Each authorization option is briefly described below:

- **Access Key** authentication for SMS and Identity operations. Access Key authentication is suitable for service applications running in a trusted service environment. Access key can be found in Azure Communication Services portal. To authenticate with an access key, a service application uses the access key as credential to initialize corresponding SMS or Identity client libraries, see [Create and manage access tokens](../quickstarts/access-tokens.md). Since access key is part of the connection string of your resource, see [Create and manage Communication Services resources](../quickstarts/create-communication-resource.md), authentication with connection string is equivalent to authentication with access key.
- **Managed Identity** authentication for SMS and Identity operations. Managed Identity, see [Managed Identity](../quickstarts/managed-identity.md), is suitable for service applications running in a trusted service environment. To authenticate with a managed identity, a service application creates a credential with the id and a secret of the managed identity then initialize corresponding SMS or Identity client libraries, see [Create and manage access tokens](../quickstarts/access-tokens.md).
- **User Access Token** authentication for Chat and Calling. User access tokens let your client applications authenticate against Azure Communication Chat and Calling Services. These tokens are generated in a "trusted user access service" that you create. They're then provided to client devices that use the token to initialize the Chat and Calling client libraries. For more information, see [Add Chat to your App](../quickstarts/chat/get-started.md) for example.

## Next steps

> [!div class="nextstepaction"]
> [Create and manage Communication Services resources](../quickstarts/create-communication-resource.md)
> [Create an Azure Active Directory managed identity application from the Azure CLI](../quickstarts/managed-identity-from-cli.md)
> [Creating user access tokens](../quickstarts/access-tokens.md)

For more information, see the following articles:
- [Learn about client and server architecture](../concepts/client-and-server-architecture.md)
