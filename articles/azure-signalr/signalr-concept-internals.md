---
title: Azure SignalR Service internals
description: An overview of Azure SignalR Service internals.
author: sffamily
ms.service: signalr
ms.topic: conceptual
ms.date: 03/01/2019
ms.author: zhshang
---
# Azure SignalR Service internals

Azure SignalR Service is built on top of ASP.NET Core SignalR framework. It also supports ASP.NET SignalR as a preview feature.

> To support ASP.NET SignalR, Azure SignalR Service reimplements ASP.NET SignalR's data protocol on top of the ASP.NET Core framework

You can easily migrate a local ASP.NET Core SignalR application to work with SignalR Service, with a few lines of code change.

The diagram below describes the typical architecture when you use the SignalR Service with your application server.

The differences from self-hosted ASP.NET Core SignalR application are discussed as well.

![Architecture](./media/signalr-concept-internals/arch.png)

## Server connections

Self-hosted ASP.NET Core SignalR application server listens to and connects clients directly.

With SignalR Service, the application server is no longer accepting persistent client connections, instead:

1. A `negotiate` endpoint is exposed by Azure SignalR Service SDK for each hub.
1. This endpoint will respond to client's negotiation requests and redirect clients to SignalR Service.
1. Eventually, clients will be connected to SignalR Service.

For more information, see [Client connections](#client-connections).

Once the application server is started, 
- For ASP.NET Core SignalR, Azure SignalR Service SDK opens 5 WebSocket connections per hub to SignalR Service. 
- For ASP.NET SignalR, Azure SignalR Service SDK opens 5 WebSocket connections per hub to SignalR Service, and one per application WebSocket connection.

5 WebSocket connections is the default value that can be changed in [configuration](https://github.com/Azure/azure-signalr/blob/dev/docs/use-signalr-service.md#connectioncount).

Messages to and from clients will be multiplexed into these connections.

These connections will remain connected to the SignalR Service all the time. If a server connection is disconnected for network issue,
- all clients that are served by this server connection disconnect (for more information about it, see [Data transmit between client and server](#data-transmit-between-client-and-server));
- the server connection starts reconnecting automatically.

## Client connections

When you use the SignalR Service, clients connect to SignalR Service instead of application server.
There are two steps to establish persistent connections between the client and the SignalR Service.

1. Client sends a negotiate request to the application server. With Azure SignalR Service SDK, application server returns a redirect response with SignalR Service's URL and access token.

- For ASP.NET Core SignalR, a typical redirect response looks like:
    ```
    {
        "url":"https://test.service.signalr.net/client/?hub=chat&...",
        "accessToken":"<a typical JWT token>"
    }
    ```
- For ASP.NET SignalR, a typical redirect response looks like:
    ```
    {
        "ProtocolVersion":"2.0",
        "RedirectUrl":"https://test.service.signalr.net/aspnetclient",
        "AccessToken":"<a typical JWT token>"
    }
    ```

1. After receiving the redirect response, client uses the new URL and access token to start the normal process to connect to SignalR Service.

Learn more about ASP.NET Core SignalR's [transport protocols](https://github.com/aspnet/SignalR/blob/release/2.2/specs/TransportProtocols.md).

## Data transmit between client and server

When a client is connected to the SignalR Service, service runtime will find a server connection to serve this client
- This step happens only once, and is a one-to-one mapping between the client and server connections.
- The mapping is maintained in SignalR Service until the client or server disconnects.

At this point, the application server receives an event with information from the new client. A logical connection to the client is created in the application server. The data channel is established from client to application server, via SignalR Service.

SignalR service transmits data from the client to the pairing application server. And data from the application server will be sent to the mapped clients.

As you can see, the Azure SignalR Service is essentially a logical transport layer between  application server and clients. All persistent connections are offloaded to SignalR Service.
Application server only needs to handle the business logic in hub class, without worrying about client connections.