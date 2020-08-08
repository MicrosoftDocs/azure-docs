---
title: Best practices for improving performance using Azure Service Bus
description: Describes how to use Service Bus to optimize performance when exchanging brokered messages.
ms.topic: article
ms.date: 06/23/2020
---

# Best Practices for performance improvements using Service Bus Messaging

This article describes how to use Azure Service Bus to optimize performance when exchanging brokered messages. The first part of this article describes the different mechanisms that are offered to help increase performance. The second part provides guidance on how to use Service Bus in a way that can offer the best performance in a given scenario.

Throughout this article, the term "client" refers to any entity that accesses Service Bus. A client can take the role of a sender or a receiver. The term "sender" is used for a Service Bus queue or topic client that sends messages to a Service Bus queue or topic subscription. The term "receiver" refers to a Service Bus queue or subscription client that receives messages from a Service Bus queue or subscription.

These sections introduce several concepts that Service Bus uses to help boost performance.

## Protocols

Service Bus enables clients to send and receive messages via one of three protocols:

1. Advanced Message Queuing Protocol (AMQP)
2. Service Bus Messaging Protocol (SBMP)
3. Hypertext Transfer Protocol (HTTP)

AMQP is the most efficient, because it maintains the connection to Service Bus. It also implements batching and prefetching. Unless explicitly mentioned, all content in this article assumes the use of AMQP or SBMP.

> [!IMPORTANT]
> The SBMP is only available for .NET Framework. AMQP is the default for .NET Standard.

## Choosing the appropriate Service Bus .NET SDK

There are two supported Azure Service Bus .NET SDKs. Their APIs are very similar, and it can be confusing which one to choose. Refer to the following table to help guide your decision. We suggest the Microsoft.Azure.ServiceBus SDK as it is more modern, performant, and is cross-platform compatible. Additionally, it supports AMQP over WebSockets and is part of the Azure .NET SDK collection of open-source projects.

| NuGet Package | Primary Namespace(s) | Minimum Platform(s) | Protocol(s) |
|---------------|----------------------|---------------------|-------------|
| <a href="https://www.nuget.org/packages/Microsoft.Azure.ServiceBus" target="_blank">Microsoft.Azure.ServiceBus <span class="docon docon-navigate-external x-hidden-focus"></span></a> | `Microsoft.Azure.ServiceBus`<br>`Microsoft.Azure.ServiceBus.Management` | .NET Core 2.0<br>.NET Framework 4.6.1<br>Mono 5.4<br>Xamarin.iOS 10.14<br>Xamarin.Mac 3.8<br>Xamarin.Android 8.0<br>Universal Windows Platform 10.0.16299 | AMQP<br>HTTP |
| <a href="https://www.nuget.org/packages/WindowsAzure.ServiceBus" target="_blank">WindowsAzure.ServiceBus <span class="docon docon-navigate-external x-hidden-focus"></span></a> | `Microsoft.ServiceBus`<br>`Microsoft.ServiceBus.Messaging` | .NET Framework 4.6.1 | AMQP<br>SBMP<br>HTTP |

For more information on minimum .NET Standard platform support, see [.NET implementation support](https://docs.microsoft.com/dotnet/standard/net-standard#net-implementation-support).

## Reusing factories and clients

# [Microsoft.Azure.ServiceBus SDK](#tab/net-standard-sdk)

Service Bus client objects, such as implementations of [`IQueueClient`][QueueClient] or [`IMessageSender`][MessageSender], should be registered for dependency injection as singletons (or instantiated once and shared). It is recommended that you do not close messaging factories or queue, topic, and subscription clients after you send a message, and then re-create them when you send the next message. Closing a messaging factory deletes the connection to the Service Bus service, and a new connection is established when recreating the factory. Establishing a connection is an expensive operation that you can avoid by reusing the same factory and client objects for multiple operations. You can safely use these client objects for concurrent asynchronous operations and from multiple threads.

# [WindowsAzure.ServiceBus SDK](#tab/net-framework-sdk)

Service Bus client objects, such as `QueueClient` or `MessageSender`, are created through a [MessagingFactory][MessagingFactory] object, which also provides internal management of connections. It is recommended that you do not close messaging factories or queue, topic, and subscription clients after you send a message, and then re-create them when you send the next message. Closing a messaging factory deletes the connection to the Service Bus service, and a new connection is established when recreating the factory. Establishing a connection is an expensive operation that you can avoid by reusing the same factory and client objects for multiple operations. You can safely use these client objects for concurrent asynchronous operations and from multiple threads.

---

## Concurrent operations

Performing an operation (send, receive, delete, etc.) takes some time. This time includes the processing of the operation by the Service Bus service in addition to the latency of the request and the response. To increase the number of operations per time, operations must execute concurrently.

The client schedules concurrent operations by performing asynchronous operations. The next request is started before the previous request is completed. The following code snippet is an example of an asynchronous send operation:

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

# [WindowsAzure.ServiceBus SDK](#tab/net-framework-sdk)

```csharp
var messageOne = new BrokeredMessage(body);
var messageTwo = new BrokeredMessage(body);

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

# [Microsoft.Azure.ServiceBus SDK](#tab/net-standard-sdk)

See the GitHub repository for full <a href="https://github.com/Azure/azure-service-bus/blob/master/samples/DotNet/Microsoft.Azure.ServiceBus/SendersReceiversWithQueues" target="_blank">source code examples <span class="docon docon-navigate-external x-hidden-focus"></span></a>:

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

# [WindowsAzure.ServiceBus SDK](#tab/net-framework-sdk)

See the GitHub repository for full <a href="https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.ServiceBus.Messaging/SendersReceiversWithQueues" target="_blank">source code examples <span class="docon docon-navigate-external x-hidden-focus"></span></a>:

```csharp
var factory = MessagingFactory.CreateFromConnectionString(connectionString);
var receiver = await factory.CreateMessageReceiverAsync(queueName, ReceiveMode.PeekLock);

// Register the handler to receive messages asynchronously
receiver.OnMessageAsync(
    async message =>
    {
        Console.WriteLine("Handle message");
        await message.CompleteAsync();
    },
    new OnMessageOptions
    {
        AutoComplete = false,
        MaxConcurrentCalls = 20
    });
```

The `MessagingFactory` creates a `factory` object from the connection string. With the `factory` instance, a `MessageReceiver` is instantiated. Next, the `receiver` instance is used to register the on-message handler.

---

## Receive mode

When creating a queue or subscription client, you can specify a receive mode: *Peek-lock* or *Receive and Delete*. The default receive mode is `PeekLock`. When operating in the default mode, the client sends a request to receive a message from Service Bus. After the client has received the message, it sends a request to complete the message.

When setting the receive mode to `ReceiveAndDelete`, both steps are combined in a single request. These steps reduce the overall number of operations, and can improve the overall message throughput. This performance gain comes at the risk of losing messages.

Service Bus does not support transactions for receive-and-delete operations. In addition, peek-lock semantics are required for any scenarios in which the client wants to defer or [dead-letter](service-bus-dead-letter-queues.md) a message.

## Client-side batching

Client-side batching enables a queue or topic client to delay the sending of a message for a certain period of time. If the client sends additional messages during this time period, it transmits the messages in a single batch. Client-side batching also causes a queue or subscription client to batch multiple **Complete** requests into a single request. Batching is only available for asynchronous **Send** and **Complete** operations. Synchronous operations are immediately sent to the Service Bus service. Batching does not occur for peek or receive operations, nor does batching occur across clients.

# [Microsoft.Azure.ServiceBus SDK](#tab/net-standard-sdk)

Batching functionality for the .NET Standard SDK, does not yet expose a property to manipulate.

# [WindowsAzure.ServiceBus SDK](#tab/net-framework-sdk)

By default, a client uses a batch interval of 20 ms. You can change the batch interval by setting the [BatchFlushInterval][BatchFlushInterval] property before creating the messaging factory. This setting affects all clients that are created by this factory.

To disable batching, set the [BatchFlushInterval][BatchFlushInterval] property to **TimeSpan.Zero**. For example:

```csharp
var settings = new MessagingFactorySettings
{
    NetMessagingTransportSettings =
    {
        BatchFlushInterval = TimeSpan.Zero
    }
};
var factory = MessagingFactory.Create(namespaceUri, settings);
```

Batching does not affect the number of billable messaging operations, and is available only for the Service Bus client protocol using the [Microsoft.ServiceBus.Messaging](https://www.nuget.org/packages/WindowsAzure.ServiceBus/) library. The HTTP protocol does not support batching.

> [!NOTE]
> Setting `BatchFlushInterval` ensures that the batching is implicit from the application's perspective. i.e.; the application makes `SendAsync` and `CompleteAsync` calls and does not make specific Batch calls.
>
> Explicit client side batching can be implemented by utilizing the below method call:
> ```csharp
> Task SendBatchAsync(IEnumerable<BrokeredMessage> messages);
> ```
> Here the combined size of the messages must be less than the maximum size supported by the pricing tier.

---

## Batching store access

To increase the throughput of a queue, topic, or subscription, Service Bus batches multiple messages when it writes to its internal store. If enabled on a queue or topic, writing messages into the store will be batched. If enabled on a queue or subscription, deleting messages from the store will be batched. If batched store access is enabled for an entity, Service Bus delays a store write operation regarding that entity by up to 20 ms.

> [!NOTE]
> There is no risk of losing messages with batching, even if there is a Service Bus failure at the end of a 20ms batching interval.

Additional store operations that occur during this interval are added to the batch. Batched store access only affects **Send** and **Complete** operations; receive operations are not affected. Batched store access is a property on an entity. Batching occurs across all entities that enable batched store access.

When creating a new queue, topic or subscription, batched store access is enabled by default.

# [Microsoft.Azure.ServiceBus SDK](#tab/net-standard-sdk)

To disable batched store access, you'll need an instance of a `ManagementClient`. Create a queue from a queue description that sets the `EnableBatchedOperations` property to `false`.

```csharp
var queueDescription = new QueueDescription(path)
{
    EnableBatchedOperations = false
};
var queue = await managementClient.CreateQueueAsync(queueDescription);
```

For more information, see the following:
* <a href="https://docs.microsoft.com/dotnet/api/microsoft.azure.servicebus.management.queuedescription.enablebatchedoperations?view=azure-dotnet" target="_blank">`Microsoft.Azure.ServiceBus.Management.QueueDescription.EnableBatchedOperations` <span class="docon docon-navigate-external x-hidden-focus"></span></a>.
* <a href="https://docs.microsoft.com/dotnet/api/microsoft.azure.servicebus.management.subscriptiondescription.enablebatchedoperations?view=azure-dotnet" target="_blank">`Microsoft.Azure.ServiceBus.Management.SubscriptionDescription.EnableBatchedOperations` <span class="docon docon-navigate-external x-hidden-focus"></span></a>.
* <a href="https://docs.microsoft.com/dotnet/api/microsoft.azure.servicebus.management.topicdescription.enablebatchedoperations?view=azure-dotnet" target="_blank">`Microsoft.Azure.ServiceBus.Management.TopicDescription.EnableBatchedOperations` <span class="docon docon-navigate-external x-hidden-focus"></span></a>.

# [WindowsAzure.ServiceBus SDK](#tab/net-framework-sdk)

To disable batched store access, you'll need an instance of a `NamespaceManager`. Create a queue from a queue description that sets the `EnableBatchedOperations` property to `false`.

```csharp
var queueDescription = new QueueDescription(path)
{
    EnableBatchedOperations = false
};
var queue = namespaceManager.CreateQueue(queueDescription);
```

For more information, see the following:
* <a href="https://docs.microsoft.com/dotnet/api/microsoft.servicebus.messaging.queuedescription.enablebatchedoperations?view=azure-dotnet" target="_blank">`Microsoft.ServiceBus.Messaging.QueueDescription.EnableBatchedOperations` <span class="docon docon-navigate-external x-hidden-focus"></span></a>.
* <a href="https://docs.microsoft.com/dotnet/api/microsoft.servicebus.messaging.subscriptiondescription.enablebatchedoperations?view=azure-dotnet" target="_blank">`Microsoft.ServiceBus.Messaging.SubscriptionDescription.EnableBatchedOperations` <span class="docon docon-navigate-external x-hidden-focus"></span></a>.
* <a href="https://docs.microsoft.com/dotnet/api/microsoft.servicebus.messaging.topicdescription.enablebatchedoperations?view=azure-dotnet" target="_blank">`Microsoft.ServiceBus.Messaging.TopicDescription.EnableBatchedOperations` <span class="docon docon-navigate-external x-hidden-focus"></span></a>.

---

Batched store access does not affect the number of billable messaging operations, and is a property of a queue, topic, or subscription. It is independent of the receive mode and the protocol that is used between a client and the Service Bus service.

## Prefetching

[Prefetching](service-bus-prefetch.md) enables the queue or subscription client to load additional messages from the service when it performs a receive operation. The client stores these messages in a local cache. The size of the cache is determined by the `QueueClient.PrefetchCount` or `SubscriptionClient.PrefetchCount` properties. Each client that enables prefetching maintains its own cache. A cache is not shared across clients. If the client initiates a receive operation and its cache is empty, the service transmits a batch of messages. The size of the batch equals the size of the cache or 256 KB, whichever is smaller. If the client initiates a receive operation and the cache contains a message, the message is taken from the cache.

When a message is prefetched, the service locks the prefetched message. With the lock, the prefetched message cannot be received by a different receiver. If the receiver cannot complete the message before the lock expires, the message becomes available to other receivers. The prefetched copy of the message remains in the cache. The receiver that consumes the expired cached copy will receive an exception when it tries to complete that message. By default, the message lock expires after 60 seconds. This value can be extended to 5 minutes. To prevent the consumption of expired messages, the cache size should always be smaller than the number of messages that can be consumed by a client within the lock time-out interval.

When using the default lock expiration of 60 seconds, a good value for `PrefetchCount` is 20 times the maximum processing rates of all receivers of the factory. For example, a factory creates three receivers, and each receiver can process up to 10 messages per second. The prefetch count should not exceed 20 X 3 X 10 = 600. By default, `PrefetchCount` is set to 0, which means that no additional messages are fetched from the service.

Prefetching messages increases the overall throughput for a queue or subscription because it reduces the overall number of message operations, or round trips. Fetching the first message, however, will take longer (due to the increased message size). Receiving prefetched messages will be faster because these messages have already been downloaded by the client.

The time-to-live (TTL) property of a message is checked by the server at the time the server sends the message to the client. The client does not check the message's TTL property when the message is received. Instead, the message can be received even if the message's TTL has passed while the message was cached by the client.

Prefetching does not affect the number of billable messaging operations, and is available only for the Service Bus client protocol. The HTTP protocol does not support prefetching. Prefetching is available for both synchronous and asynchronous receive operations.

# [Microsoft.Azure.ServiceBus SDK](#tab/net-standard-sdk)

For more information, see the following `PrefetchCount` properties:

* <a href="https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.servicebus.queueclient.prefetchcount?view=azure-dotnet" target="_blank">`Microsoft.Azure.ServiceBus.QueueClient.PrefetchCount` <span class="docon docon-navigate-external x-hidden-focus"></span></a>.
* <a href="https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.servicebus.subscriptionclient.prefetchcount?view=azure-dotnet" target="_blank">`Microsoft.Azure.ServiceBus.SubscriptionClient.PrefetchCount` <span class="docon docon-navigate-external x-hidden-focus"></span></a>.

# [WindowsAzure.ServiceBus SDK](#tab/net-framework-sdk)

For more information, see the following `PrefetchCount` properties:

* <a href="https://docs.microsoft.com/en-us/dotnet/api/microsoft.servicebus.messaging.queueclient.prefetchcount?view=azure-dotnet" target="_blank">`Microsoft.ServiceBus.Messaging.QueueClient.PrefetchCount` <span class="docon docon-navigate-external x-hidden-focus"></span></a>.
* <a href="https://docs.microsoft.com/en-us/dotnet/api/microsoft.servicebus.messaging.subscriptionclient.prefetchcount?view=azure-dotnet" target="_blank">`Microsoft.ServiceBus.Messaging.SubscriptionClient.PrefetchCount` <span class="docon docon-navigate-external x-hidden-focus"></span></a>.

---

## Prefetching and ReceiveBatch

> [!NOTE]
> This section only applies to the WindowsAzure.ServiceBus SDK, as the Microsoft.Azure.ServiceBus SDK does not expose batch functions.

While the concepts of prefetching multiple messages together have similar semantics to processing messages in a batch (`ReceiveBatch`), there are some minor differences that must be kept in mind when leveraging these together.

Prefetch is a configuration (or mode) on the client (`QueueClient` and `SubscriptionClient`) and `ReceiveBatch` is an operation (that has request-response semantics).

While using these together, consider the following cases -

* Prefetch should be greater than or equal to the number of messages you are expecting to receive from `ReceiveBatch`.
* Prefetch can be up to n/3 times the number of messages processed per second, where n is the default lock duration.

There are some challenges with having a greedy approach(i.e. keeping the prefetch count very high), because it implies that the message is locked to a particular receiver. The recommendation is to try out prefetch values between the thresholds mentioned above and empirically identify what fits.

## Multiple queues

If the expected load cannot be handled by a single queue or topic, you must use multiple messaging entities. When using multiple entities, create a dedicated client for each entity, instead of using the same client for all entities.

## Development and testing features

> [!NOTE]
> This section only applies to the WindowsAzure.ServiceBus SDK, as the Microsoft.Azure.ServiceBus SDK does not expose this functionality.

Service Bus has one feature, used specifically for development, which **should never be used in production configurations**: [`TopicDescription.EnableFilteringMessagesBeforePublishing`][TopicDescription.EnableFiltering].

When new rules or filters are added to the topic, you can use [`TopicDescription.EnableFilteringMessagesBeforePublishing`][TopicDescription.EnableFiltering] to verify that the new filter expression is working as expected.

## Scenarios

The following sections describe typical messaging scenarios and outline the preferred Service Bus settings. Throughput rates are classified as small (less than 1 message/second), moderate (1 message/second or greater but less than 100 messages/second) and high (100 messages/second or greater). The number of clients are classified as small (5 or fewer), moderate (more than 5 but less than or equal to 20), and large (more than 20).

### High-throughput queue

Goal: Maximize the throughput of a single queue. The number of senders and receivers is small.

* To increase the overall send rate into the queue, use multiple message factories to create senders. For each sender, use asynchronous operations or multiple threads.
* To increase the overall receive rate from the queue, use multiple message factories to create receivers.
* Use asynchronous operations to take advantage of client-side batching.
* Set the batching interval to 50 ms to reduce the number of Service Bus client protocol transmissions. If multiple senders are used, increase the batching interval to 100 ms.
* Leave batched store access enabled. This access increases the overall rate at which messages can be written into the queue.
* Set the prefetch count to 20 times the maximum processing rates of all receivers of a factory. This count reduces the number of Service Bus client protocol transmissions.

### Multiple high-throughput queues

Goal: Maximize overall throughput of multiple queues. The throughput of an individual queue is moderate or high.

To obtain maximum throughput across multiple queues, use the settings outlined to maximize the throughput of a single queue. In addition, use different factories to create clients that send or receive from different queues.

### Low latency queue

Goal: Minimize end-to-end latency of a queue or topic. The number of senders and receivers is small. The throughput of the queue is small or moderate.

* Disable client-side batching. The client immediately sends a message.
* Disable batched store access. The service immediately writes the message to the store.
* If using a single client, set the prefetch count to 20 times the processing rate of the receiver. If multiple messages arrive at the queue at the same time, the Service Bus client protocol transmits them all at the same time. When the client receives the next message, that message is already in the local cache. The cache should be small.
* If using multiple clients, set the prefetch count to 0. By setting the count, the second client can receive the second message while the first client is still processing the first message.

### Queue with a large number of senders

Goal: Maximize throughput of a queue or topic with a large number of senders. Each sender sends messages with a moderate rate. The number of receivers is small.

Service Bus enables up to 1000 concurrent connections to a messaging entity. This limit is enforced at the namespace level, and queues/topics/subscriptions are capped by the limit of concurrent connections per namespace. For queues, this number is shared between senders and receivers. If all 1000 connections are required for senders, replace the queue with a topic and a single subscription. A topic accepts up to 1000 concurrent connections from senders, whereas the subscription accepts an additional 1000 concurrent connections from receivers. If more than 1000 concurrent senders are required, the senders should send messages to the Service Bus protocol via HTTP.

To maximize throughput, perform the following steps:

* If each sender resides in a different process, use only a single factory per process.
* Use asynchronous operations to take advantage of client-side batching.
* Use the default batching interval of 20 ms to reduce the number of Service Bus client protocol transmissions.
* Leave batched store access enabled. This access increases the overall rate at which messages can be written into the queue or topic.
* Set the prefetch count to 20 times the maximum processing rates of all receivers of a factory. This count reduces the number of Service Bus client protocol transmissions.

### Queue with a large number of receivers

Goal: Maximize the receive rate of a queue or subscription with a large number of receivers. Each receiver receives messages at a moderate rate. The number of senders is small.

Service Bus enables up to 1000 concurrent connections to an entity. If a queue requires more than 1000 receivers, replace the queue with a topic and multiple subscriptions. Each subscription can support up to 1000 concurrent connections. Alternatively, receivers can access the queue via the HTTP protocol.

To maximize throughput, do the following:

* If each receiver resides in a different process, use only a single factory per process.
* Receivers can use synchronous or asynchronous operations. Given the moderate receive rate of an individual receiver, client-side batching of a Complete request does not affect receiver throughput.
* Leave batched store access enabled. This access reduces the overall load of the entity. It also reduces the overall rate at which messages can be written into the queue or topic.
* Set the prefetch count to a small value (for example, PrefetchCount = 10). This count prevents receivers from being idle while other receivers have large numbers of messages cached.

### Topic with a small number of subscriptions

Goal: Maximize the throughput of a topic with a small number of subscriptions. A message is received by many subscriptions, which means the combined receive rate over all subscriptions is larger than the send rate. The number of senders is small. The number of receivers per subscription is small.

To maximize throughput, do the following:

* To increase the overall send rate into the topic, use multiple message factories to create senders. For each sender, use asynchronous operations or multiple threads.
* To increase the overall receive rate from a subscription, use multiple message factories to create receivers. For each receiver, use asynchronous operations or multiple threads.
* Use asynchronous operations to take advantage of client-side batching.
* Use the default batching interval of 20 ms to reduce the number of Service Bus client protocol transmissions.
* Leave batched store access enabled. This access increases the overall rate at which messages can be written into the topic.
* Set the prefetch count to 20 times the maximum processing rates of all receivers of a factory. This count reduces the number of Service Bus client protocol transmissions.

### Topic with a large number of subscriptions

Goal: Maximize the throughput of a topic with a large number of subscriptions. A message is received by many subscriptions, which means the combined receive rate over all subscriptions is much larger than the send rate. The number of senders is small. The number of receivers per subscription is small.

Topics with a large number of subscriptions typically expose a low overall throughput if all messages are routed to all subscriptions. This low throughput is caused by the fact that each message is received many times, and all messages that are contained in a topic and all its subscriptions are stored in the same store. It is assumed that the number of senders and number of receivers per subscription is small. Service Bus supports up to 2,000 subscriptions per topic.

To maximize throughput, try the following steps:

* Use asynchronous operations to take advantage of client-side batching.
* Use the default batching interval of 20 ms to reduce the number of Service Bus client protocol transmissions.
* Leave batched store access enabled. This access increases the overall rate at which messages can be written into the topic.
* Set the prefetch count to 20 times the expected receive rate in seconds. This count reduces the number of Service Bus client protocol transmissions.

<!-- .NET Standard SDK, Microsoft.Azure.ServiceBus -->
[QueueClient]: /dotnet/api/microsoft.azure.servicebus.queueclient
[MessageSender]: /dotnet/api/microsoft.azure.servicebus.core.messagesender

<!-- .NET Framework SDK, Microsoft.Azure.ServiceBus -->
[MessagingFactory]: /dotnet/api/microsoft.servicebus.messaging.messagingfactory
[BatchFlushInterval]: /dotnet/api/microsoft.servicebus.messaging.messagesender.batchflushinterval
[ForcePersistence]: /dotnet/api/microsoft.servicebus.messaging.brokeredmessage.forcepersistence
[EnablePartitioning]: /dotnet/api/microsoft.servicebus.messaging.queuedescription.enablepartitioning
[TopicDescription.EnableFiltering]: /dotnet/api/microsoft.servicebus.messaging.topicdescription.enablefilteringmessagesbeforepublishing

<!-- Local links -->
[Partitioned messaging entities]: service-bus-partitioning.md