---
title: Manage call recording on the client with Azure Communication Services SDKs
description: Use Azure Communication Services SDKs to manage call recording on the client.
author: probableprime
ms.author: rifox
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 08/10/2021
ms.custom: template-how-to
zone_pivot_groups: acs-web-ios-android

#Customer intent: As a developer, I want to manage call recording on the client so that my users can record calls.
---

# Manage call recording on the client with Azure Communication Services SDKs

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

[Call recording](../../concepts/voice-video-calling/call-recording.md), lets your users record their calls made with Azure Communication Services. Here we'll learn how to manage recording on the client side. Before this can work you will need to setup [server side](../../../../quickstarts/voice-video-calling/call-recording-sample.md) recording.

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