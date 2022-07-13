---
title: Build Azure Communication Services support Teams identities
titleSuffix: An Azure Communication Services concept document
description: This article discusses how to build Azure Communication Services support Teams identities.
author: tomaschladek
manager: nmurav
services: azure-communication-services

ms.author: tchladek
ms.date: 06/30/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
---
# Build Azure Communication Services support Teams identities

[!INCLUDE [Public Preview](../includes/public-preview-include-document.md)]

You can use Azure Communication Services and Graph API to build Azure Communication Services support Teams identities to communicate with the Microsoft Teams client or other Azure Communication Services support Teams identities. With Azure Communication Services support Teams identities, you can customize a voice, video, chat, and screen-sharing experience for Teams users.

You can use the Azure Communication Services Identity SDK to exchange Azure Active Directory (Azure AD) access tokens of Teams users for Communication Identity access tokens. The diagrams in the next sections demonstrate multitenant use cases, where fictional company Fabrikam is the customer of fictional company Contoso.

## Calling 

Voice, video, and screen-sharing capabilities are provided via Azure Communication Services Calling SDKs. The following diagram shows an overview of the process you'll follow as you integrate your calling experiences with Azure Communication Services support Teams identities.

![Diagram of the process of enabling the calling feature for Azure Communication Services support Teams identities experience.](./media/teams-identities/teams-identity-calling-overview.svg)

## Chat

Optionally, you can also use Azure Communication Services support Teams identities to integrate chat capabilities by using Graph APIs. For more information about the Graph API, see the [chat resource type](/graph/api/channel-post-messages) documentation. 

![Diagram of the process of enabling the chat feature for Azure Communication Services support Teams identities experience.](./media/teams-identities/teams-identity-chat-overview.png)

## Azure Communication Services permissions

### Delegated permissions

|   Permission    |  Display string   |  Description | Admin consent required | Microsoft account supported |
|:--- |:--- |:--- |:--- |:--- |
| _`https://auth.msft.communication.azure.com/Teams.ManageCalls`_ | Manage calls in Teams | Start, join, forward, transfer, or leave Teams calls and update call properties. | No | No |
| _`https://auth.msft.communication.azure.com/Teams.ManageChats`_ | Manage chats in Teams | Create, read, update, and delete 1:1 or group chat threads on behalf of the signed-in user. Read, send, update, and delete messages in chat threads on behalf of the signed-in user. | No | No |

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