---
title: Auto-forwarding Azure Service Bus messaging entities
description: This article describes how to chain an Azure Service Bus queue or subscription to another queue or topic.
ms.topic: article
ms.date: 07/27/2022
ms.custom: devx-track-csharp, ignite-2022
---

# Chaining Service Bus entities with autoforwarding

The Service Bus *autoforwarding* feature enables you to chain a queue or subscription to another queue or topic that is part of the same namespace. When autoforwarding is enabled, Service Bus automatically removes messages that are placed in the first queue or subscription (source) and puts them in the second queue or topic (destination). It's still possible to send a message to the destination entity directly.

> [!NOTE]
> The basic tier of Service Bus doesn't support the autoforwarding feature. For differences between tiers, see [Service Bus pricing](https://azure.microsoft.com/pricing/details/service-bus/).

The destination entity must exist at the time the source entity is created. If the destination entity doesn't exist, Service Bus returns an exception when asked to create the source entity.

## Scenarios

### Scale out an individual topic
You can use autoforwarding to scale out an individual topic. Service Bus limits the [number of subscriptions on a given topic](service-bus-quotas.md) to 2,000. You can accommodate additional subscriptions by creating second-level topics. Even if you aren't bound by the Service Bus limitation on the number of subscriptions, adding a second level of topics can improve the overall throughput of your topic.

![Diagram of an autoforwarding scenario showing a message processed through an Orders Topic that can branch to any of three second-level Orders Topics.][0]

### Decouple message senders from receivers
You can also use autoforwarding to decouple message senders from receivers. For example, consider an ERP system that consists of three modules: order processing, inventory management, and customer relations management. Each of these modules generates messages that are enqueued into a corresponding topic. Alice and Bob are sales representatives that are interested in all messages that relate to their customers. To receive those messages, Alice and Bob each create a personal queue and a subscription on each of the ERP topics that automatically forward all messages to their queue.

![Diagram of an autoforwarding scenario showing three processing modules sending messages through three corresponding topics to two separate queues.][1]

If Alice goes on vacation, her personal queue, rather than the ERP topic, fills up. In this scenario, because a sales representative hasn't received any messages, none of the ERP topics ever reach quota.

> [!NOTE]
> When autoforwarding is setup, the value for `AutoDeleteOnIdle` on the source entity is automatically set to the maximum value of the data type.
> 
>  - On the source side, autoforwarding acts as a receive operation, so the source that has autoforwarding enabled is never really "idle" and hence it won't be automatically deleted. 
>  - Autoforwarding doesn't make any changes to the destination entity. If `AutoDeleteOnIdle` is enabled on destination entity, the entity is automatically deleted if it's inactive for the specified idle interval. We recommend that you don't enable `AutoDeleteOnIdle` on the destination entity because if the destination entity is deleted, the source entity will continually see exceptions when trying to forward messages that destination. 

## Autoforwarding considerations

- If the destination entity accumulates too many messages and exceeds the quota, or the destination entity is disabled, the source entity adds the messages to its [dead-letter queue](service-bus-dead-letter-queues.md) until there's space in the destination (or the entity is re-enabled). Those messages continue to live in the dead-letter queue, so you must explicitly receive and process them from the dead-letter queue.
- When chaining together individual topics to obtain a composite topic with many subscriptions, it's recommended that you have a moderate number of subscriptions on the first-level topic and many subscriptions on the second-level topics. For example, a first-level topic with 20 subscriptions, each of them chained to a second-level topic with 200 subscriptions, allows for higher throughput than a first-level topic with 200 subscriptions, each chained to a second-level topic with 20 subscriptions.
- Service Bus bills one operation for each forwarded message. For example, sending a message to a topic with 20 subscriptions, each of them configured to autoforward messages to another queue or topic, is billed as 21 operations if all first-level subscriptions receive a copy of the message.
- To create a subscription that is chained to another queue or topic, the creator of the subscription must have **Manage** permissions on both the source and the destination entity. Sending messages to the source topic only requires **Send** permissions on the source topic.
- Don't create a chain that exceeds four hops. Messages that exceed four hops are dead-lettered.
- Autoforwarding isn't supported for session-enabled queues or subscriptions. 
- Source queue tries to forward messages to the destination entity in the same order it received, but the destination could be a topic that doesn't support ordering. If either the source or destination entity is a partitioned entity, order isn't guaranteed.

## Next steps
To learn how to enable or disable auto forwarding in different ways (Azure portal, PowerShell, CLI, Azure Resource Management template, etc.), see [Enable auto forwarding for queues and subscriptions](enable-auto-forward.md).


[0]: ./media/service-bus-auto-forwarding/IC628631.gif
[1]: ./media/service-bus-auto-forwarding/IC628632.gif
[Partitioned messaging entities]: service-bus-partitioning.md
