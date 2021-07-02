---
title: Custom Teams endpoint
titleSuffix: An Azure Communication Services concept document
description: Building Custom Teams endpoint
author: tomaschladek
manager: nmurav
services: azure-communication-services

ms.author: tchladek
ms.date: 06/30/2021
ms.topic: overview
ms.service: azure-communication-services
---
# Custom Teams endpoint

> [!IMPORTANT]
> To enable/disable the custom Teams endpoint experience, complete [this form](https://forms.office.com/r/B8p5KqCH19).

Azure Communication Services can be used to build custom Teams endpoints to communicate with the Microsoft Teams client or other custom Teams endpoints. With custom Teams endpoint you can customize voice, video, chat, and screen sharing experience for Teams users.

You can use the Azure Communication Services Identity SDK to exchange AAD user tokens for Teams' access tokens. In the following diagrams, is demonstrated multitenant use case, where Fabrikam is customer of the company Contoso.

## Calling 

Voice, video, and screen sharing capabilities are provided via Azure Communication Services Calling SDKs. The following diagram shows an overview of the process you'll follow as you integrate your calling experiences with custom Teams endpoints.

![Process to enable calling feature for custom Teams endpoint experience](./media/teams-identities/teams-identity-calling-overview.png)

## Chat

You can also use custom Teams endpoints to optionally integrate chat capabilities using Graph APIs. Learn more about Graph API in [the documentation](https://docs.microsoft.com/graph/api/channel-post-messages). 


![Process to enable chat feature for custom Teams endpoint experience](./media/teams-identities/teams-identity-chat-overview.png)

## Next steps

> [!div class="nextstepaction"]
> [Issue Teams access token](../quickstarts/manage-teams-identity.md)

The following documents may be interesting to you:

- Learn about [Teams interoperability](./teams-interop.md)
