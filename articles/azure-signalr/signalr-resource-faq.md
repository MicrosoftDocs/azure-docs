---
title: Azure SignalR Service frequently asked questions
description: Have quick access to frequently asked questions on Azure SignalR Service, about troubleshooting and typical usage scenarios.
author: sffamily
ms.service: signalr
ms.topic: overview
ms.date: 11/13/2019
ms.author: zhshang
---
# Azure SignalR Service FAQ

## Is Azure SignalR Service ready for production use?

Yes.
For our announcement of general availability, see [Azure SignalR Service now generally available](https://azure.microsoft.com/blog/azure-signalr-service-now-generally-available/). 

[ASP.NET Core SignalR](https://docs.microsoft.com/aspnet/core/signalr/introduction) is fully supported.

Support for ASP.NET SignalR is still in the *public preview*. Here is a [code example](https://github.com/aspnet/AzureSignalR-samples/tree/master/aspnet-samples/ChatRoom).

## The Client connection closes with the error message "No server available". What does it mean?

This error occurs only when clients are sending messages to the SignalR Service.

If you don't have any application server and use only the SignalR Service REST API, this behavior is **by design**.
In serverless architecture, client connections are in **LISTEN** mode and will not send any messages to SignalR Service.
Read more on [REST API](./signalr-quickstart-rest-api.md).

If you have application servers, this error message means that no application server is connected to your SignalR Service instance.

The possible causes are:
- No application server is connected with SignalR Service. Check application server logs for possible connection errors. This case is rare in high availability setting with more than one application servers.
- There are connectivity issues with SignalR Service instances. This issue is transient and will automatically recover.
If it persists for more than an hour, [open an issue on GitHub](https://github.com/Azure/azure-signalr/issues/new) or [create a support request in Azure](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request).

## When there are multiple application servers, are client messages sent to all servers or just one of them?

It is one-to-one mapping between client and application server. Messages from one client are always sent to the same application server.

The mapping between client and application server will be maintained until client or application server disconnects.

## If one of my application servers is down, how can I find it and get notified?

SignalR Service monitors heartbeats from application servers.
If heartbeats are not received for a specified period of time, the application server is considered offline. All client connections mapped to this application server will be disconnected.

## Why does my custom `IUserIdProvider` throw exception when switching from ASP.NET Core SignalR  SDK to Azure SignalR Service SDK?

The parameter `HubConnectionContext context` is different between ASP.NET Core SignalR SDK and Azure SignalR Service SDK when `IUserIdProvider` is called.

In ASP.NET Core SignalR, `HubConnectionContext context` is the context from the physical client connection with valid values for all properties.

In Azure SignalR Service SDK, `HubConnectionContext context` is the context from logical client connection. The physical client connection is connected to the SignalR Service instance, so only a limited number of properties are provided.

For now, only `HubConnectionContext.GetHttpContext()` and `HubConnectionContext.User` are available for access.
You can check the source code [here](https://github.com/Azure/azure-signalr/blob/dev/src/Microsoft.Azure.SignalR/HubHost/ServiceHubConnectionContext.cs).

## Can I configure the transports available in SignalR Service as configuring it on server side with ASP.NET Core SignalR? For example, disable WebSocket transport?

No.

Azure SignalR Service provides all three transports that ASP.NET Core SignalR supports by default. It is not configurable. SignalR Service will handle connections and transports for all client connections.

You can configure client-side transports as documented [here](https://docs.microsoft.com/aspnet/core/signalr/configuration?view=aspnetcore-2.1&tabs=dotnet#configure-allowed-transports-2).

## What is the meaning of metrics like message count or connection count showed in Azure portal? Which kind of aggregation type should I choose?

You can find the details about how do we calculate these metrics [here](signalr-concept-messages-and-connections.md).

In the overview blade of Azure SignalR Service resources, we have already chosen the appropriate aggregation type for you. And if you go to the Metrics blade, you can
take the aggregation type [here](../azure-monitor/platform/metrics-supported.md#microsoftsignalrservicesignalr) as a reference.

## What is the meaning of service mode `Default`/`Serverless`/`Classic`? How can I choose?

Modes:
* `Default` mode *requires* hub server. In this mode, Azure SignalR routes the client traffic to its connected hub server connections. Azure SignalR checks for a connected hub server. If a connected hub server isn't found, Azure SignalR rejects the incoming client connections. You also can use **Management Api** in this mode to manage the connected clients directly through Azure SignalR.
* `Serverless` mode does *not* allow any server connection, i.e. it will reject all server connections. All clients must be in serverless mode.	Clients connect to Azure SignalR, and users usually use serverless technologies such as **Azure Function** to handle hub logics. See a [simple example](https://docs.microsoft.com/azure/azure-signalr/signalr-quickstart-azure-functions-javascript?WT.mc_id=signalrquickstart-github-antchu) that uses Azure SignalR's Serverless mode.
* `Classic` mode is a mixed status. When a hub has server connection, the new client will be routed to hub server, if not, client will enter serverless mode.

  This may cause some problem, for example, all of server connections are lost for a moment, some clients will enter serverless mode, instead of route to hub server.

Choosing:
1. No hub server, choose `Serverless`.
1. All of hubs have hub servers, choose `Default`.
1. Some of hubs have hub servers, others not, choose `Classic`, but this may cause some problem, the better way is create two instances, one is `Serverless`, another is `Default`.

## Any feature differences when using Azure SignalR for ASP.NET SignalR?
When using Azure SignalR, some APIs and features of ASP.NET SignalR are no longer supported:
- The ability to pass arbitrary state between clients and the hub (often called `HubState`) is not supported when using Azure SignalR
- `PersistentConnection` class is not yet supported when using Azure SignalR
- **Forever Frame transport** is not supported  when using Azure SignalR
- Azure SignalR no longer replays messages sent to client when client is offline
- When using Azure SignalR, the traffic for one client connection is always routed (aka. **sticky**) to one app server instance for the duration of the connection

The support for ASP.NET SignalR is focused on compatibility, so not all new features from ASP.NET Core SignalR are supported. For example, **MessagePack**, **Streaming**, etc., are only available for ASP.NET Core SignalR applications.

SignalR Service can be configured for different service mode: `Classic`/`Default`/`Serverles`s. In this ASP.NET support, the `Serverless` mode is not supported. The data-plane REST API is also not supported.

## Where do my data reside?

Azure SignalR Service is working as a data processor service. It will not store any customer content and data residency is promised by design. If you use Azure SignalR Service together with other Azure services, like Azure Storage for diagnostics, please check [here](https://azure.microsoft.com/resources/achieving-compliant-data-residency-and-security-with-azure/) for guidance about how to keep data residency in Azure regions.
