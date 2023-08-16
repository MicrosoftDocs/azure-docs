---
title: Azure Service Bus messaging - advanced features
description: This article provides a high-level overview of advanced features in Azure Service Bus. 
ms.topic: overview
ms.date: 06/08/2023
---

# Azure Service Bus - advanced features
Service Bus includes advanced features that enable you to solve more complex messaging problems. This article describes several of these features.

## Message sessions
To create a first-in, first-out (FIFO) guarantee in Service Bus, use sessions. Message sessions enable exclusive, ordered handling of unbounded sequences of related messages. To allow for handling sessions in high-scale, high-availability systems, the session feature also allows for storing session state, which allows sessions to safely move between handlers. For more information, see [Message sessions: first in, first out (FIFO)](message-sessions.md).

## Autoforwarding
The autoforwarding feature chains a queue or subscription to another queue or topic inside the same namespace. When you use this feature, Service Bus automatically moves messages from a queue or subscription to a target queue or topic. All such moves are done transactionally. For more information, see [Chaining Service Bus entities with autoforwarding](service-bus-auto-forwarding.md).

## Dead-letter queue
All Service Bus queues and topics' subscriptions have associated dead-letter queues (DLQ). A DLQ holds messages that meet the following criteria: 

- They can't be delivered successfully to any receiver.
- They timed out.
- They're explicitly sidelined by the receiving application. 

Messages in the dead-letter queue are annotated with the reason why they've been placed there. The dead-letter queue has a special endpoint, but otherwise acts like any regular queue. An application or tool can browse a DLQ or dequeue from it. You can also autoforward out of a dead-letter queue. For more information, see [Overview of Service Bus dead-letter queues](service-bus-dead-letter-queues.md).

## Scheduled delivery
You can submit messages to a queue or a topic for delayed processing, setting a time when the message becomes available for consumption. Scheduled messages can also be canceled. For more information, see [Scheduled messages](message-sequencing.md#scheduled-messages).

## Message deferral
A queue or subscription client can defer retrieval of a received message until a later time. The message may have been posted out of an expected order and the client wants to wait until it receives another message. Deferred messages remain in the queue or subscription and must be reactivated explicitly using their service-assigned sequence number. For more information, see [Message deferral](message-deferral.md).

## Transactions
A transaction groups two or more operations together into an execution scope. Service Bus allows you to group operations against multiple messaging entities within the scope of a single transaction. A message entity can be a queue, topic, or subscription. For more information, see [Overview of Service Bus transaction processing](service-bus-transactions.md).

## Autodelete on idle
Autodelete on idle enables you to specify an idle interval after which a queue or topic subscription is automatically deleted. The interval is reset when a message is added to or removed from the subscription. The minimum duration is 5 minutes. For an overview on what is considered as idleness for entities, please check [Idleness](message-expiration.md#idleness).

## Duplicate detection
The duplicate detection feature enables the sender to resend the same message again and for the broker to drop a potential duplicate. For more information, see [Duplicate detection](duplicate-detection.md).

## Support ordering
The **Support ordering** feature allows you to specify whether messages that are sent to a topic are forwarded to the subscription in the same order in which they were sent. This feature doesn't support partitioned topics. For more information, see [TopicProperties.SupportOrdering](/dotnet/api/azure.messaging.servicebus.administration.topicproperties.supportordering) in .NET or [TopicProperties.setOrderingSupported](/java/api/com.azure.messaging.servicebus.administration.models.topicproperties.setorderingsupported) in Java.

## Geo-disaster recovery
When an Azure region experiences downtime, the disaster recovery feature enables message processing to continue operating in a different region or data center. The feature keeps a structural mirror of a namespace available in the secondary region and allows the namespace identity to switch to the secondary namespace. Already posted messages remain in the former primary namespace for recovery once the availability episode subsides. For more information, see [Azure Service Bus Geo-disaster recovery](service-bus-geo-dr.md).

## Security
Service Bus supports standard [AMQP 1.0](service-bus-amqp-overview.md) and [HTTP or REST](/rest/api/servicebus/) protocols and their respective security facilities, including transport-level security (TLS). Clients can be authorized for access using [Shared Access Signature](service-bus-sas.md) or [Azure Active Directory](service-bus-authentication-and-authorization.md) role-based security. 

For protection against unwanted traffic, Service Bus provides [security features](network-security.md) such as IP firewall and integration with virtual networks. 

## Next steps
See [Service Bus messaging samples](service-bus-samples.md) that show how to use these Service Bus features.
