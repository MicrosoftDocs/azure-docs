---
title: Azure Service Bus - message browsing
description: Browse and peek Service Bus messages enables an Azure Service Bus client to enumerate all messages in a queue or subscription.
ms.topic: article
ms.date: 03/29/2021
---

# Message browsing
Message browsing, or peeking, enables a Service Bus client to enumerate all messages in a queue or a subscription, for diagnostic and debugging purposes.

The peek operation on a queue or a subscription returns at most the requested number of messages. Here are some important points about the peek operation:

- To peek into **Dead-lettered** messages, the peek operation should be made on the dead letter queue. See [accessing dead letter queues](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-dead-letter-queues#path-to-the-dead-letter-queue) for more details.
- **Scheduled** messages in a subscription log aren't included in returned messages. 
- A message in a **queue** is included even if a message isn't available for immediate acquisition. 
- **Expired** messages may be included. Consumed and expired messages are cleaned up by an asynchronous "garbage collection" run. This step may not necessarily occur immediately after messages expire. That's why, a peek operation may return messages that have already expired. These messages will be removed or dead-lettered when a receive operation is invoked on the queue or subscription the next time. Keep this behavior in mind when attempting to recover deferred messages from the queue. 

    An expired message is no longer eligible for regular retrieval by any other means, even when it's being returned by Peek. Returning these messages is by design as Peek is a diagnostics tool reflecting the current state of the log.
- Peek also returns messages that were **locked** and are currently being processed by other receivers. However, because Peek returns a disconnected snapshot, the lock state of a message can't be observed on peeked messages.

## Peek APIs
There are peek methods available on receiver objects. Peek works on queues, subscriptions, and their dead-letter queues. 

When called repeatedly, the peek operation enumerates all messages in the queue or subscription log, in order, from the lowest available sequence number to the highest. It’s the order in which messages were enqueued, not the order in which messages might eventually be retrieved.

You can also pass a SequenceNumber to a peek operation. It will be used to determine where to start peeking from. You can make subsequent calls to the peek operation without specifying the parameter to enumerate further.

## Next steps
See samples at the following locations. 

- [Azure Service Bus client library samples for Java](/samples/azure/azure-sdk-for-java/servicebus-samples/) - **Peek at a message** sample
- [Azure Service Bus client library samples for Python](/samples/azure/azure-sdk-for-python/servicebus-samples/) - **receive_peek.py** sample
- [Azure Service Bus client library samples for JavaScript](/samples/azure/azure-sdk-for-js/service-bus-javascript/) - **browseMessages.js** sample
- [Azure Service Bus client library samples for TypeScript](/samples/azure/azure-sdk-for-js/service-bus-typescript/) - **browseMessages.ts** sample
- [Azure.Messaging.ServiceBus samples for .NET](/samples/azure/azure-sdk-for-net/azuremessagingservicebus-samples/) - See peek methods on receiver classes in the [reference documentation](/dotnet/api/azure.messaging.servicebus).
- [Microsoft.Azure.ServiceBus samples for .NET](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.Azure.ServiceBus/) - **Message Browsing (Peek)** sample 
