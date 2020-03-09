---
title: Azure Service Bus prefetch messages | Microsoft Docs
description: Improve performance by prefetching Azure Service Bus messages. Messages are readily available for local retrieval before the application requests for them.
services: service-bus-messaging
documentationcenter: ''
author: axisc
manager: timlt
editor: spelluru

ms.service: service-bus-messaging
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/24/2020
ms.author: aschhab

---

# Prefetch Azure Service Bus messages

When *Prefetch* is enabled in any of the official Service Bus clients, the receiver quietly acquires more messages, up to the [PrefetchCount](/dotnet/api/microsoft.azure.servicebus.queueclient.prefetchcount#Microsoft_Azure_ServiceBus_QueueClient_PrefetchCount) limit, beyond what the application initially asked for.

A single initial [Receive](/dotnet/api/microsoft.servicebus.messaging.queueclient.receive) or [ReceiveAsync](/dotnet/api/microsoft.azure.servicebus.core.messagereceiver.receiveasync) call therefore acquires a message for immediate consumption that is returned as soon as available. The client then acquires further messages in the background, to fill the prefetch buffer.

## Enable prefetch

With .NET, you enable the Prefetch feature by setting the [PrefetchCount](/dotnet/api/microsoft.azure.servicebus.queueclient.prefetchcount#Microsoft_Azure_ServiceBus_QueueClient_PrefetchCount) property of a **MessageReceiver**, **QueueClient**, or **SubscriptionClient** to a number greater than zero. Setting the value to zero turns off prefetch.

You can easily add this setting to the receive-side of the [QueuesGettingStarted](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.ServiceBus.Messaging/QueuesGettingStarted) or [ReceiveLoop](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.ServiceBus.Messaging/ReceiveLoop) samples' settings to see the effect in those contexts.

While messages are available in the prefetch buffer, any subsequent **Receive**/**ReceiveAsync** calls are immediately fulfilled from the buffer, and the buffer is replenished in the background as space becomes available. If there are no messages available for delivery, the receive operation empties the buffer and then waits or blocks, as expected.

Prefetch also works in the same way with the [OnMessage](/dotnet/api/microsoft.servicebus.messaging.queueclient.onmessage) and [OnMessageAsync](/dotnet/api/microsoft.servicebus.messaging.queueclient.onmessageasync) APIs.

## If it is faster, why is Prefetch not the default option?

Prefetch speeds up the message flow by having a message readily available for local retrieval when and before the application asks for one. This throughput gain is the result of a trade-off that the application author must make explicitly:

With the [ReceiveAndDelete](/dotnet/api/microsoft.servicebus.messaging.receivemode) receive mode, all messages that are acquired into the prefetch buffer are no longer available in the queue, and only reside in the in-memory prefetch buffer until they are received into the application through the **Receive**/**ReceiveAsync** or **OnMessage**/**OnMessageAsync** APIs. If the application terminates before the messages are received into the application, those messages are irrecoverably lost.

In the [PeekLock](/dotnet/api/microsoft.servicebus.messaging.receivemode#Microsoft_ServiceBus_Messaging_ReceiveMode_PeekLock) receive mode, messages fetched into the Prefetch buffer are acquired into the buffer in a locked state, and have the timeout clock for the lock ticking. If the prefetch buffer is large, and processing takes so long that message locks expire while residing in the prefetch buffer or even while the application is processing the message, there might be some confusing events for the application to handle.

The application might acquire a message with an expired or imminently expiring lock. If so, the application might process the message, but then find that it cannot complete it due to a lock expiration. The application can check the [LockedUntilUtc](/dotnet/api/microsoft.azure.servicebus.message.systempropertiescollection.lockeduntilutc) property (which is subject to clock skew between the broker and local machine clock). If the message lock has expired, the application must ignore the message; no API call on or with the message should be made. If the message is not expired but expiration is imminent, the lock can be renewed and extended by another default lock period by calling [message.RenewLock()](/dotnet/api/microsoft.azure.servicebus.core.messagereceiver.renewlockasync#Microsoft_Azure_ServiceBus_Core_MessageReceiver_RenewLockAsync_System_String_)

If the lock silently expires in the prefetch buffer, the message is treated as abandoned and is again made available for retrieval from the queue. That might cause it to be fetched into the prefetch buffer; placed at the end. If the prefetch buffer cannot usually be worked through during the message expiration, this causes messages to be repeatedly prefetched but never effectively delivered in a usable (validly locked) state, and are eventually moved to the dead-letter queue once the maximum delivery count is exceeded.

If you need a high degree of reliability for message processing, and processing takes significant work and time, it is recommended that you use the prefetch feature conservatively, or not at all.

If you need high throughput and message processing is commonly cheap, prefetch yields significant throughput benefits.

The maximum prefetch count and the lock duration configured on the queue or subscription need to be balanced such that the lock timeout at least exceeds the cumulative expected message processing time for the maximum size of the prefetch buffer, plus one message. At the same time, the lock timeout ought not to be so long that messages can exceed their maximum [TimeToLive](/dotnet/api/microsoft.azure.servicebus.message.timetolive#Microsoft_Azure_ServiceBus_Message_TimeToLive) when they are accidentally dropped, thus requiring their lock to expire before being redelivered.

## Next steps

To learn more about Service Bus messaging, see the following topics:

* [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md)
* [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)
* [How to use Service Bus topics and subscriptions](service-bus-dotnet-how-to-use-topics-subscriptions.md)
