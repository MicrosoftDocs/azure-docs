---
title: Display call recording state on the client with Azure Communication Services SDKs
description: Use Azure Communication Services SDKs to detect and display the call recording state.
author: probableprime
ms.author: rifox
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 08/10/2021
ms.custom: template-how-to
zone_pivot_groups: acs-web-ios-android

#Customer intent: As a developer, I want to display the call recording state on the client so that users are aware of the call recording state.
---

# Display call recording state on the client with Azure Communication Services SDKs

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

When using [call recording](../../concepts/voice-video-calling/call-recording.md), it can be useful to detect the state of the recording on the client side. This is useful to notify users within a call that the call is being recorded etc. Here we'll learn how to do this on the client side, to actually record calls you will need to set it up on the [server side](../../../../quickstarts/voice-video-calling/call-recording-sample.md).

::: zone pivot="platform-web"
[!INCLUDE [Record Calls Client-side JavaScript](./includes/record-calls/record-calls-web.md)]
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [Record Calls Client-side Android](./includes/record-calls/record-calls-android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Record Calls Client-side iOS](./includes/record-calls/record-calls-ios.md)]
::: zone-end

## Next steps
<!-- Add a context sentence for the following links -->
- 