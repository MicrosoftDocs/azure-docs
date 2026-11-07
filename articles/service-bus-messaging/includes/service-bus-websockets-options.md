---
title: include file
description: include file
author: clemensv
ms.service: azure-service-bus
ms.topic: include
ms.date: 10/06/2026
ms.author: clemensv
ms.custom: sfi-ropc-nochange
---

The AMQP-over-WebSockets protocol option runs over port TCP 443 just like the HTTP/REST API, but is otherwise functionally identical with plain AMQP. This option has higher initial connection latency because of extra handshake roundtrips and slightly more overhead as tradeoff for sharing the HTTPS port. If this mode is selected, TCP port 443 is sufficient for communication. The following options allow selecting the AMQP WebSockets mode.

| Language | Option   |
| -------- | ----- |
| .NET (Azure.Messaging.ServiceBus)    | Create [ServiceBusClient](/dotnet/api/azure.messaging.servicebus.servicebusclient.-ctor) using a constructor that takes [ServiceBusClientOptions](/dotnet/api/azure.messaging.servicebus.servicebusclientoptions) as a parameter. Set [ServiceBusClientOptions.TransportType](/dotnet/api/azure.messaging.servicebus.servicebusclientoptions.transporttype) to [ServiceBusTransportType.AmqpWebSockets](/dotnet/api/azure.messaging.servicebus.servicebustransporttype) |
| Java (com.azure.messaging.servicebus)     | When creating clients, set [ServiceBusClientBuilder.transportType](/java/api/com.azure.messaging.servicebus.servicebusclientbuilder.transporttype) to [AmqpTransportType.AMQP.AMQP_WEB_SOCKETS](/java/api/com.azure.core.amqp.amqptransporttype) |
| JavaScript  | When creating Service Bus client objects, use the `webSocketOptions` property in [ServiceBusClientOptions](/javascript/api/@azure/service-bus/servicebusclientoptions). |
| Python | When creating Service Bus clients, set [ServiceBusClient.transport_type](/python/api/azure-servicebus/azure.servicebus.servicebusclient) to [TransportType.AmqpOverWebSocket](/python/api/azure-servicebus/azure.servicebus.transporttype) |
