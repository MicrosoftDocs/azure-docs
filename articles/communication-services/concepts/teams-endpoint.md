---
title: Custom Teams endpoint
titleSuffix: An Azure Communication Services concept document
description: Building Custom Teams endpoint
author: tomaschladek
manager: nmurav
services: azure-communication-services

ms.author: tchladek
ms.date: 05/31/2021
ms.topic: overview
ms.service: azure-communication-services
---
# Custom Teams endpoint

> [!IMPORTANT]
> To enable/disable custom Teams endpoint experience, complete [this form](https://forms.office.com/r/B8p5KqCH19).

Azure Communication Services can be used to build custom Teams endpoints. With Azure Communication Services SDKs you can customize voice, video, chat, and screen sharing experience for Teams users. Custom Teams endpoints can communicate with the Microsoft Teams client or other custom Teams endpoints. 

You can use the Azure Communication Services Identity SDK to exchange AAD user tokens for Teams access tokens. Voice, video, and screen sharing capabilities are provided via Azure Communication Services Calling SDKs. The following diagram shows an overview of the process you'll follow as you integrate your calling experiences with custom Teams endpoints.

> [!NOTE]
> Following diagram shows multitenant use case, where company Fabrikam is customer of company Contoso.

![Process to enable calling feature for custom Teams endpoint experience](./media/teams-identity-calling-overview.png)

Chat capability is available via Graph APIs. Communication Services isn't required to use chat. You can learn more about Graph API in [the documentation](https://docs.microsoft.com/graph/api/channel-post-messages). 

> [!NOTE]
> Following diagram shows multitenant use case, where company Fabrikam is customer of company Contoso.

![Process to enable chat feature for custom Teams endpoint experience](./media/teams-identity-chat-overview.png)

## Next steps

> [!div class="nextstepaction"]
> [Issue Teams access token](../quickstarts/manage-teams-identity.md)

The following documents may be interesting to you:

- Learn about [Teams interoperability](./teams-interop.md)
