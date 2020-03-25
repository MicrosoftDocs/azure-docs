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
