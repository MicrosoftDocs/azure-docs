---
title: Use Multiple Azure Service Bus Namespaces to Insulate Applications against Outages and Disasters
description: This article provides patterns to protect applications against a potential Azure Service Bus outage by deploying multiple namespaces.
ms.topic: article
ms.date: 04/29/2024
---

# Use multiple namespaces to insulate applications against Service Bus outages and disasters

Mission-critical applications must operate continuously, even in the presence of unplanned outages or disasters. Resilience against disastrous outages of data processing resources is a requirement for many enterprises and in some cases even required by industry regulations.

> [!NOTE]
> Service Bus Geo‑Disaster Recovery and Geo‑Replication help you recover from large‑scale disasters or permanently abandon a failed Azure region without requiring changes to your application configuration. For more information about these features and how to enable reliability and resiliency in Azure Service Bus, see [Reliability in Azure Service Bus](/azure/reliability/reliability-service-bus?toc=/azure/service-bus-messaging/TOC.json).

If you can't use Geo-Disaster Recovery or Geo-Replication to meet your requirements, you can deploy multiple Service Bus namespaces. This article describes techniques you can use to protect applications against a potential service outage or disaster by using multiple namespaces.

## Replication types

To achieve resilience against disasters with the Service Bus Standard tier, you can use **active** or  **passive** replication. If a queue or topic must remain available during a datacenter outage, create the same entity in both namespaces. The entities can share the same name because they exist in separate namespaces. For example, you can reach a primary queue under **contosoPrimary.servicebus.windows.net/myQueue**, while you can reach its secondary counterpart under **contosoSecondary.servicebus.windows.net/myQueue**.

>[!NOTE]
> The **active replication** and **passive replication** setup are general purpose concepts and not specific features of Service Bus. 
> The replication logic (sending to 2 different namespaces) is in the sender applications and the receiver has to have custom logic for duplicate detection.

If the application doesn't require permanent sender-to-receiver communication, the application can implement a durable client-side queue to prevent message loss and to shield the sender from any transient Service Bus errors.

## Active replication

Active replication uses entities in both namespaces for every operation. Any client that sends a message sends two copies of the same message. The first copy is sent to the primary entity (for example, **contosoPrimary.servicebus.windows.net/sales**), and the second copy of the message is sent to the secondary entity (for example, **contosoSecondary.servicebus.windows.net/sales**).

A client receives messages from both queues. The receiver processes the first copy of a message, and the second copy is suppressed. To suppress duplicate messages, the sender must tag each message with a unique identifier. Both copies of the message must be tagged with the same identifier. You can use the [ServiceBusMessage.MessageId](/dotnet/api/azure.messaging.servicebus.servicebusmessage.messageid) or [ServiceBusMessage.Subject](/dotnet/api/azure.messaging.servicebus.servicebusreceivedmessage.subject) properties, or a custom property to tag the message. The receiver must maintain a list of messages that it already received.

> [!NOTE]
> The active replication approach doubles the number of operations, therefore this approach can lead to higher cost. 

## Passive replication
In the fault-free case, passive replication uses only one of the two messaging entities. A client sends the message to the active entity. If the operation on the active entity fails with an error code that indicates the datacenter that hosts the active entity might be unavailable, the client sends a copy of the message to the backup entity. At that point, the active and the backup entities switch roles. The sending client considers the old active entity to be the new backup entity, and the old backup entity is the new active entity. If both send operations fail, the roles of the two entities remain unchanged, and an error is returned.

A client receives messages from both queues. Because there's a chance that the receiver receives two copies of the same message, the receiver must suppress duplicate messages. You can suppress duplicates in the same way as described for active replication.

In general, passive replication is more economical than active replication because in most cases only one operation is performed. Latency, throughput, and monetary cost are identical to the non-replicated scenario.

When you use passive replication, in the following scenarios, messages can be lost or received twice:

- **Message delay or loss**: Assume that the sender successfully sent a message m1 to the primary queue, and then the queue becomes unavailable before the receiver receives m1. The sender sends a subsequent message m2 to the secondary queue. If the primary queue is temporarily unavailable, the receiver receives m1 after the queue becomes available again. When a disaster happens, the receiver might never receive m1.
- **Duplicate reception**: Assume that the sender sends a message m to the primary queue. Service Bus successfully processes m but fails to send a response. After the send operation times out, the sender sends an identical copy of m to the secondary queue. If the receiver is able to receive the first copy of m before the primary queue becomes unavailable, the receiver receives both copies of m at approximately the same time. If the receiver isn't able to receive the first copy of m before the primary queue becomes unavailable, the receiver initially receives only the second copy of m, but then receives a second copy of m when the primary queue becomes available.

The [Azure Messaging Replication Tasks with .NET Core](https://github.com/Azure-Samples/azure-messaging-replication-dotnet) sample demonstrates replication of messages between namespaces.

## Next steps
To learn more about disaster recovery, see these articles:

* [Azure Service Bus Geo-Disaster Recovery](service-bus-geo-dr.md)
* [Azure Service Bus Geo-Replication](service-bus-geo-replication.md)
* [Azure SQL Database Business Continuity](/azure/azure-sql/database/business-continuity-high-availability-disaster-recover-hadr-overview)
* [Designing resilient applications for Azure](/azure/architecture/framework/resiliency/app-design)
