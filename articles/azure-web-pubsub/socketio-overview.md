---
title: Overview of Web PubSub for Socket.IO
description: An overview of Web PubSub's support for the open-source Socket.IO library
author: kevinguo-ed
ms.author: kevinguo
ms.date: 07/27/2023
ms.service: azure-web-pubsub
ms.topic: how-to
---

# Overview of Web PubSub for Socket.IO
Web PubSub for Socket.IO is a fully managed cloud service for [Socket.IO](https://socket.io/), which is a widely popular open-source library for real-time messaging between clients and server.

Managing stateful and persistent connections between clients and server is often a source of frustration for Socket.IO users. The problem is more acute when there are multiple Socket.IO instances spread across servers. 

Web PubSub for Socket.IO removes the burden of deploying, hosting and coordinating Socket.IO instances for developers, allowing development team to focus on building real-time experiences using their familiar APIs provided by Socket.IO library.


## Benefits over hosting Socket.IO app yourself
>[!NOTE]
> - **Socket.IO** refers to the open-source library. 
> - **Web PubSub for Socket.IO** refers to a fully managed Azure service.  

|     /      | Hosting Socket.IO app yourself | Using Web PubSub for Socket.IO|
|------------|------------|------------|
| Deployment | Customer managed | Azure managed |
| Hosting | Customer needs to provision enough server resources to serve and maintain persistent connections | Azure managed |
| Scaling connections | Customer managed by using a server-side component called ["adapter"](https://socket.io/docs/v4/adapter/) | Azure managed with **100k+** client connections out-of-the-box |
| Uptime guarantee | Customer managed | Azure managed with **99.9%+** uptime |
| Enterprise-grade security | Customer managed | Azure managed | 
| Ticket support system | N/A | Azure managed |

When you host Socket.IO app yourself, clients establish WebSocket or long-polling connections directly with your server. Maintaining such **stateful** connections places a heavy burden to your Socket.IO server, which limits the number of concurrent connections and increases messaging latency. 

A common approach to meeting the concurrent and latency challenge is to [scale out to multiple Socket.IO servers](https://socket.io/docs/v4/adapter/). Scaling out requires a server-side component called "adapter" like the Redis adapter provided by Socket.IO library. However, such adapter introduces an extra component you need to deploy and manage on top of writing extra code logic to get things to work properly.

:::image type="content" source="./media/socketio-overview/typical-architecture-self-hosted-socketio-app.jpg" alt-text="Screenshot of a typical architecture of a self-hosted Socket.IO app.":::

With Web PubSub for Socket.IO, you're freed from handling scaling issues and implementing code logic related to using an adapter.

## Same programming model
To migrate a self-hosted Socket.IO app to Azure, you only need to add a few lines of code with **no need** to change the rest of the application code. In other words, the programming model remains the same and the complexity of managing a real-time app is reduced.

> [!div class="nextstepaction"]
> [Quickstart for Socket.IO users](./socketio-quickstart.md)
>
> [Quickstart: Mirgrate an self-hosted Socket.IO app to Azure](./socketio-migrate-from-self-hosted.md)











