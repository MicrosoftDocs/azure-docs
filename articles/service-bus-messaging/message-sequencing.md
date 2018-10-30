---
title: Azure Service Bus message sequencing and timestamps | Microsoft Docs
description: Preserve Service Bus message sequence and order with timestamps
services: service-bus-messaging
documentationcenter: ''
author: clemensv
manager: timlt
editor: ''

ms.service: service-bus-messaging
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/25/2018
ms.author: spelluru

---

# Message sequencing and timestamps

Sequencing and timestamping are two features that are always enabled on all Service Bus entities and surface through the [Sequence​Number](/dotnet/api/microsoft.servicebus.messaging.brokeredmessage.sequencenumber) and [EnqueuedTimeUtc](/dotnet/api/microsoft.servicebus.messaging.brokeredmessage.enqueuedtimeutc) properties of received or browsed messages.

For those cases in which absolute order of messages is significant and/or in which a consumer needs a trustworthy unique identifier for messages, the broker stamps messages with a gap-free, increasing sequence number relative to the queue or topic. For partitioned entities, the sequence number is issued relative to the partition.

The **SequenceNumber** value is a unique 64-bit integer assigned to a message as it is accepted and stored by the broker and functions as its internal identifier. For partitioned entities, the topmost 16 bits reflect the partition identifier. Sequence numbers roll over to zero when the 48/64-bit range is exhausted.

The sequence number can be trusted as a unique identifier since it is assigned by a central and neutral authority and not by clients. It also represents the true order of arrival, and is more precise than a time stamp as an order criterion, because time stamps may not have a high enough resolution at extreme message rates and may be subject to (however minimal) clock skew in situations where the broker ownership transitions between nodes.

The absolute arrival order matters, for example, in business scenarios in which a limited number of offered goods are served on a first-come-first-served basis while supplies last; concert ticket sales are an example.

The time-stamping capability acts as a neutral and trustworthy authority that accurately captures the UTC time of arrival of a message, reflected in the **EnqueuedTimeUtc** property. The value is useful if a business scenario depends on deadlines, such as whether a work item was submitted on a certain date before midnight, but the processing is far behind the queue backlog.

## Scheduled messages

You can submit messages to a queue or topic for delayed processing; for example, to schedule a job to become available for processing by a system at a certain time. This capability realizes a reliable distributed time-based scheduler.

Scheduled messages do not materialize in the queue until the defined enqueue time. Before that time, scheduled messages can be canceled. Cancellation deletes the message.

You can schedule messages either by setting the [Scheduled​Enqueue​Time​Utc](/dotnet/api/microsoft.azure.servicebus.message.scheduledenqueuetimeutc) property when sending a message through the regular send path, or explicitly with the [ScheduleMessageAsync](/dotnet/api/microsoft.azure.servicebus.queueclient.schedulemessageasync#Microsoft_Azure_ServiceBus_QueueClient_ScheduleMessageAsync_Microsoft_Azure_ServiceBus_Message_System_DateTimeOffset_) API. The latter immediately returns the scheduled message's **SequenceNumber**, which you can later use to cancel the scheduled message if needed. Scheduled messages and their sequence numbers can also be discovered using [message browsing](message-browsing.md).

The **SequenceNumber** for a scheduled message is only valid while the message is in this state. As the message transitions to the active state, the message is appended to the queue as if had been enqueued at the current instant, which includes assigning a new **SequenceNumber**.

Because the feature is anchored on individual messages and messages can only be enqueued once, Service Bus does not support recurring schedules for messages.

## Next steps

To learn more about Service Bus messaging, see the following topics:

* [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md)
* [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)
* [How to use Service Bus topics and subscriptions](service-bus-dotnet-how-to-use-topics-subscriptions.md)