---
title: Insulate Azure Service Bus applications against outages and disasters
description: This articles provides techniques to protect applications against a potential Azure Service Bus outage.
ms.topic: article
ms.date: 06/23/2020
---

# Best practices for insulating applications against Service Bus outages and disasters

Mission-critical applications must operate continuously, even in the presence of unplanned outages or disasters. This article describes techniques you can use to protect Service Bus applications against a potential service outage or disaster.

An outage is defined as the temporary unavailability of Azure Service Bus. The outage can affect some components of Service Bus, such as a messaging store, or even the entire datacenter. After the problem has been fixed, Service Bus becomes available again. Typically, an outage does not cause loss of messages or other data. An example of a component failure is the unavailability of a particular messaging store. An example of a datacenter-wide outage is a power failure of the datacenter, or a faulty datacenter network switch. An outage can last from a few minutes to a few days.

A disaster is defined as the permanent loss of a Service Bus scale unit or datacenter. The datacenter may or may not become available again. Typically a disaster causes loss of some or all messages or other data. Examples of disasters are fire, flooding, or earthquake.

## Protecting against Outages and Disasters - Service Bus Premium
High Availability and Disaster Recovery concepts are built right into the Azure Service Bus Premium tier, both within the same region (via Availability Zones) and across different regions (via Geo-Disaster Recovery).

### Geo-Disaster Recovery

Service Bus Premium supports Geo-disaster recovery, at the namespace level. For more information, see [Azure Service Bus Geo-disaster recovery](service-bus-geo-dr.md). The disaster recovery feature, available for the [Premium SKU](service-bus-premium-messaging.md) only, implements metadata disaster recovery, and relies on primary and secondary disaster recovery namespaces.

### Availability Zones

The Service Bus Premium SKU supports [Availability Zones](../availability-zones/az-overview.md), providing fault-isolated locations within the same Azure region. Service Bus manages three copies of messaging store (1 primary and 2 secondary). Service Bus keeps all the three copies in sync for data and management operations. If the primary copy fails, one of the secondary copies is promoted to primary with no perceived downtime. If the applications see transient disconnects from Service Bus, the retry logic in the SDK will automatically reconnect to Service Bus. 

> [!NOTE]
> The Availability Zones support for Azure Service Bus Premium is only available in [Azure regions](../availability-zones/az-region.md) where availability zones are present.

You can enable Availability Zones on new namespaces only, using the Azure portal. Service Bus does not support migration of existing namespaces. You cannot disable zone redundancy after enabling it on your namespace.

![1][]


## Protecting against Outages and Disasters - Service Bus Standard
To achieve resilience against datacenter outages when using the standard messaging pricing tier, Service Bus supports two approaches: *active* and *passive* replication. For each approach, if a given queue or topic must remain accessible in the presence of a datacenter outage, you can create it in both namespaces. Both entities can have the same name. For example, a primary queue can be reached under **contosoPrimary.servicebus.windows.net/myQueue**, while its secondary counterpart can be reached under **contosoSecondary.servicebus.windows.net/myQueue**.

>[!NOTE]
> The **Active Replication** and **Passive Replication** setup are general purpose solutions and not specific features of Service Bus. 
> The replication logic (sending to 2 different namespaces) lives on the sender applications and the receiver has to have custom logic for duplicate detection.

If the application does not require permanent sender-to-receiver communication, the application can implement a durable client-side queue to prevent message loss and to shield the sender from any transient Service Bus errors.

### Active replication
Active replication uses entities in both namespaces for every operation. Any client that sends a message sends two copies of the same message. The first copy is sent to the primary entity (for example, **contosoPrimary.servicebus.windows.net/sales**), and the second copy of the message is sent to the secondary entity (for example, **contosoSecondary.servicebus.windows.net/sales**).

A client receives messages from both queues. The receiver processes the first copy of a message, and the second copy is suppressed. To suppress duplicate messages, the sender must tag each message with a unique identifier. Both copies of the message must be tagged with the same identifier. You can use the [BrokeredMessage.MessageId][BrokeredMessage.MessageId] or [BrokeredMessage.Label][BrokeredMessage.Label] properties, or a custom property to tag the message. The receiver must maintain a list of messages that it has already received.

The [Geo-replication with Service Bus Standard Tier][Geo-replication with Service Bus Standard Tier] sample demonstrates active replication of messaging entities.

> [!NOTE]
> The active replication approach doubles the number of operations, therefore this approach can lead to higher cost.
> 
> 

### Passive replication
In the fault-free case, passive replication uses only one of the two messaging entities. A client sends the message to the active entity. If the operation on the active entity fails with an error code that indicates the datacenter that hosts the active entity might be unavailable, the client sends a copy of the message to the backup entity. At that point the active and the backup entities switch roles: the sending client considers the old active entity to be the new backup entity, and the old backup entity is the new active entity. If both send operations fail, the roles of the two entities remain unchanged and an error is returned.

A client receives messages from both queues. Because there is a chance that the receiver receives two copies of the same message, the receiver must suppress duplicate messages. You can suppress duplicates in the same way as described for active replication.

In general, passive replication is more economical than active replication because in most cases only one operation is performed. Latency, throughput, and monetary cost are identical to the non-replicated scenario.

When using passive replication, in the following scenarios messages can be lost or received twice:

* **Message delay or loss**: Assume that the sender successfully sent a message m1 to the primary queue, and then the queue becomes unavailable before the receiver receives m1. The sender sends a subsequent message m2 to the secondary queue. If the primary queue is temporarily unavailable, the receiver receives m1 after the queue becomes available again. In case of a disaster, the receiver may never receive m1.
* **Duplicate reception**: Assume that the sender sends a message m to the primary queue. Service Bus successfully processes m but fails to send a response. After the send operation times out, the sender sends an identical copy of m to the secondary queue. If the receiver is able to receive the first copy of m before the primary queue becomes unavailable, the receiver receives both copies of m at approximately the same time. If the receiver is not able to receive the first copy of m before the primary queue becomes unavailable, the receiver initially receives only the second copy of m, but then receives a second copy of m when the primary queue becomes available.

The [Geo-replication with Service Bus Standard Tier][Geo-replication with Service Bus Standard Tier] sample demonstrates passive replication of messaging entities.

## Protecting relay endpoints against datacenter outages or disasters
Geo-replication of [Azure Relay](../service-bus-relay/relay-what-is-it.md) endpoints allows a service that exposes a relay endpoint to be reachable in the presence of Service Bus outages. To achieve geo-replication, the service must create two relay endpoints in different namespaces. The namespaces must reside in different datacenters and the two endpoints must have different names. For example, a primary endpoint can be reached under **contosoPrimary.servicebus.windows.net/myPrimaryService**, while its secondary counterpart can be reached under **contosoSecondary.servicebus.windows.net/mySecondaryService**.

The service then listens on both endpoints, and a client can invoke the service via either endpoint. A client application randomly picks one of the relays as the primary endpoint, and sends its request to the active endpoint. If the operation fails with an error code, this failure indicates that the relay endpoint is not available. The application opens a channel to the backup endpoint and reissues the request. At that point the active and the backup endpoints switch roles: the client application considers the old active endpoint to be the new backup endpoint, and the old backup endpoint to be the new active endpoint. If both send operations fail, the roles of the two entities remain unchanged and an error is returned.

## Next steps
To learn more about disaster recovery, see these articles:

* [Azure Service Bus Geo-disaster recovery](service-bus-geo-dr.md)
* [Azure SQL Database Business Continuity][Azure SQL Database Business Continuity]
* [Designing resilient applications for Azure][Azure resiliency technical guidance]

[Service Bus Authentication]: service-bus-authentication-and-authorization.md
[Partitioned messaging entities]: service-bus-partitioning.md
[Asynchronous messaging patterns and high availability]: service-bus-async-messaging.md#failure-of-service-bus-within-an-azure-datacenter
[BrokeredMessage.MessageId]: /dotnet/api/microsoft.servicebus.messaging.brokeredmessage
[BrokeredMessage.Label]: /dotnet/api/microsoft.servicebus.messaging.brokeredmessage
[Geo-replication with Service Bus Standard Tier]: https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.ServiceBus.Messaging/GeoReplication
[Azure SQL Database Business Continuity]:../azure-sql/database/business-continuity-high-availability-disaster-recover-hadr-overview.md
[Azure resiliency technical guidance]: /azure/architecture/resiliency

[1]: ./media/service-bus-outages-disasters/az.png
