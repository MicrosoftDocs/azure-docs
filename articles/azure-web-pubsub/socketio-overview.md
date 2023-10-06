---
title: Overview Socket.IO on Azure
description: Get an overview of Azure's support for the open-source Socket.IO library.
keywords: Socket.IO, Socket.IO on Azure, multi-node Socket.IO, scaling Socket.IO, socketio, azure socketio
author: kevinguo-ed
ms.author: kevinguo
ms.date: 07/27/2023
ms.service: azure-web-pubsub
ms.topic: how-to
---

# Overview Socket.IO on Azure

> [!NOTE]
> The support of Socket.IO on Azure is in public preview. We welcome any feedback and suggestions. Please reach out to the service team at awps@microsoft.com.

Socket.IO is a widely popular open-source library for real-time messaging between clients and a server. Managing stateful and persistent connections between clients and a server is often a source of frustration for Socket.IO users. The problem is more acute when multiple Socket.IO instances are spread across servers. 

Azure provides a fully managed cloud solution for [Socket.IO](https://socket.io/). This support removes the burden of deploying, hosting, and coordinating Socket.IO instances for developers. Development teams can then focus on building real-time experiences by using familiar APIs from the Socket.IO library.

## Simplified architecture
This feature removes the need for an "adapter" server component when scaling out a Socket.IO app, allowing the development team to reap the benefits of a simplified architecture.

:::image type="content" source="./media/socketio-service-internal/typical-architecture-managed-socketio.jpg" alt-text="Screenshot of a typical architecture of a fully managed Socket.IO app.":::

## Benefits over hosting a Socket.IO app yourself

The following table shows the benefits of using the fully managed solution from Azure.

| Item | Hosting a Socket.IO app yourself | Using Socket.IO on Azure|
|------------|------------|------------|
| Deployment | Customer managed | Azure managed |
| Hosting | Customer needs to provision enough server resources to serve and maintain persistent connections | Azure managed |
| Scaling connections | Customer managed by using a server-side component called an [adapter](https://socket.io/docs/v4/adapter/) | Azure managed with more than 100,000 client connections out of the box |
| Uptime guarantee | Customer managed | Azure managed with more than 99.9 percent uptime |
| Enterprise-grade security | Customer managed | Azure managed |
| Ticket support system | Not applicable | Azure managed |

When you host a Socket.IO app yourself, clients establish WebSocket or long-polling connections directly with your server. Maintaining such *stateful* connections places a heavy burden on your Socket.IO server. This burden limits the number of concurrent connections and increases messaging latency.

A common approach to meeting the concurrency and latency challenge is to [scale out to multiple Socket.IO servers](https://socket.io/docs/v4/adapter/). Scaling out requires a server-side component called an *adapter*, like the Redis adapter that the Socket.IO library provides. However, such an adapter introduces an extra component that you need to deploy and manage. It also requires you to write extra code logic to get things to work properly.

:::image type="content" source="./media/socketio-overview/typical-architecture-self-hosted-socketio-app.jpg" alt-text="Diagram of a typical architecture of a self-hosted Socket.IO app.":::

With Socket.IO on Azure, you're freed from handling scaling issues and implementing code logic related to using an adapter.

## Same programming model

To migrate a self-hosted Socket.IO app to Azure, you add only a few lines of code. There's no need to change the rest of the application code. In other words, the programming model remains the same, and the complexity of managing a real-time app is reduced.

> [!div class="nextstepaction"]
> [Quickstart for Socket.IO users](./socketio-quickstart.md)
>
> [Migrate a self-hosted Socket.IO app to Azure](./socketio-migrate-from-self-hosted.md)
