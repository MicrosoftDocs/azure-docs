---
title: Add chat to your app
titleSuffix: An Azure Communication Services article
description: This article describes how to add Communication Services chat to your app.
author: tophpalmer
manager: phans
services: azure-communication-services
ms.author: chpalm
ms.date: 06/30/2021
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: chat
zone_pivot_groups: acs-azcli-js-csharp-java-python-swift-android-power-platform
ms.custom: mode-other, devx-track-azurecli, devx-track-extended-java, devx-track-js, devx-track-python
---

# Add Chat to your App

Add real-time chat to your app using the Communication Services Chat SDK. This article describes how to use the Chat SDK to create chat threads that enable users to have conversations with one another. To learn more about Chat concepts, see [chat conceptual documentation](../../concepts/chat/concepts.md).

::: zone pivot="platform-azcli"
[!INCLUDE [Chat with Azure CLI](./includes/chat-az-cli.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [Chat with JavaScript SDK](./includes/chat-js.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Chat with Python SDK](./includes/chat-python.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Chat with Java SDK](./includes/chat-java.md)]
::: zone-end

::: zone pivot="programming-language-android"
[!INCLUDE [Chat with Android SDK](./includes/chat-android.md)]
::: zone-end

::: zone pivot="programming-language-csharp"
[!INCLUDE [Chat with C# SDK](./includes/chat-csharp.md)]
::: zone-end

::: zone pivot="programming-language-swift"
[!INCLUDE [Chat with iOS SDK](./includes/chat-swift.md)]
::: zone-end

::: zone pivot="programming-language-power-platform"
[!INCLUDE [Chat with Power Platform](./includes/chat-logic-app.md)]
::: zone-end

## Clean up resources

To clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. For more information, see [cleaning up resources](../create-communication-resource.md#clean-up-resources).

## Next steps

This article described how to:

> [!div class="checklist"]
> * Create a chat client
> * Create a thread with two users
> * Send a message to the thread
> * Receive messages from a thread
> * Remove Users from a thread

> [!div class="nextstepaction"]
> [Try the Chat Hero App](../../samples/chat-hero-sample.md)

## Related articles

 - Get started with the [UI Library](../../concepts/ui-library/ui-library-overview.md).
 - Learn about [chat concepts](../../concepts/chat/concepts.md).
 - Familiarize yourself with [Chat SDK](../../concepts/chat/sdk-features.md).
 - Using [Chat SDK in your React Native](./react-native.md) application.
