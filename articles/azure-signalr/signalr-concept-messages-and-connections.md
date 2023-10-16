---
title: Messages and connections in Azure SignalR Service
description: An overview of key concepts about messages and connections in Azure SignalR Service.
author: vicancy
ms.service: signalr
ms.topic: conceptual
ms.date: 03/23/2023
ms.author: lianwei
---
# Messages and connections in Azure SignalR Service

The billing model for Azure SignalR Service is based on the number of connections and the number of outbound messages from the service. This article explains how messages and connections are defined and counted for billing.


## Message formats 

Azure SignalR Service supports the same formats as ASP.NET Core SignalR: [JSON](https://www.json.org/) and [MessagePack](/aspnet/core/signalr/messagepackhubprotocol).

## Message size

The following limits apply for Azure SignalR Service messages:

* Client messages:
  * For long polling or server side events, the client can't send messages larger than 1 MB.
  * There's no size limit for WebSocket for service.
  * App server can set a limit for client message size. Default is 32 KB. For more information, see [Security considerations in ASP.NET Core SignalR](/aspnet/core/signalr/security?#buffer-management).
  * For serverless, the message size is limited by upstream implementation, but under 1 MB is recommended.
* Server messages:
  * There's no limit to server message size, but under 16 MB is recommended.
  * App server can set a limit for client message size. Default is 32 KB. For more information, see [Security considerations in ASP.NET Core SignalR](/aspnet/core/signalr/security?#buffer-management).
  * Serverless:
    * Rest API: 1 MB for message body, 16 KB for headers.
    * There's no limit for WebSocket, [management SDK persistent mode](https://github.com/Azure/azure-signalr/blob/dev/docs/management-sdk-guide.md), but under 16 MB is recommended.

For WebSocket clients, large messages are split into smaller messages that are no more than 2 KB each and transmitted separately. SDKs handle message splitting and assembling. No developer efforts are needed.

Large messages do negatively affect messaging performance. Use smaller messages whenever possible, and test to determine the optimal message size for each use-case scenario.

## How messages are counted for billing

Messages sent into the service are inbound messages and messages sent out of the service are outbound messages.  Only outbound messages from Azure SignalR Service are counted for billing. Ping messages between clients and servers are ignored.

Messages larger than 2 KB are counted as multiple messages of 2 KB each. The message count chart in the Azure portal is updated every 100 messages per hub.

For example, imagine you have one application server, and three clients:

* When the application server broadcasts a 1-KB message to all connected clients, the message from the application server to the service is considered a free inbound message. The three messages sent from service to each of the clients are outbound messages and are billed.

* When *client A* sends a 1 KB inbound message to *client B*, without going through app server, the message is a free inbound message. The message routed from service to *client B* is billed as an outbound message.

* If you have three clients and one application server, when one client sends a 4-KB message for the server broadcast to all clients, the billed message count is eight: 

  * One message from the service to the application server.
  * Three messages from the service to the clients. Each message is counted as two 2-KB messages.

## How connections are counted

The Azure SignalR Service creates application server and client connections. By default, each application server starts with five initial connections per hub, and each client has one client connection.

For example, assume that you have two application servers and you define five hubs in code. The server connection count is 50: (2 app servers * 5 hubs * 5 connections per hub).

The connection count shown in the Azure portal includes server, client, diagnostic, and live trace connections. The connection types are defined in the following list:

* **Server connection**: Connects Azure SignalR Service and the app server.
* **Client connection**: Connects Azure SignalR Service and the client app.
* **Diagnostic connection**: A special type of client connection that can produce a more detailed log, which might affect performance. This kind of client is designed for troubleshooting.
* **Live trace connection**: Connects to the live trace endpoint and receives live traces of Azure SignalR Service.

A live trace connection isn't counted as a client connection or as a server connection. 

ASP.NET SignalR calculates server connections in a different way. It includes one default hub in addition to hubs that you define. By default, each application server needs five more initial server connections. The initial connection count for the default hub stays consistent with other hubs.

The service and the application server keep syncing connection status and making adjustments to server connections to get better performance and service stability.  So you may see changes in the number of server connections in your running service.

## Related resources

* [Aggregation types in Azure Monitor](../azure-monitor/essentials/metrics-supported.md#microsoftsignalrservicesignalr)
* [ASP.NET Core SignalR configuration](/aspnet/core/signalr/configuration)
* [JSON](https://www.json.org/)
* [MessagePack](/aspnet/core/signalr/messagepackhubprotocol)
