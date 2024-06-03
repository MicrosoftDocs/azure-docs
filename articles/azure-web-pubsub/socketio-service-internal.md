---
title: How does Azure Web PubSub support the Socket.IO library?
description: This article explains how Azure Web PubSub supports the Socket.IO library.
keywords: Socket.IO, Socket.IO on Azure, multi-node Socket.IO, scaling Socket.IO, socketio, azure socketio
author: kevinguo-ed
ms.author: kevinguo
ms.date: 08/1/2023
ms.service: azure-web-pubsub
ms.topic: conceptual
---

# How does Azure Web PubSub support the Socket.IO library?

This article provides an engineering perspective on how you can migrate self-hosted Socket.IO apps to Azure by using Web PubSub for Socket.IO with minimal code changes. You can then take advantage of simplified app architecture and deployment, while achieving 100,000 concurrent connections. You don't need to understand everything in this article to use Web PubSub for Socket.IO effectively.

## Architecture of a self-hosted Socket.IO app

The following diagram shows a typical architecture of a self-hosted Socket.IO app.

:::image type="content" source="./media/socketio-service-internal/typical-architecture-self-hosted-socketio-app.jpg" alt-text="Diagram of a typical architecture of a self-hosted Socket.IO app, including clients, servers, a load balancer, and an adapter.":::

To ensure that an app is scalable and reliable, Socket.IO users often have an architecture that involves multiple Socket.IO servers. Client connections are distributed among Socket.IO servers to balance load on the system.

A setup of multiple Socket.IO servers introduces a challenge when developers need to send the same message to clients that are connected to a different server. Developers often refer to this use case as "broadcasting messages."

The official recommendation from the Socket.IO library is to introduce a server-side component called an [adapter](https://socket.io/docs/v4/using-multiple-nodes/) to coordinate Socket.IO servers. An adapter figures out which servers the clients are connected to and instructs those servers to send messages.

Adding an adapter component introduces complexity to both development and deployment. For example, if an architecture uses the [Redis adapter](https://socket.io/docs/v4/redis-adapter/), developers need to:

- Implement sticky sessions.
- Deploy and maintain Redis instances.

The engineering effort and time in getting a real-time communication channel in place distracts developers from working on features that make an app or system unique and valuable to users.

## What Web PubSub for Socket.IO aims to solve for developers

Although developers often report that setting up a reliable and scalable app that's built with the Socket.IO library is challenging, developers can benefit from the intuitive APIs and the wide range of clients that the library supports. Web PubSub for Socket.IO builds on the value that the library brings, while relieving developers of the complexity in managing persistent connections reliably and at scale.

In practice, developers can continue to use the Socket.IO library's APIs without needing to provision server resources to maintain WebSocket or long-polling-based connections, which can be resource intensive. Also, developers don't need to manage and deploy an adapter component. The app server needs to send only a single operation, and Web PubSub for Socket.IO broadcasts the messages to relevant clients.

## How it works

Web PubSub for Socket.IO builds on Socket.IO protocols by implementing the adapter and Engine.IO. The following diagram shows the typical architecture when you use Web PubSub for Socket.IO with your Socket.IO server.

:::image type="content" source="./media/socketio-service-internal/typical-architecture-managed-socketio.jpg" alt-text="Screenshot of a typical architecture of a fully managed Socket.IO app.":::

Like a self-hosted Socket.IO app, you still need to host your Socket.IO application logic on your own server. However, with the Web PubSub for Socket.IO service:

- Your server no longer manages client connections directly.
- Your clients establish persistent connections with the service (*client connections*).
- Your servers also establish persistent connections with the service (*server connections*).

When your server logic uses `send to client`, `broadcast`, and `add client to rooms`, these operations are sent to the service through an established server connection. Messages from your server are translated to Socket.IO operations that Socket.IO clients can understand. As a result, any existing Socket.IO implementation can work without major modifications. The only modification that you need to make is to change the endpoint that your clients connect to. For more information, see [Migrate a self-hosted Socket.IO app to be fully managed on Azure](./socketio-migrate-from-self-hosted.md).

When a client connects to the service, the service:

- Forwards the Engine.IO connection (`connect`) to the server.
- Handles the transport upgrade of client connections.
- Forwards all Socket.IO messages to the server.
