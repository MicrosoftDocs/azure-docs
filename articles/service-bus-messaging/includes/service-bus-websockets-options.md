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

The AMQP-over-WebSockets protocol option runs over port TCP 443 just like the HTTP/REST API, but is otherwise functionally identical with plain AMQP. This option has higher initial connection latency because of extra handshake roundtrips and slightly more overhead as tradeoff for sharing the HTTPS port. If this mode is selected, TCP port 443 is sufficient for communication. The following options allow selecting the AMQP WebSockets mode. 

| Language | Option   |
| -------- | ----- |
| .NET (Azure.Messaging.ServiceBus)    | Create [ServiceBusClient](/dotnet/api/azure.messaging.servicebus.servicebusclient.-ctor) using a constructor that takes [ServiceBusClientOptions](/dotnet/api/azure.messaging.servicebus.servicebusclientoptions) as a parameter. Set [ServiceBusClientOptions.TransportType](/dotnet/api/azure.messaging.servicebus.servicebusclientoptions.transporttype) to [ServiceBusTransportType.AmqpWebSockets](/dotnet/api/azure.messaging.servicebus.servicebustransporttype) |
| .NET (Microsoft.Azure.ServiceBus)    | When creating client objects, use constructors that take [TransportType](/dotnet/api/microsoft.azure.servicebus.transporttype), [ServiceBusConnection](/dotnet/api/microsoft.azure.servicebus.servicebusconnection), or [ServiceBusConnectionStringBuilder](/dotnet/api/microsoft.azure.servicebus.servicebusconnectionstringbuilder) as parameters. <p>For the construction that takes `transportType` as a parameter, set the parameter to [TransportType.AmqpWebSockets](/dotnet/api/microsoft.azure.servicebus.transporttype).</p> <p>For the constructor that takes `ServiceBusConnection` as a parameter, set the [ServiceBusConnection.TransportType](/dotnet/api/microsoft.azure.servicebus.servicebusconnection.transporttype) to [TransportType.AmqpWebSockets](/dotnet/api/microsoft.azure.servicebus.transporttype).</p> <p>If you use `ServiceBusConnectionStringBuilder`, use constructors that give you an option to specify the `transportType`.</p> |
| Java (com.azure.messaging.servicebus)     | When creating clients, set [ServiceBusClientBuilder.transportType](/java/api/com.azure.messaging.servicebus.servicebusclientbuilder.transporttype) to [AmqpTransportType.AMQP.AMQP_WEB_SOCKETS](/java/api/com.azure.core.amqp.amqptransporttype) |
| Java (com.microsoft.azure.servicebus)    | When creating clients, set `transportType` in [com.microsoft.azure.servicebus.ClientSettings](/java/api/com.microsoft.azure.servicebus.clientsettings.clientsettings#com_microsoft_azure_servicebus_ClientSettings_ClientSettings_com_microsoft_azure_servicebus_security_TokenProvider_com_microsoft_azure_servicebus_primitives_RetryPolicy_java_time_Duration_com_microsoft_azure_servicebus_primitives_TransportType_)  to [com.microsoft.azure.servicebus.primitives.TransportType.AMQP_WEB_SOCKETS](/java/api/com.microsoft.azure.servicebus.primitives.transporttype) |
| JavaScript  | When creating Service Bus client objects, use the `webSocketOptions` property in [ServiceBusClientOptions](/javascript/api/@azure/service-bus/servicebusclientoptions). |
| Python | When creating Service Bus clients, set [ServiceBusClient.transport_type](/python/api/azure-servicebus/azure.servicebus.servicebusclient) to [TransportType.AmqpOverWebSocket](/python/api/azure-servicebus/azure.servicebus.transporttype) |

