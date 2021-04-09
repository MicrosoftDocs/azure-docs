---
title: include file
description: include file
services: service-bus-messaging
author: clemensv
ms.service: service-bus-messaging
ms.topic: include
ms.date: 04/08/2021
ms.author: clemensv
ms.custom: "include file"

---

The AMQP-over-WebSockets protocol option runs over port TCP 443 just like the HTTP/REST API, but is otherwise functionally identical with plain AMQP. This option has somewhat higher initial connection latency because of extra handshake roundtrips and slightly more overhead as tradeoff for sharing the HTTPS port. If this mode is selected, TCP port 443 is sufficient for communication. The following options allow selecting the plain AMQP or AMQP WebSockets mode:

| Language | Option   |
| -------- | ----- |
| .NET (Azure.Messaging.ServiceBus)    | [ServiceBusClientOptions.TransportType](/dotnet/api/azure.messaging.servicebus.servicebusclientoptions.transporttype) property with [ServiceBusTransportType.AmqpTcp](/dotnet/api/azure.messaging.servicebus.servicebustransporttype) or [ServiceBusTransportType.AmqpWebSockets](/dotnet/api/azure.messaging.servicebus.servicebustransporttype) |
| .NET (Microsoft.Azure.ServiceBus)    | [ServiceBusConnection.TransportType](/dotnet/api/microsoft.azure.servicebus.servicebusconnection.transporttype) property with [TransportType.Amqp](/dotnet/api/microsoft.azure.servicebus.transporttype) or [TransportType.AmqpWebSockets](/dotnet/api/microsoft.azure.servicebus.transporttype) |
| Java (com.azure.messaging.servicebus)     | [ServiceBusClientBuilder.transportType method](/java/api/com.azure.messaging.servicebus.servicebusclientbuilder.transporttype) set to [AmqpTransportType.AMQP](/java/api/com.azure.core.amqp.amqptransporttype) or [AmqpTransportType.AMQP.AMQP_WEB_SOCKETS](/java/api/com.azure.core.amqp.amqptransporttype) |
| Java (com.microsoft.azure.servicebus)    | [com.microsoft.azure.servicebus.ClientSettings](/java/api/com.microsoft.azure.servicebus.clientsettings.clientsettings) with [com.microsoft.azure.servicebus.primitives.TransportType.AMQP](/java/api/com.microsoft.azure.servicebus.primitives.transporttype) or [com.microsoft.azure.servicebus.primitives.TransportType.AMQP_WEB_SOCKETS](/java/api/com.microsoft.azure.servicebus.primitives.transporttype) |
| JavaScript  | [ServiceBusClientOptions](/javascript/api/@azure/service-bus/servicebusclientoptions) has a `webSocket` constructor argument. |
| Python | [ServiceBusClient.transport_type](/python/api/azure-servicebus/azure.servicebus.servicebusclient) with [TransportType.Amqp](/python/api/azure-servicebus/azure.servicebus.transporttype) or [TransportType.AmqpOverWebSocket](/python/api/azure-servicebus/azure.servicebus.transporttype) |

