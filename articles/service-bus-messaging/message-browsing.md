---
title: Azure Service Bus - message browsing
description: Browse and peek Service Bus messages enables an Azure Service Bus client to enumerate all messages that reside in a queue or subscription.
ms.topic: article
ms.date: 06/23/2020
---

# Message browsing

Message browsing, or peeking, enables a Service Bus client to enumerate all messages that reside in a queue or subscription, typically for diagnostic and debugging purposes.

The peek operations return all messages that exist in the queue or subscription message log, not only those available for immediate acquisition with `Receive()` or the `OnMessage()` loop. The `State` property of each message tells you whether the message is active (available to be received), [deferred](message-deferral.md), or [scheduled](message-sequencing.md).

Consumed and expired messages are cleaned up by an asynchronous "garbage collection" run and not necessarily exactly when messages expire, and therefore `Peek` may indeed return messages that have already expired and will be removed or dead-lettered when a receive operation is next invoked on the queue or subscription.

This is especially important to keep in mind when attempting to recover deferred messages from the queue. A message for which the [ExpiresAtUtc](/dotnet/api/microsoft.azure.servicebus.message.expiresatutc#Microsoft_Azure_ServiceBus_Message_ExpiresAtUtc) instant has passed is no longer eligible for regular retrieval by any other means, even when it's being returned by Peek. Returning these messages is deliberate, since Peek is a diagnostics tool reflecting the current state of the log.

Peek also returns messages that were locked and are currently being processed by other receivers, but haven't yet been completed. However, because Peek returns a disconnected snapshot, the lock state of a message can't be observed on peeked messages, and the [LockedUntilUtc](/dotnet/api/microsoft.azure.servicebus.message.systempropertiescollection.lockeduntilutc) and [LockToken](/dotnet/api/microsoft.azure.servicebus.message.systempropertiescollection.locktoken#Microsoft_Azure_ServiceBus_Message_SystemPropertiesCollection_LockToken) properties throw an [InvalidOperationException](/dotnet/api/system.invalidoperationexception) when the application attempts to read them.

## Peek APIs

The [Peek/PeekAsync](/dotnet/api/microsoft.azure.servicebus.core.messagereceiver.peekasync#Microsoft_Azure_ServiceBus_Core_MessageReceiver_PeekAsync) and [PeekBatch/PeekBatchAsync](/dotnet/api/microsoft.servicebus.messaging.queueclient.peekbatchasync#Microsoft_ServiceBus_Messaging_QueueClient_PeekBatchAsync_System_Int64_System_Int32_) methods exist in all .NET and Java client libraries and on all receiver objects: **MessageReceiver**, **MessageSession**. Peek works on all queues and subscriptions and their respective dead-letter queues.

When called repeatedly, the Peek method enumerates all messages that exist in the queue or subscription log, in sequence number order, from the lowest available sequence number to the highest. This is the order in which messages were enqueued and isn't the order in which messages might eventually be retrieved.

[PeekBatch](/dotnet/api/microsoft.servicebus.messaging.queueclient.peekbatch#Microsoft_ServiceBus_Messaging_QueueClient_PeekBatch_System_Int32_) retrieves multiple messages and returns them as an enumeration. If no messages are available, the enumeration object is empty, not null.

You can also seed an overload of the method with a [SequenceNumber](/dotnet/api/microsoft.azure.servicebus.message.systempropertiescollection.sequencenumber#Microsoft_Azure_ServiceBus_Message_SystemPropertiesCollection_SequenceNumber) at which to start, and then call the parameterless method overload to enumerate further. **PeekBatch** functions equivalently, but retrieves a set of messages all at once.

## Next steps

To learn more about Service Bus messaging, see the following topics:

* [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md)
* [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)
* [How to use Service Bus topics and subscriptions](service-bus-dotnet-how-to-use-topics-subscriptions.md)
