---
title: Azure Service Bus message expiration | Microsoft Docs
description: Expiration and time to live of Azure Service Bus messages
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
ms.date: 01/23/2019
ms.author: aschhab

---

# Message expiration (Time to Live)

The payload in a message, or a command or inquiry that a message conveys to a receiver, is almost always subject to some form of application-level expiration deadline. After such a deadline, the content is no longer delivered, or the requested operation is no longer executed.

For development and test environments in which queues and topics are often used in the context of partial runs of applications or application parts, it's also desirable for stranded test messages to be automatically garbage collected so that the next test run can start clean.

The expiration for any individual message can be controlled by setting the [TimeToLive](/dotnet/api/microsoft.azure.servicebus.message.timetolive#Microsoft_Azure_ServiceBus_Message_TimeToLive) system property, which specifies a relative duration. The expiration becomes an absolute instant when the message is enqueued into the entity. At that time, the [ExpiresAtUtc](/dotnet/api/microsoft.azure.servicebus.message.expiresatutc) property takes on the value [(**EnqueuedTimeUtc**](/dotnet/api/microsoft.servicebus.messaging.brokeredmessage.enqueuedtimeutc#Microsoft_ServiceBus_Messaging_BrokeredMessage_EnqueuedTimeUtc) + [**TimeToLive**)](/dotnet/api/microsoft.azure.servicebus.message.timetolive#Microsoft_Azure_ServiceBus_Message_TimeToLive). The time-to-live (TTL) setting on a brokered message is not enforced when no client is not actively listening.

Past the **ExpiresAtUtc** instant, messages become ineligible for retrieval. The expiration does not affect messages that are currently locked for delivery; those messages are still handled normally. If the lock expires or the message is abandoned, the expiration takes immediate effect.

While the message is under lock, the application might be in possession of a message that has expired. Whether the application is willing to go ahead with processing or chooses to abandon the message is up to the implementer.

## Entity-level expiration

All messages sent into a queue or topic are subject to a default expiration that is set at the entity level with the [defaultMessageTimeToLive](/azure/templates/microsoft.servicebus/namespaces/queues) property and which can also be set in the portal during creation and adjusted later. The default expiration is used for all messages sent to the entity where [TimeToLive](/dotnet/api/microsoft.azure.servicebus.message.timetolive#Microsoft_Azure_ServiceBus_Message_TimeToLive) is not explicitly set. The default expiration also functions as a ceiling for the **TimeToLive** value. Messages that have a longer **TimeToLive** expiration than the default value are silently adjusted to the **defaultMessageTimeToLive** value before being enqueued.

> [!NOTE]
> The default [TimeToLive](/dotnet/api/microsoft.azure.servicebus.message.timetolive#Microsoft_Azure_ServiceBus_Message_TimeToLive) value for a brokered message is [TimeSpan.Max](https://docs.microsoft.com/dotnet/api/system.timespan.maxvalue) if not otherwise specified.
>
> For messaging entities (queues and topics), the default expiration time is also [TimeSpan.Max](https://docs.microsoft.com/dotnet/api/system.timespan.maxvalue) for Service Bus standard and premium tiers.  For the basic tier, the default expiration time is 14 days.

Expired messages can optionally be moved to a [dead-letter queue](service-bus-dead-letter-queues.md) by setting the [EnableDeadLetteringOnMessageExpiration](/dotnet/api/microsoft.servicebus.messaging.queuedescription.enabledeadletteringonmessageexpiration#Microsoft_ServiceBus_Messaging_QueueDescription_EnableDeadLetteringOnMessageExpiration) property, or checking the respective box in the portal. If the option is left disabled, expired messages are dropped. Expired messages moved to the dead-letter queue can be distinguished from other dead-lettered messages by evaluating the [DeadletterReason](service-bus-dead-letter-queues.md#moving-messages-to-the-dlq) property that the broker stores in the user properties section; the value is [TTLExpiredException](service-bus-dead-letter-queues.md#moving-messages-to-the-dlq) in this case.

In the aforementioned case in which the message is protected from expiration while under lock and if the flag is set on the entity, the message is moved to the dead-letter queue as the lock is abandoned or expires. However, it is not moved if the message is successfully settled, which then assumes that the application has successfully handled it, in spite of the nominal expiration.

The combination of [TimeToLive](/dotnet/api/microsoft.azure.servicebus.message.timetolive#Microsoft_Azure_ServiceBus_Message_TimeToLive) and automatic (and transactional) dead-lettering on expiry are a valuable tool for establishing confidence in whether a job given to a handler or a group of handlers under a deadline is retrieved for processing as the deadline is reached.

For example, consider a web site that needs to reliably execute jobs on a scale-constrained backend, and which occasionally experiences traffic spikes or wants to be insulated against availability episodes of that backend. In the regular case, the server-side handler for the submitted user data pushes the information into a queue and subsequently receives a reply confirming successful handling of the transaction into a reply queue. If there is a traffic spike and the backend handler cannot process its backlog items in time, the expired jobs are returned on the dead-letter queue. The interactive user can be notified that the requested operation will take a little longer than usual, and the request can then be put on a different queue for a processing path where the eventual processing result is sent to the user by email. 


## Temporary entities

Service Bus queues, topics, and subscriptions can be created as temporary entities, which are automatically removed when they have not been used for a specified period of time.
 
Automatic cleanup is useful in development and test scenarios in which entities are created dynamically and are not cleaned up after use, due to some interruption of the test or debugging run. It is also useful when an application creates dynamic entities, such as a reply queue, for receiving responses back into a web server process, or into another relatively short-lived object where it is difficult to reliably clean up those entities when the object instance disappears.

The feature is enabled using the [autoDeleteOnIdle](/azure/templates/microsoft.servicebus/namespaces/queues) property. This property is set to the duration for which an entity must be idle (unused) before it is automatically deleted. The minimum value for this property is 5.
 
The **autoDeleteOnIdle** property must be set through an Azure Resource Manager operation or via the .NET Framework client [NamespaceManager](/dotnet/api/microsoft.servicebus.namespacemanager) APIs. You can't set it in the portal.

## Idleness

Here's what considered idleness of entities (queues, topics, and subscriptions):

- Queues
    - No sends  
    - No receives  
    - No updates to the queue  
    - No scheduled messages  
    - No browse/peek 
- Topics  
    - No sends  
    - No updates to the topic  
    - No scheduled messages 
- Subscriptions
    - No receives  
    - No updates to the subscription  
    - No new rules added to the subscription  
    - No browse/peek  
 


## Next steps

To learn more about Service Bus messaging, see the following topics:

* [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md)
* [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)
* [How to use Service Bus topics and subscriptions](service-bus-dotnet-how-to-use-topics-subscriptions.md)