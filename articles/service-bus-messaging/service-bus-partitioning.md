---
title: Create Partitioned Topics and Queues
description: Learn how to create partitioned Azure Service Bus queues and topics to improve message throughput and ensure high availability using multiple brokers.
#customer intent: As a developer, I want to create partitioned queues and topics in Azure Service Bus so that I can improve message throughput and availability.
ms.topic: how-to
ms.date: 02/10/2026
ms.devlang: csharp
# Customer intent: I want to learn how to create partitioned queues and topics in Azure Service Bus. 
---

# Partitioned queues and topics

Azure Service Bus uses multiple message brokers to process messages and multiple messaging stores to store messages. A conventional queue or topic is handled by a single message broker and one messaging store. Service Bus *partitions* enable queues and topics, or *messaging entities*, to be partitioned across multiple message brokers and messaging stores. Partitioning means that the overall throughput of a partitioned entity is no longer limited by the performance of a single message broker or messaging store. In addition, a temporary outage of a messaging store doesn't make a partitioned queue or topic unavailable. Partitioned queues and topics can contain all advanced Service Bus features, such as support for transactions and sessions.

> [!NOTE]
> There are some differences between the Basic / Standard and Premium SKU when it comes to partitioning.
> - Partitioning is available at entity creation for all queues and topics in Basic or Standard SKUs. A namespace can have both partitioned and non-partitioned entities.
> - Partitioning is available at namespace creation for the Premium messaging SKU, and all queues and topics in that namespace are partitioned. Any previously migrated partitioned entities in Premium namespaces continue to work as expected.
> - When you enable partitioning in the Basic or Standard SKUs, you always create 16 partitions.
> - When you enable partitioning in the Premium SKU, you specify the number of partitions during namespace creation.
 
You can't change the partitioning option on any existing namespace, queue, or topic. You can only set the option when you create the entity.

## How it works

Each partitioned queue or topic consists of multiple partitions. Each partition is stored in a different messaging store and handled by a different message broker. When you send a message to a partitioned queue or topic, Service Bus assigns the message to one of the partitions. Service Bus selects the partition randomly or uses a partition key that the sender specifies.

When a client wants to receive a message from a partitioned queue, or from a subscription to a partitioned topic, Service Bus queries all partitions for messages. It returns the first message that it gets from any of the messaging stores to the receiver. Service Bus caches the other messages and returns them when it receives more receive requests. A receiving client isn't aware of the partitioning. The client-facing behavior of a partitioned queue or topic (for example, read, complete, defer, deadletter, prefetching) is identical to the behavior of a regular entity.

The peek operation on a nonpartitioned entity always returns the oldest message, but not on a partitioned entity. Instead, it returns the oldest message in one of the partitions whose message broker responded first. There's no guarantee that the returned message is the oldest one across all partitions. 

There's no extra cost when sending a message to, or receiving a message from, a partitioned queue or topic.

> [!NOTE]
> The peek operation returns the oldest message from the partition based on its sequence number. For partitioned entities, the sequence number is relative to the partition. For more information, see [Message sequencing and timestamps](message-sequencing.md).

## Use of partition keys

When you enqueue a message into a partitioned queue or topic, Service Bus checks for the presence of a partition key. If it finds one, it selects the partition based on that key. If it doesn't find a partition key, it selects the partition based on an internal algorithm.

### Using a partition key

Some scenarios, such as sessions or transactions, require messages to be stored in a specific partition. All these scenarios require the use of a partition key. Service Bus assigns all messages that use the same partition key to the same partition. If the partition is temporarily unavailable, Service Bus returns an error.

Depending on the scenario, different message properties are used as a partition key:

**SessionId**: If a message has the session ID property set, Service Bus uses it as the partition key. This way, the same message broker handles all messages that belong to the same session. By using sessions, Service Bus guarantees message ordering as well as the consistency of session states.

**PartitionKey**: If a message has the partition key property but not the session ID property set, Service Bus uses the partition key property value as the partition key. If the message has both the session ID and the partition key properties set, both properties must be identical. If the partition key property is set to a different value than the session ID property, Service Bus returns an invalid operation exception. Use the partition key property if a sender sends nonsession aware transactional messages. The partition key ensures that the same messaging broker handles all messages that are sent within a transaction.

**MessageId**: If you create the queue or topic with the [duplicate detection feature](duplicate-detection.md) and don't set the session ID or partition key properties, the message ID property value serves as the partition key. (The Microsoft client libraries automatically assign a message ID if the sending application doesn't.) In this case, the same message broker handles all copies of the same message. This ID enables Service Bus to detect and eliminate duplicate messages. If the duplicate detection feature isn't enabled, Service Bus doesn't consider the message ID property as a partition key.

### Not using a partition key

If you don't specify a partition key, Service Bus distributes messages in a round-robin fashion to all the partitions of the partitioned queue or topic. If the chosen partition isn't available, Service Bus assigns the message to a different partition. This way, the send operation succeeds despite the temporary unavailability of a messaging store. However, you don't achieve the guaranteed ordering that a partition key provides.

For a more in-depth discussion of the tradeoff between availability (no partition key) and consistency (using a partition key), see [Availability and consistency in Event Hubs](../event-hubs/event-hubs-availability-and-consistency.md). Except for partition ID not being exposed to users, this information applies equally to partitioned Service Bus entities.

To give Service Bus enough time to enqueue the message into a different partition, the timeout value specified by the client that sends the message must be greater than 15 seconds. The default value of 60 seconds is recommended.

A partition key "pins" a message to a specific partition. If the messaging store that holds this partition is unavailable, Service Bus returns an error. In the absence of a partition key, Service Bus can choose a different partition and the operation succeeds. Therefore, don't supply a partition key unless it's required.

## Advanced topics

### Use transactions with partitioned entities

Messages that you send as part of a transaction must specify a partition key. The key can be one of the following properties: session ID, partition key, or message ID. All messages that you send as part of the same transaction must specify the same partition key. If you attempt to send a message without a partition key within a transaction, Service Bus returns an invalid operation exception. If you attempt to send multiple messages within the same transaction that have different partition keys, Service Bus returns an invalid operation exception. For example:

```csharp
CommittableTransaction committableTransaction = new CommittableTransaction();
using (TransactionScope ts = new TransactionScope(committableTransaction))
{
    ServiceBusMessage msg = new ServiceBusMessage("This is a message");
    msg.PartitionKey = "myPartitionKey";
    await sender.SendMessageAsync(msg); 
    ts.Complete();
}
committableTransaction.Commit();
```

If you set any of the properties that serve as a partition key, Service Bus pins the message to a specific partition. This behavior occurs whether or not you use a transaction. Don't specify a partition key if it isn't necessary.

### Use transactions in sessions with partitioned entities

To send a transactional message to a session-aware topic or queue, set the session ID property on the message. If you specify the partition key property, it must be identical to the session ID property. If they differ, Service Bus returns an invalid operation exception.

Unlike regular (nonpartitioned) queues or topics, you can't use a single transaction to send multiple messages to different sessions. If you attempt this operation, Service Bus returns an invalid operation exception. For example:

```csharp
CommittableTransaction committableTransaction = new CommittableTransaction();
using (TransactionScope ts = new TransactionScope(committableTransaction))
{
    ServiceBusMessage msg = new ServiceBusMessage("This is a message");
    msg.SessionId = "mySession";
    await sender.SendMessageAsync(msg); 
    ts.Complete();
}
committableTransaction.Commit();
```

### Automatic message forwarding with partitioned entities

Service Bus supports automatic message forwarding from, to, or between partitioned entities. You can enable this feature either when creating or updating queues and subscriptions. For more information, see [Enable message forwarding](enable-auto-forward.md). If the message specifies a partition key (session ID, partition key, or message ID), that partition key is used for the destination entity.

## Considerations and guidelines
* **High consistency features**: If an entity uses features such as sessions, duplicate detection, or explicit control of partitioning key, then the messaging operations always route to a specific partition. If any of the partitions experience high traffic or the underlying store is unhealthy, those operations fail and availability is reduced. Overall, the consistency is still much higher than nonpartitioned entities. Only a subset of traffic experiences issues, as opposed to all the traffic. For more information, see this [discussion of availability and consistency](../event-hubs/event-hubs-availability-and-consistency.md).
* **Management**: Operations such as Create, Update, and Delete must be performed on all the partitions of the entity. If any partition is unhealthy, it could result in failures for these operations. For the Get operation, information such as message counts must be aggregated from all partitions. If any partition is unhealthy, the entity availability status is reported as limited.
* **Low volume message scenarios**: For such scenarios, especially when using the HTTP protocol, you might have to perform multiple receive operations in order to obtain all the messages. For receive requests, the front end performs a receive on all the partitions and caches all the responses it receives. A subsequent receive request on the same connection benefits from this caching and receive latencies are lower. However, if you have multiple connections or use HTTP, a new connection is established for each request. As such, there's no guarantee that it lands on the same node. If all existing messages are locked and cached in another front end, the receive operation returns **null**. Messages eventually expire and you can receive them again. HTTP keep-alive is recommended. When using partitioning in low-volume scenarios, receive operations might take longer than expected. Hence, don't use partitioning in these scenarios. Delete any existing partitioned entities and recreate them with partitioning disabled to improve performance.
* **Browse/Peek messages**: The peek operation doesn't always return the number of messages asked for. Two common reasons explain this behavior. One reason is that the aggregated size of the collection of messages exceeds the maximum size. Another reason is that in partitioned queues or topics, a partition might not have enough messages to return the requested number of messages. In general, if an application wants to peek or browse a specific number of messages, it should call the peek operation repeatedly until it gets that number of messages, or there are no more messages to peek. For more information, including code samples, see [Message browsing](message-browsing.md).

## Partitioned entities limitations
Currently, Service Bus imposes the following limitations on partitioned queues and topics:

- Partitioned queues and topics don't support sending messages that belong to different sessions in a single transaction.
- Service Bus currently allows up to 100 partitioned queues or topics per namespace for the Basic and Standard tiers. Each partitioned queue or topic counts towards the quota of 10,000 entities per namespace.

## Next steps
You can enable partitioning by using Azure portal, PowerShell, CLI, Resource Manager template, .NET, Java, Python, and JavaScript. For more information, see [Enable partitioning (Basic / Standard)](enable-partitions-basic-standard.md).

To learn about the core concepts of the Advanced Message Queuing Protocol (AMQP) 1.0 messaging specification, see the [AMQP 1.0 protocol guide](service-bus-amqp-protocol-guide.md).
