---
title: Identity model
titleSuffix: An Azure Communication Services concept
description: Learn about the identities and access tokens
author: tophpalmer
manager: sundraman
services: azure-communication-services

ms.author: chpalm
ms.date: 02/20/2025
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: identity
---

This guide presents data flow diagrams for [Azure Communication Services](/azure/communication-services). Use these diagrams to understand how your clients and services interact with Azure to deliver communication experiences.

## Users authenticated via user access tokens

Communication Services clients present user access tokens to access, with improved security, the Azure calling and chat data plane. You should generate and manage user access tokens by using a trusted service. The token and the connection string or Microsoft Entra secrets that are necessary to generate them need to be protected. Failure to properly manage access tokens can result in additional charges because of misuse of resources.

:::image type="content" source="./media/architecture-identity.png" alt-text="Diagram that shows the user access token architecture." border="false":::

### Dataflow

1. A user starts the client application.
2. The client application contacts your identity management service. The identity management service maintains a mapping between application identities and  Communication Services identities. (Application identities include your users and other addressable objects, like services or bots.)
3. The identity management service uses the mapping to [issue a user access token](/rest/api/communication/communication-identity/issue-access-token) for the applicable identity.

Azure App Service or Azure Functions are two alternatives for operating the identity management service. These services scale easily and have built-in features to [authenticate](/../../app-service/overview-authentication-authorization.md) users. They're integrated with [OpenID](../../app-service/configure-authentication-provider-openid-connect.md) and third-party identity providers like [Facebook](/../../app-service/configure-authentication-provider-facebook.md).

### Resources

- **Concept:** [User identity](/azure/communication-services/concepts/identity-model)
- **Sample:** [Build an identity management service using Azure Functions](https://github.com/Azure-Samples/communication-services-authentication-hero-nodejs)

## Next steps

- [Authenticate to Azure Communication Services](./authentication.md).
- [Create and manage access tokens](../quickstarts/identity/access-tokens.md).
