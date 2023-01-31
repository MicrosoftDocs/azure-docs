---
title: Quickstart - Integrate experiences in your app by using UI Library
titleSuffix: An Azure Communication Services quickstart
description: Get started with Azure Communication Services UI Library composites to add Calling communication experiences to your applications.
author: garchiro7
ms.author: jorgegarc
ms.date: 10/10/2021
ms.topic: quickstart
ms.service: azure-communication-services
zone_pivot_groups: acs-plat-web-ios-android
ms.custom: mode-other
---

# Quickstart: Get started with UI Library

Get started with Azure Communication Services UI Library to quickly integrate communication experiences into your applications. In this quickstart, learn how to integrate UI Library composites into an application and set up the experience for your app users.

Communication Services UI Library renders a full communication experience right in your application. It takes care of connecting to the call, and it sets up the user's participation in the call behind the scenes. As a developer, you need to worry about where in your app's user experience you want the communication experience to launch. The composite takes the user through setting up their devices, joining the call and participating in it, and rendering other participants.

View this video for an overview:  

::: zone pivot="platform-web"
  
[!INCLUDE [UI Library with Web](./includes/get-started-call/web.md)]

::: zone-end

::: zone pivot="platform-android"

[!INCLUDE [UI Library with Android](./includes/get-started-call/android.md)]

::: zone-end

::: zone pivot="platform-ios"

[!INCLUDE [UI Library with iOS](./includes/get-started-call/ios.md)]

::: zone-end

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group.

Deleting the resource group also deletes any other resources associated with it.

Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).
