---
title: Integrate communication as Teams user with Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: This article discusses how to integrate communication as Teams user with Azure Communication Services.
author: tomaschladek
manager: nmurav
services: azure-communication-services

ms.author: tchladek
ms.date: 06/30/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
---
# Integrate communication as Teams user with Azure Communication Services and Graph API

[!INCLUDE [Public Preview](../includes/public-preview-include-document.md)]

You can use Azure Communication Services and Graph API to integrate communication as Teams user into your products to communicate with other people in and outside your organization. With Azure Communication Services supporting Teams identities and Graph API, you can customize a voice, video, chat, and screen-sharing experience for Teams users.

You can use the Azure Communication Services Identity SDK to exchange Azure Active Directory (Azure AD) access tokens of Teams users for Communication Identity access tokens. The diagrams in the next sections demonstrate multitenant use cases, where fictional company Fabrikam is the customer of fictional company Contoso. Contoso builds multi-tenant SaaS product that Fabrikam's administrator purchases for its employees. 

## Calling 

Voice, video, and screen-sharing capabilities are provided via [Azure Communication Services Calling SDKs](./interop/teams-user-calling.md). The following diagram shows an overview of the process you'll follow as you integrate your calling experiences with Azure Communication Services support Teams identities. You can learn more details about the [authentication](./interop/custom-teams-endpoint-authentication-overview.md) and [used packages](../quickstarts/manage-teams-identity.md). 

![Diagram of the process to integrate the calling capabilities into your product with Azure Communication Services.](./media/teams-identities/teams-identity-calling-overview.svg)

## Chat

Optionally, you can also use Graph API to integrate chat capabilities into your product. For more information about the Graph API, see the [chat resource type](/graph/api/channel-post-messages) documentation. 

![Diagram of the process to integrate the chat capabilities into your product with Graph API.](./media/teams-identities/teams-identity-chat-overview.png)

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
> [Check use cases for communication as a Teams user](./interop/custom-teams-endpoint-use-cases.md)

Find more details in the following articles:
- [Teams interoperability](./teams-interop.md)
- [Issue a Teams access token](../quickstarts/manage-teams-identity.md)
- [Start a call with Teams user as a Teams user](../quickstarts/voice-video-calling/get-started-with-voice-video-calling-custom-teams-client.md)
