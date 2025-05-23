---
title: 'Insulate Azure Event Hubs applications against outages and disasters'
description: 'This article provides techniques to protect applications during Azure Event Hubs planned maintenance or unplanned outage.'
ms.topic: article
author: axisc
ms.author: aschhabria
ms.date: 5/13/2025
ms.custom: references_regions
---

# Best practices for insulating Azure Event Hubs Applications Against Outages and Disasters

Mission-critical applications must operate continuously, even in the presence of planned maintenance or unplanned outages or disasters. Resilience against disastrous outages of data processing resources is a requirement for many enterprises and, in some cases, mandated by industry regulations. This article describes techniques you can use to protect Event Hubs applications during planned maintenance or against potential service outages or disasters.

Azure Event Hubs already spreads the risk of catastrophic failures of individual machines or even complete racks across clusters that span multiple failure domains within a datacenter and it implements transparent failure detection and failover mechanisms such that the service continues to operate within the assured service-levels and typically without noticeable interruptions when such failures occur.

Furthermore, the outage risk is further spread across three physically separated facilities (availability zones), and the service has enough capacity reserves to instantly cope with the complete, catastrophic loss of a datacenter. The all-active Azure Event Hubs cluster model within a failure domain along with the availability zone support is superior to any on-premises message broker product in terms of resiliency against grave hardware failures and even catastrophic loss of entire datacenter facilities. Still, there might be grave situations with widespread physical destruction that even those measures can't sufficiently defend against.

The Event Hubs Geo-Disaster Recovery and Geo-Replication features are designed to make it easier to recover from a disaster of this magnitude and abandon a failed Azure region for good and without having to change your application configurations.

## Definitions

It’s important to distinguish between the different scenarios where business continuity and disaster recovery features may be used:

- **Planned Maintenance :** A customer planned event where resources in the specific region are optimized to meet business goals. In these events, workflows may be adjusted to use a secondary region while the primary region is being optimized. For example, Blue-green deployments, database backups and recovery, data integrity checks.

- **Outage:** A temporary unavailability of Event Hubs, which could affect individual partitions, the messaging store, or even the entire datacenter. Outages are typically resolved without data loss, and the service resumes normal operation once the underlying issue is fixed. Examples include hardware failures, software bugs, or short-term network issues.

- **Disaster:** The permanent or prolonged loss of an Event Hubs cluster, region, or datacenter. The region or datacenter may or may not become available again, or might be down for hours or days. Examples of such disasters are fire, flooding, or earthquake. While this is unlikely, a disaster that becomes permanent might cause the loss of some messages, events, or other data. However, in most cases there should be no data loss and messages can be recovered once the data center comes back up.


## Protection Against Outages and Disasters

Azure Event Hubs offers several built-in mechanisms and recommended patterns for high availability and disaster recovery:

### Availability Zones

Event Hubs supports **availability zones** in select Azure regions. Data (metadata and event payloads) is replicated across physically separated datacenters within a region, providing fault isolation against datacenter-level failures.

> [!NOTE]
> Availability zones are enabled by default in supported regions.

### Geo-Disaster Recovery (Geo-DR)

Event Hubs supports [Geo-Disaster Recovery (Geo-DR)](event-hubs-geo-dr.md) at the namespace level, which implements metadata disaster recovery between the primary and secondary namespace in different Azure regions. With Geo-disaster recovery, **only metadata** for entities is replicated between primary and secondary namespaces.

### Geo-replication

Geo-replication ensures that metadata and data of a namespace is continuously replicated from a primary region to the secondary region. The namespace can be thought of as being virtually extended to more than one region, with one region being the primary and the other being the secondary.

At any time, the secondary region can be promoted to become a primary region. Promoting a secondary repoints the namespace FQDN to the selected secondary region, and the previous primary region is demoted to a secondary region.

#### How does Geo-replication differ from Availability Zones

Event Hubs offers [Availability Zones support](#availability-zones), depending on the Azure regions where the Event Hubs namespace is provisioned. Availability zones support offers fault isolation and provide resiliency **within** the same datacenter region.

Geo-replication provides fault isolation **across** Azure regions, by pairing 2 regions together and ensuring the data is copied over for an RPO (recovery point objective).

Availability Zones are **fully supported** along with geo-replication.

#### How does Geo-replication differ from Geo-disaster recovery (DR)

The [Geo-disaster recovery feature](#geo-disaster-recovery-geo-dr) replicates configuration information (or metadata) for a namespace from a primary namespace to a secondary namespace. It supports a one time only failover to the secondary region. During customer initiated failover, the alias name for the namespace is repointed to the secondary namespace and then the pairing is broken. No data is replicated other than configuration information nor are permission assignments replicated. 

Geo-replication feature replicates configuration information and all of the data from a primary namespace to the secondary region. Failover is performed by promoting the selected secondary to primary (and demoting the previous primary to a secondary). Users can fail back to the original primary when desired.

Metadata disaster recovery (DR) is ***not supported*** along with geo-replication. You can migrate from *Metadata disaster recovery (DR)* to *Geo-replication*, by breaking the metadata DR pairing and enabling Geo-replication as mentioned in this document.


## Next Steps

To learn more about diaster recovery, see these articles:

   * [Event Hubs Geo-disaster recovery documentation](event-hubs-geo-dr.md)
   * [Event Hubs availability and consistency](event-hubs-availability-and-consistency.md)
   * [Event Hubs Geo-replication](geo-replication.md)
