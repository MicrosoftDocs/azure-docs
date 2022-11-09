---
title: Configure Transport Layer Security (TLS) for a Service Bus client application
titleSuffix: Service Bus
description: Configure a client application to communicate with Azure Service Bus using a minimum version of Transport Layer Security (TLS).
services: service-bus
author: EldertGrootenboer

ms.service: service-bus-messaging
ms.custom: ignite-2022
ms.topic: article
ms.date: 09/26/2022
ms.author: egrootenboer
---

# Configure Transport Layer Security (TLS) for a Service Bus client application

For security purposes, an Azure Service Bus namespace may require that clients use a minimum version of Transport Layer Security (TLS) to send requests. Calls to Azure Service Bus will fail if the client is using a version of TLS that is lower than the minimum required version. For example, if a namespace requires TLS 1.2, then a request sent by a client who is using TLS 1.1 will fail.

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
    
    // Connection string to your Service Bus namespace
    string connectionString = "<NAMESPACE CONNECTION STRING>";
    
    // Name of your Service Bus queue
    string queueName = "<QUEUE NAME>";

    // The client that owns the connection and can be used to create senders and receivers
    static ServiceBusClient client = new ServiceBusClient(connectionString);
    
    // The sender used to publish messages to the queue
    ServiceBusSender sender = client.CreateSender(queueName);
    
    // Use the producer client to send a message to the Service Bus queue
    await sender.SendMessagesAsync(new ServiceBusMessage($"Message for TLS check")));
}
```
# [Java](#tab/java)
The minimum Java version for messaging SDKs is Java 8. For Java 8 installations, the default TLS version is 1.2. For Java 11 and later, the default is TLS 1.3. 

Java Messaging SDKs use the default `SSLContext` from JDK. That's, if you configure JDK TLS using the system properties documented by the JVM, then Java messaging libraries implicitly use it. For example, For OpenJDK-based JVMs, you can use the system property `jdk.tls.client.protocols`. Example: `-Djdk.tls.client.protocols=TLSv1.2`. 

There are a few other ways to enable TLS 1.2 include the following one:

```java
sslSocket.setEnabledProtocols(new String[] {"TLSv1. 2"});
```

---

## Verify the TLS version used by a client

To verify that the specified version of TLS was used by the client to send a request, you can use [Fiddler](https://www.telerik.com/fiddler) or a similar tool. Open Fiddler to start capturing client network traffic, then execute one of the examples in the previous section. Look at the Fiddler trace to confirm that the correct version of TLS was used to send the request.

## Next steps

See the following documentation for more information.

- [Enforce a minimum required version of Transport Layer Security (TLS) for requests to a Service Bus namespace](transport-layer-security-enforce-minimum-version.md)
- [Configure the minimum TLS version for a Service Bus namespace](transport-layer-security-configure-minimum-version.md)
- [Use Azure Policy to audit for compliance of minimum TLS version for a Service Bus namespace](transport-layer-security-audit-minimum-version.md)
