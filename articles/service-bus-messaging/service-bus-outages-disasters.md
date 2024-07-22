---
title: Insulate Azure Service Bus applications against outages and disasters
description: This article provides techniques to protect applications against a potential Azure Service Bus outage.
ms.topic: article
ms.date: 04/29/2024
---

# Best practices for insulating applications against Service Bus outages and disasters

Mission-critical applications must operate continuously, even in the presence of unplanned outages or disasters. Resilience against disastrous outages of data processing resources is a requirement for many enterprises and in some cases even required by industry regulations. This article describes techniques you can use to protect Service Bus applications against a potential service outage or disaster.

Azure Service Bus already spreads the risk of catastrophic failures of individual machines or even complete racks across clusters that span multiple failure domains within a datacenter and it implements transparent failure detection and failover mechanisms such that the service continues to operate within the assured service-levels and typically without noticeable interruptions when such failures occur.

Furthermore, the outage risk is further spread across three physically separated facilities ([availability zones](#availability-zones)), and the service has enough capacity reserves to instantly cope with the complete, catastrophic loss of a datacenter. The all-active Azure Service Bus cluster model within a failure domain along with the availability zone support is superior to any on-premises message broker product in terms of resiliency against grave hardware failures and even catastrophic loss of entire datacenter facilities. Still, there might be grave situations with widespread physical destruction that even those measures can't sufficiently defend against.

The Service Bus Geo-Disaster Recovery and Geo-Replication features are designed to make it easier to recover from a disaster of this magnitude and abandon a failed Azure region for good and without having to change your application configurations.

## Outages and disasters

It's important to note the distinction between "outages" and "disasters."

An *outage* is the temporary unavailability of Azure Service Bus, and can affect some components of the service, such as a messaging store, or even the entire datacenter. However, after the problem is fixed, Service Bus becomes available again. Typically, an outage doesn't cause the loss of messages or other data. An example of a component failure is the unavailability of a particular messaging store. An example of a datacenter-wide outage is a power failure of the datacenter, or a faulty datacenter network switch. An outage can last from a few minutes to a few days. Some outages are only short connection losses because of transient or network issues.

A *disaster* is defined as the permanent, or longer-term loss of a Service Bus cluster, Azure region, or datacenter. The region or datacenter might or might not become available again, or might be down for hours or days. Examples of such disasters are fire, flooding, or earthquake. A disaster that becomes permanent might cause the loss of some messages, events, or other data. However, in most cases there should be no data loss and messages can be recovered once the data center comes back up.

## Protection against outages and disasters

There are two features that provide Geo-Disaster Recovery in Azure Service Bus for the Premium tier. First, there is Geo-Disaster Recovery (Metadata DR) providing replication of metadata (entities, configuration, properties). Second, there is Geo-Replication, which is currently in public preview, providing replication of both metadata and data (message data and message property / state changes) itself. Neither Geo-Disaster Recovery feature should be confused with Availability Zones. Regardless of if it is Metadata DR or Geo replication, both geo-graphic recovery features provide resilience between Azure regions such as East US and West US.

Availability Zones are available on all Service Bus tiers, and support provides resilience within a specific geographic region, such as East US. For a detailed discussion of disaster recovery in Microsoft Azure, see [this article](/azure/architecture/resiliency/disaster-recovery-azure-applications).

High availability and disaster recovery concepts are built right into the Azure Service Bus **premium** tier, both within the same region (via availability zones) and across different regions (via Geo-Disaster Recovery and Geo-Replication).

## Geo-Disaster Recovery options

### Geo-Disaster Recovery

Service Bus **premium** tier supports Geo-Disaster Recovery, at the namespace level. For more information, see [Azure Service Bus Geo-Disaster Recovery](service-bus-geo-dr.md). The Geo-Disaster Recovery feature, available for the [Premium tier](service-bus-premium-messaging.md) only, implements metadata disaster recovery, and relies on primary and secondary namespaces. With Geo-Disaster Recovery, **only metadata** for entities is replicated between primary and secondary **namespaces**.

### Geo-Replication

Service Bus **premium** tier also supports Geo-Replication, at the namespace level. For more information, see [Azure Service Bus Geo-Replication (Public Preview)](service-bus-geo-replication.md). The Geo-Replication feature, available for the [Premium tier](service-bus-premium-messaging.md) only and currently in public preview, implements metadata and data disaster recovery, and relies on primary and secondary regions. With Geo-Replication, **both metadata and data** for entities are replicated between primary and secondary **regions**.

### High-level feature differences

The **Geo-Disaster Recovery (Metadata DR)** feature replicates metadata for a namespace from a primary namespace to a secondary namespace. It supports a one time only failover to the secondary region. During customer initiated failover, the alias name for the namespace is repointed to the secondary namespace and then the pairing is broken.  No data is replicated other than metadata nor are RBAC assignments replicated.

The **Geo-Replication** feature replicates metadata and all of the data from a primary region to one or more secondary regions. When a failover is performed by the customer, the selected secondary becomes the primary and the previous primary becomes a secondary. Users can perform a failover back to the original primary when desired.

### Availability zones

All Service Bus tiers support [availability zones](../availability-zones/az-overview.md), providing fault-isolated locations within the same Azure region. Service Bus manages three copies of the messaging store (1 primary and 2 secondary). Service Bus keeps all three copies in sync for data and management operations. If the primary copy fails, one of the secondary copies is promoted to primary with no perceived downtime. If applications see transient disconnects from Service Bus, the [retry logic](/azure/architecture/best-practices/retry-service-specific#service-bus) in the SDK automatically reconnects to Service Bus. 

When you use availability zones, **both metadata and data (messages)** are replicated across data centers in the availability zone. 

> [!NOTE]
> The availability zones support is only available in [Azure regions](../availability-zones/az-region.md) where availability zones are present.

When you create a namespace, the support for availability zones (if available in the selected region) is automatically enabled for the namespace. There's no extra cost for using this feature and you can't disable or enable this feature after namespace creation.

> [!NOTE]
> Previously it was required to set the property `zoneRedundant` to `true` to enable availability zones, however this behavior has changed to enable availability zones by default. Existing namespaces are being migrated to availability zones as well, and the property `zoneRedundant` is being deprecated. The property `zoneRedundant` might still show as `false`, even when availability zones has been enabled.

## Protection against disasters - standard tier

To achieve resilience against disasters with the Service Bus Standard tier, you could use **active** or  **passive** replication. For each approach, if a given queue or topic must remain accessible in the presence of a datacenter outage, you can create it in both namespaces. Both entities can have the same name. For example, a primary queue can be reached under **contosoPrimary.servicebus.windows.net/myQueue**, while its secondary counterpart can be reached under **contosoSecondary.servicebus.windows.net/myQueue**.

>[!NOTE]
> The **active replication** and **passive replication** setup are general purpose solutions and not specific features of Service Bus. 
> The replication logic (sending to 2 different namespaces) is in the sender applications and the receiver has to have custom logic for duplicate detection.

If the application doesn't require permanent sender-to-receiver communication, the application can implement a durable client-side queue to prevent message loss and to shield the sender from any transient Service Bus errors.

### Active replication

Active replication uses entities in both namespaces for every operation. Any client that sends a message sends two copies of the same message. The first copy is sent to the primary entity (for example, **contosoPrimary.servicebus.windows.net/sales**), and the second copy of the message is sent to the secondary entity (for example, **contosoSecondary.servicebus.windows.net/sales**).

A client receives messages from both queues. The receiver processes the first copy of a message, and the second copy is suppressed. To suppress duplicate messages, the sender must tag each message with a unique identifier. Both copies of the message must be tagged with the same identifier. You can use the [ServiceBusMessage.MessageId](/dotnet/api/azure.messaging.servicebus.servicebusmessage.messageid) or [ServiceBusMessage.Subject](/dotnet/api/azure.messaging.servicebus.servicebusreceivedmessage.subject) properties, or a custom property to tag the message. The receiver must maintain a list of messages that it has already received.

> [!NOTE]
> The active replication approach doubles the number of operations, therefore this approach can lead to higher cost. 

### Passive replication
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
* [Azure Service Bus Geo-Replication (Public Preview)](service-bus-geo-replication.md)
* [Azure SQL Database Business Continuity](/azure/azure-sql/database/business-continuity-high-availability-disaster-recover-hadr-overview)
* [Designing resilient applications for Azure](/azure/architecture/framework/resiliency/app-design)
