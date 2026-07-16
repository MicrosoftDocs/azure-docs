---
title: Message Deferral Overview
description: Learn how message deferral works in Service Bus. Postpone message retrieval when processing isn't possible and retrieve deferred messages later by sequence number.
ms.topic: concept-article
ms.date: 06/12/2026
ai-usage: ai-assisted
#customer intent: As a developer, I want to understand message deferral in Azure Service Bus so that I can handle out-of-order message processing in my workflows.
---

# Message deferral in Azure Service Bus

When a queue or subscription client receives a message that it's willing to process, but processing isn't currently possible due to special circumstances, the client can defer retrieval of the message to a later point. The message remains in the queue or subscription, but it's set aside.

## When to use message deferral

Deferral is a feature created specifically for workflow processing scenarios. Workflow frameworks might require certain operations to be processed in a particular order. They might have to postpone processing of some received messages until prescribed prior work informed by other messages is completed.

A simple illustrative example is an order processing sequence in which a payment notification from an external payment provider appears in a system before the matching purchase order propagates from the storefront to the fulfillment system. In that case, the fulfillment system might defer processing the payment notification until there's an order to associate it with. In rendezvous scenarios, where messages from different sources drive a workflow forward, the real-time execution order might be correct, but the messages reflecting the outcomes might arrive out of order.

Deferral helps reorder messages from the arrival order into an order in which they can be processed, while leaving those messages safely in the message store when processing needs to be postponed.

If a message can't be processed because a particular resource for handling that message is temporarily unavailable but message processing shouldn't be suspended, you can put that message aside for a few minutes. Remember the sequence number in a [scheduled message](message-sequencing.md) to be posted in a few minutes, and re-retrieve the deferred message when the scheduled message arrives. If a message handler depends on a database for all operations and that database is temporarily unavailable, don't use deferral. Instead, suspend receiving messages altogether until the database is available again.

## Retrieve deferred messages

Deferred messages remain in the main queue along with all other active messages (unlike dead-letter messages that live in a subqueue), but they can no longer be received by using the regular receive operations. You can discover deferred messages via [message browsing or peeking](message-browsing.md) if an application loses track of them.

To retrieve a deferred message, the owner is responsible for remembering the **sequence number** when deferring the message. Any receiver that knows the sequence number of a deferred message can later receive the message by using receive methods that take the sequence number as a parameter. For more information about sequence numbers, see [Message sequencing and timestamps](message-sequencing.md).

> [!NOTE]
> Deferred messages don't expire and automatically move to a dead-letter queue until a client app attempts to receive them by using an API and the sequence number. This behavior is by design. When a client tries to retrieve a deferred message, it's checked for the [expired condition](service-bus-dead-letter-queues.md#time-to-live) and moved to a dead-letter queue if it's already expired. An expired message moves to a dead-letter subqueue only when the dead-letter feature is enabled for the entity (queue or subscription).

## Key behaviors of deferred messages

- Deferred messages stay in the main queue, not in a subqueue.
- You must use the message's **sequence number** to retrieve a deferred message.
- Deferred messages can be discovered through [message browsing (peeking)](message-browsing.md).
- Deferred messages don't expire until a client attempts to receive them.
- Expiration check happens only when a client calls a receive API with the sequence number.

## Next steps

Try the samples in the language of your choice to explore Azure Service Bus features.

- [Azure Service Bus client library samples for .NET (latest)](/samples/azure/azure-sdk-for-net/azuremessagingservicebus-samples/) — see the **Settling Messages** sample.
- [Azure Service Bus client library samples for Java (latest)](/samples/azure/azure-sdk-for-java/servicebus-samples/)
- [Azure Service Bus client library samples for Python](/samples/azure/azure-sdk-for-python/servicebus-samples/) — see the `receive_deferred_message_queue.py` sample.
- [Azure Service Bus client library samples for JavaScript](/samples/azure/azure-sdk-for-js/service-bus-javascript/) — see the `advanced/deferral.js` sample.
- [Azure Service Bus client library samples for TypeScript](/samples/azure/azure-sdk-for-js/service-bus-typescript/) — see the `advanced/deferral.ts` sample.

## Related content

- [Tutorial showing the use of message deferral as a part of a workflow, using NServiceBus](https://docs.particular.net/tutorials/nservicebus-sagas/2-timeouts/)
