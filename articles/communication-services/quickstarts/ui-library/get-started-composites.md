---
title: Quickstart - Add UI Library into your app
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to get started with UI Library composites
author: jorgegarc
ms.author: jorgegarc
ms.date: 10/10/2021
ms.topic: quickstart
ms.service: azure-communication-services
zone_pivot_groups: acs-plat-web-ios-android
ms.custom: mode-other
---

# Quickstart: Get started with the UI Library

Get started with Azure Communication Services by using the UI Library to quickly integrate communication experiences into your applications. In this quickstart, you'll learn how to integrate the composites into your  applications.

The UI library will render a full communication experience right into your application. It takes care of connecting to the desired call and setting it up behind the scenes. As a developer you just need to worry about where in your experience you want the communication experience to launch. The composite takes the user through setting up their devices, joining the call and participating in it, and rendering other participants.

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
