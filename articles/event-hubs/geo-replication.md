---
title: 'Azure Event Hubs geo-replication'
description: 'This article describes the Azure Event Hubs geo-replication feature'
ms.topic: article
author: axisc
ms.author: aschhabria
ms.date: 11/11/2024
ms.custom: references_regions
---
 
# Azure Event Hubs Geo-replication

The Event Hubs Geo-replication feature is one of the options to insulate Azure Event Hubs against outages and disasters, providing replication of both metadata (entities, configuration and properties) and data (event payloads).
 
> [!NOTE]
> The Event Hubs Geo-replication feature is available for the Premium tier namespaces and namespaces provisioned on Dedicated clusters only.
>

This feature ensures that metadata and data of a namespace is continuously replicated from a primary region to the secondary region. The namespace can be thought of as being virtually extended to more than one region, with one region being the primary and the other being the secondary.

At any time, the secondary region can be promoted to become a primary region. Promoting a secondary repoints the namespace to the selected secondary region, and the previous primary region is demoted to a secondary region.


## Geo-replication vs other business continuity options

In this section, we touch upon other BCDR (business continuity and disaster recovery story) offerings, the distinction they have with geo-replication and the compatibility between these features.

### Availability Zones

Event Hubs offers [Availability Zones support](../reliability/reliability-event-hubs.md#availability-zone-support), depending on the Azure regions where the Event Hubs namespace is provisioned. Availability zones support offers fault isolation and provide resiliency **within** the same datacenter region.

Geo-replication provides fault isolation **across** Azure regions, by pairing 2 regions together and ensuring the data is copied over for an RPO (recovery point objective).

Availability Zones are **fully supported** along with geo-replication.

### Metadata disaster recovery (DR)

The [Metadata disaster recovery feature](./event-hubs-geo-dr.md) replicates configuration information (or metadata) for a namespace from a primary namespace to a secondary namespace. It supports a one time only failover to the secondary region. During customer initiated failover, the alias name for the namespace is repointed to the secondary namespace and then the pairing is broken. No data is replicated other than configuration information nor are permission assignments replicated. 

Geo-replication feature replicates configuration information and all of the data from a primary namespace to the secondary region. Failover is performed by promoting the selected secondary to primary (and demoting the previous primary to a secondary). Users can fail back to the original primary when desired.

Metadata disaster recovery (DR) is ***not supported*** along with geo-replication. You can migrate from *Metadata disaster recovery (DR)* to *Geo-replication*, by breaking the metadata DR pairing and enabling Geo-replication as mentioned in this document.

## Scenarios

Event Hubs Geo-replication can be used in multiple different scenarios, as described here.

### Ensuring Business Continuity and Disaster Recovery
Geo-replication ensures disaster recovery and business continuity for all streaming data on your namespace. By replicating data across regions, organizations can safeguard against data loss and ensure that their applications remain operational even in the event of a regional outage. This feature is crucial for mission-critical applications that require high availability and minimal downtime.

### Global Data Distribution
Geo-replication can be used to distribute data globally, allowing applications to access data from the nearest region. This reduces latency and improves performance for workloads located in different parts of the world.

### Data Sovereignty and Compliance
Organizations operating in multiple countries often need to comply with data sovereignty laws that require data to be stored within specific geographic boundaries. Geo-replication allows these organizations to replicate data to regions that comply with local regulations, ensuring that they meet legal requirements while still maintaining a unified data platform.

### Migration and Upgrades
Geo-replication can also be used to facilitate data migration, maintenance, and system upgrades. Organizations can migrate their namespace proactively from a primary to a secondary region to allow for any maintenance and upgrades on the primary region.

## Geo-replication 
The public preview of the Geo-replication feature is supported for namespaces in Event Hubs self-serve scaling dedicated clusters. You can use the feature with new, or existing namespaces in dedicated self-serve clusters. The following features aren't supported with Geo-replication:

- Customer managed keys encryption (CMK).
-	Managed identity for capture.
-	Private endpoints.
-	Large messages support (currently in public preview).
-	Kafka Streams and Transactions (currently in public preview).
 
Some of the key aspects of Geo-data Replication public preview are: 

-	Primary-secondary replication model – Geo-replication is built on primary-secondary replication model, where at a given time there’s only one primary namespace that serves event producers and event consumers. 
-	Event Hubs performs fully managed byte-to-byte replication of metadata, event data, and consumer offset across secondaries with the configured consistency levels. 
-	Stable namespace fully qualified domain name (FQDN) – The FQDN doesn't need to change when promotion is performed. 
-	Replication consistency - There are two replication consistency settings, synchronous and asynchronous.
-	User-managed promotion of a secondary to being the new primary.

Changing a secondary to being a new primary is done two ways:

- **Planned**: a promotion of the secondary to primary where traffic isn't processed until the new primary catches up with all of the data held by the former primary instance.
- **Forced**: as a failover where the secondary becomes primary as fast as possible. The Geo-replication feature replicates all data and metadata from the primary region to the selected secondary regions. The namespace FQDN always points to the primary region.

:::image type="content" source="./media/geo-replication/a-as-primary.png" alt-text="Diagram showing when region A is primary, B is secondary."::: 
 
When you initiate a promotion of a secondary, the FQDN points to the region selected to be the new primary. The old primary then becomes a secondary. You can promote your secondary to be the new primary for reasons other than a failover. Those reasons can include application upgrades, failover testing, or any number of other things. In those situations, it's common to switch back when those activities are completed.

 :::image type="content" source="./media/geo-replication/b-as-primary.png" alt-text="Diagram showing when B is made the primary, that A becomes the new secondary."::: 
 
Secondary regions are added, or removed at the customer's discretion. There are some current limitations worth noting:

-	There's no ability to support read-only views on secondary regions.
-	There's no automatic promotion/failover capability. All promotions are customer initiated.
-	Secondary regions must be different from the primary region. You can't select another dedicated cluster in the same region.
-	Only one secondary is supported for public preview.
 
## Replication modes
There are two replication consistency configurations, synchronous and asynchronous. It's important to know the differences between the two configurations as they have an impact on your applications and your data consistency.

### Asynchronous replication

Using asynchronous replication, all requests are committed on the primary, after which an acknowledgment is sent to the client. Replication to the secondary regions happens asynchronously. Users can configure the maximum acceptable amount of lag time. The lag time is the service side offset between the latest action on the primary and the secondary regions. The service continuously replicates the data and metadata, ensuring the lag remains as small as possible. If the lag for an active secondary grows beyond the user configured maximum replication lag, the primary starts throttling incoming requests.

### Synchronous replication

Using synchronous replication, all requests are replicated to the secondary, which must commit and confirm the operation before committing on the primary. As such, your application publishes at the rate it takes to publish, replicate, acknowledge, and commit. Moreover, it also means that your application is tied to the availability of both regions. If the secondary region lags or is unavailable, messages won't be acknowledged and committed, and the primary will throttle incoming requests.

### Replication consistency comparison

With **synchronous** replication:

   * Latency is longer due to the distributed commit operations.
   * Availability is tied to the availability of two regions. If one region goes down, your namespace is unavailable.

On the other hand, synchronous replication provides the greatest assurance that your data is safe. If you have synchronous replication, then when we commit it, it commits in all of the regions you configured for Geo-Replication, providing the best data assurance.

With **asynchronous** replication:

   * Latency is impacted minimally.
   * The loss of a secondary region doesn't immediately impact availability. However, availability gets impacted once the configured maximum replication lag is reached.

As such, it doesn’t have the absolute guarantee that all regions have the data before we commit it like synchronous replication does, and data loss or duplication may occur. However, as you're no longer immediately impacted when a single region lags or is unavailable, application availability improves, in addition to having a lower latency.

| Capability | Synchronous replication | Asynchronous replication |
| --- | --- | --- |
| Latency | Longer due to distributed commit operations	 | Minimally impacted |
| Availability | 	Tied to availability of secondary regions | 	Loss of a secondary region doesn't immediately impact availability |
| Data consistency | Data always committed in both regions before acknowledgment | Data committed in primary only before acknowledgment |
| Recovery point objective (RPO) | RPO 0, no data loss on promotion | RPO > 0, possible data loss on promotion |

The replication mode can be changed after configuring Geo-Replication. You can go from synchronous to asynchronous or from asynchronous to synchronous. If you go from asynchronous to synchronous, your secondary will be configured as synchronous after lag reaches zero. If you're running with a continual lag for whatever reason, then you may need to pause your publishers in order for lag to reach zero and your mode to be able to switch to synchronous. The reasons to have synchronous replication enabled, instead of asynchronous replication, are tied to the importance of the data, specific business needs, or compliance reasons, rather than availability of your application.

> [!NOTE]
> In case a secondary region lags or becomes unavailable, the application will no longer be able to replicate to this region and will start throttling once the replication lag is reached. To continue using the namespace in the primary location, the afflicted secondary region can be removed. If no more secondary regions are configured, the namespace continues without Geo-Replication enabled. It's possible to add other secondary regions at any time. Top-level entities, which are event hubs, are replicated synchronously, regardless of the replication mode configured.
>

## Secondary region selection
To enable the Geo-Replication feature, you need to use primary and secondary regions where the feature is enabled. The Geo-Replication feature depends on being able to replicate published messages from the primary to the secondary regions. If the secondary region is on another continent, this has a major impact on replication lag from the primary to the secondary region. If using Geo-Replication for availability reasons, you're best off with secondary regions being at least on the same continent where possible. To get a better understanding of the latency induced by geographic distance, you can learn more from Azure network round-trip latency statistics.

## Geo-replication management

The Geo-Replication feature enables customers to configure a secondary region towards which to replicate metadata and data. As such, customers can perform the following management tasks:

-	**Configure Geo-replication** - Secondary regions can be configured on any new or existing namespace in a region with the Geo-Replication feature enabled.
-	**Configure the replication consistency** - Synchronous and asynchronous replication is set when Geo-Replication is configured but can also be switched afterwards.
-	**Trigger promotion/failover** - All promotions are customer initiated.
-	**Remove a secondary** - If at any time you want to remove a secondary region, you can do so after which the data in the secondary region is deleted.
 
## Monitoring data replication
Users can monitor the progress of the replication job by monitoring the replication lag metric in Application Metrics logs.

-	Enable Application Metrics logs in your Event Hubs namespace following [Monitoring Azure Event Hubs - Azure Event Hubs | Microsoft Learn](./monitor-event-hubs.md). 
-	Once Application Metrics logs are enabled, you need to produce and consume data from namespace for a few minutes before you start to see the logs. 
-	To view Application Metrics logs, navigate to **Monitoring** section of Event Hubs page, and select **Logs** on the left menu. You can use the following query to find the replication lag (in seconds) between the primary and secondary namespaces. 

    ```kusto
    AzureDiagnostics
      | where TimeGenerated > ago(1h)
      | where Category == "ApplicationMetricsLogs"
      | where ActivityName_s == "ReplicationLag
    ```
-	The column `count_d` indicates the replication lag in seconds between the primary and secondary region.

 ## Publishing Data 
Event publishing applications can publish data to geo-replicated namespaces via stable namespace FQDN of the geo replicated namespace. The event publishing approach is the same as the non-Geo DR case and no changes to client applications are required. 

Event publishing might not be available during the following circumstances: 

-	During Failover grace period, the existing primary region rejects any new events that are published to the event hub. 
-	When replication lag between primary and secondary regions reaches the max replication lag duration, the publisher ingress workload might get throttled. 
Publisher applications can't directly access any namespaces in the secondary regions. 

## Consuming Data
Event consuming applications can consume data using the stable namespace FQDN of a geo-replicated namespace. The consumer operations aren't supported, from when the failover is initiated until it's completed. 

### Checkpointing/Offset Management
Event consuming applications can continue to maintain offset management as they would do it with a single namespace. 

**Kafka**

Offsets are committed to Event Hubs directly and offsets are replicated across regions. Therefore, consumers can start consuming from where it left off in the primary region. 

**Event Hubs SDK/AMQP**

Clients that use the Event Hubs SDK need to upgrade to the April 2024 version of the SDK. The latest version of the Event Hubs SDK supports failover with an update to the checkpoint. The checkpoint is managed by users with a checkpoint store such as Azure Blob storage, or a custom storage solution. If there's a failover, the checkpoint store must be available from the secondary region so that clients can retrieve checkpoint data and avoid loss of messages.

## Pricing
Event Hubs dedicated clusters are priced independently of geo-replication. Use of geo-replication with Event Hubs dedicated requires you to have at least two dedicated clusters in separate regions. The dedicated clusters used as secondary instances for geo-replication can be used for other workloads. There's a charge for geo-replication based on the published bandwidth * the number of secondary regions. The geo-replication charge is waived in early public preview. 

## Related content
To learn how to use the Geo-replication feature, see [Use Geo-replication](use-geo-replication.md).
