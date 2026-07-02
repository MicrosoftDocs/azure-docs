---
title: Service Bus Dead-Letter Queues
description: Describes dead-letter queues in Azure Service Bus. Service Bus queues and topic subscriptions provide a secondary subqueue, called a dead-letter queue.
ms.topic: concept-article
ms.date: 06/29/2026
ms.custom:
  - "fasttrack-edit, devx-track-csharp"
  - build-2025
#customer intent: As an architect or a developer, I want to understand how dead-lettering of messages work in Azure Service Bus.
---

# Overview of Service Bus dead-letter queues

Azure Service Bus queues and topic subscriptions provide a secondary subqueue, called a _dead-letter queue_ (DLQ). The dead-letter queue doesn't need to be explicitly created and can't be deleted or managed independently of the main entity.

This article describes dead-letter queues in Service Bus. Much of the discussion is illustrated by the [Dead-Letter queues sample](https://github.com/Azure/azure-sdk-for-net/tree/main/samples/servicebus/dead-letter-queue) on GitHub.

## The dead-letter queue

The purpose of the dead-letter queue is to hold messages that can't be delivered to any receiver, or messages that couldn't be processed. Messages can then be removed from the DLQ and inspected. An application might let a user correct issues and resubmit the message.

From an API and protocol perspective, the DLQ is mostly similar to any other queue, except that messages can only be submitted via the dead-letter operation of the parent entity. In addition, time-to-live isn't observed, and you can't dead-letter a message from a DLQ. The dead-letter queue fully supports normal operations such as peek-lock delivery, receive-and-delete, and transactional operations.

There's no automatic cleanup of the DLQ. Messages remain in the DLQ until you explicitly retrieve them from the DLQ and complete the dead-letter message.

## Path to the dead-letter queue

Each queue and each subscription has its own dead-letter sub-queue. You can address it directly by using the following syntax (used by Azure CLI, REST, and tools such as Service Bus Explorer):

```
<queue path>/$deadletterqueue
<topic path>/Subscriptions/<subscription path>/$deadletterqueue
```

When you use the `Azure.Messaging.ServiceBus` .NET library, you don't construct this path yourself. Instead, set `ServiceBusReceiverOptions.SubQueue` to `SubQueue.DeadLetter` when you create the receiver. For an example, see [Receive messages from a dead-letter queue](#receive-messages-from-a-dead-letter-queue).

## Path to the transfer dead-letter queue

When a message can't be forwarded to its destination in auto forward or send via scenarios, the message is placed in the _transfer dead-letter queue_ (TDLQ) of the **source** entity that did the forwarding, not on the destination entity. Each queue or subscription that forwards messages has its own transfer dead-letter subqueue, which you can address directly by using the following syntax:

```
<queue path>/$Transfer/$DeadLetterQueue
<topic path>/Subscriptions/<subscription path>/$Transfer/$DeadLetterQueue
```

When you use the `Azure.Messaging.ServiceBus` .NET library, set `ServiceBusReceiverOptions.SubQueue` to `SubQueue.TransferDeadLetter`. For an example, see [Receive messages from the transfer dead-letter queue](#receive-messages-from-the-transfer-dead-letter-queue).

## DLQ message count

Obtaining the count of messages in the dead-letter queue at the topic level isn't applicable because messages don't sit at the topic level. Instead, when a sender sends a message to a topic, the message is forwarded to subscriptions for the topic within milliseconds and thus no longer resides at the topic level. So, you can see messages in the DLQ associated with the subscription for the topic. In the following example, [Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer) shows that there are 62 messages currently in the DLQ for the subscription: test1.

:::image type="content" source="./media/service-bus-dead-letter-queues/dead-letter-queue-message-count.png" alt-text="62 messages in the dead-letter queue for the test1 subscription.":::

You can also get the count of DLQ messages by using the Azure CLI command [`az servicebus topic subscription show`](/cli/azure/servicebus/topic/subscription#az-servicebus-topic-subscription-show).

## Moving messages to the DLQ

There are several activities in Service Bus that cause messages to get pushed to the DLQ from within the messaging engine itself. An application can also explicitly move messages to the DLQ. The following two properties (dead-letter reason and dead-letter description) are added to dead-lettered messages. Applications can define their own codes for the dead-letter reason property, but the system sets the following values.

| Dead-letter reason            | Dead-letter error description                 |
| ------------------- | ---------------------- |
| `HeaderSizeExceeded`          | The size quota for this stream exceeded the limit.                                                                                           |
| `TTLExpiredException`         | The message expired and was dead-lettered. See the [Time to live](#time-to-live) section for details.                                        |
| `Session ID is null`          | Session enabled entity doesn't allow a message whose session identifier is null.                                                             |
| `MaxTransferHopCountExceeded` | The maximum number of allowed hops when forwarding between queues exceeded the limit. This value is set to 4.                                |
| `MaxDeliveryCountExceeded`    | Message couldn't be consumed after maximum delivery attempts. See the [Maximum delivery count](#maximum-delivery-count) section for details. |

## Time to live

When you enable dead-lettering on queues or subscriptions, all expiring messages are moved to the DLQ. The dead-letter reason code is set to `TTLExpiredException`. Deferred messages won't be purged and moved to the dead-letter queue after they expire. This behavior is by design.

## Maximum delivery count

There's a limit on the number of attempts to deliver messages for Service Bus queues and subscriptions. The default value is 10. Whenever a message is delivered under a peek-lock, but is either explicitly abandoned or the lock has expired, the delivery count on the message is incremented. When the delivery count exceeds the limit, the message is moved to the DLQ. The dead-letter reason for the message in DLQ is set to `MaxDeliveryCountExceeded`. This behavior can't be disabled, but you can set the max delivery count to a large number.

## Errors while processing subscription rules

If you enable dead-lettering on filter evaluation exceptions, any errors that occur while a subscription's SQL filter rule executes are captured in the DLQ along with the offending message. Don't use this option in a production environment where you have message types that are sent to the topic, which don't have subscribers, as it may result in a large load of DLQ messages. As such, ensure that all messages sent to the topic have at least one matching subscription.

## Application-level dead-lettering

In addition to the system-provided dead-lettering features, applications can use the DLQ to explicitly reject unacceptable messages. Unacceptable messages can include messages that can't be properly processed because of any sort of system issue, messages that hold malformed payloads, or messages that fail authentication when some message-level security scheme is used.

In .NET, call the [ServiceBusReceiver.DeadLetterMessageAsync method](/dotnet/api/azure.messaging.servicebus.servicebusreceiver.deadlettermessageasync).

We recommend that you include the type of the exception in the `DeadLetterReason` and the stack trace of the exception in the `DeadLetterDescription` as it makes it easier to troubleshoot the cause of the problem resulting in messages being dead-lettered. It might result in some messages exceeding [the 256 KB quota limit for the Standard tier of Azure Service Bus](./service-bus-quotas.md). You can [upgrade your Service Bus namespace from the standard tier to the premium tier](service-bus-migrate-standard-premium.md) to have higher [quotas and limits](service-bus-quotas.md).

## Receive messages from a dead-letter queue

To receive a dead-lettered message with the `Azure.Messaging.ServiceBus` .NET library, set `ServiceBusReceiverOptions.SubQueue` to `SubQueue.DeadLetter` when you create the receiver. The library handles addressing the dead-letter sub-queue for you.

```csharp
using Azure.Identity;
using Azure.Messaging.ServiceBus;

string fullyQualifiedNamespace = "<NAMESPACE-NAME>.servicebus.windows.net";
string queueName = "<QUEUE-NAME>";

// 1. Create the top-level client. Passwordless authentication is recommended.
await using var client = new ServiceBusClient(fullyQualifiedNamespace, new DefaultAzureCredential());

// 2. Configure options to target the dead-letter sub-queue.
var options = new ServiceBusReceiverOptions
{
    SubQueue = SubQueue.DeadLetter
};

// 3. Create a receiver scoped to the dead-letter queue. For a subscription's
//    dead-letter queue, use: client.CreateReceiver(topicName, subscriptionName, options).
ServiceBusReceiver dlqReceiver = client.CreateReceiver(queueName, options);

// 4. Receive a dead-lettered message.
ServiceBusReceivedMessage dlqMessage = await dlqReceiver.ReceiveMessageAsync();

// 5. Inspect why the message was dead-lettered.
string reason = dlqMessage.DeadLetterReason;
string description = dlqMessage.DeadLetterErrorDescription;

// 6. Complete the message to remove it from the dead-letter queue.
await dlqReceiver.CompleteMessageAsync(dlqMessage);
```

The same pattern works for the transfer dead-letter queue by using `SubQueue.TransferDeadLetter`. For a complete example, see [Receive messages from the transfer dead-letter queue](#receive-messages-from-the-transfer-dead-letter-queue).

## Dead-lettering in auto forward scenarios

Messages are sent to the dead-letter queue under the following conditions:

- A message passes through more than four queues or topics that are [chained together](service-bus-auto-forwarding.md).
- The destination queue or topic is disabled or deleted.
- The destination queue or topic exceeds the maximum entity size.

## Dead-lettering in send via scenarios

- If the destination queue or topic is disabled, the message is sent to the transfer dead-letter queue (TDLQ) of the source queue.
- If the destination queue or entity exceeds the entity size, the message is sent to a TDLQ of the source queue.

You can check how many messages are waiting in the transfer dead-letter queue by reading the `TransferDeadLetterMessageCount` runtime property of the source entity. For more information, see [Message count details](message-counters.md).

## Receive messages from the transfer dead-letter queue

The transfer dead-letter queue is a sub-queue of the source entity, so you receive from it the same way you receive from a regular dead-letter queue: scope the receiver to the source queue (or the source topic subscription) and select the transfer dead-letter sub-queue.

When you use the `Azure.Messaging.ServiceBus` .NET library, set `ServiceBusReceiverOptions.SubQueue` to `SubQueue.TransferDeadLetter` when you create the receiver. The library addresses the transfer dead-letter sub-queue for you.

```csharp
using Azure.Identity;
using Azure.Messaging.ServiceBus;

string fullyQualifiedNamespace = "<NAMESPACE-NAME>.servicebus.windows.net";

// The source queue that forwards messages. The transfer dead-letter queue
// lives on this entity, not on the destination.
string sourceQueueName = "<SOURCE-QUEUE-NAME>";

// 1. Create the top-level client. Passwordless authentication is recommended.
await using var client = new ServiceBusClient(fullyQualifiedNamespace, new DefaultAzureCredential());

// 2. Configure options to target the transfer dead-letter sub-queue.
var options = new ServiceBusReceiverOptions
{
    SubQueue = SubQueue.TransferDeadLetter
};

// 3. Create a receiver scoped to the source entity's transfer dead-letter queue.
//    For a subscription that forwards, use:
//    client.CreateReceiver(topicName, subscriptionName, options).
ServiceBusReceiver tdlqReceiver = client.CreateReceiver(sourceQueueName, options);

// 4. Receive a message that failed to transfer to its destination.
ServiceBusReceivedMessage tdlqMessage = await tdlqReceiver.ReceiveMessageAsync();

// 5. Inspect why the message couldn't be transferred.
string reason = tdlqMessage.DeadLetterReason;
string description = tdlqMessage.DeadLetterErrorDescription;

// 6. Complete the message to remove it from the transfer dead-letter queue.
await tdlqReceiver.CompleteMessageAsync(tdlqMessage);
```

## Sending dead-lettered messages to be reprocessed

Once you resolve the issue that caused a message to be dead-lettered, you can resubmit it to the queue or topic to be reprocessed. The simplest approach is to use [Service Bus Explorer in the Azure portal](./explorer.md#resend-a-message), which lets you peek messages in the dead-letter queue, edit their content or properties if needed, and resend them - individually or in batches. Operators often prefer this UI because it surfaces which message types failed, from which source entities, and why, while still allowing batch resubmission.

## Related content

See [Enable dead lettering for a queue or subscription](enable-dead-letter.md) to learn about different ways of configuring the **dead lettering on message expiration** setting.
