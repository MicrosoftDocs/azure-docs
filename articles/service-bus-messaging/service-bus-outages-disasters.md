---
title: Insulating Azure Service Bus applications against outages and disasters | Microsoft Docs
description: Techniques to protect applications against a potential Service Bus outage.
services: service-bus-messaging
author: spelluru
manager: timlt

ms.service: service-bus-messaging
ms.topic: article
ms.date: 09/14/2018
ms.author: spelluru

---

# Best practices for insulating applications against Service Bus outages and disasters

Mission-critical applications must operate continuously, even in the presence of unplanned outages or disasters. This article describes techniques you can use to protect Service Bus applications against a potential service outage or disaster.

An outage is defined as the temporary unavailability of Azure Service Bus. The outage can affect some components of Service Bus, such as a messaging store, or even the entire datacenter. After the problem has been fixed, Service Bus becomes available again. Typically, an outage does not cause loss of messages or other data. An example of a component failure is the unavailability of a particular messaging store. An example of a datacenter-wide outage is a power failure of the datacenter, or a faulty datacenter network switch. An outage can last from a few minutes to a few days.

A disaster is defined as the permanent loss of a Service Bus scale unit or datacenter. The datacenter may or may not become available again. Typically a disaster causes loss of some or all messages or other data. Examples of disasters are fire, flooding, or earthquake.

## Current architecture
Service Bus uses multiple messaging stores to store messages that are sent to queues or topics. A non-partitioned queue or topic is assigned to one messaging store. If this messaging store is unavailable, all operations on that queue or topic will fail.

All Service Bus messaging entities (queues, topics, relays) reside in a service namespace, which is affiliated with a datacenter. Service Bus now supports [*Geo-disaster recovery* and *Geo-replication*](service-bus-geo-dr.md) at the namespace level.

## Protecting queues and topics against messaging store failures
A non-partitioned queue or topic is assigned to one messaging store. If this messaging store is unavailable, all operations on that queue or topic will fail. A partitioned queue, on the other hand, consists of multiple fragments. Each fragment is stored in a different messaging store. When a message is sent to a partitioned queue or topic, Service Bus assigns the message to one of the fragments. If the corresponding messaging store is unavailable, Service Bus writes the message to a different fragment, if possible. Partitioned entities are no longer supported in the [Premium SKU](service-bus-premium-messaging.md). 

For more information about partitioned entities, see [Partitioned messaging entities][Partitioned messaging entities].

## Protecting against datacenter outages or disasters
To allow for a failover between two datacenters, you can create a Service Bus service namespace in each datacenter. For example, the Service Bus service namespace **contosoPrimary.servicebus.windows.net** might be located in the United States North/Central region, and **contosoSecondary.servicebus.windows.net** might be located in the US South/Central region. If a Service Bus messaging entity must remain accessible in the presence of a datacenter outage, you can create that entity in both namespaces.

For more information, see the "Failure of Service Bus within an Azure datacenter" section in [Asynchronous messaging patterns and high availability][Asynchronous messaging patterns and high availability].

## Protecting relay endpoints against datacenter outages or disasters
Geo-replication of relay endpoints allows a service that exposes a relay endpoint to be reachable in the presence of Service Bus outages. To achieve geo-replication, the service must create two relay endpoints in different namespaces. The namespaces must reside in different datacenters and the two endpoints must have different names. For example, a primary endpoint can be reached under **contosoPrimary.servicebus.windows.net/myPrimaryService**, while its secondary counterpart can be reached under **contosoSecondary.servicebus.windows.net/mySecondaryService**.

The service then listens on both endpoints, and a client can invoke the service via either endpoint. A client application randomly picks one of the relays as the primary endpoint, and sends its request to the active endpoint. If the operation fails with an error code, this failure indicates that the relay endpoint is not available. The application opens a channel to the backup endpoint and reissues the request. At that point the active and the backup endpoints switch roles: the client application considers the old active endpoint to be the new backup endpoint, and the old backup endpoint to be the new active endpoint. If both send operations fail, the roles of the two entities remain unchanged and an error is returned.

## Protecting queues and topics against datacenter outages or disasters
To achieve resilience against datacenter outages when using brokered messaging, Service Bus supports two approaches: *active* and *passive* replication. For each approach, if a given queue or topic must remain accessible in the presence of a datacenter outage, you can create it in both namespaces. Both entities can have the same name. For example, a primary queue can be reached under **contosoPrimary.servicebus.windows.net/myQueue**, while its secondary counterpart can be reached under **contosoSecondary.servicebus.windows.net/myQueue**.

If the application does not require permanent sender-to-receiver communication, the application can implement a durable client-side queue to prevent message loss and to shield the sender from any transient Service Bus errors.

## Active replication
Active replication uses entities in both namespaces for every operation. Any client that sends a message sends two copies of the same message. The first copy is sent to the primary entity (for example, **contosoPrimary.servicebus.windows.net/sales**), and the second copy of the message is sent to the secondary entity (for example, **contosoSecondary.servicebus.windows.net/sales**).

A client receives messages from both queues. The receiver processes the first copy of a message, and the second copy is suppressed. To suppress duplicate messages, the sender must tag each message with a unique identifier. Both copies of the message must be tagged with the same identifier. You can use the [BrokeredMessage.MessageId][BrokeredMessage.MessageId] or [BrokeredMessage.Label][BrokeredMessage.Label] properties, or a custom property to tag the message. The receiver must maintain a list of messages that it has already received.

The [Geo-replication with Service Bus Brokered Messages][Geo-replication with Service Bus Brokered Messages] sample demonstrates active replication of messaging entities.

> [!NOTE]
> The active replication approach doubles the number of operations, therefore this approach can lead to higher cost.
> 
> 

## Passive replication
In the fault-free case, passive replication uses only one of the two messaging entities. A client sends the message to the active entity. If the operation on the active entity fails with an error code that indicates the datacenter that hosts the active entity might be unavailable, the client sends a copy of the message to the backup entity. At that point the active and the backup entities switch roles: the sending client considers the old active entity to be the new backup entity, and the old backup entity is the new active entity. If both send operations fail, the roles of the two entities remain unchanged and an error is returned.

A client receives messages from both queues. Because there is a chance that the receiver receives two copies of the same message, the receiver must suppress duplicate messages. You can suppress duplicates in the same way as described for active replication.

In general, passive replication is more economical than active replication because in most cases only one operation is performed. Latency, throughput, and monetary cost are identical to the non-replicated scenario.

When using passive replication, in the following scenarios messages can be lost or received twice:

* **Message delay or loss**: Assume that the sender successfully sent a message m1 to the primary queue, and then the queue becomes unavailable before the receiver receives m1. The sender sends a subsequent message m2 to the secondary queue. If the primary queue is temporarily unavailable, the receiver receives m1 after the queue becomes available again. In case of a disaster, the receiver may never receive m1.
* **Duplicate reception**: Assume that the sender sends a message m to the primary queue. Service Bus successfully processes m but fails to send a response. After the send operation times out, the sender sends an identical copy of m to the secondary queue. If the receiver is able to receive the first copy of m before the primary queue becomes unavailable, the receiver receives both copies of m at approximately the same time. If the receiver is not able to receive the first copy of m before the primary queue becomes unavailable, the receiver initially receives only the second copy of m, but then receives a second copy of m when the primary queue becomes available.

The [Geo-replication with Service Bus brokered messages][Geo-replication with Service Bus Brokered Messages] sample demonstrates passive replication of messaging entities.

## Geo-replication

Service Bus supports Geo-disaster recovery and Geo-replication, at the namespace level. For more information, see [Azure Service Bus Geo-disaster recovery](service-bus-geo-dr.md). The disaster recovery feature, available for the [Premium SKU](service-bus-premium-messaging.md) only, implements metadata disaster recovery, and relies on primary and secondary disaster recovery namespaces.

## Availability Zones (preview)

The Service Bus Premium SKU supports [Availability Zones](../availability-zones/az-overview.md), providing fault-isolated locations within an Azure region. 

> [!NOTE]
> The Availability Zones preview is supported only in the **Central US**, **East US 2**, and **France Central** regions.

You can enable Availability Zones on new namespaces only, using the Azure portal. Service Bus does not support migration of existing namespaces. You cannot disable zone redundancy after enabling it on your namespace.

![1][]

## Next steps
To learn more about disaster recovery, see these articles:

* [Azure Service Bus Geo-disaster recovery](service-bus-geo-dr.md)
* [Azure SQL Database Business Continuity][Azure SQL Database Business Continuity]
* [Designing resilient applications for Azure][Azure resiliency technical guidance]

[Service Bus Authentication]: service-bus-authentication-and-authorization.md
[Partitioned messaging entities]: service-bus-partitioning.md
[Asynchronous messaging patterns and high availability]: service-bus-async-messaging.md#failure-of-service-bus-within-an-azure-datacenter
[BrokeredMessage.MessageId]: /dotnet/api/microsoft.servicebus.messaging.brokeredmessage#Microsoft_ServiceBus_Messaging_BrokeredMessage_MessageId
[BrokeredMessage.Label]: /dotnet/api/microsoft.servicebus.messaging.brokeredmessage#Microsoft_ServiceBus_Messaging_BrokeredMessage_Label
[Geo-replication with Service Bus Brokered Messages]: https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.ServiceBus.Messaging/GeoReplication
[Azure SQL Database Business Continuity]: ../sql-database/sql-database-business-continuity.md
[Azure resiliency technical guidance]: /azure/architecture/resiliency

[1]: ./media/service-bus-outages-disasters/az.png