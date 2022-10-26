---
title: Messages and connections in Azure SignalR Service
description: An overview of key concepts about messages and connections in Azure SignalR Service.
author: vicancy
ms.service: signalr
ms.topic: conceptual
ms.date: 08/05/2020
ms.author: lianwei
---
# Messages and connections in Azure SignalR Service

The billing model for Azure SignalR Service is based on the number of connections and the number of messages. This article explains how messages and connections are defined and counted for billing.


## Message formats 

Azure SignalR Service supports the same formats as ASP.NET Core SignalR: [JSON](https://www.json.org/) and [MessagePack](/aspnet/core/signalr/messagepackhubprotocol).

## Message size

The following limits apply for Azure SignalR Service messages:

* Client messages:
  * For long polling or server side events, the client cannot send messages larger than 1MB.
  * There is no size limit for Websockets for service.
  * App server can set a limit for client message size. Default is 32KB. For more information, see [Security considerations in ASP.NET Core SignalR](/aspnet/core/signalr/security?#buffer-management).
  * For serverless, the message size is limited by upstream implementation, but under 1MB is recommended.
* Server messages:
  * There is no limit to server message size, but under 16MB is recommended.
  * App server can set a limit for client message size. Default is 32KB. For more information, see [Security considerations in ASP.NET Core SignalR](/aspnet/core/signalr/security?#buffer-management).
  * Serverless:
    * Rest API: 1MB for message body, 16KB for headers.
    * There is no limit for Websockets, [management SDK persistent mode](https://github.com/Azure/azure-signalr/blob/dev/docs/management-sdk-guide.md), but under 16MB is recommended.

For Websockets clients, large messages are split into smaller messages that are no more than 2 KB each and transmitted separately. SDKs handle message splitting and assembling. No developer efforts are needed.

Large messages do negatively affect messaging performance. Use smaller messages whenever possible, and test to determine the optimal message size for each use-case scenario.

## How messages are counted for billing

For billing, only outbound messages from Azure SignalR Service are counted. Ping messages between clients and servers are ignored.

Messages larger than 2 KB are counted as multiple messages of 2 KB each. The message count chart in the Azure portal is updated every 100 messages per hub.

For example, imagine you have one application server, and three clients:

App server broadcasts a 1-KB message to all connected clients, the message from app server to the service is considered free inbound message. Only the three messages sending from service to each of the client are billed as outbound messages.

Client A sends a 1-KB message to another client B, without going through app server. The message from client A to service is free inbound message. The message from service to client B is billed as outbound message.

If you have three clients and one application server. One client sends a 4-KB message to let the server broadcast to all clients. The billed message count is eight: one message from the service to the application server and three messages from the service to the clients. Each message is counted as two 2-KB messages.

## How connections are counted

There are server connections and client connections with Azure SignalR Service. By default, each application server starts with five initial connections per hub, and each client has one client connection.

For example, assume that you have two application servers and you define five hubs in code. The server connection count will be 50: 2 app servers * 5 hubs * 5 connections per hub.

The connection count shown in the Azure portal includes server connections, client connections, diagnostic connections, and live trace connections. The connection types are defined in the following list:

- **Server connection**: Connects Azure SignalR Service and the app server.
- **Client connection**: Connects Azure SignalR Service and the client app.
- **Diagnostic connection**: A special kind of client connection that can produce a more detailed log, which might affect performance. This kind of client is designed for troubleshooting.
- **Live trace connection**: Connects to the live trace endpoint and receives live traces of Azure SignalR Service. 
 
Note that a live trace connection isn't counted as a client connection or as a server connection. 

ASP.NET SignalR calculates server connections in a different way. It includes one default hub in addition to hubs that you define. By default, each application server needs five more initial server connections. The initial connection count for the default hub stays consistent with other hubs.

The service and the application server keep syncing connection status and making adjustment to server connections to get better performance and service stability.  So you might see server connection number changes from time to time.

## How inbound/outbound traffic is counted

Message sent into the service is inbound message. Message sent out of the service is outbound message. Traffic is calculated in bytes.

## Related resources

- [Aggregation types in Azure Monitor](../azure-monitor/essentials/metrics-supported.md#microsoftsignalrservicesignalr )
- [ASP.NET Core SignalR configuration](/aspnet/core/signalr/configuration)
- [JSON](https://www.json.org/)
- [MessagePack](/aspnet/core/signalr/messagepackhubprotocol)
