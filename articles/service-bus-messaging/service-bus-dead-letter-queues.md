---
title: Service Bus dead-letter queues | Microsoft Docs
description: Describes dead-letter queues in Azure Service Bus. Service Bus queues and topic subscriptions provide a secondary subqueue, called a dead-letter queue.
ms.topic: article
ms.date: 10/09/2023
ms.custom: "fasttrack-edit, devx-track-csharp"
---

# Overview of Service Bus dead-letter queues

Azure Service Bus queues and topic subscriptions provide a secondary subqueue, called a *dead-letter queue* (DLQ). The dead-letter queue doesn't need to be explicitly created and can't be deleted or managed independent of the main entity.

This article describes dead-letter queues in Service Bus. Much of the discussion is illustrated by the [Dead-Letter queues sample](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/servicebus/Azure.Messaging.ServiceBus/samples/DeadLetterQueue) on GitHub.
 
## The dead-letter queue

The purpose of the dead-letter queue is to hold messages that can't be delivered to any receiver, or messages that couldn't be processed. Messages can then be removed from the DLQ and inspected. An application might, with help of an operator, correct issues and resubmit the message, log the fact that there was an error, and take corrective action. 

From an API and protocol perspective, the DLQ is mostly similar to any other queue, except that messages can only be submitted via the dead-letter operation of the parent entity. In addition, time-to-live isn't observed, and you can't dead-letter a message from a DLQ. The dead-letter queue fully supports peek-lock delivery and transactional operations.

There's no automatic cleanup of the DLQ. Messages remain in the DLQ until you explicitly retrieve them from the DLQ and complete the dead-letter message.


## DLQ message count

It's not possible to obtain count of messages in the dead-letter queue at the topic level. That's because messages don't sit at the topic level. Instead, when a sender sends a message to a topic, the message is forwarded to subscriptions for the topic within milliseconds and thus no longer resides at the topic level. So, you can see messages in the DLQ associated with the subscription for the topic. In the following example, **Service Bus Explorer** shows that there are 62 messages currently in the DLQ for the subscription "test1". 

:::image type="content" source="./media/service-bus-dead-letter-queues/dead-letter-queue-message-count.png" alt-text="Image showing 62 messages in the dead-letter queue.":::

You can also get the count of DLQ messages by using Azure CLI command: [`az servicebus topic subscription show`](/cli/azure/servicebus/topic/subscription#az-servicebus-topic-subscription-show). 

## Moving messages to the DLQ

There are several activities in Service Bus that cause messages to get pushed to the DLQ from within the messaging engine itself. An application can also explicitly move messages to the DLQ. The following two properties (dead-letter reason and dead-letter description) are added to  dead-lettered messages. Applications can define their own codes for the dead-letter reason property, but the system sets the following values.

| Dead-letter reason | Dead-letter error description |
| --- | --- |
| `HeaderSizeExceeded` |The size quota for this stream has been exceeded. |
| `TTLExpiredException` |The message expired and was dead lettered. See the [Time to live](#time-to-live) section for details. |
|Session ID is null. |Session enabled entity doesn't allow a message whose session identifier is null. |
|`MaxTransferHopCountExceeded` | The maximum number of allowed hops when forwarding between queues has been exceeded. This value is set to 4. |
| `MaxDeliveryCountExceeded` | Message couldn't be consumed after maximum delivery attempts. See the [Maximum delivery count](#maximum-delivery-count) section for details. |

## Maximum delivery count

There's a limit on number of attempts to deliver messages for Service Bus queues and subscriptions. The default value is 10. Whenever a message has been delivered under a peek-lock, but has been either explicitly abandoned or the lock has expired, the delivery count on the message is incremented. When the delivery count exceeds the limit, the message is moved to the DLQ. The dead-letter reason for the message in DLQ is set to: `MaxDeliveryCountExceeded`. This behavior can't be disabled, but you can set the max delivery count to a large number.

## Time to live

When you enable dead-lettering on queues or subscriptions, all expiring messages are moved to the DLQ. The dead-letter reason code is set to: `TTLExpiredException`.

Deferred messages won't be purged and moved to the dead-letter queue after they expire. This behavior is by design.

## Errors while processing subscription rules

If you enable dead-lettering on filter evaluation exceptions, any errors that occur while a subscription's SQL filter rule executes are captured in the DLQ along with the offending message. Don't use this option in a production environment in which not all message types have subscribers.

## Application-level dead-lettering

In addition to the system-provided dead-lettering features, applications can use the DLQ to explicitly reject unacceptable messages. They can include messages that can't be properly processed because of any sort of system issue, messages that hold malformed payloads, or messages that fail authentication when some message-level security scheme is used.

This can be done by calling [ServiceBusReceiver.DeadLetterMessageAsync method](/dotnet/api/azure.messaging.servicebus.servicebusreceiver.deadlettermessageasync).

We recommend that you include the type of the exception in the `DeadLetterReason` and the stack trace of the exception in the `DeadLetterDescription` as it makes it easier to troubleshoot the cause of the problem resulting in messages being dead-lettered. Be aware that this might result in some messages exceeding [the 256 KB quota limit for the Standard Tier of Azure Service Bus](./service-bus-quotas.md), further indicating that the Premium Tier is what should be used for production environments.

## Dead-lettering in auto forward scenarios

Messages are sent to the dead-letter queue under the following conditions:

- A message passes through more than four queues or topics that are [chained together](service-bus-auto-forwarding.md).
- The destination queue or topic is disabled or deleted.
- The destination queue or topic exceeds the maximum entity size.

## Dead-lettering in send via scenarios

- If the destination queue or topic is disabled, the message is sent to a transfer dead letter queue (TDLQ) of the source queue.
- If the destination queue or topic is deleted, the 404 exception is raised.
- If the destination queue or entity exceeds the entity size, the message is sent to a TDLQ of the source queue.
 

## Path to the dead-letter queue

You can access the dead-letter queue by using the following syntax:

```
<queue path>/$deadletterqueue
<topic path>/Subscriptions/<subscription path>/$deadletterqueue
```

## Sending dead-lettered messages to be reprocessed

As there can be valuable business data in messages that ended up in the dead-letter queue, it's desirable to have those messages be reprocessed when operators have finished dealing with the circumstances that caused the messages to be dead-lettered in the first place.

Tools like [Azure Service Bus Explorer](./explorer.md) enable manual moving of messages between queues and topics. If there are many messages in the dead-letter queue that need to be moved, [code like this](https://stackoverflow.com/a/68632602/151350) can help move them all at once. Operators often prefer having a user interface so they can troubleshoot which message types have failed processing, from which source queues, and for what reasons, while still being able to resubmit batches of messages to be reprocessed. Tools like [ServicePulse with NServiceBus](https://docs.particular.net/servicepulse/intro-failed-messages) provide these capabilities.

## Next steps

See [Enable dead lettering for a queue or subscription](enable-dead-letter.md) to learn about different ways of configuring the **dead lettering on message expiration** setting.

