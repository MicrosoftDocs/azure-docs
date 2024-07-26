---
title: What is Azure Web PubSub service?
description: Better understand what typical use cases and app scenarios Azure Web PubSub service enables, and learn the key benefits of the service.
author: kevinguo-ed
ms.author: kevinguo
ms.service: azure-web-pubsub
ms.topic: overview 
ms.date: 07/26/2024
---

# What is Azure Web PubSub service?

Azure Web PubSub Service makes it easy to build web applications that allows server and connected clients to exchange data in real-time. Real-time data exchange is the bedrock of certain time-sensitive apps developers build and maintain. Developers have leveraged the service in chat apps, real-time dashboards, multi-player games, online auctions, multi-user collaborative apps, location tracking, notifications and more. With the recent surge in interest in AI, Web PubSub has become an invaluable tool to developers building AI-enabled applications for token streaming. The service is battle-tested to scale to tens of millions of concurrent connections and offers ultra-low latency. 

When an app's usage is small, developers typically opt for a polling mechanism to provide real-time communication between server and clients - clients send repeated HTTP requests to server over a time interval. However, developers often report that while polling mechanism is straightforward to implement, it suffers three important drawbacks. 
1. Not real-time enough. 
2. Data inconsistency. 
3. Wasted bandwidth and compute.

These drawbacks are the primary motivations that drive developers to look for alternatives. This article provides an overview of Azure Web PubSub service and how developers can leverage it to build real-time communication channel fast and at scale.

## What is Azure Web PubSub service used for?

Any app scenario where updates at the data resource need to be delivered to other components across network can benefit from using Azure Web PubSub. As the name suggests, the service facilities the communication between a publisher and subscribers. A publisher is a component that publishes data updates. A subscriber is a component that subscrbes to data updates. 

Azure Web PubSub service are used in a multitude of industries and app scenarios who data is time-senstive. Here's a partial list of some common use cases. 

|Use case              |Example appliations   |
|----------------------|----------------------|
|High frequency data updates | Multi-player games, social media voting, opinion polling, online auctioning |
|Live dashboards and monitoring | Company dashboard, financial market data, instant sales update, game leaderboard, IoT monitoring |
|Cross-platform chat| Live chat room, AI-assisted chatbot, online customer support, real-time shopping assistant, messenger, in-game chat |
|Location tracking | Vehicle asset tracking, delivery status tracking, transportation status updates, ride-hailing apps |  
|Multi-user collaborative apps | co-authoring, collaborative whiteboard and team meeting apps |
|Cross-platform push notifications | Social media, email, game status, travel alert | 
|IoT and connected devices | Real-time IoT metrics, managing charging network for electric vehicles, live concert engagement |
|Automation | Real-time trigger from upstream events | 

## What are the benefits using Azure Web PubSub service?

**Built-in support for large-scale client connections and highly available architectures:**

Azure Web PubSub service is designed for large-scale, real-time applications. With a single Web PubSub resource, it can scale to one million concurrent connections, which is sufficent for most cases. When multiple resources are used together, the service allows you to scale beyond one million concurrent connections. Meanwhile, it also supports multiple global regions for sharding, high availability, or disaster recovery purposes.

**Support for a wide variety of client SDKs and programming languages:**

Azure Web PubSub service works with a broad range of clients. These clients include web and mobile browsers, desktop apps, mobile apps, server processes, IoT devices, and game consoles. Server and client SDKs are available for mainstream programming languages, C#, Java, JavaScript and Python, making it easy to consume the APIs offered by the service. Since the service supports standard WebSocket protocol, you can use any REST capable programming lanagues to call Web PubSub's APIs directly if SDKs are not available in your programming language of choice.

**Offer rich APIs for different messaging patterns:**

Azure Web PubSub service offers real-time, bi-directional communication between server and clients for data exchange. The service offers features to allow you finely control how a message should be delivered and to whom. Here's a list of supported messaging patterns.

|Messaging pattern              |Details                         |
|-------------------------------|--------------------------------|
|Broadcast to all clients | A server sends data updates to all connected clients. |
|Broadcast to a subset of clients | A server sends data updates to a subset of clients arbitrarily defined by you. |
|Broadcast to all clients owned by a specific human user | A human user can have multiple browser tabs or device open, you can broadcast to the user so that all the web clients used by the user are synchronized. |
|Client pub/sub | A client sends messages to clients that are in a group arbitrarily defined by you without your server's involvement.| 
|Clients to server | Clients send messages to server at low latency. | 

## How to use the Azure Web PubSub service?

There are many different ways to program with Azure Web PubSub service, as some of the samples listed here:

- **Build serverless real-time applications**: Use Azure Functions' integration with Azure Web PubSub service to build serverless real-time applications in languages such as JavaScript, C#, Java and Python. 
- **Use WebSocket subprotocol to do client-side only Pub/Sub** - Azure Web PubSub service provides WebSocket subprotocols to empower authorized clients to publish to other clients in a convenient manner.
- **Use provided SDKs to manage the WebSocket connections in self-host app servers** - Azure Web PubSub service provides SDKs in C#, JavaScript, Java and Python to manage the WebSocket connections easily, including broadcast messages to the connections, add connections to some groups, or close the connections, etc.
- **Send messages from server to clients via REST API** - Azure Web PubSub service provides REST API to enable applications to post messages to clients connected, in any REST capable programming languages.

## Quick start

> [!div class="nextstepaction"]
> [Play with chat demo](https://azure.github.io/azure-webpubsub/demos/chat)

> [!div class="nextstepaction"]
> [Build a chat app](tutorial-build-chat.md)

## Next steps

[!INCLUDE [next step](includes/include-next-step.md)]
