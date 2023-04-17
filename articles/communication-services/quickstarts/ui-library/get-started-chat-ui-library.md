---
title: Quickstart - Integrate chat experiences in your app by using UI Library
titleSuffix: An Azure Communication Services quickstart
description: Get started with Azure Communication Services UI Library composites to add Chat communication experiences to your applications.
author: dhiraj
ms.author: jorgegarc
ms.date: 11/29/2022
ms.topic: quickstart
ms.service: azure-communication-services
zone_pivot_groups: acs-plat-web-ios-android
ms.custom: mode-other
---

# Quickstart: Add chat with UI Library

Get started with Azure Communication Services UI Library to quickly integrate communication experiences into your applications. In this quickstart, learn how to integrate UI Library chat composites into an application and set up the experience for your app users.

Communication Services UI Library renders a full chat experience right in your application. It takes care of connecting to ACS chat services, and updates participant's presence automatically. As a developer, you need to worry about where in your app's user experience you want the chat experience to launch and only create the ACS resources as required.

::: zone pivot="platform-web"

[!INCLUDE [UI Library with Web](./includes/get-started-chat/web.md)]

::: zone-end

::: zone pivot="platform-android"

[!INCLUDE [UI Library with Android](./includes/get-started-chat/android.md)]

::: zone-end

::: zone pivot="platform-ios"

[!INCLUDE [UI Library with iOS](./includes/get-started-chat/ios.md)]

::: zone-end

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group.

Deleting the resource group also deletes any other resources associated with it.

Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).