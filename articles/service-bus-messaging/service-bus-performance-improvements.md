---
title: Best practices for improving performance using Azure Service Bus | Microsoft Docs
description: Describes how to use Service Bus to optimize performance when exchanging brokered messages.
services: service-bus-messaging
documentationcenter: na
author: spelluru
manager: timlt

ms.service: service-bus-messaging
ms.topic: article
ms.date: 09/14/2018
ms.author: spelluru

---
# Best Practices for performance improvements using Service Bus Messaging

This article describes how to use Azure Service Bus to optimize performance when exchanging brokered messages. The first part of this article describes the different mechanisms that are offered to help increase performance. The second part provides guidance on how to use Service Bus in a way that can offer the best performance in a given scenario.

Throughout this article, the term "client" refers to any entity that accesses Service Bus. A client can take the role of a sender or a receiver. The term "sender" is used for a Service Bus queue or topic client that sends messages to a Service Bus queue or topic subscription. The term "receiver" refers to a Service Bus queue or subscription client that receives messages from a Service Bus queue or subscription.

These sections introduce several concepts that Service Bus uses to help boost performance.

## Protocols

Service Bus enables clients to send and receive messages via one of three protocols:

1. Advanced Message Queuing Protocol (AMQP)
2. Service Bus Messaging Protocol (SBMP)
3. HTTP

AMQP and SBMP are more efficient, because they maintain the connection to Service Bus as long as the messaging factory exists. It also implements batching and prefetching. Unless explicitly mentioned, all content in this article assumes the use of AMQP or SBMP.

## Reusing factories and clients

Service Bus client objects, such as [QueueClient][QueueClient] or [MessageSender][MessageSender], are created through a [MessagingFactory][MessagingFactory] object, which also provides internal management of connections. It is recommended that you do not close messaging factories or queue, topic, and subscription clients after you send a message, and then re-create them when you send the next message. Closing a messaging factory deletes the connection to the Service Bus service, and a new connection is established when recreating the factory. Establishing a connection is an expensive operation that you can avoid by reusing the same factory and client objects for multiple operations. You can safely use the [QueueClient][QueueClient] object for sending messages from concurrent asynchronous operations and multiple threads. 

## Concurrent operations

Performing an operation (send, receive, delete, etc.) takes some time. This time includes the processing of the operation by the Service Bus service in addition to the latency of the request and the reply. To increase the number of operations per time, operations must execute concurrently. 

The client schedules concurrent operations by performing asynchronous operations. The next request is started before the previous request is completed. The following code snippet is an example of an asynchronous send operation:
  
 ```csharp
  Message m1 = new BrokeredMessage(body);
  Message m2 = new BrokeredMessage(body);
  
  Task send1 = queueClient.SendAsync(m1).ContinueWith((t) => 
    {
      Console.WriteLine("Sent message #1");
    });
  Task send2 = queueClient.SendAsync(m2).ContinueWith((t) => 
    {
      Console.WriteLine("Sent message #2");
    });
  Task.WaitAll(send1, send2);
  Console.WriteLine("All messages sent");
  ```
  
  The following code is an example of an asynchronous receive operation. See the full program [here](https://github.com/Azure/azure-service-bus/blob/master/samples/DotNet/Microsoft.Azure.ServiceBus/SendersReceiversWithQueues):
  
  ```csharp
  var receiver = new MessageReceiver(connectionString, queueName, ReceiveMode.PeekLock);
  var doneReceiving = new TaskCompletionSource<bool>();

  receiver.RegisterMessageHandler(...);
  ```

## Receive mode

When creating a queue or subscription client, you can specify a receive mode: *Peek-lock* or *Receive and Delete*. The default receive mode is [PeekLock][PeekLock]. When operating in this mode, the client sends a request to receive a message from Service Bus. After the client has received the message, it sends a request to complete the message.

When setting the receive mode to [ReceiveAndDelete][ReceiveAndDelete], both steps are combined in a single request. These steps reduce the overall number of operations, and can improve the overall message throughput. This performance gain comes at the risk of losing messages.

Service Bus does not support transactions for receive-and-delete operations. In addition, peek-lock semantics are required for any scenarios in which the client wants to defer or [dead-letter](service-bus-dead-letter-queues.md) a message.

## Client-side batching

Client-side batching enables a queue or topic client to delay the sending of a message for a certain period of time. If the client sends additional messages during this time period, it transmits the messages in a single batch. Client-side batching also causes a queue or subscription client to batch multiple **Complete** requests into a single request. Batching is only available for asynchronous **Send** and **Complete** operations. Synchronous operations are immediately sent to the Service Bus service. Batching does not occur for peek or receive operations, nor does batching occur across clients.

By default, a client uses a batch interval of 20 ms. You can change the batch interval by setting the [BatchFlushInterval][BatchFlushInterval] property before creating the messaging factory. This setting affects all clients that are created by this factory.

To disable batching, set the [BatchFlushInterval][BatchFlushInterval] property to **TimeSpan.Zero**. For example:

```csharp
MessagingFactorySettings mfs = new MessagingFactorySettings();
mfs.TokenProvider = tokenProvider;
mfs.NetMessagingTransportSettings.BatchFlushInterval = TimeSpan.FromSeconds(0.05);
MessagingFactory messagingFactory = MessagingFactory.Create(namespaceUri, mfs);
```

Batching does not affect the number of billable messaging operations, and is available only for the Service Bus client protocol using the [Microsoft.ServiceBus.Messaging](https://www.nuget.org/packages/WindowsAzure.ServiceBus/) library. The HTTP protocol does not support batching.

## Batching store access

To increase the throughput of a queue, topic, or subscription, Service Bus batches multiple messages when it writes to its internal store. If enabled on a queue or topic, writing messages into the store will be batched. If enabled on a queue or subscription, deleting messages from the store will be batched. If batched store access is enabled for an entity, Service Bus delays a store write operation regarding that entity by up to 20 ms. 

> [!NOTE]
> There is no risk of losing messages with batching, even if there is a Service Bus failure at the end of a 20ms batching interval. 

Additional store operations that occur during this interval are added to the batch. Batched store access only affects **Send** and **Complete** operations; receive operations are not affected. Batched store access is a property on an entity. Batching occurs across all entities that enable batched store access.

When creating a new queue, topic or subscription, batched store access is enabled by default. To disable batched store access, set the [EnableBatchedOperations][EnableBatchedOperations] property to **false** before creating the entity. For example:

```csharp
QueueDescription qd = new QueueDescription();
qd.EnableBatchedOperations = false;
Queue q = namespaceManager.CreateQueue(qd);
```

Batched store access does not affect the number of billable messaging operations, and is a property of a queue, topic, or subscription. It is independent of the receive mode and the protocol that is used between a client and the Service Bus service.

## Prefetching

[Prefetching](service-bus-prefetch.md) enables the queue or subscription client to load additional messages from the service when it performs a receive operation. The client stores these messages in a local cache. The size of the cache is determined by the [QueueClient.PrefetchCount][QueueClient.PrefetchCount] or [SubscriptionClient.PrefetchCount][SubscriptionClient.PrefetchCount] properties. Each client that enables prefetching maintains its own cache. A cache is not shared across clients. If the client initiates a receive operation and its cache is empty, the service transmits a batch of messages. The size of the batch equals the size of the cache or 256 KB, whichever is smaller. If the client initiates a receive operation and the cache contains a message, the message is taken from the cache.

When a message is prefetched, the service locks the prefetched message. With the lock, the prefetched message cannot be received by a different receiver. If the receiver cannot complete the message before the lock expires, the message becomes available to other receivers. The prefetched copy of the message remains in the cache. The receiver that consumes the expired cached copy will receive an exception when it tries to complete that message. By default, the message lock expires after 60 seconds. This value can be extended to 5 minutes. To prevent the consumption of expired messages, the cache size should always be smaller than the number of messages that can be consumed by a client within the lock time-out interval.

When using the default lock expiration of 60 seconds, a good value for [PrefetchCount][SubscriptionClient.PrefetchCount] is 20 times the maximum processing rates of all receivers of the factory. For example, a factory creates three receivers, and each receiver can process up to 10 messages per second. The prefetch count should not exceed 20 X 3 X 10 = 600. By default, [PrefetchCount][QueueClient.PrefetchCount] is set to 0, which means that no additional messages are fetched from the service.

Prefetching messages increases the overall throughput for a queue or subscription because it reduces the overall number of message operations, or round trips. Fetching the first message, however, will take longer (due to the increased message size). Receiving prefetched messages will be faster because these messages have already been downloaded by the client.

The time-to-live (TTL) property of a message is checked by the server at the time the server sends the message to the client. The client does not check the message’s TTL property when the message is received. Instead, the message can be received even if the message’s TTL has passed while the message was cached by the client.

Prefetching does not affect the number of billable messaging operations, and is available only for the Service Bus client protocol. The HTTP protocol does not support prefetching. Prefetching is available for both synchronous and asynchronous receive operations.

## Express queues and topics

Express entities enable high throughput and reduced latency scenarios, and are supported only in the Standard messaging tier. Entities created in [Premium namespaces](service-bus-premium-messaging.md) do not support the express option. With express entities, if a message is sent to a queue or topic, the message is not immediately stored in the messaging store. Instead, it is cached in memory. If a message remains in the queue for more than a few seconds, it is automatically written to stable storage, thus protecting it against loss due to an outage. Writing the message into a memory cache increases throughput and reduces latency because there is no access to stable storage at the time the message is sent. Messages that are consumed within a few seconds are not written to the messaging store. The following example creates an express topic.

```csharp
TopicDescription td = new TopicDescription(TopicName);
td.EnableExpress = true;
namespaceManager.CreateTopic(td);
```

If a message containing critical information that must not be lost is sent to an express entity, the sender can force Service Bus to immediately persist the message to stable storage by setting the [ForcePersistence][ForcePersistence] property to **true**.

> [!NOTE]
> Express entities do not support transactions.

## Partitioned queues or topics

Internally, Service Bus uses the same node and messaging store to process and store all messages for a messaging entity (queue or topic). A [partitioned queue or topic](service-bus-partitioning.md), on the other hand, is distributed across multiple nodes and messaging stores. Partitioned queues and topics not only yield a higher throughput than regular queues and topics, they also exhibit superior availability. To create a partitioned entity, set the [EnablePartitioning][EnablePartitioning] property to **true**, as shown in the following example. For more information about partitioned entities, see [Partitioned messaging entities][Partitioned messaging entities].

> [!NOTE]
> Partitioned entities are not supported in the [Premium SKU](service-bus-premium-messaging.md). 

```csharp
// Create partitioned queue.
QueueDescription qd = new QueueDescription(QueueName);
qd.EnablePartitioning = true;
namespaceManager.CreateQueue(qd);
```

## Multiple queues

If it is not possible to use a partitioned queue or topic, or the expected load cannot be handled by a single partitioned queue or topic, you must use multiple messaging entities. When using multiple entities, create a dedicated client for each entity, instead of using the same client for all entities.

## Development and testing features

Service Bus has one feature, used specifically for development, which **should never be used in production configurations**: [TopicDescription.EnableFilteringMessagesBeforePublishing][].

When new rules or filters are added to the topic, you can use [TopicDescription.EnableFilteringMessagesBeforePublishing][] to verify that the new filter expression is working as expected.

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
* Use a partitioned queue for improved performance and availability.

### Multiple high-throughput queues

Goal: Maximize overall throughput of multiple queues. The throughput of an individual queue is moderate or high.

To obtain maximum throughput across multiple queues, use the settings outlined to maximize the throughput of a single queue. In addition, use different factories to create clients that send or receive from different queues.

### Low latency queue

Goal: Minimize end-to-end latency of a queue or topic. The number of senders and receivers is small. The throughput of the queue is small or moderate.

* Disable client-side batching. The client immediately sends a message.
* Disable batched store access. The service immediately writes the message to the store.
* If using a single client, set the prefetch count to 20 times the processing rate of the receiver. If multiple messages arrive at the queue at the same time, the Service Bus client protocol transmits them all at the same time. When the client receives the next message, that message is already in the local cache. The cache should be small.
* If using multiple clients, set the prefetch count to 0. By setting the count, the second client can receive the second message while the first client is still processing the first message.
* Use a partitioned queue for improved performance and availability.

### Queue with a large number of senders

Goal: Maximize throughput of a queue or topic with a large number of senders. Each sender sends messages with a moderate rate. The number of receivers is small.

Service Bus enables up to 1000 concurrent connections to a messaging entity (or 5000 using AMQP). This limit is enforced at the namespace level, and queues/topics/subscriptions are capped by the limit of concurrent connections per namespace. For queues, this number is shared between senders and receivers. If all 1000 connections are required for senders, replace the queue with a topic and a single subscription. A topic accepts up to 1000 concurrent connections from senders, whereas the subscription accepts an additional 1000 concurrent connections from receivers. If more than 1000 concurrent senders are required, the senders should send messages to the Service Bus protocol via HTTP.

To maximize throughput, perform the following steps:

* If each sender resides in a different process, use only a single factory per process.
* Use asynchronous operations to take advantage of client-side batching.
* Use the default batching interval of 20 ms to reduce the number of Service Bus client protocol transmissions.
* Leave batched store access enabled. This access increases the overall rate at which messages can be written into the queue or topic.
* Set the prefetch count to 20 times the maximum processing rates of all receivers of a factory. This count reduces the number of Service Bus client protocol transmissions.
* Use a partitioned queue for improved performance and availability.

### Queue with a large number of receivers

Goal: Maximize the receive rate of a queue or subscription with a large number of receivers. Each receiver receives messages at a moderate rate. The number of senders is small.

Service Bus enables up to 1000 concurrent connections to an entity. If a queue requires more than 1000 receivers, replace the queue with a topic and multiple subscriptions. Each subscription can support up to 1000 concurrent connections. Alternatively, receivers can access the queue via the HTTP protocol.

To maximize throughput, do the following:

* If each receiver resides in a different process, use only a single factory per process.
* Receivers can use synchronous or asynchronous operations. Given the moderate receive rate of an individual receiver, client-side batching of a Complete request does not affect receiver throughput.
* Leave batched store access enabled. This access reduces the overall load of the entity. It also reduces the overall rate at which messages can be written into the queue or topic.
* Set the prefetch count to a small value (for example, PrefetchCount = 10). This count prevents receivers from being idle while other receivers have large numbers of messages cached.
* Use a partitioned queue for improved performance and availability.

### Topic with a small number of subscriptions

Goal: Maximize the throughput of a topic with a small number of subscriptions. A message is received by many subscriptions, which means the combined receive rate over all subscriptions is larger than the send rate. The number of senders is small. The number of receivers per subscription is small.

To maximize throughput, do the following:

* To increase the overall send rate into the topic, use multiple message factories to create senders. For each sender, use asynchronous operations or multiple threads.
* To increase the overall receive rate from a subscription, use multiple message factories to create receivers. For each receiver, use asynchronous operations or multiple threads.
* Use asynchronous operations to take advantage of client-side batching.
* Use the default batching interval of 20 ms to reduce the number of Service Bus client protocol transmissions.
* Leave batched store access enabled. This access increases the overall rate at which messages can be written into the topic.
* Set the prefetch count to 20 times the maximum processing rates of all receivers of a factory. This count reduces the number of Service Bus client protocol transmissions.
* Use a partitioned topic for improved performance and availability.

### Topic with a large number of subscriptions

Goal: Maximize the throughput of a topic with a large number of subscriptions. A message is received by many subscriptions, which means the combined receive rate over all subscriptions is much larger than the send rate. The number of senders is small. The number of receivers per subscription is small.

Topics with a large number of subscriptions typically expose a low overall throughput if all messages are routed to all subscriptions. This low throughput is caused by the fact that each message is received many times, and all messages that are contained in a topic and all its subscriptions are stored in the same store. It is assumed that the number of senders and number of receivers per subscription is small. Service Bus supports up to 2,000 subscriptions per topic.

To maximize throughput, try the following steps:

* Use asynchronous operations to take advantage of client-side batching.
* Use the default batching interval of 20 ms to reduce the number of Service Bus client protocol transmissions.
* Leave batched store access enabled. This access increases the overall rate at which messages can be written into the topic.
* Set the prefetch count to 20 times the expected receive rate in seconds. This count reduces the number of Service Bus client protocol transmissions.
* Use a partitioned topic for improved performance and availability.

## Next steps

To learn more about optimizing Service Bus performance, see [Partitioned messaging entities][Partitioned messaging entities].

[QueueClient]: /dotnet/api/microsoft.azure.servicebus.queueclient
[MessageSender]: /dotnet/api/microsoft.azure.servicebus.core.messagesender
[MessagingFactory]: /dotnet/api/microsoft.servicebus.messaging.messagingfactory
[PeekLock]: /dotnet/api/microsoft.azure.servicebus.receivemode
[ReceiveAndDelete]: /dotnet/api/microsoft.azure.servicebus.receivemode
[BatchFlushInterval]: /dotnet/api/microsoft.servicebus.messaging.messagesender.batchflushinterval
[EnableBatchedOperations]: /dotnet/api/microsoft.servicebus.messaging.queuedescription.enablebatchedoperations
[QueueClient.PrefetchCount]: /dotnet/api/microsoft.azure.servicebus.queueclient.prefetchcount
[SubscriptionClient.PrefetchCount]: /dotnet/api/microsoft.azure.servicebus.subscriptionclient.prefetchcount
[ForcePersistence]: /dotnet/api/microsoft.servicebus.messaging.brokeredmessage.forcepersistence
[EnablePartitioning]: /dotnet/api/microsoft.servicebus.messaging.queuedescription.enablepartitioning
[Partitioned messaging entities]: service-bus-partitioning.md
[TopicDescription.EnableFilteringMessagesBeforePublishing]: /dotnet/api/microsoft.servicebus.messaging.topicdescription.enablefilteringmessagesbeforepublishing
