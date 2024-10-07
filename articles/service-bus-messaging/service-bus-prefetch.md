---
title: Prefetch messages from Azure Service Bus
description: Improve performance by prefetching messages from Azure Service Bus queues or subscriptions. Messages are readily available for local retrieval before the application requests for them.
ms.topic: article
ms.date: 06/18/2024
ms.devlang: csharp
# ms.devlang: csharp, java, javascript, python
---

# Prefetch Azure Service Bus messages
The Prefetch feature fetches messages in the background into a local prefetch buffer up to the prefetch count. Messages are served from the buffer. As it happens, space is freed up in the buffer, and the receiver will prefetch more in the background.

To enable the Prefetch feature, set the prefetch count of the queue or subscription client to a number greater than zero. Setting the value to zero turns off prefetch. If there are messages in the prefetch buffer after the feature is turned off, the application receives those messages from the buffer first, and then goes to the service.

# [.NET](#tab/dotnet)
Set the prefetch count property on the [ServiceBusReceiverOptions](/dotnet/api/azure.messaging.servicebus.servicebusreceiveroptions.prefetchcount) and [ServiceBusProcessorOptions](/dotnet/api/azure.messaging.servicebus.servicebusprocessoroptions.prefetchcount) objects. 

# [Java](#tab/java)
Set the prefetch count property on the [ServiceBusReceiverClientBuilder](/java/api/com.azure.messaging.servicebus.servicebusclientbuilder.servicebusreceiverclientbuilder) and [ServiceBusProcessorClientBuilder](/java/api/com.azure.messaging.servicebus.servicebusclientbuilder.servicebusprocessorclientbuilder) objects. 

# [Python](#tab/python)

You can set **prefetch_count** on the [azure.servicebus.ServiceBusReceiver](/python/api/azure-servicebus/azure.servicebus.servicebusreceiver) or [azure.servicebus.aio.ServiceBusReceiver](/python/api/azure-servicebus/azure.servicebus.aio.servicebusreceiver).

---

> [!NOTE]
> Java Script SDK doesn't support the **Prefetch** feature. 

While messages are available in the prefetch buffer, any subsequent receive calls are immediately fulfilled from the buffer. The buffer is replenished in the background as space becomes available. If there are no messages available for delivery, the receive operation empties the buffer and then waits or blocks, as expected.

## Why is Prefetch not the default option?
Prefetch speeds up the message flow by having a message readily available for local retrieval before the application asks for one. This throughput gain is the result of a trade-off that the application author must make explicitly.

When you use the [receive and delete](message-transfers-locks-settlement.md#receiveanddelete) mode, all messages that are acquired into the prefetch buffer are no longer available in the queue. The messages stay only in the in-memory prefetch buffer until they're received into the application. If the application ends before the messages are received into the application, those messages are irrecoverable (lost).

When you use the [peek lock](message-transfers-locks-settlement.md#peeklock) receive mode, messages fetched into the prefetch buffer are acquired into the buffer in a locked state. The lock timer starts from the moment the message is prefetched into the buffer. If the prefetch buffer is large, and processing takes so long that message locks expire while staying in the prefetch buffer or even while the application is processing the message, there might be some confusing events for the application to handle. The application might acquire a message with an expired or imminently expiring lock. If so, the application might process the message, but then find that it can't complete the message because of a lock expiration. The application can check the `LockedUntilUtc` property, but keep in mind that there's clock skew between the broker and local machine clock. 

If the lock silently expires in the prefetch buffer, the message is treated as abandoned and is again made available for retrieval from the queue. Then the message will be fetched again into the prefetch buffer and placed at the end If the prefetch buffer can't usually be worked through during the message expiration, messages are repeatedly prefetched but never effectively delivered in a usable (validly locked) state, and are eventually moved to the dead-letter queue once the maximum delivery count is exceeded.

If an application explicitly abandons a message, the message might again be available for retrieval from the queue. When the prefetch is enabled, the message is fetched into the prefetch buffer again and placed at the end. As the messages from the prefetch buffer are drained in the first-in first-out (FIFO) order, the application might receive messages out of order. For example, the application might receive a message with ID  2 and then a message with ID 1 (that was abandoned earlier) from the buffer. 

If you need a high degree of reliability for message processing, and processing takes significant work and time, we recommend that you use the Prefetch feature conservatively, or not at all. If you need high throughput and message processing is commonly cheap, prefetch yields significant throughput benefits.

The maximum prefetch count and the lock duration configured on the queue or subscription need to be balanced such that the lock timeout at least exceeds the cumulative expected message processing time for the maximum size of the prefetch buffer, plus one message. At the same time, the lock duration shouldn't be so long that messages can exceed their maximum time to live while being locked, as this would mean they get removed if they could not be completed when they were prefetched.

[!INCLUDE [service-bus-track-0-and-1-sdk-support-retirement](../../includes/service-bus-track-0-and-1-sdk-support-retirement.md)]
