---
title: Overview of Web PubSub for Socket.IO Serverless Mode
description: Get an overview of Azure's support for the open-source Socket.IO library on serverless mode.
keywords: Socket.IO, Socket.IO on Azure, serverless, multi-node Socket.IO, scaling Socket.IO, socketio, azure socketio
author: zackliu
ms.author: chenyl
ms.date: 08/5/2024
ms.service: azure-web-pubsub
ms.topic: how-to
---

# Overview Socket.IO Serverless Mode (Preview)

Socket.IO is a library that enables real-time, bidirectional, and event-based communication between web clients and servers. Traditionally, Socket.IO operates in a server-client architecture, where the server handles all communication logic and maintains persistent connections.

With the increasing adoption of serverless computing, we're introducing a new mode: Socket.IO Serverless mode. This mode allows Socket.IO to function in a serverless environment, handling communication logic through RESTful APIs or webhooks, offering a scalable, cost-effective, and maintenance-free solution.

## Differences Between Default Mode and Serverless Mode

:::image type="content" source="./media/socket-io-serverless-overview/socket-io-serverless-default-modes.jpg" alt-text="Diagram of how the default mode compares with the serverless when using Web PubSub for Socket.IO.":::

| Feature | Default Mode | Serverless Mode |
|------------|------------|------------|
|Architecture|Use persistent connection for both servers and clients | Clients use persistent connections but servers use RESTful APIs and webhook event handlers in a stateless manner|
|SDKs and Languages| Official JavaScript server SDKs together with [Extension library for Web PubSub for Socket.IO SDK](https://www.npmjs.com/package/@azure/web-pubsub-socket.io) is required; All compatible clients|No mandatory SDKs or languages. Use [Socket.IO Function binding](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.WebPubSubForSocketIO) to simplified integrate with Azure Function; All compatible clients|
|Network Accessibility| The server doesn't need to expose network access as it proactively makes connection to the service|The server needs to expose network access to the service|
|Feature supports|Most features are supported except some unsupported features: [Unsupported server APIs of Socket.IO](./socketio-supported-server-apis.md)|See list of supported features: [Supported functionality and RESTful APIs](./socket-io-serverless-protocol.md#supported-functionality-and-restful-apis)|

## Next steps

This article provides you with an overview of the Serverless Mode of Web PubSub for Socket.IO.

> [!div class="nextstepaction"]
> [Tutorial: Build chat app with Azure Function in Serverless Mode](./socket-io-serverless-tutorial.md)
>
> [Serverless Protocols](./socket-io-serverless-protocol.md)
>
> [Serverless Function Binding](./socket-io-serverless-function-binding.md)
