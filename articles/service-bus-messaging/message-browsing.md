---
title: Azure Service Bus - message browsing
description: Browse and peek Service Bus messages enables an Azure Service Bus client to enumerate all messages in a queue or subscription.
ms.topic: article
ms.date: 03/29/2021
---

# Message browsing

Message browsing, or peeking, enables a Service Bus client to enumerate all messages in a queue or a subscription, for diagnostic and debugging purposes.

The peek operation on a **queue** returns all messages in the queue, not only the ones available for immediate acquisition. The peek operation on a **subscription** returns all messages except scheduled messages in the subscription message log. 

Consumed and expired messages are cleaned up by an asynchronous "garbage collection" run. This step may not necessarily occur immediately after messages expire. That's why, a peek operation may return messages that have already expired. These messages will be removed or dead-lettered when a receive operation is invoked on the queue or subscription the next time. Keep this behavior in mind when attempting to recover deferred messages from the queue. An expired message is no longer eligible for regular retrieval by any other means, even when it's being returned by Peek. Returning these messages is by design as Peek is a diagnostics tool reflecting the current state of the log.

Peek also returns messages that were locked and are currently being processed by other receivers. However, because Peek returns a disconnected snapshot, the lock state of a message can't be observed on peeked messages.

## Peek APIs
## [Azure.Messaging.ServiceBus](#tab/dotnet)
The [PeekMessageAsync](/dotnet/api/azure.messaging.servicebus.servicebusreceiver.peekmessageasync) and [PeekMessagesAsync](/dotnet/api/azure.messaging.servicebus.servicebusreceiver.peekmessagesasync) methods exist on receiver objects: `ServiceBusReceiver`, `ServiceBusSessionReceiver`. Peek works on queues, subscriptions, and their respective dead-letter queues.

When called repeatedly, `PeekMessageAsync` enumerates all messages in the queue or subscription log, in order, from the lowest available sequence number to the highest. It’s the order in which messages were enqueued, not the order in which messages might eventually be retrieved.
PeekMessagesAsync retrieves multiple messages and returns them as an enumeration. If no messages are available, the enumeration object is empty, not null.

You can also populate the [fromSequenceNumber](/dotnet/api/microsoft.servicebus.messaging.eventposition.fromsequencenumber) parameter with a SequenceNumber at which to start, and then call the method again without specifying the parameter to enumerate further. `PeekMessagesAsync` functions equivalently, but retrieves a set of messages all at once.


## [Microsoft.Azure.ServiceBus](#tab/dotnetold)
The [Peek/PeekAsync](/dotnet/api/microsoft.azure.servicebus.core.messagereceiver.peekasync#Microsoft_Azure_ServiceBus_Core_MessageReceiver_PeekAsync) and [PeekBatch/PeekBatchAsync](/dotnet/api/microsoft.servicebus.messaging.queueclient.peekbatchasync#Microsoft_ServiceBus_Messaging_QueueClient_PeekBatchAsync_System_Int64_System_Int32_) methods exist on receiver objects: `MessageReceiver`, `MessageSession`. Peek works on queues, subscriptions, and their respective dead-letter queues.

When called repeatedly, `Peek` enumerates all messages in the queue or subscription log, in order, from the lowest available sequence number to the highest. It's the order in which messages were enqueued, not the order in which messages might eventually be retrieved.

[PeekBatch](/dotnet/api/microsoft.servicebus.messaging.queueclient.peekbatch#Microsoft_ServiceBus_Messaging_QueueClient_PeekBatch_System_Int32_) retrieves multiple messages and returns them as an enumeration. If no messages are available, the enumeration object is empty, not null.

You can also use an overload of the method with a [SequenceNumber](/dotnet/api/microsoft.azure.servicebus.message.systempropertiescollection.sequencenumber#Microsoft_Azure_ServiceBus_Message_SystemPropertiesCollection_SequenceNumber) at which to start, and then call the parameterless method overload to enumerate further. **PeekBatch** functions equivalently, but retrieves a set of messages all at once.


---

## Next steps

To learn more about Service Bus messaging, see the following topics:

* [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md)
* [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)
* [How to use Service Bus topics and subscriptions](service-bus-dotnet-how-to-use-topics-subscriptions.md)
