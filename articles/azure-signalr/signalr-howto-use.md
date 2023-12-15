---
title: Use Azure SignalR Service
description: Learn how to use Azure SignalR Service in your app server
author: vicancy
ms.service: signalr
ms.topic: how-to
ms.date: 12/18/2023
ms.author: lianwei 
---

# Use Azure SignalR Service

- [Use Azure SignalR Service](#use-azure-signalr-service)
  - [Provision an Azure SignalR Service instance](#provision-an-azure-signalr-service-instance)
  - [For ASP&#46;NET Core SignalR](#for-aspnet-core-signalr)
  - [For ASP&#46;NET SignalR](#for-aspnet-signalr)
  - [Scale Out Application Server](#scale-out-application-server)

## Provision an Azure SignalR Service instance

Follow [Quickstart: Use an ARM template to deploy Azure SignalR](./signalr-quickstart-azure-signalr-service-arm-template.md) to provision a SignalR service instance.

## For ASP&#46;NET Core SignalR

[See document](signalr-howto-asp-net-core.md)

## For ASP&#46;NET SignalR

[See document](signalr-howto-run-asp-net.md)

## Scale Out Application Server

With Azure SignalR Service, persistent connections are offloaded from application server so that you can focus on implementing your business logic in hub classes.
But you still need to scale out application servers for better performance when handling massive client connections.
Below are a few tips for scaling out application servers.
- Multiple application servers can connect to the same Azure SignalR Service instance.
- As long as the name of the hub class is the same, connections from different application servers are grouped in the same hub.
- Each client connection will only be created in ***one*** of the application servers, and messages from that client will only be sent to that same application server. If you want to access client information globally *(from all application servers)*, you have to use some centralized storage to save client information from all application servers.

## Next steps

In this guide, you learned about how to scale single SignalR Service instance.

Autoscale is supported in Azure SignalR Service Premium Tier.

> [!div class="nextstepaction"]
> [Automatically scale units of an Azure SignalR Service](./signalr-howto-scale-autoscale.md)

Multiple endpoints are also supported for scaling, sharding, and cross-region scenarios.

> [!div class="nextstepaction"]
> [scale SignalR Service with multiple instances](./signalr-howto-scale-multi-instances.md)
