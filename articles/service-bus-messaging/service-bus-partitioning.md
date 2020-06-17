---
title: Create partitioned Azure Service Bus queues and topics | Microsoft Docs
description: Describes how to partition Service Bus queues and topics by using multiple message brokers.
services: service-bus-messaging
author: axisc
manager: timlt
editor: spelluru

ms.service: service-bus-messaging
ms.topic: article
ms.date: 02/06/2020
ms.author: aschhab

---
# Partitioned queues and topics

Azure Service Bus employs multiple message brokers to process messages and multiple messaging stores to store messages. A conventional queue or topic is handled by a single message broker and stored in one messaging store. Service Bus *partitions* enable queues and topics, or *messaging entities*, to be partitioned across multiple message brokers and messaging stores. Partitioning means that the overall throughput of a partitioned entity is no longer limited by the performance of a single message broker or messaging store. In addition, a temporary outage of a messaging store does not render a partitioned queue or topic unavailable. Partitioned queues and topics can contain all advanced Service Bus features, such as support for transactions and sessions.

> [!NOTE]
> Partitioning is available at entity creation for all queues and topics in Basic or Standard SKUs. It is not available for the Premium messaging SKU, but any previously existing partitioned entities in Premium namespaces continue to work as expected.
 
It is not possible to change the partitioning option on any existing queue or topic; you can only set the option when you create the entity.

## How it works

Each partitioned queue or topic consists of multiple partitions. Each partition is stored in a different messaging store and handled by a different message broker. When a message is sent to a partitioned queue or topic, Service Bus assigns the message to one of the partitions. The selection is done randomly by Service Bus or by using a partition key that the sender can specify.

When a client wants to receive a message from a partitioned queue, or from a subscription to a partitioned topic, Service Bus queries all partitions for messages, then returns the first message that is obtained from any of the messaging stores to the receiver. Service Bus caches the other messages and returns them when it receives additional receive requests. A receiving client is not aware of the partitioning; the client-facing behavior of a partitioned queue or topic (for example, read, complete, defer, deadletter, prefetching) is identical to the behavior of a regular entity.

There is no additional cost when sending a message to, or receiving a message from, a partitioned queue or topic.

## Enable partitioning

To use partitioned queues and topics with Azure Service Bus, use the Azure SDK version 2.2 or later, or specify `api-version=2013-10` or later in your HTTP requests.

### Standard

In the Standard messaging tier, you can create Service Bus queues and topics in 1, 2, 3, 4, or 5-GB sizes (the default is 1 GB). With partitioning enabled, Service Bus creates 16 copies (16 partitions) of the entity, each of the same size specified. As such, if you create a queue that's 5 GB in size, with 16 partitions the maximum queue size becomes (5 \* 16) = 80 GB. You can see the maximum size of your partitioned queue or topic by looking at its entry on the [Azure portal][Azure portal], in the **Overview** blade for that entity.

### Premium

In a Premium tier namespace, partitioning entities are not supported. However, you can still create Service Bus queues and topics in 1, 2, 3, 4, 5, 10, 20, 40, or 80-GB sizes (the default is 1 GB). You can see the size of your queue or topic by looking at its entry on the [Azure portal][Azure portal], in the **Overview** blade for that entity.

### Create a partitioned entity

There are several ways to create a partitioned queue or topic. When you create the queue or topic from your application, you can enable partitioning for the queue or topic by respectively setting the [QueueDescription.EnablePartitioning][QueueDescription.EnablePartitioning] or [TopicDescription.EnablePartitioning][TopicDescription.EnablePartitioning] property to **true**. These properties must be set at the time the queue or topic is created, and are available only in the older [WindowsAzure.ServiceBus](https://www.nuget.org/packages/WindowsAzure.ServiceBus/) library. As stated previously, it is not possible to change these properties on an existing queue or topic. For example:

```csharp
// Create partitioned topic
NamespaceManager ns = NamespaceManager.CreateFromConnectionString(myConnectionString);
TopicDescription td = new TopicDescription(TopicName);
td.EnablePartitioning = true;
ns.CreateTopic(td);
```

Alternatively, you can create a partitioned queue or topic in the [Azure portal][Azure portal]. When you create a queue or topic in the portal, the **Enable partitioning** option in the queue or topic **Create** dialog box is checked by default. You can only disable this option in a Standard tier entity; in the Premium tier partitioning is not supported, and the checkbox has no effect. 

## Use of partition keys

When a message is enqueued into a partitioned queue or topic, Service Bus checks for the presence of a partition key. If it finds one, it selects the partition based on that key. If it does not find a partition key, it selects the partition based on an internal algorithm.

### Using a partition key

Some scenarios, such as sessions or transactions, require messages to be stored in a specific partition. All these scenarios require the use of a partition key. All messages that use the same partition key are assigned to the same partition. If the partition is temporarily unavailable, Service Bus returns an error.

Depending on the scenario, different message properties are used as a partition key:

**SessionId**: If a message has the [SessionId](/dotnet/api/microsoft.azure.servicebus.message.sessionid) property set, then Service Bus uses **SessionID** as the partition key. This way, all messages that belong to the same session are handled by the same message broker. Sessions enable Service Bus to guarantee message ordering as well as the consistency of session states.

**PartitionKey**: If a message has the [PartitionKey](/dotnet/api/microsoft.azure.servicebus.message.partitionkey) property but not the [SessionId](/dotnet/api/microsoft.azure.servicebus.message.sessionid) property set, then Service Bus uses the [PartitionKey](/dotnet/api/microsoft.azure.servicebus.message.partitionkey) property value as the partition key. If the message has both the [SessionId](/dotnet/api/microsoft.azure.servicebus.message.sessionid) and the [PartitionKey](/dotnet/api/microsoft.azure.servicebus.message.partitionkey) properties set, both properties must be identical. If the [PartitionKey](/dotnet/api/microsoft.azure.servicebus.message.partitionkey) property is set to a different value than the [SessionId](/dotnet/api/microsoft.azure.servicebus.message.sessionid) property, Service Bus returns an invalid operation exception. The [PartitionKey](/dotnet/api/microsoft.azure.servicebus.message.partitionkey) property should be used if a sender sends non-session aware transactional messages. The partition key ensures that all messages that are sent within a transaction are handled by the same messaging broker.

**MessageId**: If the queue or topic has the [RequiresDuplicateDetection](/dotnet/api/microsoft.azure.management.servicebus.models.sbqueue.requiresduplicatedetection) property set to **true** and the [SessionId](/dotnet/api/microsoft.azure.servicebus.message.sessionid) or [PartitionKey](/dotnet/api/microsoft.azure.servicebus.message.partitionkey) properties are not set, then the [MessageId](/dotnet/api/microsoft.azure.servicebus.message.messageid) property value serves as the partition key. (The Microsoft .NET and AMQP libraries automatically assign a message ID if the sending application does not.) In this case, all copies of the same message are handled by the same message broker. This ID enables Service Bus to detect and eliminate duplicate messages. If the [RequiresDuplicateDetection](/dotnet/api/microsoft.azure.management.servicebus.models.sbqueue.requiresduplicatedetection) property is not set to **true**, Service Bus does not consider the [MessageId](/dotnet/api/microsoft.azure.servicebus.message.messageid) property as a partition key.

### Not using a partition key

In the absence of a partition key, Service Bus distributes messages in a round-robin fashion to all the partitions of the partitioned queue or topic. If the chosen partition is not available, Service Bus assigns the message to a different partition. This way, the send operation succeeds despite the temporary unavailability of a messaging store. However, you will not achieve the guaranteed ordering that a partition key provides.

For a more in-depth discussion of the tradeoff between availability (no partition key) and consistency (using a partition key), see [this article](../event-hubs/event-hubs-availability-and-consistency.md). This information applies equally to partitioned Service Bus entities.

To give Service Bus enough time to enqueue the message into a different partition, the [OperationTimeout](/dotnet/api/microsoft.azure.servicebus.queueclient.operationtimeout) value specified by the client that sends the message must be greater than 15 seconds. It is recommended that you set the [OperationTimeout](/dotnet/api/microsoft.azure.servicebus.queueclient.operationtimeout) property to the default value of 60 seconds.

A partition key "pins" a message to a specific partition. If the messaging store that holds this partition is unavailable, Service Bus returns an error. In the absence of a partition key, Service Bus can choose a different partition and the operation succeeds. Therefore, it is recommended that you do not supply a partition key unless it is required.

## Advanced topics: use transactions with partitioned entities

Messages that are sent as part of a transaction must specify a partition key. The key can be one of the following properties: [SessionId](/dotnet/api/microsoft.azure.servicebus.message.sessionid), [PartitionKey](/dotnet/api/microsoft.azure.servicebus.message.partitionkey), or [MessageId](/dotnet/api/microsoft.azure.servicebus.message.messageid). All messages that are sent as part of the same transaction must specify the same partition key. If you attempt to send a message without a partition key within a transaction, Service Bus returns an invalid operation exception. If you attempt to send multiple messages within the same transaction that have different partition keys, Service Bus returns an invalid operation exception. For example:

```csharp
CommittableTransaction committableTransaction = new CommittableTransaction();
using (TransactionScope ts = new TransactionScope(committableTransaction))
{
    Message msg = new Message("This is a message");
    msg.PartitionKey = "myPartitionKey";
    messageSender.SendAsync(msg); 
    ts.CompleteAsync();
}
committableTransaction.Commit();
```

If any of the properties that serve as a partition key are set, Service Bus pins the message to a specific partition. This behavior occurs whether or not a transaction is used. It is recommended that you do not specify a partition key if it is not necessary.

## Using sessions with partitioned entities

To send a transactional message to a session-aware topic or queue, the message must have the [SessionId](/dotnet/api/microsoft.azure.servicebus.message.sessionid) property set. If the [PartitionKey](/dotnet/api/microsoft.azure.servicebus.message.partitionkey) property is specified as well, it must be identical to the [SessionId](/dotnet/api/microsoft.azure.servicebus.message.sessionid) property. If they differ, Service Bus returns an invalid operation exception.

Unlike regular (non-partitioned) queues or topics, it is not possible to use a single transaction to send multiple messages to different sessions. If attempted, Service Bus returns an invalid operation exception. For example:

```csharp
CommittableTransaction committableTransaction = new CommittableTransaction();
using (TransactionScope ts = new TransactionScope(committableTransaction))
{
    Message msg = new Message("This is a message");
    msg.SessionId = "mySession";
    messageSender.SendAsync(msg); 
    ts.CompleteAsync();
}
committableTransaction.Commit();
```

## Automatic message forwarding with partitioned entities

Service Bus supports automatic message forwarding from, to, or between partitioned entities. To enable automatic message forwarding, set the [QueueDescription.ForwardTo][QueueDescription.ForwardTo] property on the source queue or subscription. If the message specifies a partition key ([SessionId](/dotnet/api/microsoft.azure.servicebus.message.sessionid), [PartitionKey](/dotnet/api/microsoft.azure.servicebus.message.partitionkey), or [MessageId](/dotnet/api/microsoft.azure.servicebus.message.messageid)), that partition key is used for the destination entity.

## Considerations and guidelines
* **High consistency features**: If an entity uses features such as sessions, duplicate detection, or explicit control of partitioning key, then the messaging operations are always routed to specific partition. If any of the partitions experience high traffic or the underlying store is unhealthy, those operations fail and availability is reduced. Overall, the consistency is still much higher than non-partitioned entities; only a subset of traffic is experiencing issues, as opposed to all the traffic. For more information, see this [discussion of availability and consistency](../event-hubs/event-hubs-availability-and-consistency.md).
* **Management**: Operations such as Create, Update, and Delete must be performed on all the partitions of the entity. If any partition is unhealthy, it could result in failures for these operations. For the Get operation, information such as message counts must be aggregated from all partitions. If any partition is unhealthy, the entity availability status is reported as limited.
* **Low volume message scenarios**: For such scenarios, especially when using the HTTP protocol, you may have to perform multiple receive operations in order to obtain all the messages. For receive requests, the front end performs a receive on all the partitions and caches all the responses received. A subsequent receive request on the same connection would benefit from this caching and receive latencies will be lower. However, if you have multiple connections or use HTTP, that establishes a new connection for each request. As such, there is no guarantee that it would land on the same node. If all existing messages are locked and cached in another front end, the receive operation returns **null**. Messages eventually expire and you can receive them again. HTTP keep-alive is recommended. When using partitioning in low-volume scenarios, receive operations may take longer than expected. Hence, we recommend that you don't use partitioning in these scenarios. Delete any existing partitioned entities and recreate them with partitioning disabled to improve performance.
* **Browse/Peek messages**: Available only in the older [WindowsAzure.ServiceBus](https://www.nuget.org/packages/WindowsAzure.ServiceBus/) library. [PeekBatch](/dotnet/api/microsoft.servicebus.messaging.queueclient.peekbatch) does not always return the number of messages specified in the [MessageCount](/dotnet/api/microsoft.servicebus.messaging.queuedescription.messagecount) property. There are two common reasons for this behavior. One reason is that the aggregated size of the collection of messages exceeds the maximum size of 256 KB. Another reason is that if the queue or topic has the [EnablePartitioning property](/dotnet/api/microsoft.servicebus.messaging.queuedescription.enablepartitioning) set to **true**, a partition may not have enough messages to complete the requested number of messages. In general, if an application wants to receive a specific number of messages, it should call [PeekBatch](/dotnet/api/microsoft.servicebus.messaging.queueclient.peekbatch) repeatedly until it gets that number of messages, or there are no more messages to peek. For more information, including code samples, see the [QueueClient.PeekBatch](/dotnet/api/microsoft.servicebus.messaging.queueclient.peekbatch) or [SubscriptionClient.PeekBatch](/dotnet/api/microsoft.servicebus.messaging.subscriptionclient.peekbatch) API documentation.

## Latest added features

* Add or remove rule is now supported with partitioned entities. Different from non-partitioned entities, these operations are not supported under transactions. 
* AMQP is now supported for sending and receiving messages to and from a partitioned entity.
* AMQP is now supported for the following operations: [Batch Send](/dotnet/api/microsoft.servicebus.messaging.queueclient.sendbatch), [Batch Receive](/dotnet/api/microsoft.servicebus.messaging.queueclient.receivebatch), [Receive by Sequence Number](/dotnet/api/microsoft.servicebus.messaging.queueclient.receive), [Peek](/dotnet/api/microsoft.servicebus.messaging.queueclient.peek), [Renew Lock](/dotnet/api/microsoft.servicebus.messaging.queueclient.renewmessagelock), [Schedule Message](/dotnet/api/microsoft.azure.servicebus.queueclient.schedulemessageasync), [Cancel Scheduled Message](/dotnet/api/microsoft.azure.servicebus.queueclient.cancelscheduledmessageasync), [Add Rule](/dotnet/api/microsoft.azure.servicebus.ruledescription), [Remove Rule](/dotnet/api/microsoft.azure.servicebus.ruledescription), [Session Renew Lock](/dotnet/api/microsoft.servicebus.messaging.messagesession.renewlock), [Set Session State](/dotnet/api/microsoft.servicebus.messaging.messagesession.setstate), [Get Session State](/dotnet/api/microsoft.servicebus.messaging.messagesession.getstate), and [Enumerate Sessions](/dotnet/api/microsoft.servicebus.messaging.queueclient.getmessagesessions).

## Partitioned entities limitations

Currently Service Bus imposes the following limitations on partitioned queues and topics:

* Partitioned queues and topics are not supported in the Premium messaging tier. Sessions are supported in the premier tier by using SessionId. 
* Partitioned queues and topics do not support sending messages that belong to different sessions in a single transaction.
* Service Bus currently allows up to 100 partitioned queues or topics per namespace. Each partitioned queue or topic counts towards the quota of 10,000 entities per namespace (does not apply to Premium tier).

## Next steps

Read about the core concepts of the AMQP 1.0 messaging specification in the [AMQP 1.0 protocol guide](service-bus-amqp-protocol-guide.md).

[Azure portal]: https://portal.azure.com
[QueueDescription.EnablePartitioning]: /dotnet/api/microsoft.servicebus.messaging.queuedescription.enablepartitioning
[TopicDescription.EnablePartitioning]: /dotnet/api/microsoft.servicebus.messaging.topicdescription.enablepartitioning
[QueueDescription.ForwardTo]: /dotnet/api/microsoft.servicebus.messaging.queuedescription.forwardto
[AMQP 1.0 support for Service Bus partitioned queues and topics]: service-bus-partitioned-queues-and-topics-amqp-overview.md
