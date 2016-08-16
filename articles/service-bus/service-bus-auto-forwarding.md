<properties 
    pageTitle="Auto-forwarding Service Bus messaging entities | Microsoft Azure"
    description="How to chain a queue or subscription to another queue or topic."
    services="service-bus"
    documentationCenter="na"
    authors="sethmanheim"
    manager="timlt"
    editor="" /> 
<tags 
    ms.service="service-bus"
    ms.devlang="na"
    ms.topic="article"
    ms.tgt_pltfrm="na"
    ms.workload="na"
    ms.date="05/06/2016"
    ms.author="sethm" />

# Chaining Service Bus entities with auto-forwarding

The *auto-forwarding* feature enables you to chain a queue or subscription to another queue or topic that is part of the same namespace. When auto-forwarding is enabled, Service Bus automatically removes messages that are placed in the first queue or subscription (source) and puts them in the second queue or topic (destination). Note that it is still possible to send a message to the destination entity directly. Also, it is not possible to chain a subqueue, such as a deadletter queue, to another queue or topic.

## Using auto-forwarding

You can enable auto-forwarding by setting the [QueueDescription.ForwardTo][] or [SubscriptionDescription.ForwardTo][] properties on the [QueueDescription][] or [SubscriptionDescription][] objects for the source, as in the following example.

```
SubscriptionDescription srcSubscription = new SubscriptionDescription (srcTopic, srcSubscriptionName);
srcSubscription.ForwardTo = destTopic;
namespaceManager.CreateSubscription(srcSubscription));
```

The destination entity must exist at the time the source entity is created. If the destination entity does not exist, Service Bus returns an exception when asked to create the source entity.

You can use auto-forwarding to scale out an individual topic. Service Bus limits the [number of subscriptions on a given topic](service-bus-quotas.md) to 2,000. You can accommodate additional subscriptions by creating second-level topics. Note that even if you are not bound by the Service Bus limitation on the number of subscriptions, adding a second level of topics can improve the overall throughput of your topic.

![Auto-forwarding scenario][0]

You can also use auto-forwarding to decouple message senders from receivers. For example, consider an ERP system that consists of three modules: Order Processing, Inventory Management, and Customer Relations Management. Each of these modules generates messages that are enqueued into a corresponding topic. Alice and Bob are sales representatives that are interested in all messages that relate to their customers. To receive those messages, Alice and Bob each create a personal queue and a subscription on each of the ERP topics that automatically forward all messages to their queue.

![Auto-forwarding scenario][1]

If Alice goes on vacation, her personal queue, rather than the ERP topic, fills up. In this scenario, because a sales representative has not received any messages, none of the ERP topics ever reach quota.

## Auto-forwarding considerations

If the destination entity has accumulated many messages and exceeds the quota, or the destination entity is disabled, the source entity adds the messages to its [dead-letter queue](service-bus-dead-letter-queues.md) until there is space in the destination (or the entity is re-enabled). Those messages will continue to live in the dead-letter queue, so you must explicitly receive and process them from the dead-letter queue.

When chaining together individual topics to obtain a composite topic with many subscriptions, it is recommended that you have a moderate number of subscriptions on the first-level topic and many subscriptions on the second-level topics. For example, a first-level topic with 20 subscriptions, each of them chained to a second-level topic with 200 subscriptions, allows for higher throughput than a first-level topic with 200 subscriptions, each chained to a second-level topic with 20 subscriptions.

Service Bus bills one operation for each forwarded message. For example, sending a message to a topic with 20 subscriptions, each of them configured to auto-forward messages to another queue or topic, is billed as 21 operations if all first-level subscriptions receive a copy of the message.

To create a subscription that is chained to another queue or topic, the creator of the subscription must have **manage** permissions on both the source and the destination entity. Sending messages to the source topic only requires **send** permissions on the source topic.

## Next steps

For detailed information about auto-forwarding, see the following reference topics:

- [SubscriptionDescription.ForwardTo][]
- [QueueDescription][]
- [SubscriptionDescription][]

To learn more about Service Bus performance improvements, see [Partitioned messaging entities][].

  [QueueDescription.ForwardTo]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.queuedescription.forwardto.aspx
  [SubscriptionDescription.ForwardTo]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.subscriptiondescription.forwardto.aspx
  [QueueDescription]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.queuedescription.aspx
  [SubscriptionDescription]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.subscriptiondescription.aspx
  [0]: ./media/service-bus-auto-forwarding/IC628631.gif
  [1]: ./media/service-bus-auto-forwarding/IC628632.gif
  [Partitioned messaging entities]: service-bus-partitioning.md