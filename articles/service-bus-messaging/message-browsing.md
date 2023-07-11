---
title: Azure Service Bus - message browsing
description: Browse and peek Service Bus messages enables an Azure Service Bus client to enumerate all messages in a queue or subscription.
ms.topic: article
ms.date: 06/08/2023
---

# Message browsing
Message browsing, or peeking, enables a Service Bus client to enumerate all messages in a queue or a subscription, for diagnostic and debugging purposes.

The Peek operation on a queue or a subscription returns at most the requested number of messages. The following table shows the types of messages that are returned by the Peek operation. 

| Type of messages | Included? | 
| ---------------- | ----- | 
| Active messages | Yes |
| Dead-lettered messages | No | 
| Locked messages | Yes |
| Expired messages |  May be (before they're dead-lettered) |
| Scheduled messages | Yes for queues. No for subscriptions |

## Dead-lettered messages
To peek into **Dead-lettered** messages of a queue or subscription, the peek operation should be run on the dead letter queue associated with the queue or subscription. For more information, see [accessing dead letter queues](service-bus-dead-letter-queues.md#path-to-the-dead-letter-queue).

## Expired messages
Expired messages may be included in the results returned from the Peek operation. Consumed and expired messages are cleaned up by an asynchronous "garbage collection" run. This step may not necessarily occur immediately after messages expire. That's why, a peek operation may return messages that have already expired. These messages will be removed or dead-lettered when a receive operation is invoked on the queue or subscription the next time. Keep this behavior in mind when attempting to recover deferred messages from the queue. 

An expired message is no longer eligible for regular retrieval by any other means, even when it's being returned by Peek. Returning these messages is by design as Peek is a diagnostics tool reflecting the current state of the log.

## Locked messages
Peek also returns messages that were **locked** and are currently being processed by other receivers. However, because Peek returns a disconnected snapshot, the lock state of a message can't be observed on peeked messages.

## Peek APIs
Peek works on queues, subscriptions, and their dead-letter queues. 

When called repeatedly, the peek operation enumerates all messages in the queue or subscription, in order, from the lowest available sequence number to the highest. It’s the order in which messages were enqueued, not the order in which messages might eventually be retrieved.

You can also pass a SequenceNumber to a peek operation. It's used to determine where to start peeking from. You can make subsequent calls to the peek operation without specifying the parameter to enumerate further.

## Next steps
Try the samples in the language of your choice to explore Azure Service Bus features. 

- [Azure Service Bus client library samples for .NET (latest)](/samples/azure/azure-sdk-for-net/azuremessagingservicebus-samples/) - - **Sending and receiving messages** sample.
- [Azure Service Bus client library samples for Java (latest)](/samples/azure/azure-sdk-for-java/servicebus-samples/) - **Peek at a message** sample
- [Azure Service Bus client library samples for Python](/samples/azure/azure-sdk-for-python/servicebus-samples/)  - **receive_peek.py** sample
- [Azure Service Bus client library samples for JavaScript](/samples/azure/azure-sdk-for-js/service-bus-javascript/)  - **browseMessages.js** sample
- [Azure Service Bus client library samples for TypeScript](/samples/azure/azure-sdk-for-js/service-bus-typescript/) - **browseMessages.ts** sample

Find samples for the older .NET and Java client libraries below:
- [Azure Service Bus client library samples for .NET (legacy)](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.Azure.ServiceBus/) - **Message Browsing (Peek)** sample
- [Azure Service Bus client library samples for Java (legacy)](https://github.com/Azure/azure-service-bus/tree/master/samples/Java/azure-servicebus) - **Message Browse** sample. 

