---
title: Insulate Azure Service Bus applications against outages and disasters
description: This article provides techniques to protect applications against a potential Azure Service Bus outage.
ms.topic: article
ms.custom: ignite-2022
ms.date: 12/15/2022
---

# Best practices for insulating applications against Service Bus outages and disasters

Mission-critical applications must operate continuously, even in the presence of unplanned outages or disasters. This article describes techniques you can use to protect Service Bus applications against a potential service outage or disaster.

An outage is defined as the temporary unavailability of Azure Service Bus. The outage can affect some components of Service Bus, such as a messaging store, or even the entire datacenter. After the problem has been fixed, Service Bus becomes available again. Typically, an outage doesn't cause loss of messages or other data. An example of a component failure is the unavailability of a particular messaging store. An example of a datacenter-wide outage is a power failure of the datacenter, or a faulty datacenter network switch. An outage can last from a few minutes to a few days.

A disaster is defined as the permanent loss of a Service Bus scale unit or datacenter. The datacenter may or may not become available again. Typically a disaster causes loss of some or all messages or other data. Examples of disasters are fire, flooding, or earthquake.

## Protection against outages and disasters - premium tier
High availability and disaster recovery concepts are built right into the Azure Service Bus **premium** tier, both within the same region (via availability zones) and across different regions (via geo-disaster Recovery).

### Geo-Disaster recovery

Service Bus **premium** tier supports geo-disaster recovery, at the namespace level. For more information, see [Azure Service Bus geo-disaster recovery](service-bus-geo-dr.md). The disaster recovery feature, available for the [Premium SKU](service-bus-premium-messaging.md) only, implements metadata disaster recovery, and relies on primary and secondary namespaces. With geo-disaster recovery, **only metadata** for entities is replicated between primary and secondary namespaces.  

### Availability zones

The Service Bus **premium** tier supports [availability Zones](../availability-zones/az-overview.md), providing fault-isolated locations within the same Azure region. Service Bus manages three copies of messaging store (1 primary and 2 secondary). Service Bus keeps all three copies in sync for data and management operations. If the primary copy fails, one of the secondary copies is promoted to primary with no perceived downtime. If applications see transient disconnects from Service Bus, the [retry logic](/azure/architecture/best-practices/retry-service-specific#service-bus) in the SDK will automatically reconnect to Service Bus. 

When you use availability zones, **both metadata and data (messages)** are replicated across data centers in the availability zone. 

> [!NOTE]
> The availability zones support for the premium tier is only available in [Azure regions](../availability-zones/az-region.md) where availability zones are present.

When you create a premium tier namespace, the support for availability zones (if available in the selected region) is automatically enabled for the namespace. There's no additional cost for using this feature and you can't disable or enable this feature.

## Protection against outages and disasters - standard tier
To achieve resilience against datacenter outages when using the standard messaging pricing tier, Service Bus supports two approaches: **active** and **passive** replication. For each approach, if a given queue or topic must remain accessible in the presence of a datacenter outage, you can create it in both namespaces. Both entities can have the same name. For example, a primary queue can be reached under **contosoPrimary.servicebus.windows.net/myQueue**, while its secondary counterpart can be reached under **contosoSecondary.servicebus.windows.net/myQueue**.

>[!NOTE]
> The **active replication** and **passive replication** setup are general purpose solutions and not specific features of Service Bus. 
> The replication logic (sending to 2 different namespaces) is in the sender applications and the receiver has to have custom logic for duplicate detection.

If the application doesn't require permanent sender-to-receiver communication, the application can implement a durable client-side queue to prevent message loss and to shield the sender from any transient Service Bus errors.

### Active replication
Active replication uses entities in both namespaces for every operation. Any client that sends a message sends two copies of the same message. The first copy is sent to the primary entity (for example, **contosoPrimary.servicebus.windows.net/sales**), and the second copy of the message is sent to the secondary entity (for example, **contosoSecondary.servicebus.windows.net/sales**).

A client receives messages from both queues. The receiver processes the first copy of a message, and the second copy is suppressed. To suppress duplicate messages, the sender must tag each message with a unique identifier. Both copies of the message must be tagged with the same identifier. You can use the [ServiceBusMessage.MessageId](/dotnet/api/azure.messaging.servicebus.servicebusmessage.messageid) or [ServiceBusMessage.Subject](/dotnet/api/azure.messaging.servicebus.servicebusreceivedmessage.subject) properties, or a custom property to tag the message. The receiver must maintain a list of messages that it has already received.

The [geo-replication with Service Bus standard tier][Geo-replication with Service Bus Standard Tier] sample demonstrates active replication of messaging entities.

> [!NOTE]
> The active replication approach doubles the number of operations, therefore this approach can lead to higher cost. 

### Passive replication
In the fault-free case, passive replication uses only one of the two messaging entities. A client sends the message to the active entity. If the operation on the active entity fails with an error code that indicates the datacenter that hosts the active entity might be unavailable, the client sends a copy of the message to the backup entity. At that point, the active and the backup entities switch roles. The sending client considers the old active entity to be the new backup entity, and the old backup entity is the new active entity. If both send operations fail, the roles of the two entities remain unchanged, and an error is returned.

A client receives messages from both queues. Because there's a chance that the receiver receives two copies of the same message, the receiver must suppress duplicate messages. You can suppress duplicates in the same way as described for active replication.

In general, passive replication is more economical than active replication because in most cases only one operation is performed. Latency, throughput, and monetary cost are identical to the non-replicated scenario.

When using passive replication, in the following scenarios, messages can be lost or received twice:

* **Message delay or loss**: Assume that the sender successfully sent a message m1 to the primary queue, and then the queue becomes unavailable before the receiver receives m1. The sender sends a subsequent message m2 to the secondary queue. If the primary queue is temporarily unavailable, the receiver receives m1 after the queue becomes available again. In case of a disaster, the receiver may never receive m1.
* **Duplicate reception**: Assume that the sender sends a message m to the primary queue. Service Bus successfully processes m but fails to send a response. After the send operation times out, the sender sends an identical copy of m to the secondary queue. If the receiver is able to receive the first copy of m before the primary queue becomes unavailable, the receiver receives both copies of m at approximately the same time. If the receiver isn't able to receive the first copy of m before the primary queue becomes unavailable, the receiver initially receives only the second copy of m, but then receives a second copy of m when the primary queue becomes available.

The [Geo-replication with Service Bus standard Tier][Geo-replication with Service Bus Standard Tier] sample demonstrates passive replication of messaging entities.

## Next steps
To learn more about disaster recovery, see these articles:

* [Azure Service Bus Geo-disaster recovery](service-bus-geo-dr.md)
* [Azure SQL Database Business Continuity][Azure SQL Database Business Continuity]
* [Designing resilient applications for Azure][Azure resiliency technical guidance]

[Geo-replication with Service Bus Standard Tier]: https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.ServiceBus.Messaging/GeoReplication
[Azure SQL Database Business Continuity]:/azure/azure-sql/database/business-continuity-high-availability-disaster-recover-hadr-overview
[Azure resiliency technical guidance]: /azure/architecture/framework/resiliency/app-design
