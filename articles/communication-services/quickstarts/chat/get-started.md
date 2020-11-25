---
title: Quickstart - Add chat to your app
titleSuffix: An Azure Communication Services quickstart
description: This quickstart shows you how to add Communication Services chat to your app.
author: fanche
manager: phans
services: azure-communication-services

ms.author: mikben
ms.date: 09/30/2020
ms.topic: quickstart
ms.service: azure-communication-services
zone_pivot_groups: acs-js-csharp-java-python
---
# Quickstart: Add Chat to your App

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]

Get started with Azure Communication Services by using the Communication Services Chat client library to add real-time chat to your application. In this quickstart, we'll use the Chat client library to create chat threads that allow users to have conversations with one another. To learn more about Chat concepts, visit the [chat conceptual documentation](../../concepts/chat/concepts.md).

::: zone pivot="programming-language-javascript"
[!INCLUDE [Chat with JavaScript client library](./includes/chat-js.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Chat with Python client library](./includes/chat-python.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Chat with Java client library](./includes/chat-java.md)]
::: zone-end

::: zone pivot="programming-language-csharp"
[!INCLUDE [Chat with C# client library](./includes/chat-csharp.md)]
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

 - Learn about [chat concepts](../../concepts/chat/concepts.md)
 - Familiarize yourself with [chat client library](../../concepts/chat/sdk-features.md)
