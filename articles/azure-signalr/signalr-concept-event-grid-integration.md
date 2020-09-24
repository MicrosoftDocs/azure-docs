---
title: React to Azure SignalR Service events
description: Use Azure Event Grid to subscribe to Azure SignalR Service events. Other downstream services can be triggered by these events.
services: azure-signalr,event-grid 
author: chenyl

ms.author: chenyl
ms.reviewer: zhshang
ms.date: 11/13/2019
ms.topic: conceptual
ms.service: signalr
---

# Reacting to Azure SignalR Service events

Azure SignalR Service events allow applications to react to client connections connected or disconnected using modern serverless architectures. It does so without the need for complicated code or expensive and inefficient polling services.  Instead, events are pushed through [Azure Event Grid](https://azure.microsoft.com/services/event-grid/) to subscribers such as [Azure Functions](https://azure.microsoft.com/services/functions/), [Azure Logic Apps](https://azure.microsoft.com/services/logic-apps/), or even to your own custom http listener, and you only pay for what you use.

Azure SignalR Service events are reliably sent to the Event Grid service which provides reliable delivery services to your applications through rich retry policies and dead-letter delivery. To learn more, see [Event Grid message delivery and retry](https://docs.microsoft.com/azure/event-grid/delivery-and-retry).

![Event Grid Model](https://docs.microsoft.com/azure/event-grid/media/overview/functional-model.png)

## Serverless state
Azure SignalR Service events are only active when client connections are in serverless state. Generally speaking, if a client doesn't route to a hub server, it goes into the serverless state. Classic mode work only when the hub, that client connections connect to, doesn't have a hub server. However, serverless mode is recommended to avoid some problem. To learn more details about service mode, see [How to choose Service Mode](https://github.com/Azure/azure-signalr/blob/dev/docs/faq.md#what-is-the-meaning-of-service-mode-defaultserverlessclassic-how-can-i-choose).

## Available Azure SignalR Service events
Event grid uses [event subscriptions](../event-grid/concepts.md#event-subscriptions) to route event messages to subscribers. Azure SignalR Service event subscriptions support two types of events:  

|Event Name|Description|
|----------|-----------|
|`Microsoft.SignalRService.ClientConnectionConnected`|Raised when a client connection is connected.|
|`Microsoft.SignalRService.ClientConnectionDisconnected`|Raised when a client connection is disconnected.|

## Event schema
Azure SignalR Service events contain all the information you need to respond to the changes in your data. You can identify an Azure SignalR Service event with the eventType property starts with "Microsoft.SignalRService". Additional information about the usage of Event Grid event properties is documented at [Event Grid event schema](../event-grid/event-schema.md).  

Here is an example of a client connection connected event:
```json
[{
  "topic": "/subscriptions/{subscription-id}/resourceGroups/signalr-rg/providers/Microsoft.SignalRService/SignalR/signalr-resource",
  "subject": "/hub/chat",
  "eventType": "Microsoft.SignalRService.ClientConnectionConnected",
  "eventTime": "2019-06-10T18:41:00.9584103Z",
  "id": "831e1650-001e-001b-66ab-eeb76e069631",
  "data": {
    "timestamp": "2019-06-10T18:41:00.9584103Z",
    "hubName": "chat",
    "connectionId": "crH0uxVSvP61p5wkFY1x1A",
    "userId": "user-eymwyo23"
  },
  "dataVersion": "1.0",
  "metadataVersion": "1"
}]
```

For more information, see [SignalR Service events schema](../event-grid/event-schema-azure-signalr.md).

## Next steps

Learn more about Event Grid and give Azure SignalR Service events a try:

> [!div class="nextstepaction"]
> [Try a sample Event Grid integration with Azure SignalR Service](./signalr-howto-event-grid-integration.md)
> [About Event Grid](../event-grid/overview.md)
