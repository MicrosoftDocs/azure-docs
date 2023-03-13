---
title: Spotlight states
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to send spotlight state.
author: cnwankwo
ms.author: Chukwuebuka
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 03/01/2023
ms.custom: template-how-to
zone_pivot_groups: acs-web

#Customer intent: As a developer, I want to learn how to send and receive Spotlight state using SDK.
---

# Spotlight states

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

During an active call, you may want to send or receive states from other users. Let's learn how. 

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).
- Optional: Complete the quickstart to [add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md)

::: zone pivot="platform-web"
[!INCLUDE [Spotlight Client-side JavaScript](./includes/spotlight/spotlight-web.md)]
::: zone-end

## Next steps
- [Learn how to manage calls](./manage-calls.md)
- [Learn how to manage video](./manage-video.md)
- [Learn how to record calls](./record-calls.md)
- [Learn how to transcribe calls](./call-transcription.md)
