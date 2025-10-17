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

The Event Hubs Geo-replication feature provides replication of both metadata (entities, configuration and properties) and data (event payloads) for the namespace, allowing for business continuity and disaster recovery.
 
> [!NOTE]
> The Event Hubs Geo-replication feature is available on the Premium and Dedicated tier only.
>

This feature ensures that metadata and data of a namespace is continuously replicated from a primary region to the secondary region. The namespace can be thought of as being extended to more than one region, with one region being the primary and the other being the secondary.

At any time, the secondary region can be promoted to become a primary region. Promoting a secondary repoints the namespace FQDN (fully qualified domain name) to the selected secondary region, and the previous primary region is demoted to a secondary region.

## Scenarios

Event Hubs Geo-replication can be used in multiple different scenarios, as described here.

### Ensuring Business Continuity and Disaster Recovery
Geo-replication ensures disaster recovery and business continuity for all streaming data on your namespace. By replicating data across regions, organizations can safeguard against data loss and ensure that their applications remain operational even in the event of a regional outage. This feature is crucial for mission-critical applications that require high availability and minimal downtime.

### Global Data Distribution
Geo-replication can be used to distribute data globally, allowing applications to access data from the nearest region. This reduces latency and improves performance for workloads located in different parts of the world.

### Data Sovereignty and Compliance
Organizations operating in multiple countries/regions often need to comply with data sovereignty laws that require data to be stored within specific geographic boundaries. Geo-replication allows these organizations to replicate data to regions that comply with local regulations, ensuring that they meet legal requirements while still maintaining a unified data platform.

### Migration and Upgrades
Geo-replication can also be used to facilitate data migration, maintenance, and system upgrades. Organizations can migrate their namespace proactively from a primary to a secondary region to allow for any maintenance and upgrades on the primary region.

## Basic concepts

The Geo-Replication feature implements metadata and data replication in a primary-secondary replication model. At a given time there’s a single primary region, which is serving both producers and consumers. The secondary acts as a hot stand-by region, meaning that it isn't possible to interact with these secondary regions. However, they run in the same configuration as the primary region, allowing for fast promotion, ready to step in after promotion has been completed. 

Some of the key aspects of Geo-data Replication feature are: 

-	Primary-secondary replication model – Geo-replication is built on primary-secondary replication model, where at a given time there’s only one primary namespace that serves event producers and event consumers. 
-	Event Hubs performs fully managed byte-to-byte replication of metadata, event data, and consumer offset across secondaries with the configured consistency levels. 
-	Single namespace hostname - Upon successful configuration of a Geo-Replication enabled namespace, users can use the namespace hostname in their client application. The hostname behaves agnostic of the configured primary and secondary regions, and always points to the primary region.
- When a customer initiates a promotion, the hostname points to the region selected to be the new primary region. The old primary becomes a secondary region.
- It isn't possible to read or write on the secondary regions.
- Customer-managed promotion from primary to secondary region, providing full ownership and visibility for outage resolution. Metrics are available, which can help to automate the promotion from customer side.
Secondary regions can be added or removed at the customer's discretion.
-	Replication consistency - There are two replication consistency settings, synchronous and asynchronous.

| State | Diagram |
| --- | ---|
| Before failover (promotion of secondary) | :::image type="content" source="./media/geo-replication/a-as-primary.png" alt-text="Diagram showing when region A is primary, B is secondary."::: |
| After failover (promotion of secondary) | :::image type="content" source="./media/geo-replication/b-as-primary.png" alt-text="Diagram showing when B is made the primary, that A becomes the new secondary."::: |
 
## Replication modes
There are two replication consistency configurations, synchronous and asynchronous. It's important to know the differences between the two configurations as they have an impact on your applications and your data consistency.

### Asynchronous replication

Using asynchronous replication, all requests are committed on the primary, after which an acknowledgment is sent to the client. Replication to the secondary regions happens asynchronously. Users can configure the maximum acceptable amount of lag time - the service side offset between the latest action on the primary and the secondary regions. The service continuously replicates the data and metadata, ensuring the lag remains as small as possible. If the lag for an active secondary grows beyond the user configured maximum replication lag, the primary starts throttling incoming requests.

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

| Capability                     | Synchronous replication                                      | Asynchronous replication                                           |
|--------------------------------|--------------------------------------------------------------|--------------------------------------------------------------------|
| Latency                        | Longer due to distributed commit operations                  | Minimally impacted                                                 |
| Availability                   | Tied to availability of secondary regions                    | Loss of a secondary region doesn't immediately impact availability |
| Data consistency               | Data always committed in both regions before acknowledgment  | Data committed in primary only before acknowledgment               |
| RPO (Recovery Point Objective) | RPO 0, no data loss on promotion                             | RPO > 0, possible data loss on promotion                           |

The replication mode can be changed after configuring Geo-Replication. You can go from synchronous to asynchronous or from asynchronous to synchronous. If you go from asynchronous to synchronous, your secondary will be configured as synchronous after lag reaches zero. If you're running with a continual lag for whatever reason, then you may need to pause your publishers in order for lag to reach zero and your mode to be able to switch to synchronous. The reasons to have synchronous replication enabled, instead of asynchronous replication, are tied to the importance of the data, specific business needs, or compliance reasons, rather than availability of your application.

> [!NOTE]
> In case a secondary region lags or becomes unavailable, the application will no longer be able to replicate to this region and will start throttling once the replication lag is reached. To continue using the namespace in the primary location, the afflicted secondary region can be removed. If no more secondary regions are configured, the namespace continues without Geo-Replication enabled. It's possible to add other secondary regions at any time. Top-level entities, which are event hubs, are replicated synchronously, regardless of the replication mode configured.
>

## Secondary region selection
To enable the Geo-Replication feature, you need to use primary and secondary regions where the feature is enabled. The Geo-Replication feature depends on being able to replicate published messages from the primary to the secondary regions. If the secondary region is on another continent, this has a major impact on replication lag from the primary to the secondary region. If using Geo-Replication for availability reasons, you're best off with secondary regions being at least on the same continent where possible. To get a better understanding of the latency induced by geographic distance, you can learn more from Azure network round-trip latency statistics.

> [!NOTE]
> Geo-replication requires that primary and secondary copies of the Event Hubs be on the same tier. The configuration cannot be done across tiers.
> 

## Geo-replication management

The Geo-Replication feature enables customers to configure a secondary region towards which to replicate metadata and data. As such, customers can perform the following management tasks:

-	**Configure Geo-replication** - Secondary regions can be configured on any new or existing namespace in a region with the Geo-Replication feature enabled.
-	**Configure the replication consistency** - Synchronous and asynchronous replication is set when Geo-Replication is configured but can also be switched afterwards.
-	**Trigger promotion/failover** - All promotions are customer initiated.
-	**Remove a secondary** - If at any time you want to remove a secondary region, you can do so after which the data in the secondary region is deleted.

### Criteria to trigger promotion

Here are some cases where a promotion of a secondary to primary may be triggered.

   * Regional Outage: If there is a regional outage affecting the primary region, you should promote the secondary region to ensure business continuity and minimize downtime.
   
   * Maintenance Activities: During planned maintenance activities in the primary region, promoting the secondary region can help maintain high availability for mission-critical applications.

   * Disaster Recovery: In the event of a disaster affecting the primary region, promoting the secondary region ensures that your data remains accessible and your applications continue to function.

   * Performance Issues: If the primary region is experiencing performance issues that impact the availability or reliability of your Event Hubs, promoting the secondary region can help mitigate these issues.

It is recommended to occasionally test failover mechanisms to ensure the business continuity plan is effective, and your applications can seamlessly switch to the secondary region when needed.

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
Publishing applications can publish data to geo replicated namespaces via the namespace hostname of the Geo-Replication enabled namespace. The publishing approach is the same as the non-Geo-Replication case and no changes to data plane SDKs or client applications are required. 

Event publishing might not be available during the following circumstances: 

-	After requesting promotion of a secondary region, the existing primary region rejects any new events that are published to the event hub. 
-	When replication lag between primary and secondary regions reaches the max replication lag duration, the publisher ingress workload might get throttled.

Publisher applications can't directly access any namespaces in the secondary regions. 

## Consuming Data
Consuming applications can consume data using the namespace hostname of a namespace with the Geo-Replication feature enabled. Consumer operations aren't supported from the moment that promotion is initiated until promotion is completed.


### Checkpointing/Offset Management

Event consuming applications can continue to maintain offset management as they would do it with a non-geo replicated namespace. No special consideration is needed for offset management for geo-replication enabled namespaces.

> [!WARNING]
> In the event of forced failover (that is, non graceful failover), some of the data that is yet to be copied over may be lost. This may cause the offsets of that specific data to be different across the primary and secondary regions for the namespace, however it would still be within the bounds of the maximum replication lag configured for the namespace.
> In such cases, it's preferred to start consuming from the last committed offset. Some data might have duplicate processing and must be handled on the client side.
>

#### Kafka

Offsets are committed to Event Hubs directly and offsets are replicated across regions. Therefore, consumers can start consuming from where it left off in the primary region.

Here are the list of Apache Kafka clients that are supported - 

| Client name | Version |
| ----------- | ------- |
| Apache Kafka | 2.1.0 or later |
| Librdkafka and derived libraries | 2.1.0 or later |

In the case of other libraries, the ones using the below API versions are supported - 

| API name | Version supported |
| -------------- | ----------------- |
| Metadata API | 7 or later |
| Fetch API | 9 or later|
| ListOffset API| 4 or later |
| OffsetFetch API | 5 or later |
| OffsetForLeaderEpoch API | 0 or later |


#### Event Hubs SDK/AMQP

For AMQP, the checkpoint is managed by users with a checkpoint store such as Azure Blob storage or a custom storage solution. If there's a failover, the checkpoint store must be available from the secondary region so that clients can retrieve checkpoint data and avoid loss of messages.

The latest version of the Event Hubs SDK has made some changes to checkpoint representation to supports failovers. We recommend using the [latest versions of the SDKs](sdks.md), but prior versions of the below SDKs are supported as well.

| Language | Package name|
| -------- | ----------- |
| C# | [Azure.Messaging.EventHubs](https://www.nuget.org/packages/Azure.Messaging.EventHubs/) |
| C# | [Microsoft.Azure.EventHubs](https://www.nuget.org/packages/Microsoft.Azure.EventHubs/) |

> [!WARNING]
> As part of the implementation, the checkpoint format is adapted when geo-replication is enabled on a namespace. Subsequent checkpoints after the geo-replication is complete will be written with a new format. If you force promote a secondary region to primary right after the geo-replication pairing is done but before a new checkpoint is stored (this may happen in the case of forced promotion/failover), then a new data published post promotion may be lost.
>
> In such cases, it's preferred to start consuming from the last committed offset. Some data might have duplicate processing and must be handled on the client side.
>
> It's also recommended to upgrade to the [latest versions of the SDKs](sdks.md).
>

## Considerations

Note the following considerations to keep in mind with this feature:

- In your promotion planning, you should also consider the time factor. For example, if you lose connectivity for longer than 15 to 20 minutes, you might decide to initiate the promotion.
- Promoting a complex distributed infrastructure should be [rehearsed](/azure/architecture/reliability/disaster-recovery#disaster-recovery-plan) at least once.

## Pricing

The pricing varies based on the tier you pick, but generally has 2 parameters -

   * The compute charge for the cluster or namespace.
   * The bandwidth charge for the data being replicated between the primary and secondary regions.

> [!NOTE]
> Refer to the pricing details listed at [Azure Event Hubs](https://azure.microsoft.com/products/event-hubs/) to determine the charges. The geo-replication charge depends on location of the primary region.
>

### Dedicated clusters

Use of geo-replication with Event Hubs dedicated requires you to have at least two dedicated clusters in separate regions, which can be used to host namespaces other than the one being geo-replicated. These dedicated clusters are billed separately based on the number of Capacity Units (CUs) allocated to each.

When geo-replication is enabled, the only additional charge is the bandwidth charge for the data replicated from primary to secondary. This charge depends on the location of the primary region.

### Premium namespaces

For Premium namespaces, enabling geo-replication provisions the same number of processing units (PUs) in the secondary region. Thus, you pay for the **number of PUs** you're using and the **bandwidth for the data transferred between the primary and secondary region**.

For example, if you enable geo-replication on a Premium namespace which has been provisioned with **4 PU**, you'll be billed for

   * 4 PUs in the primary region,
   * 4 PUs in the secondary region,
   * Geo-replication charge per GB of data replicated. 

Bandwidth is charged based on the data transferred between the primary and secondary regions.

### Pricing Meters

The pricing meters for the geo-replication data transfer bandwidth charge will show up with the below details - 

| Product Name | Meter Description |
| --- | ---|
| Service Bus | Service Bus - Geo Replication Zone 1 GB Data Transfer - REGION NAME |
| Service Bus | Service Bus - Geo Replication Zone 2 GB Data Transfer - REGION NAME |
| Service Bus | Service Bus - Geo Replication Zone 3 GB Data Transfer - REGION NAME |


## Private endpoints

This section provides additional considerations when using Geo-Replication with namespaces that utilize private endpoints. For general information on using private endpoints with Event Hubs, see [Integrate Azure Event Hubs with Azure Private Link](private-link-service.md).

When implementing Geo-Replication for an Event Hubs namespace that uses private endpoints, it is important to create private endpoints for both the primary and secondary regions. These endpoints should be configured against virtual networks hosting both primary and secondary instances of your application. For example, if you have two virtual networks, VNET-1 and VNET-2, you need to create two private endpoints on the Event Hubs namespace, using subnets from VNET-1 and VNET-2 respectively. Moreover, the VNETs should be set up with [cross-region peering](/azure/virtual-network/virtual-network-peering-overview), so that clients can communicate with either of the private endpoints. Finally, the [DNS](/azure/private-link/private-endpoint-dns) needs to be managed in such a way that all clients get the DNS information, which should point the namespace endpoint (namespacename.servicebus.windows.net) to the IP address of the private endpoint in the current primary region.

> [!IMPORTANT]
> When promoting a secondary region for Event Hubs, the DNS entry also needs to be updated to point to the corresponding endpoint.

:::image type="content" source="./media/geo-replication/geo-replication-private-endpoints.png" alt-text="Screenshot showing two VNETs with their own private endpoints and VMs connected to an on-premises instance and an Event Hubs namespace." lightbox="./media/geo-replication/geo-replication-private-endpoints.png":::

The advantage of this approach is that failover can occur independently at the application layer or on the Event Hubs namespace:

- Application-only failover: In this scenario, the application moves from VNET-1 to VNET-2. Since private endpoints are configured on both VNET-1 and VNET-2 for both primary and secondary namespaces, the application continues to function seamlessly.
- Event Hubs namespace-only failover: Similarly, if the failover occurs only at the Event Hubs namespace level, the application remains operational because private endpoints are configured on both virtual networks.

By following these guidelines, you can ensure robust and reliable failover mechanisms for your Event Hubs namespaces using private endpoints.

## Related content
To learn how to use the Geo-replication feature, see [Use Geo-replication](use-geo-replication.md).
