---
title: Azure Service Bus - message expiration
description: This article explains about expiration and time to live (TTL) of Azure Service Bus messages. After such a deadline, the message is no longer delivered.
ms.topic: conceptual
ms.date: 02/18/2022
ms.custom: contperf-fy22q2
---

# Azure Service Bus - Message expiration (Time to Live)
The payload in a message, or a command or inquiry that a message conveys to a receiver, is almost always subject to some form of application-level expiration deadline. After such a deadline, the content is no longer delivered, or the requested operation is no longer executed.

For development and test environments in which queues and topics are often used in the context of partial runs of applications or application parts, it's also desirable for stranded test messages to be automatically garbage collected so that the next test run can start clean.

> [!NOTE]
> If you aren't familiar with Service Bus concepts yet, see [Service Bus concepts](service-bus-messaging-overview.md#concepts), and [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md).

The expiration for any individual message can be controlled by setting the **time-to-live** system property, which specifies a relative duration. The expiration becomes an absolute instant when the message is enqueued into the entity. At that time, the **expires-at-utc** property takes on the value **enqueued-time-utc** + **time-to-live**. The time-to-live (TTL) setting on a brokered message isn't enforced when there are no clients actively listening.

Past the **expires-at-utc** instant, messages become ineligible for retrieval. The expiration doesn't affect messages that are currently locked for delivery. Those messages are still handled normally. If the lock expires or the message is abandoned, the expiration takes immediate effect. While the message is under lock, the application might be in possession of a message that has expired. Whether the application is willing to go ahead with processing or chooses to abandon the message is up to the implementer.

Extremely low TTL in the order of milliseconds or seconds may cause messages to expire before receiver applications receive it. Consider the highest TTL that works for your application.

## Entity-level expiration
All messages sent into a queue or topic are subject to a default expiration that is set at the entity level. It can also be set in the portal during creation and adjusted later. The default expiration is used for all messages sent to the entity where time-to-live isn't explicitly set. The default expiration also functions as a ceiling for the time-to-live value. Messages that have a longer time-to-live expiration than the default value are silently adjusted to the default message time-to-live value before being enqueued.

> [!NOTE]
> - The default time-to-live value for a brokered message is the largest possible value for a signed 64-bit integer if not otherwise specified.
> - For messaging entities (queues and topics), the default expiration time is also largest possible value for a signed 64-bit integer for [Service Bus standard and premium](service-bus-premium-messaging.md) tiers. For the **basic** tier, the default (also maximum) expiration time is **14 days**.
> - If the topic specifies a smaller TTL than the subscription, the topic TTL is applied.

Expired messages can optionally be moved to a [dead-letter queue](service-bus-dead-letter-queues.md). You can configure this setting programmatically or using the Azure portal. If the option is left disabled, expired messages are dropped. Expired messages moved to the dead-letter queue can be distinguished from other dead-lettered messages by evaluating the [dead-letter reason](service-bus-dead-letter-queues.md#moving-messages-to-the-dlq) property that the broker stores in the user properties section. 

If the message is protected from expiration while under lock and if the flag is set on the entity, the message is moved to the dead-letter queue as the lock is abandoned or expires. However, it isn't moved if the message is successfully settled, which then assumes that the application has successfully handled it, in spite of the nominal expiration. For more information about message locks and settlement, see [Message transfers, locks, and settlement](message-transfers-locks-settlement.md).

The combination of time-to-live and automatic (and transactional) dead-lettering on expiry are a valuable tool for establishing confidence in whether a job given to a handler or a group of handlers under a deadline is retrieved for processing as the deadline is reached.

For example, consider a web site that needs to reliably execute jobs on a scale-constrained backend, and which occasionally experiences traffic spikes or wants to be insulated against availability episodes of that backend. In the regular case, the server-side handler for the submitted user data pushes the information into a queue and subsequently receives a reply confirming successful handling of the transaction into a reply queue. If there is a traffic spike and the backend handler can't process its backlog items in time, the expired jobs are returned on the dead-letter queue. The interactive user can be notified that the requested operation will take a little longer than usual, and the request can then be put on a different queue for a processing path where the eventual processing result is sent to the user by email. 


## Temporary entities

Service Bus queues, topics, and subscriptions can be created as temporary entities, which are automatically removed when they haven't been used for a specified period of time.
 
Automatic cleanup is useful in development and test scenarios in which entities are created dynamically and aren't cleaned up after use, due to some interruption of the test or debugging run. It's also useful when an application creates dynamic entities, such as a reply queue, for receiving responses back into a web server process, or into another relatively short-lived object where it's difficult to reliably clean up those entities when the object instance disappears.

The feature is enabled using the **auto delete on idle** property on the namespace. This property is set to the duration for which an entity must be idle (unused) before it's automatically deleted. The minimum value for this property is 5 minutes.

> [!IMPORTANT] 
> Setting the Azure Resource Manager lock-level to [`CanNotDelete`](../azure-resource-manager/management/lock-resources.md), on the namespace or at a higher level doesn't prevent entities with `AutoDeleteOnIdle` from being deleted. If you don't want the entity to be deleted, set the `AutoDeleteOnIdle` property to `DataTime.MaxValue`.

 
## Idleness

Here's what considered idleness of entities (queues, topics, and subscriptions):

| Entity | What's considered idle | 
| ------ | ---------------------- | 
| Queue | <ul><li>No sends</li><li>No receives</li><li>No updates to the queue</li><li>No scheduled messages</li><li>No browse/peek</li> |
| Topic | <ul><li>No sends</li><li>No updates to the topic</li><li>No scheduled messages</li><li>No operations on the topic's subscriptions (see the next row)</li></ul> |
| Subscription | <ul><li>No receives</li><li>No updates to the subscription</li><li>No new rules added to the subscription</li><li>No browse/peek</li></ul> |

 > [!IMPORTANT] 
> If you have auto forwarding setup on the queue or subscription, that is equivalent to having a receiver peform receives on the queue or subscription and they will not be idle.
 
## SDKs

- To set time-to-live on a message: [.NET](/dotnet/api/azure.messaging.servicebus.servicebusmessage.timetolive), [Java](/java/api/com.azure.messaging.servicebus.servicebusmessage.settimetolive), [Python](/python/api/azure-servicebus/azure.servicebus.servicebusmessage), [JavaScript](/javascript/api/@azure/service-bus/servicebusmessage#@azure-service-bus-servicebusmessage-timetolive)
- To set the default time-to-live on a queue: [.NET](/dotnet/api/azure.messaging.servicebus.administration.createqueueoptions.defaultmessagetimetolive), [Java](/java/api/com.azure.messaging.servicebus.administration.models.createqueueoptions.setdefaultmessagetimetolive), [Python](/python/api/azure-servicebus/azure.servicebus.management.queueproperties), [JavaScript](/javascript/api/@azure/service-bus/queueproperties#@azure-service-bus-queueproperties-defaultmessagetimetolive)
- To set the default time-to-live on a topic: [.NET](/dotnet/api/azure.messaging.servicebus.administration.createtopicoptions.defaultmessagetimetolive), [Java](/java/api/com.azure.messaging.servicebus.administration.models.createtopicoptions.setdefaultmessagetimetolive), [Python](/python/api/azure-servicebus/azure.servicebus.management.topicproperties), [JavaScript](/javascript/api/@azure/service-bus/topicproperties#@azure-service-bus-topicproperties-defaultmessagetimetolive)
- To set the default time-to-live on a subscription: [.NET](/dotnet/api/azure.messaging.servicebus.administration.createsubscriptionoptions.defaultmessagetimetolive), [Java](), [Python](), [JavaScript](/java/api/com.azure.messaging.servicebus.administration.models.createsubscriptionoptions.setdefaultmessagetimetolive), [Python](/python/api/azure-servicebus/azure.servicebus.management.subscriptionproperties), [JavaScript](/javascript/api/@azure/service-bus/subscriptionproperties)
 


## Next steps

To learn more about Service Bus messaging, see the following articles: 

- [Message sequencing and time stamps](message-sequencing.md)
- [Messages, payloads, and serialization](service-bus-messages-payloads.md)
- [Message sessions](message-sessions.md)
- [Duplicate message detection](duplicate-detection.md)
- [Topic filters](topic-filters.md)
- [Message browsing](message-browsing.md)
- [Message transfers, locks, and settlement](message-transfers-locks-settlement.md)
- [Dead-letter queues](service-bus-dead-letter-queues.md)
- [Message deferral](message-deferral.md)
- [Pre-fetch messages](service-bus-prefetch.md)
- [Autoforward messages](service-bus-auto-forwarding.md)
- [Transaction support](service-bus-transactions.md)
- [Geo-disaster recovery](service-bus-geo-dr.md)
- [Asynchronous messaging patterns and high availability](service-bus-async-messaging.md)
- [Handling outages and disasters](service-bus-outages-disasters.md)
- [Throttling](service-bus-throttling.md)
