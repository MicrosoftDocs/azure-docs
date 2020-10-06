---
title: Azure SignalR Service frequently asked questions
description: Get answers to frequently asked questions about Azure SignalR Service, including troubleshooting and typical usage scenarios.
author: sffamily
ms.service: signalr
ms.topic: overview
ms.custom: devx-track-dotnet
ms.date: 11/13/2019
ms.author: zhshang
---
# Azure SignalR Service FAQ

## Is Azure SignalR Service ready for production use?

Yes, both the support for [ASP.NET Core SignalR](https://dotnet.microsoft.com/apps/aspnet/signalr) and [ASP.NET SignalR](https://docs.microsoft.com/aspnet/signalr/overview/getting-started/introduction-to-signalr) is all generally available.

## When there are multiple application servers, are client messages sent to all servers or just one of them?

There's a one-to-one mapping between a client and an application server. Messages from one client are always sent to the same application server.

The mapping is maintained until the client or application server disconnects.

## If one of my application servers is down, how can I find it and get notified?

Azure SignalR Service monitors heartbeats from application servers.
If heartbeats are not received for a specified period of time, the application server is considered offline. All client connections mapped to this application server will be disconnected.

## Why does my custom `IUserIdProvider` throw an exception when I'm switching from ASP.NET Core SignalR SDK to Azure SignalR Service SDK?

The parameter `HubConnectionContext context` is different between the ASP.NET Core SignalR SDK and the Azure SignalR Service SDK when `IUserIdProvider` is called.

In ASP.NET Core SignalR, `HubConnectionContext context` is the context from the physical client connection with valid values for all properties.

In the Azure SignalR Service SDK, `HubConnectionContext context` is the context from the logical client connection. The physical client is connected to the Azure SignalR Service instance, so only a limited number of properties are provided.

For now, only `HubConnectionContext.GetHttpContext()` and `HubConnectionContext.User` are available for access.
You can [check the source code](https://github.com/Azure/azure-signalr/blob/dev/src/Microsoft.Azure.SignalR/HubHost/ServiceHubConnectionContext.cs).

## Can I configure the transports available in Azure SignalR Service on the server side with ASP.NET Core SignalR? For example, can I disable WebSocket transport?

No.

Azure SignalR Service provides all three transports that ASP.NET Core SignalR supports by default. It's not configurable. Azure SignalR Service will handle connections and transports for all client connections.

You can configure client-side transports as documented in [ASP.NET Core SignalR configuration](https://docs.microsoft.com/aspnet/core/signalr/configuration#configure-allowed-transports-1).

## What is the meaning of metrics like message count or connection count shown in the Azure portal? Which kind of aggregation type should I choose?

You can find details about we calculate these metrics in [Messages and connections in Azure SignalR Service](signalr-concept-messages-and-connections.md).

On the overview pane of Azure SignalR Service resources, we've already chosen the appropriate aggregation type for you. If you go to the metrics pane, you can
take the aggregation type to [Messages and connections in Azure SignalR Service](../azure-monitor/platform/metrics-supported.md#microsoftsignalrservicesignalr) as a reference.

## What is the meaning of the `Default`, `Serverless`, and `Classic` service modes? How can I choose?

For new applications, only default and serverless mode should be used. The main difference is whether you have application servers that establish server connections to the service (i.e. use `AddAzureSignalR()` to connect to service). If yes use default mode, otherwise use serverless mode.

Classic mode is designed for backward compatibility for existing applications so should not be used for new applications.

For more information about service mode in [this doc](concept-service-mode.md).

## Can I send message from client in serverless mode?

You can send message from client if you configure upstream in your SignalR instance. Upstream is a set of endpoints that can receive messages and connection events from SignalR service. If no upstream is configured, messages from client will be ignored.

For more information about upstream see [this doc](concept-upstream.md).

Upstream is currently in public preview.

## Are there any feature differences in using Azure SignalR Service with ASP.NET SignalR?

When you're using Azure SignalR Service, some APIs and features of ASP.NET SignalR aren't supported:
- The ability to pass arbitrary state between clients and the hub (often called `HubState`) is not supported.
- The `PersistentConnection` class is not supported.
- *Forever Frame transport* is not supported.
- Azure SignalR Service no longer replays messages sent to the client when the client is offline.
- When you're using Azure SignalR Service, the traffic for one client connection is always routed (also called *sticky*) to one app server instance for the duration of the connection.

Support for ASP.NET SignalR is focused on compatibility, so not all new features from ASP.NET Core SignalR are supported. For example, *MessagePack* and *Streaming* are available only for ASP.NET Core SignalR applications.

You can configure Azure SignalR Service for different service modes: `Classic`, `Default`, and `Serverless`. The `Serverless` mode is not supported for ASP.NET. The data-plane REST API is also not supported.

## Where does my data reside?

Azure SignalR Service works as a data processor service. It won't store any customer content, and data residency is included by design. If you use Azure SignalR Service together with other Azure services, like Azure Storage for diagnostics, see [this white paper](https://azure.microsoft.com/resources/achieving-compliant-data-residency-and-security-with-azure/) for guidance about how to keep data residency in Azure regions.
