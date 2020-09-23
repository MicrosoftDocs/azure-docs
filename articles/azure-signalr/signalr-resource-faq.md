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

Yes.
For the announcement of general availability, see [Azure SignalR Service now generally available](https://azure.microsoft.com/blog/azure-signalr-service-now-generally-available/). 

[ASP.NET Core SignalR](https://docs.microsoft.com/aspnet/core/signalr/introduction) is fully supported.

Support for ASP.NET SignalR is still in *public preview*. [Here's a code example](https://github.com/aspnet/AzureSignalR-samples/tree/master/aspnet-samples/ChatRoom).

## The client connection closes with the error message "No server available." What does it mean?

This error occurs only when clients are sending messages to Azure SignalR Service.

If you don't have any application server and use only the Azure SignalR Service REST API, this behavior is *by design*.
In serverless architecture, client connections are in *listen* mode and won't send any messages to Azure SignalR Service.
Read [more about the REST API](./signalr-quickstart-rest-api.md).

If you have application servers, this error message means that no application server is connected to your Azure SignalR Service instance.

The possible causes are:
- No application server is connected with Azure SignalR Service. Check application server logs for possible connection errors. This case is rare in a high-availability setting that has more than one application server.
- There are connectivity issues with Azure SignalR Service instances. This issue is transient, and the instances will automatically recover.
If it persists for more than an hour, [open an issue on GitHub](https://github.com/Azure/azure-signalr/issues/new) or [create a support request in Azure](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request).

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

You can configure client-side transports as documented in [ASP.NET Core SignalR configuration](https://docs.microsoft.com/aspnet/core/signalr/configuration?view=aspnetcore-2.1&tabs=dotnet#configure-allowed-transports-2).

## What is the meaning of metrics like message count or connection count shown in the Azure portal? Which kind of aggregation type should I choose?

You can find details about we calculate these metrics in [Messages and connections in Azure SignalR Service](signalr-concept-messages-and-connections.md).

On the overview pane of Azure SignalR Service resources, we've already chosen the appropriate aggregation type for you. If you go to the metrics pane, you can
take the aggregation type to [Messages and connections in Azure SignalR Service](../azure-monitor/platform/metrics-supported.md#microsoftsignalrservicesignalr) as a reference.

## What is the meaning of the `Default`, `Serverless`, and `Classic` service modes? How can I choose?

Here's information about the modes:
* `Default` mode *requires* a hub server. In this mode, Azure SignalR Service routes the client traffic to its connected hub server connections. Azure SignalR Service checks for a connected hub server. If the service can't find a connected hub server, it rejects the incoming client connections. You also can use the *Management API* in this mode to manage the connected clients directly through Azure SignalR Service.
* `Serverless` mode does *not* allow any server connection. That is, it will reject all server connections. All clients must be in serverless mode.	Clients connect to Azure SignalR Service, and users usually use serverless technologies such as *Azure Functions* to handle hub logics. [See a simple example](https://docs.microsoft.com/azure/azure-signalr/signalr-quickstart-azure-functions-javascript?WT.mc_id=signalrquickstart-github-antchu) that uses serverless mode in Azure SignalR Service.
* `Classic` mode is a mixed status. When a hub has a server connection, the new client will be routed to a hub server. If not, the client will enter serverless mode. 

  This might cause a problem. For example, if all server connections are lost for a moment, some clients will enter serverless mode instead of routing to a hub server.

Here are some guidelines for choosing a mode:
- If there's no hub server, choose `Serverless`.
- If all hubs have hub servers, choose `Default`.
- If some hubs have hub servers but others don't, you can choose `Classic`, but this might cause a problem. The better way is to create two instances: one is `Serverless`, and the other is `Default`.

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
