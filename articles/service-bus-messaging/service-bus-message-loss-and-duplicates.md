---
title: Prevent message loss and duplicate processing in Azure Service Bus
description: Understand Azure Service Bus delivery guarantees, when messages can be lost or processed more than once, and the patterns that prevent it.
ms.topic: concept-article
ms.date: 06/26/2026
ms.devlang: csharp
---

# Prevent message loss and duplicate processing in Azure Service Bus

Messages that seem missing or processed twice usually result from how an application receives and settles messages and how you configure its entities. This article explains the delivery guarantees, where messages go when they seem lost, and the patterns that prevent both loss and duplicate processing.

## Delivery guarantees

The delivery guarantee depends on the receive mode you choose. **Peek lock** provides at-least-once delivery, and **receive and delete** provides at-most-once delivery. In both modes, Azure Service Bus durably retains a successfully sent message until it's delivered. The receive mode determines whether the residual risk is a duplicate or a loss.

The receive mode determines the trade-off between the risk of loss and the risk of duplicates:

| Receive mode | Behavior | Risk |
|--------------|----------|------|
| **Peek lock** (default) | The message is locked, then removed only after you settle it (complete). If the consumer fails before completing, the lock expires and the message is delivered again. | Possible duplicate processing |
| **Receive and delete** | The message is removed as soon as it's delivered. | Possible message loss if the consumer fails before processing |

Use **peek lock** for any workload where losing a message is unacceptable. Use **receive and delete** only when occasional loss is acceptable in exchange for higher throughput. For details, see [Message transfers, locks, and settlement](message-transfers-locks-settlement.md).

## Where "missing" messages actually go

A message that seems to disappear is usually still accounted for. Check these possibilities before concluding it was lost:

- **Dead-letter queue.** The system moves messages to the dead-letter queue when they exceed the maximum delivery count, when their time to live expires (if dead-lettering on expiration is enabled), or when a subscription filter evaluation fails. Inspect the dead-letter queue and the `DeadLetterReason` property. See [Dead-letter queues](service-bus-dead-letter-queues.md).
- **Transfer dead-letter queue.** When a message is autoforwarded (or sent through a transfer queue) and can't be delivered to the destination entity, the system places it in the transfer dead-letter queue of the *source* entity, not the destination. Check the source entity's transfer dead-letter queue. See [Dead-letter queues](service-bus-dead-letter-queues.md).
- **Time to live expiry.** A message whose time to live elapses before it's received is removed (and dead-lettered when that option is enabled). See [Message expiration](message-expiration.md).
- **A different receiver.** With competing consumers, another receiver might already have processed the message.
- **No matching subscription filter.** For topics, a message is copied only to the subscriptions whose filters match it. If no subscription filter matches, the message isn't delivered to any subscription.
- **Receive and delete loss.** If you use receive-and-delete mode and the consumer crashes mid-processing, the message is gone. Switch to peek lock.

## Why messages are processed more than once

When you use peek lock, the same message can be delivered again in these situations:

- **Lock lost before settlement.** If processing takes longer than the lock duration, or the AMQP link is detached (transient network issue or the 10-minute idle timeout) before you complete the message, the lock is lost and the message is redelivered. See [MessageLockLost in the exceptions reference](service-bus-messaging-exceptions-latest.md).
- **Retry after a successful-but-unacknowledged operation.** A transient failure can cause a send or settle to be retried even though the service already applied it.
- **Consumer restarts.** A consumer that restarts before settling in-flight messages receives them again.

## Patterns that prevent loss and duplicates

Apply these together:

1. **Use peek lock and settle explicitly.** Complete a message only after processing succeeds. On failure, abandon or dead-letter it deliberately.
1. **Right-size the lock duration and renew when needed.** Keep processing shorter than the lock duration, or renew the lock for legitimately long work. Avoid oversized prefetch that locks more messages than you can process in time. See [Prefetch messages](service-bus-prefetch.md).
1. **Make processing idempotent.** Because peek lock can redeliver a message, design consumers so that processing the same message twice has no additional effect - for example, key downstream writes on the `MessageId` or a business identifier.
1. **Enable duplicate detection for send-side retries.** Duplicate detection discards messages with a repeated `MessageId` within a configured window, which protects against duplicate sends. It doesn't replace idempotent processing on the receive side. See [Duplicate detection](duplicate-detection.md).
1. **Use sessions when order matters.** For first-in, first-out processing and per-key ordering, use [message sessions](message-sessions.md).
1. **Handle timeouts correctly.** A timed-out send may have succeeded; combine duplicate detection with idempotent consumers so a retried send doesn't create a duplicate. See [Handle timeouts and configure retries](service-bus-timeouts-retries.md).

## Related content

- [Dead-letter queues](service-bus-dead-letter-queues.md)
- [Duplicate detection](duplicate-detection.md)
- [Message expiration](message-expiration.md)
- [Message transfers, locks, and settlement](message-transfers-locks-settlement.md)
- [Message sessions](message-sessions.md)
- [Handle timeouts and configure retries](service-bus-timeouts-retries.md)
