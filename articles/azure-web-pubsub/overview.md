---
title: What is Azure Web PubSub service?
description: Better understand what typical use case scenarios to use Azure Web PubSub, and learn the key benefits of Azure Web PubSub.
author: yjin81
ms.author: yajin1
ms.service: azure-web-pubsub
ms.topic: overview 
ms.date: 11/08/2021
---

# What is Azure Web PubSub service?

The Azure Web PubSub Service helps you build real-time messaging web applications using WebSockets and the publish-subscribe pattern easily. This real-time functionality allows publishing content updates between server and connected clients (for example a single page web application or mobile application). The clients do not need to poll the latest updates, or submit new HTTP requests for updates.

This article provides an overview of Azure Web PubSub service.

## What is Azure Web PubSub service used for?

Any scenario that requires real-time publish-subscribe messaging between server and clients or among clients, can use Azure Web PubSub service. Traditional real-time features that often require polling from server or submitting HTTP requests, can also use Azure Web PubSub service.

Azure Web PubSub service can be used in any application type that requires real-time content updates. We list some examples that are good to use Azure Web PubSub service:

* **High frequency data updates:** gaming, voting, polling, auction.
* **Live dashboards and monitoring:** company dashboard, financial market data, instant sales update, multi-player game leader board, and IoT monitoring.
* **Cross-platform live chat:** live chat room, chat bot, on-line customer support, real-time shopping assistant, messenger, in-game chat, and so on.
* **Real-time location on map:** logistic tracking, delivery status tracking, transportation status updates, GPS apps.
* **Real-time targeted ads:** personalized real-time push ads and offers, interactive ads.
* **Collaborative apps:** coauthoring, whiteboard apps and team meeting software.
* **Push instant notifications:** social network, email, game, travel alert.
* **Real-time broadcasting:** live audio/video broadcasting, live captioning, translating, events/news broadcasting.
* **IoT and connected devices:** real-time IoT metrics, remote control, real-time status, and location tracking.
* **Automation:** real-time trigger from upstream events.

## What are the benefits using Azure Web PubSub service?

**Built-in support for large-scale client connections and highly available architectures:**

Azure Web PubSub service is designed for large-scale real-time applications. The service allows multiple instances to work together and scale to millions of client connections. Meanwhile, it also supports multiple global regions for sharding, high availability, or disaster recovery purposes.

**Support for a wide variety of client SDKs and programming languages:**

Azure Web PubSub service works with a broad range of clients, such as web and mobile browsers, desktop apps, mobile apps, server process, IoT devices, and game consoles. Since this service supports the standard WebSocket connection with publish-subscribe pattern, it is easily to use any standard WebSocket client SDK in different languages with this service. 

**Offer rich APIs for different messaging patterns:**

Azure Web PubSub service is a bi-directional messaging service that allows different messaging patterns among server and clients, for example:

* The server sends messages to a particular client, all clients, or a subset of clients that belong to a specific user, or have been placed in an arbitrary group. 
* The client sends messages to clients that belong to an arbitrary group.
* The clients send messages to server.


## How to use the Azure Web PubSub service?

There are many different ways to program with Azure Web PubSub service, as some of the samples listed here:

- **Build serverless real-time applications**: Use Azure Functions' integration with Azure Web PubSub service to build serverless real-time applications in languages such as JavaScript, C#, Java and Python. 
- **Use WebSocket subprotocol to do client-side only Pub/Sub** - Azure Web PubSub service provides WebSocket subprotocols to empower authorized clients to publish to other clients in a convenience manner.
- **Use provided SDKs to manage the WebSocket connections in self-host app servers** - Azure Web PubSub service provides SDKs in C#, JavaScript, Java and Python to manage the WebSocket connections easily, including broadcast messages to the connections, add connections to some groups, or close the connections, etc.
- **Send messages from server to clients via REST API** - Azure Web PubSub service provides REST API to enable applications to post messages to clients connected, in any REST capable programming languages.

## Quick start

> [!div class="nextstepaction"]
> [Play with chat demo](https://azure.github.io/azure-webpubsub/demos/chat)

> [!div class="nextstepaction"]
> [Build a chat app](tutorial-build-chat.md)

## Next steps

[!INCLUDE [next step](includes/include-next-step.md)]
