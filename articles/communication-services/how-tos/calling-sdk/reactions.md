---
title: Reactions
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to send and receive reactions.
author: jamescadd
manager: chpalm
ms.author: jacadd
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 10/20/2023
ms.custom: template-how-to
---

# Reactions
In this article, you learn how to implement the reactions capability with Azure Communication Services Calling SDKs. This capability allows users in a group call or meeting to send and receive reactions with participants in Azure Communication Services and Microsoft Teams. Reactions for users in Microsoft Teams are controlled by the configuration and policy settings in Teams. Additional information is available in [Manage reactions in Teams meetings and webinars](/microsoftteams/manage-reactions-meetings) and [Meeting options in Microsoft Teams](https://support.microsoft.com/en-us/office/meeting-options-in-microsoft-teams-53261366-dbd5-45f9-aae9-a70e6354f88e)

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).
- Optional: Complete the quickstart to [add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md)

[!INCLUDE [Spotlight Client-side JavaScript](./includes/reactions/reactions-web.md)]

## Next steps
- [Learn how to manage calls](./manage-calls.md)
- [Learn how to manage video](./manage-video.md)
