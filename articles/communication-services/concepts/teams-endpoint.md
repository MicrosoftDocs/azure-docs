---
title: Build a custom Teams endpoint
titleSuffix: An Azure Communication Services concept document
description: This article discusses how to build a custom Teams endpoint.
author: tomaschladek
manager: nmurav
services: azure-communication-services

ms.author: tchladek
ms.date: 06/30/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
---
# Build a custom Teams endpoint

[!INCLUDE [Public Preview](../includes/public-preview-include-document.md)]

You can use Azure Communication Services and Graph API to build custom Teams endpoints to communicate with the Microsoft Teams client or other custom Teams endpoints. With a custom Teams endpoint, you can customize a voice, video, chat, and screen-sharing experience for Teams users.

You can use the Azure Communication Services Identity SDK to exchange Azure Active Directory (Azure AD) access tokens of Teams users for Communication Identity access tokens. The diagrams in the next sections demonstrate multitenant use cases, where fictional company Fabrikam is the customer of fictional company Contoso.

## Calling 

Voice, video, and screen-sharing capabilities are provided via Azure Communication Services Calling SDKs. The following diagram shows an overview of the process you'll follow as you integrate your calling experiences with custom Teams endpoints.

![Diagram of the process of enabling the calling feature for a custom Teams endpoint experience.](./media/teams-identities/teams-identity-calling-overview.svg)

## Chat

Optionally, you can also use custom Teams endpoints to integrate chat capabilities by using Graph APIs. For more information about the Graph API, see the [chat resource type](/graph/api/channel-post-messages) documentation. 

![Diagram of the process of enabling the chat feature for a custom Teams endpoint experience.](./media/teams-identities/teams-identity-chat-overview.png)

## Azure Communication Services permissions

### Delegated permissions

|   Permission    |  Display string   |  Description | Admin consent required | Microsoft account supported |
|:--- |:--- |:--- |:--- |:--- |
| _`https://auth.msft.communication.azure.com/Teams.ManageCalls`_ | Manage calls in Teams | Start, join, forward, transfer, or leave Teams calls and update call properties. | No | No |

### Application permissions

None.

### Roles for granting consent on behalf of a company

- Global admin
- Application admin
- Cloud application admin

Find more details in [Azure Active Directory documentation](../../active-directory/roles/permissions-reference.md).

## Next steps

> [!div class="nextstepaction"]
> [Issue a Teams access token](../quickstarts/manage-teams-identity.md)

Learn about [Teams interoperability](./teams-interop.md).