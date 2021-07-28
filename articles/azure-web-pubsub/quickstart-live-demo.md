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

## Get started with the chatroom live demo

### Get client URL with a temp access token

As the first step, you need to get the Client URL from the Azure Web PubSub instance. 

- Go to Azure portal and find out the Azure Web PubSub instance.
- Go to the `Client URL Generator` in `Key` blade. 
- Set proper `Roles`: **Send To Groups** and **Join/Leave Groups**
- Generate and copy the `Client Access URL`. 

:::image type="content" source="media/quickstart-live-demo/generate-client-url.png" alt-text="Screenshot of generating client URL.":::

### Try the live demo 

With this live demo, you could join or leave a group and send messages to the group members easily. 

- Open [chatroom live demo](https://azure.github.io/azure-webpubsub/demos/clientpubsub.html), paste the `Client Access URL` and Connect. 

:::image type="content" source="media/quickstart-live-demo/paste-client-access-url.png" alt-text="Screenshot of pasting client URL with live demo.":::

> [!NOTE]
>  **Client Access URL** is a convenience tool provided in the portal to simplify your getting-started experience, you can also use this Client Access URL to do some quick connect test. To write your own application, we provide SDKs in 4 languages to help you generate the URL. 

- Try different groups to join and different groups to send messages to, and see what messages are received. For example:
    - Make two clients joining into the same group. You will see that the message could broadcast to the group members. 
    - Make two clients joining into different groups. You will see that the client cannot receive message if it is not group member. 
- You can also try to uncheck `Roles` when generating the `Client Access URL` to see what will happen when join a group or send messages to a group. For example:
    - Uncheck the `Send to Groups` permission. You will see that the client cannot send messages to the group. 
    - Uncheck the `Join/Leave Groups` permission. You will see that the client cannot join a group. 

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