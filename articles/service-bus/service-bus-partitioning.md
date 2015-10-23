<properties 
   pageTitle="Partitioned messaging entities | Microsoft Azure"
   description="Describes how to partition messaging entities by using multiple message brokers."
   services="service-bus"
   documentationCenter="na"
   authors="sethmanheim"
   manager="timlt"
   editor="tysonn" /> 
<tags 
   ms.service="service-bus"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="09/18/2015"
   ms.author="sethm" />

# Partitioned messaging entities

Azure Service Bus employs multiple message brokers to process messages and multiple messaging stores to store messages. A conventional queue or topic is handled by a single message broker and stored in one messaging store. Service Bus also enables queues or topics to be partitioned across multiple message brokers and messaging stores. This means that the overall throughput of a partitioned queue or topic is no longer limited by the performance of a single message broker or messaging store. In addition, a temporary outage of a messaging store does not render a partitioned queue or topic unavailable. Partitioned queues and topics can contain all advanced Service Bus features, such as support for transactions and sessions.

For more details about Service Bus internals, see the [Service Bus Architecture][] topic.

## Partitioned queues and topics

Each partitioned queue or topic consists of multiple fragments. Each fragment is stored in a different messaging store and handled by a different message broker. When a message is sent to a partitioned queue or topic, Service Bus assigns the message to one of the fragments. The selection is done randomly by Service Bus or by a partition key that the sender can specify.

When a client wants to receive a message from a partitioned queue, or from a subscription of a partitioned topic, Service Bus queries all fragments for messages, then returns the first message that is returned from any of the messaging stores to the receiver. Service Bus caches the other messages and returns them when it receives additional receive requests. A receiving client is not aware of the partitioning; the client-facing behavior of a partitioned queue or topic (for example, read, complete, defer, deadletter, prefetching) is identical to the behavior of a regular entity.

There is no additional cost when sending a message to, or receiving a message from, a partitioned queue or topic.

## Enable partitioning

To use partitioned queues and topics with Microsoft Azure Service Bus, use the Azure SDK version 2.2 or later, or specify `api-version=2013-10` in your HTTP requests.

You can create Service Bus queues and topics in 1, 2, 3, 4, or 5 GB sizes (the default is 1 GB). With partitioning enabled, Service Bus creates 16 partitions for each GB you specify. As such, if you create a queue that's 5 GB in size, with 16 partitions the maximum queue size becomes (5 \* 16) = 80 GB. You can see the maximum size of your partitioned queue or topic by looking at its entry on the [Azure portal][].

There are several ways to create a partitioned queue or topic. When you create the queue or topic from your application, you can enable partitioning for the queue or topic by respectively setting the [QueueDescription.EnablePartitioning][] or [TopicDescription.EnablePartitioning][] property to **true**. These properties must be set at the time the queue or topic is created. It is not possible to change these properties on an existing queue or topic. For example:

```
// Create partitioned topic
NamespaceManager ns = NamespaceManager.CreateFromConnectionString(myConnectionString);
TopicDescription td = new TopicDescription(TopicName);
td.EnablePartitioning = true;
ns.CreateTopic(td);
```

Alternatively, you can create a partitioned queue or topic in Visual Studio or in the [Azure portal][]. When you create a new queue or topic in the portal, check the **Enable Partitioning** option in the **Configure** tab of the queue or topic window. In Visual Studio, click the **Enable Partitioning** checkbox in the **New Queue** or **New Topic** dialog box.

## Use of partition keys

When a message is enqueued into a partitioned queue or topic, Service Bus checks for the presence of a partition key. If it finds one, it selects the fragment based on that key. If it does not find a partition key, it selects the fragment based on an internal algorithm.

### Use a partition key

Some scenarios, such as sessions or transactions, require messages to be stored in a specific fragment. All of these scenarios require the use of a partition key. All messages that use the same partition key are assigned to the same fragment. If the fragment is temporarily unavailable, Service Bus returns an error.

Depending on the scenario, different message properties are used as a partition key:

**SessionId**: If a message has the [BrokeredMessage.SessionId][] property set, then Service Bus uses this property as the partition key. This way, all messages that belong to the same session are handled by the same message broker. This enables Service Bus to guarantee message ordering as well as the consistency of session states.

**PartitionKey**: If a message has the [BrokeredMessage.PartitionKey][] property but not the [BrokeredMessage.SessionId][] property set, then Service Bus uses the [PartitionKey][] property as the partition key. If the message has both the [SessionId][] and the [PartitionKey][] properties set, both properties must be identical. If the [PartitionKey][] property is set to a different value than the [SessionId][] property, Service Bus returns an **InvalidOperationException** exception. The [PartitionKey][] property should be used if a sender sends non-session aware transactional messages. The partition key ensures that all messages that are sent within a transaction are handled by the same messaging broker.

**MessageId**: If the queue or topic has the [QueueDescription.RequiresDuplicateDetection][] property set to **true** and the [BrokeredMessage.SessionId][] or [BrokeredMessage.PartitionKey][] properties are not set, then the [BrokeredMessage.MessageId][] property serves as the partition key. (Note that the Microsoft .NET and AMQP libraries automatically assign a message ID if the sending application does not.) In this case, all copies of the same message are handled by the same message broker. This allows Service Bus to detect and eliminate duplicate messages. If the [QueueDescription.RequiresDuplicateDetection][] property is not set to **true**, Service Bus does not consider the [MessageId][] property as a partition key.

### Not using a partition key

In the absence of a partition key, Service Bus distributes messages in a round-robin fashion to all the fragments of the partitioned queue or topic. If the chosen fragment is not available, Service Bus assigns the message to a different fragment. This way, the send operation succeeds despite the temporary unavailability of a messaging store.

To give Service Bus enough time to enqueue the message into a different fragment, the [MessagingFactorySettings.OperationTimeout][] value specified by the client that sends the message must be greater than 15 seconds. It is recommended that you set the [OperationTimeout][] property to the default value of 60 seconds.

Note that a partition key "pins" a message to a specific fragment. If the messaging store that holds this fragment is unavailable, Service Bus returns an error. In the absence of a partition key, Service Bus can choose a different fragment and the operation succeeds. Therefore, it is recommended that you do not supply a partition key unless it is required.

## Advanced topics: use transactions with partitioned entities

Messages that are sent as part of a transaction must specify a partition key. This can be one of the following properties: [BrokeredMessage.SessionId][], [BrokeredMessage.PartitionKey][], or [BrokeredMessage.MessageId][]. All messages that are sent as part of the same transaction must specify the same partition key. If you attempt to send a message without a partition key within a transaction, Service Bus returns an **InvalidOperationException** exception. If you attempt to send multiple messages within the same transaction that have different partition keys, Service Bus returns an **InvalidOperationException** exception. For example:

```
CommittableTransaction committableTransaction = new CommittableTransaction();
using (TransactionScope ts = new TransactionScope(committableTransaction))
{
    BrokeredMessage msg = new BrokeredMessage("This is a message");
    msg.PartitionKey = "myPartitionKey";
    messageSender.Send(msg); 
    ts.Complete();
}
committableTransaction.Commit();
```

If any of the properties that serve as a partition key are set, Service Bus pins the message to a specific fragment. This behavior occurs whether or not a transaction is used. It is recommended that you do not specify a partition key if it is not necessary.

## Use sessions with partitioned entities

To send a transactional message to a session-aware topic or queue, the message must have the [BrokeredMessage.SessionId][] property set. If the [BrokeredMessage.PartitionKey][] property is specified as well, it must be identical to the [SessionId][] property. If they differ, Service Bus returns an **InvalidOperationException** exception.

Unlike regular (non-partitioned) queues or topics, it is not possible to use a single transaction to send multiple messages to different sessions. If attempted, Service Bus returns an **InvalidOperationException **exception. For example:

```
CommittableTransaction committableTransaction = new CommittableTransaction();
using (TransactionScope ts = new TransactionScope(committableTransaction))
{
    BrokeredMessage msg = new BrokeredMessage("This is a message");
    msg.SessionId = "mySession";
    messageSender.Send(msg); 
    ts.Complete();
}
committableTransaction.Commit();
```

## Automatic message forwarding with partitioned entities

Azure Service Bus supports automatic message forwarding from, to, or between partitioned entities. To enable automatic message forwarding, set the [QueueDescription.ForwardTo][] property on the source queue or subscription. If the message specifies a partition key ([SessionId][], [PartitionKey][], or [MessageId][]), that partition key is used for the destination entity.

## Partitioned entities limitations

In its current implementation, Service Bus imposes the following limitations on partitioned queues and topics:

-   Partitioned queues and topics are available via SBMP or HTTP/HTTPS, as well as with AMQP.

-   Partitioned queues and topics do not support sending messages that belong to different sessions in a single transaction.

-   Service Bus currently allows up to 100 partitioned queues or topics per namespace. Each partitioned queue or topic counts towards the quota of 10,000 entities per namespace.

-   Partitioned queues and topics are not supported on Service Bus for Windows Server versions 1.0 and 1.1.

## Next steps

See the discussion of AMQP 1.0 support for Service Bus partitioned queues and topics (coming soon!) to learn more about paritioning messaging entities. 

  [Service Bus Architecture]: service-bus-architecture.md
  [Azure portal]: http://manage.windowsazure.com
  [QueueDescription.EnablePartitioning]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.queuedescription.enablepartitioning.aspx
  [TopicDescription.EnablePartitioning]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.topicdescription.enablepartitioning.aspx
  [BrokeredMessage.SessionId]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.brokeredmessage.sessionid.aspx
  [BrokeredMessage.PartitionKey]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.brokeredmessage.partitionkey.aspx
  [SessionId]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.brokeredmessage.sessionid.aspx
  [PartitionKey]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.brokeredmessage.partitionkey.aspx
  [QueueDescription.RequiresDuplicateDetection]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.queuedescription.requiresduplicatedetection.aspx
  [BrokeredMessage.MessageId]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.brokeredmessage.messageid.aspx
  [MessageId]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.brokeredmessage.messageid.aspx
  [QueueDescription.RequiresDuplicateDetection]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.queuedescription.requiresduplicatedetection.aspx
  [MessagingFactorySettings.OperationTimeout]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.messagingfactorysettings.operationtimeout.aspx
  [OperationTimeout]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.messagingfactorysettings.operationtimeout.aspx
  [QueueDescription.ForwardTo]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.queuedescription.forwardto.aspx
  [AMQP 1.0 support for Service Bus partitioned queues and topics]: service-bus-partitioned-entities-amqp-overview.md
