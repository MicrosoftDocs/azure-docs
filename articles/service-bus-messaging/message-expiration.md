---
title: Azure Service Bus Message Expiration and TTL Explained
description: This article explains about expiration and time to live (TTL) of Azure Service Bus messages. After such a deadline, the message is no longer delivered.
#customer intent: As an Azure Service Bus user, I want to understand how message expiration works so that I can manage message lifecycles effectively.
ms.topic: concept-article
ms.date: 02/10/2026
# Customer intent: As an Azure Service Bus user, developer or architect, I want to know whether the message enqueued expires after a certain amount of time. 
---

# Azure Service Bus - Message expiration (Time to Live)
The payload in a message, or a command or inquiry that a message conveys to a receiver, is almost always subject to some form of application-level expiration deadline. After such a deadline, the content is no longer delivered, or the requested operation is no longer executed. For development and test environments where queues and topics are often used in the context of partial runs of applications or application parts, it's also desirable for stranded test messages to be automatically removed so that the next test run can start clean.

## Time to live and expires at UTC
You can control the expiration for any individual message by setting the **time-to-live** system property, which specifies a relative duration. The expiration becomes an absolute instant when you enqueue the message into the entity. At that time, the **expires-at-utc** property takes on the value **enqueued-time-utc** + **time-to-live**. The time-to-live (TTL) setting on a brokered message isn't enforced when no clients are actively listening.

> [!NOTE]
> The broker might not immediately remove messages that have expired. The broker might choose to lazily expire these messages, based on whether the entity is in active use at the time a message expires. So, you might observe an incorrect message count when using message expiration, and you might even see these messages during a peek operation. However, when receiving messages, the expired message isn't included.

Past the **expires-at-utc** instant, messages become ineligible for retrieval. The expiration doesn't affect messages that are currently locked for delivery. Those messages are still handled normally. If the lock expires or the message is abandoned, the expiration takes immediate effect. While the message is under lock, the application might be in possession of a message that has expired. Whether the application is willing to go ahead with processing or chooses to abandon the message is up to the implementer.

Extremely low TTL in the order of milliseconds or seconds might cause messages to expire before receiver applications receive them. Consider the highest TTL that works for your application.

## Scheduled messages
For [scheduled messages](message-sequencing.md#scheduled-messages), you specify the enqueue time at which you want the message to appear in the queue for retrieval. The time at which the message is sent to Service Bus is different from the time at which the message is enqueued. The message expiration time depends on the enqueued time, not on the time at which the message is sent to Service Bus. Therefore, the **expires-at-utc** is still **enqueued time + time-to-live**. 

For example, if you set the `ScheduledEnqueueTimeUtc` to five minutes from `UtcNow`, and `TimeToLive` to 10 minutes, the message expires after 5 + 10 = 15 minutes from now. The message materializes in the queue after five minutes and the 10-minute counter starts from then.

## Entity-level expiration
All messages sent into a queue or topic are subject to a default expiration that you set at the entity level. You can also set this expiration in the portal during creation and adjust it later. The default expiration applies to all messages sent to the entity where time-to-live isn't explicitly set. The default expiration also functions as a ceiling for the time-to-live value. If a message has a longer time-to-live expiration than the default value, the system silently adjusts it to the default message time-to-live value before enqueuing the message.

The **expires-at-utc** property is by design. If the message TTL isn't set and only the entity TTL is set, **expires-at-utc** is a computed value that's computed in the Receive/Peeklock path but not in the Peek path. If the message has TTL, the system computes **expires-at-utc** when the message is sent and stores it. In this case, Peek returns the correct **expires-at-utc** values.

> [!NOTE]
> - The default time-to-live value for a brokered message is the largest possible value for a signed 64-bit integer if you don't specify otherwise.
> - For messaging entities (queues and topics), the default expiration time is also the largest possible value for a signed 64-bit integer for [Service Bus standard and premium](service-bus-premium-messaging.md) tiers. For the **basic** tier, the default (also maximum) expiration time is **14 days**.
> - If the topic specifies a smaller TTL than the subscription, the topic TTL is applied.

You can optionally move expired messages to a [dead-letter queue](service-bus-dead-letter-queues.md). You can configure this setting programmatically or by using the Azure portal. If you leave the option disabled, expired messages are dropped. You can distinguish expired messages moved to the dead-letter queue from other dead-lettered messages by evaluating the [dead-letter reason](service-bus-dead-letter-queues.md#moving-messages-to-the-dlq) property that the broker stores in the user properties section. 

If the message is protected from expiration while under lock and if the flag is set on the entity, the message is moved to the dead-letter queue as the lock is abandoned or expires. However, the system doesn't move the message if the message is successfully settled. Settlement assumes that the application successfully handled the message, in spite of the nominal expiration. For more information about message locks and settlement, see [Message transfers, locks, and settlement](message-transfers-locks-settlement.md).

The combination of time-to-live and automatic (and transactional) dead-lettering on expiry are valuable tools for establishing confidence in whether a job given to a handler or a group of handlers under a deadline is retrieved for processing as the deadline is reached.

For example, consider a web site that needs to reliably execute jobs on a scale-constrained backend, and which occasionally experiences traffic spikes or wants to be insulated against availability episodes of that backend. In the regular case, the server-side handler for the submitted user data pushes the information into a queue and subsequently receives a reply confirming successful handling of the transaction into a reply queue. If there's a traffic spike and the backend handler can't process its backlog items in time, the expired jobs are returned on the dead-letter queue. The interactive user can be notified that the requested operation takes a little longer than usual, and the request can then be put on a different queue for a processing path where the eventual processing result is sent to the user by email. 

## Temporary entities

You can create Service Bus queues, topics, and subscriptions as temporary entities. The system automatically removes these entities when they aren't used for a specified period of time.
 
Automatic cleanup is useful in development and test scenarios where entities are created dynamically and aren't cleaned up after use due to some interruption of the test or debugging run. It's also useful when an application creates dynamic entities, such as a reply queue, for receiving responses back into a web server process, or into another relatively short-lived object where it's difficult to reliably clean up those entities when the object instance disappears.

Enable the feature by setting the **auto delete on idle** property on the entity. Set this property to the duration for which an entity must be idle (unused) before the system automatically deletes it. The minimum value for this property is 5 minutes.

> [!IMPORTANT] 
> Setting the Azure Resource Manager lock-level to [`CanNotDelete`](../azure-resource-manager/management/lock-resources.md), on the namespace or at a higher level doesn't prevent entities with `AutoDeleteOnIdle` from being deleted. If you don't want the entity to be deleted, set the `AutoDeleteOnIdle` property to `DataTime.MaxValue`.

 
## Idleness

Here's what counts as idleness for entities (queues, topics, and subscriptions):

| Entity | What's considered idle | 
| ------ | ---------------------- | 
| Queue | <ul><li>No sends</li><li>No receives</li><li>No updates to the queue</li><li>No scheduled messages</li><li>No browse or peek</li> |
| Topic | <ul><li>No sends</li><li>No updates to the topic</li><li>No scheduled messages</li><li>No operations on the topic's subscriptions (see the next row)</li></ul> |
| Subscription | <ul><li>No receives</li><li>No updates to the subscription</li><li>No new rules added to the subscription</li><li>No browse or peek</li></ul> |

 > [!IMPORTANT] 
> If you set up auto forwarding on the queue or subscription, it's the same as a receiver performing receives on the queue or subscription. These entities aren't idle.
 
## SDKs
Set the time-to-live property by using Software Development Kits (SDKs). 

- To set time-to-live on a message: [.NET](/dotnet/api/azure.messaging.servicebus.servicebusmessage.timetolive), [Java](/java/api/com.azure.messaging.servicebus.servicebusmessage.settimetolive), [Python](/python/api/azure-servicebus/azure.servicebus.servicebusmessage), [JavaScript](/javascript/api/@azure/service-bus/servicebusmessage#@azure-service-bus-servicebusmessage-timetolive)
- To set the default time-to-live on a queue: [.NET](/dotnet/api/azure.messaging.servicebus.administration.createqueueoptions.defaultmessagetimetolive), [Java](/java/api/com.azure.messaging.servicebus.administration.models.createqueueoptions.setdefaultmessagetimetolive), [Python](/python/api/azure-servicebus/azure.servicebus.management.queueproperties), [JavaScript](/javascript/api/@azure/service-bus/queueproperties#@azure-service-bus-queueproperties-defaultmessagetimetolive)
- To set the default time-to-live on a topic: [.NET](/dotnet/api/azure.messaging.servicebus.administration.createtopicoptions.defaultmessagetimetolive), [Java](/java/api/com.azure.messaging.servicebus.administration.models.createtopicoptions.setdefaultmessagetimetolive), [Python](/python/api/azure-servicebus/azure.servicebus.management.topicproperties), [JavaScript](/javascript/api/@azure/service-bus/topicproperties#@azure-service-bus-topicproperties-defaultmessagetimetolive)
- To set the default time-to-live on a subscription: [.NET](/dotnet/api/azure.messaging.servicebus.administration.createsubscriptionoptions.defaultmessagetimetolive), [Java](), [Python](), [JavaScript](/java/api/com.azure.messaging.servicebus.administration.models.createsubscriptionoptions.setdefaultmessagetimetolive), [Python](/python/api/azure-servicebus/azure.servicebus.management.subscriptionproperties), [JavaScript](/javascript/api/@azure/service-bus/subscriptionproperties)
 


## Related content

If you're not familiar with Service Bus concepts yet, see [Service Bus concepts](service-bus-messaging-overview.md#concepts), and [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md).

To learn about advanced features of Azure Service Bus, see [Overview of advanced features](advanced-features-overview.md). 

