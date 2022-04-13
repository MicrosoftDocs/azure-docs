---
title: Configure Transport Layer Security (TLS) for a client application
titleSuffix: Service Bus
description: Configure a client application to communicate with Azure Service Bus using a minimum version of Transport Layer Security (TLS).
services: service-bus
author: EldertGrootenboer

ms.service: service-bus
ms.topic: article
ms.date: 04/12/2022
ms.author: EldertGrootenboer
---

# Configure Transport Layer Security (TLS) for a client application

For security purposes, an Azure Azure Service Bus namespace may require that clients use a minimum version of Transport Layer Security (TLS) to send requests. Calls to Azure Service Bus will fail if the client is using a version of TLS that is lower than the minimum required version. For example, if a namespace requires TLS 1.2, then a request sent by a client who is using TLS 1.1 will fail.

This article describes how to configure a client application to use a particular version of TLS. For information about how to configure a minimum required version of TLS for an Azure Service Bus namespace, see [Enforce a minimum required version of Transport Layer Security (TLS) for requests to a Service Bus namespace](transport-layer-security-configure-minimum-version.md).

## Configure the client TLS version

In order for a client to send a request with a particular version of TLS, the operating system must support that version.

The following example shows how to set the client's TLS version to 1.2 from .NET. The .NET Framework used by the client must support TLS 1.2. For more information, see [Support for TLS 1.2](/dotnet/framework/network-programming/tls#support-for-tls-12).

# [.NET](#tab/dotnet)

The following sample shows how to enable TLS 1.2 in a .NET client using the Azure.Messaging.ServiceBus client library of Service Bus:

```csharp
{
// Enable TLS 1.2 before connecting to Service Bus
System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
// connection string to your Service Bus namespace
string connectionString = "<NAMESPACE CONNECTION STRING>";

// name of your Service Bus queue
string queueName = "<QUEUE NAME>";

// the sender used to publish messages to the queue
ServiceBusSender sender = client.CreateSender(queueName);

Use the producer client to send a message to the Service Bus queue
await sender.SendMessagesAsync(new ServiceBusMessage($"Message for TLS check")));
}
```

---

## Verify the TLS version used by a client

To verify that the specified version of TLS was used by the client to send a request, you can use [Fiddler](https://www.telerik.com/fiddler) or a similar tool. Open Fiddler to start capturing client network traffic, then execute one of the examples in the previous section. Look at the Fiddler trace to confirm that the correct version of TLS was used to send the request.