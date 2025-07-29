---
title: Use UI components for chat
titleSuffix: An Azure Communication Services quickstart
description: Get started with Azure Communication Services UI Library composites to add chat communication experiences to your applications.
author: dhiraj
ms.author: jorgegarc
ms.date: 11/29/2022
ms.topic: quickstart
ms.service: azure-communication-services
zone_pivot_groups: acs-plat-web-ios-android
ms.custom: mode-other
---

# Use UI components for chat

Get started with Azure Communication Services UI Library to quickly integrate communication experiences into your applications. This article describes how to integrate UI Library chat composites into an application and set up the experience for your app users.

Azure Communication Services UI Library renders a full chat experience right in your application. It takes care of connecting to Azure Communication Services chat services and updates a participant's presence automatically. As a developer, you need to decide where in your app's user experience you want the chat experience to start and create only the Azure Communication Services resources as required.

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

If you want to clean up and remove an Azure Communication Services subscription, you can delete the resource or resource group.

Deleting the resource group also deletes any other resources associated with it.

Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).