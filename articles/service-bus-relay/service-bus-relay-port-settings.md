---
title: Azure Service Bus WCF Relay port settings | Microsoft Docs
description: Details about Service Bus WCF Relay port values.
services: service-bus-relay
documentationcenter: na
author: sethmanheim
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-bus-relay
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/23/2016
ms.author: sethm

---

# Azure Relay port settings

The following table describes the required configuration for port values for a Service Bus WCF Relay binding.

## Ports
  
|Binding|Transport Security|Port|  
|-------------|------------------------|----------|  
|[BasicHttpRelayBinding Class](/dotnet/api/microsoft.servicebus.basichttprelaybinding) (client)|Yes|HTTPS| 
| |" |No|HTTP|  
|[BasicHttpRelayBinding Class](/dotnet/api/microsoft.servicebus.basichttprelaybinding) (service)|Either|9351/HTTP|  
|[NetEventRelayBinding Class](/dotnet/api/microsoft.servicebus.neteventrelaybinding) (client)|Yes|9351/HTTPS|  
||" |No|9350/HTTP|  
|[NetEventRelayBinding Class](/dotnet/api/microsoft.servicebus.neteventrelaybinding) (service)|Either|9351/HTTP|  
|[NetTcpRelayBinding Class](/dotnet/api/microsoft.servicebus.nettcprelaybinding) (client/service)|Either|5671/9352/HTTP (9352/9353 if using hybrid)|  
|[NetOnewayRelayBinding Class](/dotnet/api/microsoft.servicebus.netonewayrelaybinding) (client)|Yes|9351/HTTPS|  
||" |No|9350/HTTP|  
|[NetOnewayRelayBinding Class](/dotnet/api/microsoft.servicebus.netonewayrelaybinding) (service)|Either|9351/HTTP|  
|[WebHttpRelayBinding Class](/dotnet/api/microsoft.servicebus.webhttprelaybinding) (client)|Yes|HTTPS|  
||" |No|HTTP|  
|[WebHttpRelayBinding Class](/dotnet/api/microsoft.servicebus.webhttprelaybinding) (service)|Either|9351/HTTP|  
|[WS2007HttpRelayBinding Class](/dotnet/api/microsoft.servicebus.ws2007httprelaybinding) (client)|Yes|HTTPS|  
||" |No|HTTP|  
|[WS2007HttpRelayBinding Class](/dotnet/api/microsoft.servicebus.ws2007httprelaybinding) (service)|Either|9351/HTTP|

## Next steps
To learn more about Service Bus messaging, see the following topics.

* [Service Bus fundamentals](../service-bus-messaging/service-bus-fundamentals-hybrid-solutions.md)
* [Service Bus queues, topics, and subscriptions](../service-bus-messaging/service-bus-queues-topics-subscriptions.md)
* [How to use Service Bus queues](../service-bus-messaging/service-bus-dotnet-get-started-with-queues.md)
* [How to use Service Bus topics and subscriptions](../service-bus-messaging/service-bus-dotnet-how-to-use-topics-subscriptions.md)
