---
title: Best practices for improving performance using Azure Service Bus
description: Describes how to use Service Bus to optimize performance when exchanging brokered messages.
ms.topic: article
ms.date: 06/30/2023
ms.devlang: csharp
ms.custom: ignite-2022, devx-track-dotnet
---

# Best Practices for performance improvements using Service Bus Messaging

This article describes how to use Azure Service Bus to optimize performance when exchanging brokered messages. The first part of this article describes different mechanisms to increase performance. The second part provides guidance on using Service Bus in a way that can offer the best performance in a given scenario.

Throughout this article, the term "client" refers to any entity that accesses Service Bus. A client can take the role of a sender or a receiver. The term "sender" is used for a Service Bus queue client or a topic client that sends messages to a Service Bus queue or a topic. The term "receiver" refers to a Service Bus queue client or subscription client that receives messages from a Service Bus queue or a subscription.

## Resource planning and considerations

As with any technical resourcing, prudent planning is key in ensuring that Azure Service Bus is providing the performance that your application expects. The right configuration or topology for your Service Bus namespaces depends on a host of factors involving your application architecture and how each of the Service Bus features is used.

### Pricing tier

Service Bus offers various pricing tiers. It's recommended to pick the appropriate tier for your application requirements.

   * **Standard tier** - Suited for developer/test environments or low throughput scenarios where the applications are **not sensitive** to throttling.

   * **Premium tier** - Suited for production environments with varied throughput requirements where predictable latency and throughput are required. Additionally, Service Bus premium namespaces can be [auto scaled](automate-update-messaging-units.md) and can be enabled to accommodate spikes in throughput.

> [!NOTE]
> If the right tier is not picked, there is a risk of overwhelming the Service Bus namespace which may lead to [throttling](service-bus-throttling.md).
>
> Throttling does not lead to loss of data. Applications leveraging the Service Bus SDK can utilize the default [retry policy](/azure/architecture/best-practices/retry-service-specific#service-bus) to ensure that the data is eventually accepted by Service Bus.
>

### Calculating throughput for Premium

Data sent to Service Bus is serialized to binary and then deserialized when received by the receiver. Thus, while applications think of **messages** as atomic units of work, Service Bus measures throughput in terms of bytes (or megabytes).

When calculating the throughput requirement, consider the data that is being sent to Service Bus (ingress) and data that is received from Service Bus (egress).

As expected, throughput is higher for smaller message payloads that can be batched together.

#### Benchmarks

Here's a [GitHub sample](https://github.com/Azure-Samples/service-bus-dotnet-messaging-performance) that you can run to see the expected throughput you receive for your SB namespace. In our [benchmark tests](https://techcommunity.microsoft.com/t5/Service-Bus-blog/Premium-Messaging-How-fast-is-it/ba-p/370722), we observed approximately 4 MB/second per Messaging Unit (MU) of ingress and egress.

The benchmarking sample doesn't use any advanced features, so the throughput your applications observe is different, based on your scenarios.

#### Compute considerations

Using certain Service Bus features may require compute utilization that may decrease the expected throughput. Some of these features are -

1. Sessions.
2. Fanning out to multiple subscriptions on a single topic.
3. Running many filters on a single subscription.
4. Scheduled messages.
5. Deferred messages.
6. Transactions.
7. Deduplication & look back time window.
8. Forward to (forwarding from one entity to another).

If your application uses any of the above features and you aren't receiving the expected throughput, you can review the **CPU usage** metrics and consider scaling up your Service Bus Premium namespace.

You can also utilize Azure Monitor to [automatically scale the Service Bus namespace](automate-update-messaging-units.md).

### Sharding across namespaces

While scaling up Compute (Messaging Units) allocated to the namespace is an easier solution, it **may not** provide a linear increase in the throughput. It's because of Service Bus internals (storage, network, etc.), which may be limiting the throughput.

The cleaner solution in this case is to shard your entities (queues, and topics) across different Service Bus Premium namespaces. You may also consider sharding across different namespaces in different Azure regions.

## Protocols
Service Bus enables clients to send and receive messages via one of three protocols:

1. Advanced Message Queuing Protocol (AMQP)
2. Service Bus Messaging Protocol (SBMP)
3. Hypertext Transfer Protocol (HTTP)

AMQP is the most efficient, because it maintains the connection to Service Bus. It also implements [batching](#batching-store-access) and [prefetching](#prefetching). Unless explicitly mentioned, all content in this article assumes the use of AMQP or SBMP.

> [!IMPORTANT]
> The SBMP protocol is only available for .NET Framework. AMQP is the default for .NET Standard.

[!INCLUDE [service-bus-amqp-support-retirement](../../includes/service-bus-amqp-support-retirement.md)]

## Choosing the appropriate Service Bus .NET SDK

The `Azure.Messaging.ServiceBus` package is the latest Azure Service Bus .NET SDK available as of November 2020. There are two older .NET SDKs that will continue to receive critical bug fixes until 30 September 2026, but we strongly encourage you to use the latest SDK instead. Read the [migration guide](https://aka.ms/azsdk/net/migrate/sb) for details on how to move from the older SDKs.

| NuGet Package | Primary Namespace(s) | Minimum Platform(s) | Protocol(s) |
|---------------|----------------------|---------------------|-------------|
| [Azure.Messaging.ServiceBus](https://www.nuget.org/packages/Azure.Messaging.ServiceBus) (**latest**) | `Azure.Messaging.ServiceBus`<br>`Azure.Messaging.ServiceBus.Administration` | .NET Core 2.0<br>.NET Framework 4.6.1<br>Mono 5.4<br>Xamarin.iOS 10.14<br>Xamarin.Mac 3.8<br>Xamarin.Android 8.0<br>Universal Windows Platform 10.0.16299 | AMQP<br>HTTP |
| [Microsoft.Azure.ServiceBus](https://www.nuget.org/packages/Microsoft.Azure.ServiceBus) | `Microsoft.Azure.ServiceBus`<br>`Microsoft.Azure.ServiceBus.Management` | .NET Core 2.0<br>.NET Framework 4.6.1<br>Mono 5.4<br>Xamarin.iOS 10.14<br>Xamarin.Mac 3.8<br>Xamarin.Android 8.0<br>Universal Windows Platform 10.0.16299 | AMQP<br>HTTP |

For more information on minimum .NET Standard platform support, see [.NET implementation support](/dotnet/standard/net-standard#net-implementation-support).

[!INCLUDE [service-bus-track-0-and-1-sdk-support-retirement](../../includes/service-bus-track-0-and-1-sdk-support-retirement.md)]

## Reusing factories and clients
# [Azure.Messaging.ServiceBus SDK](#tab/net-standard-sdk-2)
The Service Bus clients that interact with the service, such as [ServiceBusClient](/dotnet/api/azure.messaging.servicebus.servicebusclient), [ServiceBusSender](/dotnet/api/azure.messaging.servicebus.servicebussender), [ServiceBusReceiver](/dotnet/api/azure.messaging.servicebus.servicebusreceiver), and [ServiceBusProcessor](/dotnet/api/azure.messaging.servicebus.servicebusprocessor), should be registered for dependency injection as singletons (or instantiated once and shared).  ServiceBusClient can be registered for dependency injection with the [ServiceBusClientBuilderExtensions](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/servicebus/Azure.Messaging.ServiceBus/src/Compatibility/ServiceBusClientBuilderExtensions.cs). 

We recommend that you don't close or dispose these clients after sending or receiving each message. Closing or disposing the entity-specific objects (ServiceBusSender/Receiver/Processor) results in tearing down the link to the Service Bus service. Disposing the ServiceBusClient results in tearing down the connection to the Service Bus service. 

This guidance doesn't apply to the [ServiceBusSessionReceiver](/dotnet/api/azure.messaging.servicebus.servicebussessionreceiver), as its lifetime is the same as the session itself.  For applications working with the `ServiceBusSessionReceiver`, it's recommended to use a singleton instance of the `ServiceBusClient` to accept each session, which spans a new `ServiceBusSessionReceiver` bound to that session.  Once the application finishes processing that session, it should dispose the associated `ServiceBusSessionReceiver`.

# [Microsoft.Azure.ServiceBus SDK](#tab/net-standard-sdk)

> Please note, a newer package Azure.Messaging.ServiceBus is available as of November 2020. While the Microsoft.Azure.ServiceBus package will continue to receive critical bug fixes until 30 September 2026, we strongly encourage you to upgrade. Read the [migration guide](https://aka.ms/azsdk/net/migrate/sb) for more details.

Service Bus client objects, such as implementations of [`IQueueClient`](/dotnet/api/microsoft.azure.servicebus.queueclient) or [`IMessageSender`](/dotnet/api/microsoft.azure.servicebus.core.messagesender), should be registered for dependency injection as singletons (or instantiated once and shared). We recommend that you don't close messaging factories, queue, topic, or subscription clients after you send a message, and then re-create them when you send the next message. Closing a messaging factory deletes the connection to the Service Bus service. A new connection is established when recreating the factory. 

---

The following note applies to all SDKs:

> [!NOTE]
> Establishing a connection is an expensive operation that you can avoid by reusing the same factory or client objects for multiple operations. You can safely use these client objects for concurrent asynchronous operations and from multiple threads.

## Concurrent operations
Operations such as send, receive, delete, and so on, take some time. This time includes the time that the Service Bus service takes to process the operation and the latency of the request and the response. To increase the number of operations per time, operations must execute concurrently.

The client schedules concurrent operations by performing **asynchronous** operations. The next request is started before the previous request is completed. The following code snippet is an example of an asynchronous send operation:

# [Azure.Messaging.ServiceBus SDK](#tab/net-standard-sdk-2)
```csharp
var messageOne = new ServiceBusMessage(body);
var messageTwo = new ServiceBusMessage(body);

var sendFirstMessageTask =
    sender.SendMessageAsync(messageOne).ContinueWith(_ =>
    {
        Console.WriteLine("Sent message #1");
    });
var sendSecondMessageTask =
    sender.SendMessageAsync(messageTwo).ContinueWith(_ =>
    {
        Console.WriteLine("Sent message #2");
    });

await Task.WhenAll(sendFirstMessageTask, sendSecondMessageTask);
Console.WriteLine("All messages sent");

```

# [Microsoft.Azure.ServiceBus SDK](#tab/net-standard-sdk)

```csharp
var messageOne = new Message(body);
var messageTwo = new Message(body);

var sendFirstMessageTask =
    queueClient.SendAsync(messageOne).ContinueWith(_ =>
    {
        Console.WriteLine("Sent message #1");
    });
var sendSecondMessageTask =
    queueClient.SendAsync(messageTwo).ContinueWith(_ =>
    {
        Console.WriteLine("Sent message #2");
    });

await Task.WhenAll(sendFirstMessageTask, sendSecondMessageTask);
Console.WriteLine("All messages sent");
```

---

The following code is an example of an asynchronous receive operation.

# [Azure.Messaging.ServiceBus SDK](#tab/net-standard-sdk-2)

```csharp
var client = new ServiceBusClient(connectionString);
var options = new ServiceBusProcessorOptions 
{

      AutoCompleteMessages = false,
      MaxConcurrentCalls = 20
};
await using ServiceBusProcessor processor = client.CreateProcessor(queueName,options);
processor.ProcessMessageAsync += MessageHandler;
processor.ProcessErrorAsync += ErrorHandler;

static Task ErrorHandler(ProcessErrorEventArgs args)
{
    Console.WriteLine(args.Exception);
    return Task.CompletedTask;
};

static async Task MessageHandler(ProcessMessageEventArgs args)
{
    Console.WriteLine("Handle message");
    await args.CompleteMessageAsync(args.Message);
}

await processor.StartProcessingAsync();
```

# [Microsoft.Azure.ServiceBus SDK](#tab/net-standard-sdk)

See the [GitHub repository](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.Azure.ServiceBus/SendersReceiversWithQueues) for full source code examples. 

```csharp
var receiver = new MessageReceiver(connectionString, queueName, ReceiveMode.PeekLock);

static Task LogErrorAsync(Exception exception)
{
    Console.WriteLine(exception);
    return Task.CompletedTask;
};

receiver.RegisterMessageHandler(
    async (message, cancellationToken) =>
    {
        Console.WriteLine("Handle message");
        await receiver.CompleteAsync(message.SystemProperties.LockToken);
    },
    new MessageHandlerOptions(e => LogErrorAsync(e.Exception))
    {
        AutoComplete = false,
        MaxConcurrentCalls = 20
    });
```

The `MessageReceiver` object is instantiated with the connection string, queue name, and a peek-look receive mode. Next, the `receiver` instance is used to register the message handler.

---

## Receive mode

When creating a queue or subscription client, you can specify a receive mode: *Peek-lock* or *Receive and Delete*. The default receive mode is `PeekLock`. When operating in the default mode, the client sends a request to receive a message from Service Bus. After the client has received the message, it sends a request to complete the message.

When setting the receive mode to `ReceiveAndDelete`, both steps are combined in a single request. These steps reduce the overall number of operations, and can improve the overall message throughput. This performance gain comes at the risk of losing messages.

Service Bus doesn't support transactions for receive-and-delete operations. Also, peek-lock semantics are required for any scenarios in which the client wants to defer or [dead-letter](service-bus-dead-letter-queues.md) a message.

## Batching store access

To increase the throughput of a queue, topic, or subscription, Service Bus batches multiple messages when it writes to its internal store. 

- When you enable batching on a queue, writing messages into the store, and deleting messages from the store are batched. 
- When you enable batching on a topic, writing messages into the store are batched. 
- When you enable batching on a subscription, deleting messages from the store are batched. 
- When batched store access is enabled for an entity, Service Bus delays a store write operation for that entity by up to 20 ms.

> [!NOTE]
> There is no risk of losing messages with batching, even if there is a Service Bus failure at the end of a 20ms batching interval.

Additional store operations that occur during this interval are added to the batch. Batched store access only affects **Send** and **Complete** operations; receive operations aren't affected. Batched store access is a property on an entity. Batching occurs across all entities that enable batched store access.

When you create a new queue, topic or subscription, batched store access is enabled by default.


# [Azure.Messaging.ServiceBus SDK](#tab/net-standard-sdk-2)
To disable batched store access, you need an instance of a `ServiceBusAdministrationClient`. Create a `CreateQueueOptions` from a queue description that sets the `EnableBatchedOperations` property to `false`.

```csharp
var options = new CreateQueueOptions(path)
{
    EnableBatchedOperations = false
};
var queue = await administrationClient.CreateQueueAsync(options);
```


# [Microsoft.Azure.ServiceBus SDK](#tab/net-standard-sdk)

To disable batched store access, you need an instance of a `ManagementClient`. Create a queue from a queue description that sets the `EnableBatchedOperations` property to `false`.

```csharp
var queueDescription = new QueueDescription(path)
{
    EnableBatchedOperations = false
};
var queue = await managementClient.CreateQueueAsync(queueDescription);
```

For more information, see the following articles:
- [QueueDescription.EnableBatchedOperations property](/dotnet/api/microsoft.azure.servicebus.management.queuedescription.enablebatchedoperations)
- [SubscriptionDescription.EnabledBatchedOperations property](/dotnet/api/microsoft.azure.servicebus.management.subscriptiondescription.enablebatchedoperations)
* [TopicDescription.EnableBatchedOperations](/dotnet/api/microsoft.azure.servicebus.management.topicdescription.enablebatchedoperations)

---

Batched store access doesn't affect the number of billable messaging operations. It's a property of a queue, topic, or subscription. It's independent of the receive mode and the protocol that's used between a client and the Service Bus service.

## Prefetching

[Prefetching](service-bus-prefetch.md) enables the queue or subscription client to load additional messages from the service when it receives messages. The client stores these messages in a local cache. The size of the cache is determined by the `ServiceBusReceiver.PrefetchCount` properties. Each client that enables prefetching maintains its own cache. A cache isn't shared across clients. If the client starts a receive operation and its cache is empty, the service transmits a batch of messages. The size of the batch equals the size of the cache or 256 KB, whichever is smaller. If the client starts a receive operation and the cache contains a message, the message is taken from the cache.

When a message is prefetched, the service locks the prefetched message. With the lock, the prefetched message can't be received by a different receiver. If the receiver can't complete the message before the lock expires, the message becomes available to other receivers. The prefetched copy of the message remains in the cache. The receiver that consumes the expired cached copy receives an exception when it tries to complete that message. By default, the message lock expires after 60 seconds. This value can be extended to 5 minutes. To prevent the consumption of expired messages, set the cache size smaller than the number of messages that a client can consume within the lock timeout interval.

When you use the default lock expiration of 60 seconds, a good value for `PrefetchCount` is 20 times the maximum processing rates of all receivers of the factory. For example, a factory creates three receivers, and each receiver can process up to 10 messages per second. The prefetch count shouldn't exceed 20 X 3 X 10 = 600. By default, `PrefetchCount` is set to 0, which means that no additional messages are fetched from the service.

Prefetching messages increases the overall throughput for a queue or subscription because it reduces the overall number of message operations, or round trips. The fetch of the first message, however, takes longer (because of the increased message size). Receiving prefetched messages from the cache is faster because these messages have already been downloaded by the client.

The time-to-live (TTL) property of a message is checked by the server at the time the server sends the message to the client. The client doesn't check the message's TTL property when the message is received. Instead, the message can be received even if the message's TTL has passed while the message was cached by the client.

Prefetching doesn't affect the number of billable messaging operations, and is available only for the Service Bus client protocol. The HTTP protocol doesn't support prefetching. Prefetching is available for both synchronous and asynchronous receive operations.

# [Azure.Messaging.ServiceBus SDK](#tab/net-standard-sdk-2)
For more information, see the following `PrefetchCount` properties:

- [ServiceBusReceiver.PrefetchCount](/dotnet/api/azure.messaging.servicebus.servicebusreceiver.prefetchcount)
- [ServiceBusProcessor.PrefetchCount](/dotnet/api/azure.messaging.servicebus.servicebusprocessor.prefetchcount)

You can set values for these properties in [ServiceBusReceiverOptions](/dotnet/api/azure.messaging.servicebus.servicebusreceiveroptions) or [ServiceBusProcessorOptions](/dotnet/api/azure.messaging.servicebus.servicebusprocessoroptions).

# [Microsoft.Azure.ServiceBus SDK](#tab/net-standard-sdk)

For more information, see the following `PrefetchCount` properties:

* [`Microsoft.Azure.ServiceBus.QueueClient.PrefetchCount`](/dotnet/api/microsoft.azure.servicebus.queueclient.prefetchcount)
* [`Microsoft.Azure.ServiceBus.SubscriptionClient.PrefetchCount`](/dotnet/api/microsoft.azure.servicebus.subscriptionclient.prefetchcount)

---

## Prefetching and ReceiveMessagesAsync
While the concepts of prefetching multiple messages together have similar semantics to processing messages in a batch (`ReceiveMessagesAsync`), there are some minor differences that must be kept in mind when using these approaches together.

Prefetch is a configuration (or mode) on the ServiceBusReceiver and `ReceiveMessagesAsync` is an operation (that has request-response semantics).

While using these approaches together, consider the following cases -

* Prefetch should be greater than or equal to the number of messages you're expecting to receive from `ReceiveMessagesAsync`.
* Prefetch can be up to n/3 times the number of messages processed per second, where n is the default lock duration.

There are some challenges with having a greedy approach, that is, keeping the prefetch count high, because it implies that the message is locked to a particular receiver. We recommend that you try out prefetch values that are between the thresholds mentioned above, and identify what fits.

## Multiple queues or topics

If a single queue or topic can't handle the expected number of messages, use multiple messaging entities. When using multiple entities, create a dedicated client for each entity, instead of using the same client for all entities.

More queues or topics mean that you have more entities to manage at deployment time. From a scalability perspective, there really isn't too much of a difference that you would notice as Service Bus already spreads the load across multiple logs internally, so if you use six queues or topics or two queues or topics won't make a material difference.

The tier of service you use impacts performance predictability. If you choose **Standard** tier, throughput and latency are best effort over a shared multi-tenant infrastructure. Other tenants on the same cluster may impact your throughput. If you choose **Premium**, you get resources that give you predictable performance, and your multiple queues or topics get processed out of that resource pool. For more information, see [Pricing tiers](#pricing-tier).

## Partitioned namespaces
When you use [partitioned premium tier namespaces](service-bus-partitioning.md), multiple partitions with lower messaging units (MU) give you a better performance over a single partition with higher MUs. 

## Scenarios

The following sections describe typical messaging scenarios and outline the preferred Service Bus settings. Throughput rates are classified as small (less than 1 message/second), moderate (1 message/second or greater but less than 100 messages/second) and high (100 messages/second or greater). The number of clients are classified as small (5 or fewer), moderate (more than 5 but less than or equal to 20), and large (more than 20).

### High-throughput queue

Goal: Maximize the throughput of a single queue. The number of senders and receivers is small.

* To increase the overall send rate into the queue, use multiple message factories to create senders. For each sender, use asynchronous operations or multiple threads.
* To increase the overall receive rate from the queue, use multiple message factories to create receivers.
* Use asynchronous operations to take advantage of client-side batching.
* Leave batched store access enabled. This access increases the overall rate at which messages can be written into the queue.
* Set the prefetch count to 20 times the maximum processing rates of all receivers of a factory. This count reduces the number of Service Bus client protocol transmissions.

### Multiple high-throughput queues

Goal: Maximize overall throughput of multiple queues. The throughput of an individual queue is moderate or high.

To obtain maximum throughput across multiple queues, use the settings outlined to maximize the throughput of a single queue. Also, use different factories to create clients that send or receive from different queues.

### Low latency queue

Goal: Minimize latency of a queue or topic. The number of senders and receivers is small. The throughput of the queue is small or moderate.

* Disable client-side batching. The client immediately sends a message.
* Disable batched store access. The service immediately writes the message to the store.
* If using a single client, set the prefetch count to 20 times the processing rate of the receiver. If multiple messages arrive at the queue at the same time, the Service Bus client protocol transmits them all at the same time. When the client receives the next message, that message is already in the local cache. The cache should be small.
* If using multiple clients, set the prefetch count to 0. By setting the count, the second client can receive the second message while the first client is still processing the first message.

### Queue with a large number of senders

Goal: Maximize throughput of a queue or topic with a large number of senders. Each sender sends messages with a moderate rate. The number of receivers is small.

Service Bus enables up to 1000 concurrent connections to a messaging entity. This limit is enforced at the namespace level, and queues, topics, or subscriptions are capped by the limit of concurrent connections per namespace. For queues, this number is shared between senders and receivers. If all 1000 connections are required for senders, replace the queue with a topic and a single subscription. A topic accepts up to 1000 concurrent connections from senders. The subscription accepts an additional 1000 concurrent connections from receivers. If more than 1000 concurrent senders are required, the senders should send messages to the Service Bus protocol via HTTP.

To maximize throughput, follow these steps:

* If each sender is in a different process, use only a single factory per process.
* Use asynchronous operations to take advantage of client-side batching.
* Leave batched store access enabled. This access increases the overall rate at which messages can be written into the queue or topic.
* Set the prefetch count to 20 times the maximum processing rates of all receivers of a factory. This count reduces the number of Service Bus client protocol transmissions.

### Queue with a large number of receivers

Goal: Maximize the receive rate of a queue or subscription with a large number of receivers. Each receiver receives messages at a moderate rate. The number of senders is small.

Service Bus enables up to 1000 concurrent connections to an entity. If a queue requires more than 1000 receivers, replace the queue with a topic and multiple subscriptions. Each subscription can support up to 1000 concurrent connections. Alternatively, receivers can access the queue via the HTTP protocol.

To maximize throughput, follow these guidelines:

* If each receiver is in a different process, use only a single factory per process.
* Receivers can use synchronous or asynchronous operations. Given the moderate receive rate of an individual receiver, client-side batching of a Complete request doesn't affect receiver throughput.
* Leave batched store access enabled. This access reduces the overall load of the entity. It also increases the overall rate at which messages can be written into the queue or topic.
* Set the prefetch count to a small value (for example, PrefetchCount = 10). This count prevents receivers from being idle while other receivers have large numbers of messages cached.

### Topic with a few subscriptions

Goal: Maximize the throughput of a topic with a few subscriptions. A message is received by many subscriptions, which means the combined receive rate over all subscriptions is larger than the send rate. The number of senders is small. The number of receivers per subscription is small.

To maximize throughput, follow these guidelines:

* To increase the overall send rate into the topic, use multiple message factories to create senders. For each sender, use asynchronous operations or multiple threads.
* To increase the overall receive rate from a subscription, use multiple message factories to create receivers. For each receiver, use asynchronous operations or multiple threads.
* Use asynchronous operations to take advantage of client-side batching.
* Leave batched store access enabled. This access increases the overall rate at which messages can be written into the topic.
* Set the prefetch count to 20 times the maximum processing rates of all receivers of a factory. This count reduces the number of Service Bus client protocol transmissions.

### Topic with a large number of subscriptions

Goal: Maximize the throughput of a topic with a large number of subscriptions. A message is received by many subscriptions, which means the combined receive rate over all subscriptions is much larger than the send rate. The number of senders is small. The number of receivers per subscription is small.

Topics with a large number of subscriptions typically expose a low overall throughput if all messages are routed to all subscriptions. It's because each message is received many times, and all messages in a topic and all its subscriptions are stored in the same store. The assumption here's that the number of senders and number of receivers per subscription is small. Service Bus supports up to 2,000 subscriptions per topic.

To maximize throughput, try the following steps:

* Use asynchronous operations to take advantage of client-side batching.
* Leave batched store access enabled. This access increases the overall rate at which messages can be written into the topic.
* Set the prefetch count to 20 times the expected receive rate in seconds. This count reduces the number of Service Bus client protocol transmissions.
