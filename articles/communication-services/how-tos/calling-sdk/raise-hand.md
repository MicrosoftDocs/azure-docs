---
title: Raise hand states
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to send raised hand state.
author: rzdor
ms.author: ruslanzdor
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 09/09/2022
ms.custom: template-how-to
zone_pivot_groups: acs-plat-web-ios-android-windows

#Customer intent: As a developer, I want to learn how to send and receive Raise Hand state using SDK.
---

# Raise hand states
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
[!INCLUDE [Raise Hand Client-side JavaScript](./includes/raise-hand/raise-hand-web.md)]
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [Raise Hand Client-side Android](./includes/raise-hand/raise-hand-android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Record Calls Client-side iOS](./includes/raise-hand/raise-hand-ios.md)]
::: zone-end

::: zone pivot="platform-windows"
[!INCLUDE [Manage Video Calls Windows](./includes/raise-hand/raise-hand-windows.md)]
::: zone-end

Additional resources
For more information about using the Raise Hand feature in Teams calls and meetings, see the [Microsoft Teams documentation](https://support.microsoft.com/en-us/office/raise-your-hand-in-a-teams-meeting-bb2dd8e1-e6bd-43a6-85cf-30822667b372).


## Next steps
- [Learn how to manage calls](./manage-calls.md)
- [Learn how to manage video](./manage-video.md)
- [Learn how to record calls](./record-calls.md)
- [Learn how to transcribe calls](./call-transcription.md)
