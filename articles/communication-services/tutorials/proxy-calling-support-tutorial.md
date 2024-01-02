---
title: Tutorial - Proxy your Azure Communication Services calling traffic across your own servers
titleSuffix: An Azure Communication Services tutorial
description: Learn how to have your media and signaling traffic be proxied to servers that you can control.
author: sloanster
services: azure-communication-services

ms.author: micahvivion
ms.date: 04/20/2023
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other
zone_pivot_groups: acs-plat-web-ios-android-windows
---
# How to force calling traffic to be proxied across your own server

In certain situations, it might be useful to have all your client traffic proxied to a server that you can control. When the SDK is initializing, you can provide the details of your servers that you would like the traffic to route to. Once enabled all the media traffic (audio/video/screen sharing) travel through the provided TURN servers instead of the Azure Communication Services defaults. This tutorial guides on how to have calling traffic be proxied to servers that you control.

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
