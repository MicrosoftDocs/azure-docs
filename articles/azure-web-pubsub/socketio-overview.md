---
title: Overview of Web PubSub for Socket.IO
description: 
author: xingsy97
ms.author: xingsy97
ms.date: 07/27/2023
ms.service: azure-web-pubsub
ms.topic: how-to
---

# Overview of Web PubSub for Socket.IO
Web PubSub for Socket.IO is a fully managed cloud service for [Socket.IO](https://socket.io/), which is a widely popular open-source library for real-time messaging between clients and server.

Managing stateful and persistent connections between clients and server is often a source of frustration for Socket.IO users. The problem is more acute when there are multiple Socket.IO instances spread across servers. 

Web PubSub for Socket.IO removes the burden of deploying, hosting and coordinating Socket.IO instances for developers, allowing development team to focus on building real-time experiences using their familiar APIs provided by Socket.IO library.


## Benefits of using Web PubSub for Socket.IO over hosting Socket.IO app yourself
>[!NOTE]
> - **Socket.IO** refers to the open-source library. 
> - **Web PubSub for Socket.IO** refers to a fully managed Azure service.  

|            | Hosting Socket.IO app yourself | Using Web PubSub for Socket.IO
|------------|------------|------------|
| Deployment | Customer managed | Azure managed |
| Hosting | Customer needs to serve and maintain persistent connections | Azure managed |
| Scaling connections | Customer managed by using a server-side componnet called ["adapter"](https://socket.io/docs/v4/adapter/) | Azure managed with **100k+** client connections |
| Uptime guarantee | Customer managed | Azure managed with **99.9%+** uptime |
| Enterprise-grade security | Customer managed | Azure managed | 
| Ticket support system | N/A | Azure managed |

When hosting Socket.IO app yourself, clients establish WebSocket or long-polling connections directly with your server. Maintaining such **stateful** connections places a heavy burden to your Socket.IO server, which limits the number of concurrent connections and increases messaging latency. [...Illustration missing...]

A common approach to meeting the challenge of a large number of concurrent connections and latency is to [scale out to multiple Socket.IO servers](https://socket.io/docs/v4/adapter/) using a server-side component called "adapter", like the Redis adapter provided by Socket.IO library. However, such adapter introduces an extra component you'll need to deploy and manage besides the additional code logic to get things to work properly.
[...Illustration missing...]

With Web PubSub for Socket.IO, you are freed from handling scaling issues and implementing code logic related to using an adapter.

## Same programming model
To migrate a self-hosted Socket.IO app to Azure, you only need to add a few lines of code with **no need** to change the rest of the application code. This means the programming model remains the same with less complexity to worry about.

## 

[!INCLUDE [next step](includes/include-next-step.md)]










