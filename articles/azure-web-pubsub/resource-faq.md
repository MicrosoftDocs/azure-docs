---
title: Azure Web PubSub service FAQ
description: Get answers to frequently asked questions about Azure Web PubSub service.
author: yjin81
ms.author: yajin1
ms.service: azure-web-pubsub
ms.topic: overview 
ms.date: 03/21/2023
---

# Azure Web PubSub service FAQ

This is the FAQ of Azure Web PubSub service. 

## Is Azure Web PubSub service ready for production use?
Yes, Azure Web PubSub service is generally available.

## How do I choose between Azure SignalR Service and Azure Web PubSub service?

Both [Azure SignalR Service](https://azure.microsoft.com/services/signalr-service) and [Azure Web PubSub service](https://azure.microsoft.com/services/web-pubsub) help customers build real-time web applications easily with large scale and high availability and enable customers to focus on their business logic instead of managing the messaging infrastructure. In general, you may choose Azure SignalR Service if you already use SignalR library to build real-time application. Instead, if you're looking for a generic solution to build real-time application based on WebSocket and publish-subscribe pattern, you may choose Azure Web PubSub service. The Azure Web PubSub service is **not** a replacement for Azure SignalR Service. They're targeting different scenarios.

Azure SignalR Service is more suitable if:  

- You're already using ASP.NET or ASP.NET Core SignalR, primarily using .NET or need to integrate with .NET ecosystem (like Blazor).
- There's a SignalR client available for your platform. 
- You need an established protocol that supports a wide variety of calling patterns (RPC and streaming), transports (WebSocket, server sent events, and long polling) and with a client that manages the connection lifetime on your behalf. 

Azure Web PubSub service is more suitable for situations where:  

- You need to build real-time applications based on WebSocket technology or publish-subscribe over WebSocket.
- You want to build your own subprotocol or use existing advanced sub-protocols over WebSocket (for example, [GraphQL subscriptions over WebSocket](https://github.com/Azure/azure-webpubsub/tree/main/experimental/sdk/webpubsub-graphql-subscribe)). 
- You're looking for a lightweight server, for example, sending messages to client without going through the configured backend.  

##  Where does my data reside?

Azure Web PubSub does not store any customer data. If you use Azure Web PubSub service together with other Azure services, like Azure Storage for diagnostics, see [this white paper](https://azure.microsoft.com/resources/achieving-compliant-data-residency-and-security-with-azure/) for guidance about how to keep data residency in Azure regions.
