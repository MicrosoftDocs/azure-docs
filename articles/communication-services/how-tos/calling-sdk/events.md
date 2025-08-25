---
title: Subscribe to SDK events
titleSuffix: An Azure Communication Services article
description: Use Azure Communication Services SDKs to subscribe to SDK events.
author: tophpalmer
ms.author: chpalm
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 06/15/2025
ms.custom: template-how-to
zone_pivot_groups: acs-plat-web-ios-android

#Customer intent: As a developer, I want to subscribe to SDK events so that I know when things change.
---

# Subscribe to SDK events

We recommend subscribing to Calling SDK Events. Azure Communication Services SDKs are dynamic and contain properties that might change over time. You can subscribe to these events to be notified in advance of any changes. Follow the instructions in this article to subscribe to Azure Communication Services SDK events.

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