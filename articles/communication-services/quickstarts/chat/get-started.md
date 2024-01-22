---
title: Quickstart - Add chat to your app
titleSuffix: An Azure Communication Services quickstart
description: This quickstart shows you how to add Communication Services chat to your app.
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
# Quickstart: Add Chat to your App

Get started with Azure Communication Services by using the Communication Services Chat SDK to add real-time chat to your application. In this quickstart, we'll use the Chat SDK to create chat threads that allow users to have conversations with one another. To learn more about Chat concepts, visit the [chat conceptual documentation](../../concepts/chat/concepts.md).

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

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).

## Next steps

In this quickstart you learned how to:

> [!div class="checklist"]
> * Create a chat client
> * Create a thread with two users
> * Send a message to the thread
> * Receive messages from a thread
> * Remove Users from a thread

> [!div class="nextstepaction"]
> [Try the Chat Hero App](../../samples/chat-hero-sample.md)

You may also want to:

 - Get started with the [UI Library](../../concepts/ui-library/ui-library-overview.md)
 - Learn about [chat concepts](../../concepts/chat/concepts.md)
 - Familiarize yourself with [Chat SDK](../../concepts/chat/sdk-features.md)
 - Using [Chat SDK in your React Native](./react-native.md) application.
