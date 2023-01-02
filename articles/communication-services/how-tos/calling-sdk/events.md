---
title: Subscribe to SDK events
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to subscribe to SDK events.
author: tophpalmer
ms.author: chpalm
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 08/10/2021
ms.custom: template-how-to
zone_pivot_groups: acs-plat-web-ios-android

#Customer intent: As a developer, I want to subscribe to SDK events so that I know when things change.
---

# Subscribe to SDK events

Azure Communication Services SDKs are dynamic and contain a lot of properties. When these change, as a developer you might want to know when and more importantly what changes. Here's how!

::: zone pivot="platform-web"
[!INCLUDE [Events JavaScript](./includes/events/events-web.md)]
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [Events Android](./includes/events/events-android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Events iOS](./includes/events/events-ios.md)]
::: zone-end

## Next steps
- [Try our calling quickstart](../../quickstarts/voice-video-calling/getting-started-with-calling.md)
- [Try our video calling quickstart](../../quickstarts/voice-video-calling/get-started-with-video-calling.md)
- [Learn how to enable push notifications](./push-notifications.md)