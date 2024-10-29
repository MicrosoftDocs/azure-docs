---
title: Media access states
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to send media access state.
author: fuyan
ms.author: fuyan
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 10/24/2024
ms.custom: template-how-to
zone_pivot_groups: acs-plat-web-ios-android-windows

#Customer intent: As a developer, I want to learn how to send and receive Media access state using SDK.
---

# Media access states
::: zone pivot="platform-android"
[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]
::: zone-end

::: zone pivot="platform-windows"
[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]
::: zone-end
During an active call, you may want to send or receive states from other users. Let's learn how. 

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).
- Optional: Complete the quickstart to [add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md)

::: zone pivot="platform-web"
[!INCLUDE [Media Access Client-side JavaScript](./includes/media-access/media-access-web.md)]
::: zone-end

Additional resources
For more information about using the Media Access feature in Teams calls and meetings, see the [Microsoft Teams documentation](https://support.microsoft.com/en-us/office/manage-attendee-audio-and-video-permissions-in-microsoft-teams-meetings-f9db15e1-f46f-46da-95c6-34f9f39e671a).


## Next steps
- [Learn how to manage calls](./manage-calls.md)
- [Learn how to manage video](./manage-video.md)
- [Learn how to record calls](./record-calls.md)
- [Learn how to transcribe calls](./call-transcription.md)