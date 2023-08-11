---
title: Service internal - how does Web PubSub support Socket.IO library
description: An article explaining how Web PubSub supports Socket.IO library
author: kevinguo-ed
ms.author: kevinguo
ms.date: 08/1/2023
ms.service: azure-web-pubsub
ms.topic: conceptual
---

# Service internal - how does Web PubSub support Socket.IO library

> [!NOTE]
> This article peels back the curtain from an engieerning perspective of how self-hosted Socket.IO apps can migrate to Azure with minimal code change to simplify app architecture and deployment, while achieving 100 K+ concurrent connections out-of-the-box. It's not necessary to understand everything in this article to use Web PubSub for Socket.IO effectively. 

## A typical architecture of a self-hosted Socket.IO app
:::image type="content" source="./media/socketio-service-internal/typical-architecture-self-hosted-socketio-app.jpg" alt-text="Screenshot of a typical architecture of a self-hosted Socket.IO app.":::

The diagram shows a typical architecture of a self-hosted Socket.IO app. To ensure that an app is scalable and reliable, Socket.IO users often have an architecture involving multiple Socket.IO servers. Client connections are distributed among Socket.IO servers to balance load on the system. A setup of multiple Socket.IO servers introduces the challenge when developers need to send the same message to clients connected to different server. This use case is often referred to as "broadcasting messages" by developers. 

The official recommendation from Soket.IO library is to introduce a server-side component called ["adapter"](https://socket.io/docs/v4/using-multiple-nodes/)to coordinate Socket.IO servers. What an adapter does is to figure out which servers clients are connected to and instruct those servers to send messages. 

Adding an adapter component introduces complexity to both development and deployment. For example, if the [Redis adapter](https://socket.io/docs/v4/redis-adapter/) is used, it means developers need to 
- implement sticky session
- deploy and maintain Redis instance(s)

The engineering effort and time of getting a real-time communication channel in place distracts developers from working on features that make an app or system unique and valuable to end users.

## What Web PubSub for Socket.IO aims to solve for developers
Although setting up a reliable and scalable app built with Socket.IO library is often reported as challenging by developers, developers **enjoy** the intuitive APIs offered and the wide range of clients the library supports. Web PubSub for Socket.IO builds on the values the library brings, while relieving developers the complexity of managing persistent connections reliably and at scale. 

In practice, developers can continue using the APIs offered by Socket.IO library, but don't need to provision server resources to maintain WebSocket or long-polling based connections, which can be resource intensive. Also, developers don't need to manage and deploy an "adapter" component. The app server only needs to send a **single** operation and the Web PubSub for Socket.IO broadcasts the messages to relevant clients. 

## How does it work under the hood?
Web PubSub for Socket.IO builds upon Socket.IO protocols by implementing the Adapter and Engine.IO. The diagram describes the typical architecture when you use the Web PubSub for Socket.IO with your Socket.IO server.

:::image type="content" source="./media/socketio-service-internal/typical-architecture-managed-socketio.jpg" alt-text="Screenshot of a typical architecture of a fully managed Socket.IO app.":::

Like a self-hosted Socket.IO app, you still need to host your Socket.IO application logic on your own server. However, with Web PubSub for Socket.IO**(the service)**, your server no longer manages client connections directly. 
- **Your clients** establish persistent connections with the service, which we call "client connections". 
- **Your servers** also establish persistent connections with the service, which we call "server connections". 

When your server logic uses `send to client`, `broadcast`, and `add client to rooms`, these operations are sent to the service through established server connection. Messages from your server are translated to Socket.IO operations that Socket.IO clients can understand. As a result, any existing Socket.IO implementation can work without modification. The only modification needed is to change the endpoint your clients connect to. Refer to this article of [how to migrate a self-hosted Socket.IO app to Azure](./socketio-migrate-from-self-hosted.md).

When a client connects to the service, the service
- forwards Engine.IO connection `connect` to the server
- handles transport upgrade of client connections 
- forwards all Socket.IO messages to server

