---
title: What is Azure SignalR | Microsoft Docs
description: An overview of the Azure SignalR service.
services: signalr
documentationcenter: ''
author: sffamily
manager: cfowler
editor: 

ms.service: signalr
ms.devlang: na
ms.topic: overview
ms.workload: tbd
ms.date: 09/13/2018
ms.author: zhshang
---

# What is Azure SignalR Service

Azure SignalR Service simplifies the process of adding real-time web functionality to applications over HTTP. This real-time functionality allows the service to push content updates to connected clients, such as a single page web or mobile application. As a result, clients are updated without the need to poll the server, or submit new HTTP requests for updates.

This article provides an overview of Azure SignalR Service.

## What is Azure SignalR Service used for? 

There are many application types that require real-time content updates. The following examples are good candidates for using Azure SignalR Service:

* Apps that require high frequency updates from the server. Examples are gaming, voting, auction, maps, and GPS apps.
* Dashboards and monitoring apps. Examples include company dashboards and instant sales updates.
* Collaborative apps. Whiteboard apps and team meeting software are examples of collaborative apps.
* Apps that require notifications. Social networks, email, chat, games, travel alerts, and many other apps use notifications.

SignalR provides an abstraction over a number of techniques used for building real-time web applications. [WebSockets](https://wikipedia.org/wiki/WebSocket) is the optimal transport, but other techniques like [Server-Sent Events (SSE)](https://wikipedia.org/wiki/Server-sent_events) and Long Polling are used when other options aren't available. SignalR automatically detects and initializes the appropriate transport based on the features supported on the server and client.

In addition, SignalR provides a programming model for real-time applications that allows the server to send messages to all connections, or to a subset of connections that belong to a specific user or have been placed in an arbitrary group.

## How to use Azure SignalR Service

Currently there are three ways to use Azure SignalR Service:

- **[Scale an ASP.NET Core SignalR App](signalr-overview-scale-aspnet-core.md)** - Integrate Azure SignalR Service with an ASP.NET Core SignalR application to scale out to hundreds of thousands of connections.
- **[Build serverless real-time apps](signalr-overview-azure-functions.md)** - Use Azure Functions' integration with Azure SignalR Service to build serverless real-time applications in languages such as JavaScript, C#, and Java.
- **[Send messages from server to clients via REST API](https://github.com/Azure/azure-signalr/blob/dev/docs/rest-api.md)** - Azure SignalR Service provides REST API to enable applications to post messages to clients connected with SignalR Service, in any REST capable programming languages.

