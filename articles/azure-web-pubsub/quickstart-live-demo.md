---
title: A simple Pub/Sub live demo
description: A quickstart for getting started with Azure Web PubSub service live demo.
author: yjin81
ms.author: yajin1
ms.service: azure-web-pubsub
ms.topic: overview 
ms.date: 04/26/2021
---

# Quickstart: Get started with chatroom live demo

The Azure Web PubSub service helps you build real-time messaging web applications using WebSockets and the publish-subscribe pattern easily. The [pub/sub live demo](https://azure.github.io/azure-webpubsub/demos/clientpubsub.html) demonstrates the real-time messaging capability provided by Azure Web PubSub. With this live demo, you could easily join a chat group and send real-time message to a specific group. 

:::image type="content" source="media/quickstart-live-demo/chat-live-demo.gif" alt-text="Using the chatroom live demo.":::

In this quickstart, learn how to get started easily with a live demo.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [create-instance-portal](includes/create-instance-portal.md)]

[!INCLUDE [try a simple live demo](includes/try-live-demo.md)]

## Next steps

This quickstart provides you a basic idea of the Web PubSub service. In this quickstart, we leverage the *Client URL Generator* to generate a temporarily available client URL to connect to the service. In real-world applications, SDKs in various languages are provided for you to generate the client URL from the *Connection String*. Besides using SDKs to talk to the Web PubSub service from the application servers, Azure Function extension is also provided for you to build your serverless applications. 

Follow the quick starts listed below to start building your own application.

> [!div class="nextstepaction"]
> [Quick start: publish and subscribe messages in Azure Web PubSub](https://azure.github.io/azure-webpubsub/getting-started/publish-messages/js-publish-message)

> [!div class="nextstepaction"]
> [Quick start: Create a simple chatroom with Azure Web PubSub](https://azure.github.io/azure-webpubsub/getting-started/create-a-chat-app/js-handle-events)

> [!div class="nextstepaction"]
> [Quickstart: Create a serverless simple chat application with Azure Functions and Azure Web PubSub service](./quickstart-serverless.md)

> [!div class="nextstepaction"]
> [Explore more Azure Web PubSub samples](https://github.com/Azure/azure-webpubsub/tree/main/samples)