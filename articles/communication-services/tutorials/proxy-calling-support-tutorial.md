---
title: Proxy your calling traffic
titleSuffix: An Azure Communication Services article
description: This article describes how to have your media and signaling traffic proxied to servers that you can control.
author: sloanster
services: azure-communication-services

ms.author: micahvivion
ms.date: 06/27/2025
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other
zone_pivot_groups: acs-plat-web-ios-android-windows
---

# Proxy your calling traffic

This article describes how to proxy your Azure Communication Services calling traffic across your own servers.

In certain situations, it might be useful to have all your client traffic proxied to a server that you can control. When the SDK is initializing, you can provide the details of your servers that you want the traffic to route to. Once enabled, all the media traffic (audio/video/screen sharing) travels through the provided TURN servers instead of the Azure Communication Services defaults.

This article describes how to:

> [!div class="checklist"]
> * Set up a TURN server.
> * Set up a signaling proxy server.

## Prerequisites

None

::: zone pivot="platform-web"
[!INCLUDE [Proxy support with JavaScript](./includes/proxy-calling-support-tutorial-web.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Proxy support with iOS](./includes/proxy-calling-support-tutorial-ios.md)]
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [Proxy support with Android](./includes/proxy-calling-support-tutorial-android.md)]
::: zone-end

::: zone pivot="platform-windows"
[!INCLUDE [Proxy support with Windows](./includes/proxy-calling-support-tutorial-windows.md)]
::: zone-end
