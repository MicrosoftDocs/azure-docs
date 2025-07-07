---
title: Azure Service Bus message sequencing and timestamps
description: This article explains how to preserve sequencing and ordering (with timestamps) of Azure Service Bus messages.
ms.topic: concept-article
ms.date: 02/04/2025
#customer intent: As an architect or a developer, I want to know how the messages are sequenced (stamped with sequence number) and time-stamped in a queue or a topic in Azure Service Bus. 
---

# Message sequencing and timestamps

Sequencing and timestamping are two features that are always enabled on all Service Bus entities and surface through the `Sequence​Number` and `EnqueuedTimeUtc` properties of received or browsed messages.

For those cases in which absolute order of messages is significant and/or in which a consumer needs a trustworthy unique identifier for messages, the broker stamps messages with a gap-free, increasing sequence number relative to the queue or topic. For partitioned entities, the sequence number is issued relative to the partition.

## Sequence number
The `SequenceNumber` value is a unique 64-bit integer assigned to a message as it is accepted and stored by the broker and functions as its internal identifier. For partitioned entities, the topmost 16 bits reflect the partition identifier. Sequence numbers roll over to zero when the 64-bit or 48-bit (excluding 16 bits for the partition identifier) range is exhausted.

The sequence number can be trusted as a unique identifier since it's assigned by a central and neutral authority and not by clients. It also represents the true order of arrival, and is more precise than a time stamp as an order criterion, because time stamps might not have a high enough resolution at extreme message rates and might be subject to (however minimal) clock skew in situations where the broker ownership transitions between nodes.

The absolute arrival order matters, for example, in business scenarios in which a limited number of offered goods are served on a first-come-first-served basis while supplies last; concert ticket sales are an example.

## Timestamp
The time-stamping capability acts as a neutral and trustworthy authority that accurately captures the UTC time of arrival of a message, reflected in the `EnqueuedTimeUtc` property. The value is useful if a business scenario depends on deadlines, such as whether a work item was submitted on a certain date before midnight, but the processing is far behind the queue backlog.

> [!NOTE]
> Sequence number on its own guarantees the queuing order and the extractor order of messages, but not the processing order, which requires [sessions](message-sessions.md). 
> 
> Say, there are five messages in the queue and two consumers. Consumer 1 picks up message 1. Consumer 2 picks up message 2. Consumer 2 finishes processing message 2 and picks up message 3 while Consumer 1 isn't done with processing message 1 yet. Consumer 2 finishes processing message 3 but consumer 1 is still not done with processing message 1 yet. Finally, consumer 1 completes processing message 1. So, the messages are processed in this order: message 2, message 3, and message 1. If you need message 1, 2, and 3 to be processed in order, you need to use sessions.
> 
> So, if messages just need to be retrieved in order, you don't need to use sessions. If messages need to be processed in order, use sessions. The same session ID should be set on messages that belong together, which could be message 1, 4, and 8 in one set, and 2, 3, and 6 in another set. 
>
> For more information, see [Service Bus message sessions](message-sessions.md).

## Scheduled messages

You can submit messages to a queue or topic for delayed processing; for example, to schedule a job to become available for processing by a system at a certain time. This capability realizes a reliable distributed time-based scheduler.

Scheduled messages don't materialize in the queue until the defined enqueue time. Before that time, scheduled messages can be canceled. Cancellation deletes the message.

You can schedule messages using any of our clients in two ways:

- Use the regular send API, but set the `Scheduled​Enqueue​Time​Utc` property on the message before sending.
- Use the schedule message API, pass both the normal message and the scheduled time. The API returns the scheduled message's `SequenceNumber`, which you can later use to cancel the scheduled message if needed.

> [!NOTE]
> Messages that are larger than 1 MB can only be scheduled using the regular API and setting the `Scheduled​Enqueue​Time​Utc` property.

Scheduled messages and their sequence numbers can also be discovered using [message browsing](message-browsing.md).

The `SequenceNumber` for a scheduled message is only valid while the message is in the scheduled state. As the message transitions to the active state, the message is appended to the queue as if it had been enqueued at the current instant, which includes assigning a new `SequenceNumber`.

Because the feature is anchored on individual messages and messages can only be enqueued once, Service Bus doesn't support recurring schedules for messages.

> [!NOTE]
> - Message enqueuing time doesn't mean that the message is sent at the same time. It's enqueued, but the actual sending time depends on the queue's workload and its state.
> - Due to performance considerations, the activation and cancellation of scheduled messages are independent operations without mutual locking. If a message is in the process of being activated and is simultaneously canceled, the activation process won't be reversed and the message will still be activated. Moreover, it can potentially lead to a negative count of scheduled messages. To minimize this race condition, we recommend that you avoid scheduling activation and cancellation operations in close succession.

### Using scheduled messages with workflows

It's common to see longer-running business workflows that have an explicit time component to them, like 5-minute time-outs for 2-factor authentication, hour-long time-outs for users confirming their email address, and multi-day, week, or month long time components in domains like banking and insurance.

These workflows are often kicked off by the processing of some message, which then stores some state, and then schedules a message to continue the process at a later time. Frameworks like [NServiceBus](https://docs.particular.net/tutorials/nservicebus-sagas/2-timeouts/) and [MassTransit](https://masstransit.io/documentation/configuration/sagas/overview) make it easier to integrate all of these elements together.

## Related content

To learn more about Service Bus messaging, see the following topics:

* [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md)
* [A blog post that describes techniques for reordering messages that arrive out of order](https://particular.net/blog/you-dont-need-ordered-delivery)
