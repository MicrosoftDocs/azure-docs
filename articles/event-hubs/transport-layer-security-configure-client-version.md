---
title: Configure Transport Layer Security (TLS) for an Event Hubs client application
titleSuffix: Event Hubs
description: Configure a client application to communicate with Azure Event Hubs using a minimum version of Transport Layer Security (TLS).
services: event-hubs
author: EldertGrootenboer

ms.service: event-hubs
ms.topic: article
ms.date: 04/25/2022
ms.author: egrootenboer
---

# Configure Transport Layer Security (TLS) for an Event Hubs client application

For security purposes, an Azure Event Hubs namespace may require that clients use a minimum version of Transport Layer Security (TLS) to send requests. Calls to Azure Event Hubs will fail if the client is using a version of TLS that is lower than the minimum required version. For example, if a namespace requires TLS 1.2, then a request sent by a client who is using TLS 1.1 will fail.

This article describes how to configure a client application to use a particular version of TLS. For information about how to configure a minimum required version of TLS for an Azure Event Hubs namespace, see [Enforce a minimum required version of Transport Layer Security (TLS) for requests to an Event Hubs namespace](transport-layer-security-configure-minimum-version.md).

## Configure the client TLS version

In order for a client to send a request with a particular version of TLS, the operating system must support that version.

The following example shows how to set the client's TLS version to 1.2 from .NET. The .NET Framework used by the client must support TLS 1.2. For more information, see [Support for TLS 1.2](/dotnet/framework/network-programming/tls#support-for-tls-12).

# [.NET](#tab/dotnet)

The following sample shows how to enable TLS 1.2 in a .NET client using the Azure.Messaging.ServiceBus client library of Event Hubs:

```csharp
{
    // Enable TLS 1.2 before connecting to Event Hubs
    System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;

    // Connection string to your Event Hubs namespace
    string connectionString = "<NAMESPACE CONNECTION STRING>";
    
    // Name of your Event Hub
    string eventHubName = "<EVENT HUB NAME>";
    
    // The sender used to publish messages to the queue
    var producer = new EventHubProducerClient(connectionString, eventHubName);
    
    // Use the producer client to send a message to the Event Hubs queue
    using EventDataBatch eventBatch = await producer.CreateBatchAsync();
    var eventData = new EventData("This is an event body");

    if (!eventBatch.TryAdd(eventData))
    {
        throw new Exception($"The event could not be added.");
    }
}
```

---

## Verify the TLS version used by a client

To verify that the specified version of TLS was used by the client to send a request, you can use [Fiddler](https://www.telerik.com/fiddler) or a similar tool. Open Fiddler to start capturing client network traffic, then execute one of the examples in the previous section. Look at the Fiddler trace to confirm that the correct version of TLS was used to send the request.

## Next steps

See the following documentation for more information.

- [Enforce a minimum required version of Transport Layer Security (TLS) for requests to an Event Hubs namespace](transport-layer-security-enforce-minimum-version.md)
- [Configure the minimum TLS version for an Event Hubs namespace](transport-layer-security-configure-minimum-version.md)
- [Use Azure Policy to audit for compliance of minimum TLS version for an Event Hubs namespace](transport-layer-security-audit-minimum-version.md)