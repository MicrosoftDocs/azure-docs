---
title: Messages and connections in Azure SignalR
description: An overview of key concepts around messages and connections in Azure SignalR Service.
author: sffamily
ms.service: signalr
ms.topic: overview
ms.date: 09/13/2018
ms.author: zhshang
---
# Message and connection in Azure SignalR Service

Azure SignalR Service has billing model based on the number of connections and number of messages. How the messages and connections are defined and counted for billing purpose is explained below.

## Message formats supported

Azure SignalR Service supports the same formats that the ASP.NET Core SignalR supports: [JSON](https://www.json.org/) and [MessagePack](/aspnet/core/signalr/messagepackhubprotocol)

## Message size

Azure SignalR Service has no message size limit.

In practice, large message is split into smaller messages no more than 2 KB each, and transmitted as separate messages. Message splitting and assembling are handled by SDKs. No developer efforts are needed.

But large message has negative impact on messaging performance. Use smaller message size whenever possible and test to choose the optimal message size for each use case scenario.

## How to count messages for billing purpose?

We only count the outbound messages from SignalR Service and ignore the ping messages between clients and servers.

Message larger than 2 KB is counted as multiple messages of 2 KB each. Message count chart in Azure portal will update every 100 messages per hub.

For example, a user has 3 clients and 1 application server. One client sends one 4-KB message to let the server broadcast to all clients. The message count will be 8: 1 message from service to application server, 3 messages from service to clients, and each message is counted as 2 2-KB messages.

Message count shown in Azure portal is still 0, until it accumulates to be more than 100.

## How to count connections?

There are server connections and client connections. By default each application server has 5 connections per hub with SignalR Service and each client has 1 client connection with SignalR Service.

Connection count shown in Azure portal includes both server connections and client connections.

For example, a user has two application servers and defines 5 hubs in codes. Server connection count shown in Azure portal will be 2 app servers * 5 hubs * 5 connections/hub = 50 server connections.

## Related resources

- [ASP.NET Core SignalR configuration](/aspnet/core/signalr/configuration)
- [JSON](https://www.json.org/)
- [MessagePack](/aspnet/core/signalr/messagepackhubprotocol)