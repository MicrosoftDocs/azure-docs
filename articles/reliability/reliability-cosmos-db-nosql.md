---
title: High availability (Reliability)  in Azure Cosmos DB for NoSQL
description: Learn about high availability (Reliability) in Azure Cosmos DB for NoSQL
author: anaharris-ms
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: cosmos-db
ms.date: 05/06/2024 
---

<!--#Customer intent:  I want to understand reliability support in Azure Cosmos DB for NoSQL so that I can respond to and/or avoid failures in order to minimize downtime and data loss. -->

#  High availability (Reliability) in Azure Cosmos DB for NoSQL


This article describes high availability (reliability) support in Azure CosmosDB for NoSQL and covers both [availability zones](#availability-zone-support), as well as [cross-region disaster recovery and business continuity](#cross-region-disaster-recovery-and-business-continuity). 

For general resiliency recommendations for Azure Cosmos DB for NoSQL, see [Resiliency recommendations for Azure Cosmos DB for NoSQL](./resiliency-recommendations/recommend-cosmos-db-nosql.md).

## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]


Azure Cosmos DB is a multitenant service that manages all details of individual compute nodes transparently. You don't have to worry about any kind of patching or planned maintenance. Azure Cosmos DB guarantees [SLAs for availability](#sla-improvements) and P99 latency through all automatic maintenance operations that the system performs.

Azure Cosmos DB offers:

**Individual node outage resiliency.** Azure Cosmos DB automatically mitigates [replica](/azure/cosmos-db/distribute-data-globally) outages by guaranteeing at least three replicas of your data in each Azure region for your account within a four-replica quorum. This guarantee results in an RTO of 0 and an RPO of 0 for individual node outages, without requiring application changes or configurations. 

**Zone outage resiliency.** When you deploy an Azure Cosmos DB account by using [availability zones](availability-zones-overview.md), Azure Cosmos DB provides an RTO of 0 and an RPO of 0, even in a zone outage. For information on RTO, see [Recovery objectives](./disaster-recovery-overview.md#recovery-objectives). 

With availability zones enabled, Azure Cosmos DB for NoSQL supports a *zone-redundant* configuration.


### Prerequisites

- Your replicas must be deployed in an Azure region that supports availability zones. To see if your region supports availability zones, see the [list of supported regions](availability-zones-service-support.md#azure-regions-with-availability-zone-support). 

- Determine whether or not availability zones add enough value to your current configuration in [Impact of using availability zones](#impact-of-using-availability-zones).

### Impact of using availability zones


The impact of availability zones on the high availability of your Cosmos DB for NoSQL database depends on the consistency level of the account and which regions have availability zones enabled. In many cases, availability zones don’t add value or add minimal value if the account is multi-region (unless configured with strong consistency). 

Consult the table below to estimate the impact of using availability zones in your current account configuration:


| Account consistency level | Regions with availability zones enabled| Impact of using availability zones|
|----|---|---|
| [Asynchronous (Bounded Staleness or weaker)](/azure/cosmos-db/consistency-levels#bounded-staleness-consistency) |Any number of secondary read regions.| Provides minimal value because the SDK already provides seamless redirects for reads when a read region fails.|
| [Synchronous (Strong)](/azure/cosmos-db/consistency-levels#strong-consistency) |Two or more secondary read regions| Provides marginal value because the system can leverage dynamic quorum should a read region lose availability which allows for writes to continue.|
| Synchronous (Strong) |One secondary read region| Provides greater value because the loss of a read region in this scenario can impact write availability.|
| All |Write regions and any number of secondary regions| Ensures greater availability for write operations for zonal failures. |
| All |Single region | Single region cannot benefit from multi-region failover capability. Using availability zones guards against total availability loss due to zonal failure.|



### SLA improvements

Because availability zones are physically separate and provide distinct power source, network, and cooling, Availability SLAs (Service-level agreements) are higher (99.995%) than accounts with a single region (99.99%). Regions where availability zones are enabled are charged at 25% premium, while those without those without availability zones don't incur the premium. Moreover, the premium pricing for availability zones is waived for accounts configured with multi-region writes and/or for collections configured with autoscale mode.

Adding an additional region to Cosmos DB account typically increases existing bill by 100% (additively not multiplicatively) though small variations in cost across regions exist. For more details, see [pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/autoscale-provisioned/).

Enabling AZs, adding additional region(s), or turning on multi-region writes can be thought as a layering approach that increases resiliency and availability of a given Cosmos DB account at each step of the way - from 4 9's availability for single region no-AZ configuration, through 4 and half 9's for single region with AZs, all the way to 5 9's of availability for multi-region configuration with the multi-region write option enabled. Please refer the following table for a summary of SLAs for each configuration.


|KPI|Single-region writes without availability zones|Single-region writes with availability zones|Multiple-region, single-region writes without availability zones|Multiple-region, single-region writes with availability zones|Multiple-region, multiple-region writes with or without availability zones|
|---------|---------|---------|---------|---------|---------|
|Write availability SLA | 99.99% | 99.995% | 99.99% | 99.995% | 99.999% |
|Read availability SLA  | 99.99% | 99.995% | 99.999% | 99.999% | 99.999% |
|Zone failures: data loss | Data loss | No data loss | No data loss | No data loss | No data loss |
|Zone failures: availability | Availability loss | No availability loss | No availability loss | No availability loss | No availability loss |
|Regional outage: data loss | Data loss |  Data loss | Dependent on consistency level. For more information, see [Consistency, availability, and performance tradeoffs](../cosmos-db/consistency-levels.md). | Dependent on consistency level. For more information, see [Consistency, availability, and performance tradeoffs](../cosmos-db/consistency-levels.md). | Dependent on consistency level. For more information, see [Consistency, availability, and performance tradeoffs](../cosmos-db/consistency-levels.md).
|Regional outage: availability | Availability loss | Availability loss | No availability loss for read region failure, temporary for write region failure | No availability loss for read region failure, temporary for write region failure | No read availability loss, temporary write availability loss in the affected region |
|Price (***1***) | Not applicable | Provisioned RU/s x 1.25 rate | Provisioned RU/s x *N* regions | Provisioned RU/s x 1.25 rate x *N* regions (***2***) | Multiple-region write rate x *N* regions |

***1*** For serverless accounts, RUs are multiplied by a factor of 1.25.

***2*** The 1.25 rate applies only to regions in which you enable availability zones.


### Create a resource with availability zones enabled

You can configure availability zones only when you add a new region to an Azure Cosmos DB NoSQL account. 

To enable availability zone support you can use:


* [Azure portal](../cosmos-db/how-to-manage-database-account.yml#add-remove-regions-from-your-database-account)

* [Azure CLI](../cosmos-db/sql/manage-with-cli.md#add-or-remove-regions)

* [Azure Resource Manager templates](../cosmos-db/manage-with-templates.md)


### Migrate to availability zone support

To learn how to migrate your Cosmos DB account to availability zone support, see [Migrate Azure Cosmos DB for NoSQL to availability zone support](./migrate-cosmos-nosql.md)).


## Cross-region disaster recovery and business continuity

[!INCLUDE [introduction to disaster recovery](includes/reliability-disaster-recovery-description-include.md)]


Region outages are outages that affect all Azure Cosmos DB nodes in an Azure region, across all availability zones. For the rare cases of region outages, you can configure Azure Cosmos DB to support various outcomes of durability and availability.

### Durability

When an Azure Cosmos DB account is deployed in a single region, generally no data loss occurs. Data access is restored after Azure Cosmos DB services recover in the affected region. Data loss might occur only with an unrecoverable disaster in the Azure Cosmos DB region.

To help you protect against complete data loss that might result from catastrophic disasters in a region, Azure Cosmos DB provides two backup modes:

- [Continuous backups](../cosmos-db/continuous-backup-restore-introduction.md) back up each region every 100 seconds. They enable you to restore your data to any point in time with 1-second granularity. In each region, the backup is dependent on the data committed in that region. If the region has availability zones enabled, then the backup is stored in zone-redundant storage accounts.
- [Periodic backups](../cosmos-db/periodic-backup-restore-introduction.md) fully back up all partitions from all containers under your account, with no synchronization across partitions. The minimum backup interval is 1 hour.

When an Azure Cosmos DB account is deployed in multiple regions, data durability depends on the consistency level that you configure on the account. The following table details, for all consistency levels, the RPO of an Azure Cosmos DB account that's deployed in at least two regions.

|**Consistency level**|**RPO for region outage**|
|---------|---------|
|Session, consistent prefix, eventual|Less than 15 minutes|
|Bounded staleness|*K* and *T*|
|Strong|0|

*K* = The number of versions (that is, updates) of an item.

*T* = The time interval since the last update.

For multiple-region accounts, the minimum value of *K* and *T* is 100,000 write operations or 300 seconds. This value defines the minimum RPO for data when you're using bounded staleness.

For more information on the differences between consistency levels, see [Consistency levels in Azure Cosmos DB](../cosmos-db/consistency-levels.md).

### Service managed failover

If your solution requires continuous uptime during region outages, you can configure Azure Cosmos DB to replicate your data across multiple regions and to transparently fail over to operating regions when required.

Single-region accounts might lose accessibility after a regional outage. To ensure business continuity at all times, we recommend that you set up your Azure Cosmos DB account with *a single write region and at least a second (read) region* and enable *service-managed failover*.

Service-managed failover allows Azure Cosmos DB to fail over the write region of a multiple-region account in order to preserve business continuity at the cost of data loss, as described earlier in the [Durability](#durability) section. Regional failovers are detected and handled in the Azure Cosmos DB client. They don't require any changes from the application. For instructions on how to enable multiple read regions and service-managed failover, see [Manage an Azure Cosmos DB account using the Azure portal](../cosmos-db/how-to-manage-database-account.yml).

> [!IMPORTANT]
> If you have chosen single-region write configuration with multiple read regions, we strongly recommend that you configure the Azure Cosmos DB accounts used for production workloads to *enable service-managed failover*. This configuration enables Azure Cosmos DB to fail over the account databases to available regions.
> In the absence of this configuration, the account will experience loss of write availability for the whole duration of the write region outage. Manual failover won't succeed because of a lack of region connectivity.

> [!WARNING]
> Even with service-managed failover enabled, partial outage may require manual intervention for the Azure Cosmos DB service team. In these scenarios, it may take up to 1 hour (or more) for failover to take effect. For better write availability during partial outages, we recommend enabling availability zones in addition to service-managed failover.  



### Multiple write regions

You can configure Azure Cosmos DB to accept writes in multiple regions. This configuration is useful for reducing write latency  in geographically distributed applications.

When you configure an Azure Cosmos DB account for multiple write regions, strong consistency isn't supported and write conflicts might arise. For more information on how to resolve these conflicts, see [Conflict types and resolution policies when using multiple write regions](../cosmos-db/conflict-resolution-policies.md).

> [!IMPORTANT]
> Updating same Document ID frequently (or recreating same document ID frequently after TTL or delete) will have an effect on replication performance due to increased number of conflicts generated in the system.  

#### Conflict-resolution region

When an Azure Cosmos DB account is configured with multiple-region writes, one of the regions will act as an arbiter in write conflicts.  

#### Best practices for multi-region writes

Here are some best practices to consider when you're writing to multiple regions.

##### Keep local traffic local

When you use multiple-region writes, the application should issue read and write traffic that originates in the local region strictly to the local Cosmos DB region. For optimal performance, avoid cross-region calls.

It's important for the application to minimize conflicts by avoiding the following antipatterns:

* Sending the same write operation to all regions to increase the odds of getting a fast response time

* Randomly determining the target region for a read or write operation on a per-request basis

* Using a round-robin policy to determine the target region for a read or write operation on a per-request basis.

##### Avoid dependency on replication lag

You can't configure multiple-region write accounts for strong consistency. The region that's being written to responds immediately after Azure Cosmos DB replicates the data locally while asynchronously replicating the data globally.  

Though it's infrequent, a replication lag might occur on one or a few partitions when you're geo-replicating data. Replication lag can occur because of a rare blip in network traffic or higher-than-usual rates of conflict resolution.

For instance, an architecture in which the application writes to Region A but reads from Region B introduces a dependency on replication lag between the two regions. However, if the application reads and writes to the same region, performance remains constant even in the presence of replication lag.
    
##### Evaluate session consistency usage for write operations

In session consistency, you use the session token for both read and write operations.  

For read operations, Azure Cosmos DB sends the cached session token to the server with a guarantee of receiving data that corresponds to the specified (or a more recent) session token.  

For write operations, Azure Cosmos DB sends the session token to the database with a guarantee of persisting the data only if the server has caught up to the provided session token. In single-region write accounts, the write region is always guaranteed to have caught up to the session token. However, in multiple-region write accounts, the region that you write to might not have caught up to writes issued to another region. If the client writes to Region A with a session token from Region B, Region A won't be able to persist the data until it catches up to changes made in Region B.

It's best to use session tokens only for read operations and not for write operations when you're passing session tokens between client instances.

##### Mitigate rapid updates to the same document

The server's updates to resolve or confirm the absence of conflicts can collide with writes triggered by the application when the same document is repeatedly updated. Repeated updates in rapid succession to the same document experience higher latencies during conflict resolution.

Although occasional bursts in repeated updates to the same document are inevitable, you might consider exploring an architecture where new documents are created instead if steady-state traffic sees rapid updates to the same document over an extended period.
    

### Read and write outages

Clients of single-region accounts will experience loss of read and write availability until service is restored.

Multiple-region accounts experience different behaviors depending on the following configurations and outage types.

| Configuration | Outage | Availability impact | Durability impact| What to do |
| -- | -- | -- | -- | -- |
| Single write region  | Read region outage | All clients automatically redirect reads to other regions. There's no read or write availability loss for all configurations. The exception is a configuration of two regions with strong consistency, which loses write availability until restoration of the service. Or, *if you enable service-managed failover*, the service marks the region as failed and a failover occurs. | No data loss. | During the outage, ensure that there are enough provisioned Request Units (RUs) in the remaining regions to support read traffic. <br/><br/> When the outage is over, readjust provisioned RUs as appropriate. |
| Single write region | Write region outage | Clients redirect reads to other regions. <br/><br/> *Without service-managed failover*, clients experience write availability loss. Restoration of write availability occurs automatically when the outage ends. <br/><br/> *With service-managed failover*, clients experience write availability loss until the service manages a failover to a new write region that you select. | If you don't select the strong consistency level, the service might not replicate some data to the remaining active regions. This replication depends on the [consistency level](../cosmos-db/consistency-levels.md#rto) that you select. If the affected region suffers permanent data loss, you could lose unreplicated data. | During the outage, ensure that there are enough provisioned RUs in the remaining regions to support read traffic. <br/><br/> *Don't* trigger a manual failover during the outage, because it can't succeed. <br/><br/> When the outage is over, readjust provisioned RUs as appropriate. Accounts that use the API for NoSQL might also recover the unreplicated data in the failed region from your [conflict feed](../cosmos-db/how-to-manage-conflicts.md#read-from-conflict-feed). |
| Multiple write regions | Any regional outage | There's a possibility of temporary loss of write availability, which is analogous to a single write region with service-managed failover. The failover of the [conflict-resolution region](#conflict-resolution-region) might also cause a loss of write availability if a high number of conflicting writes happen at the time of the outage. | Recently updated data in the failed region might be unavailable in the remaining active regions, depending on the selected [consistency level](../cosmos-db/consistency-levels.md). If the affected region suffers permanent data loss, you might lose unreplicated data. | During the outage, ensure that there are enough provisioned RUs in the remaining regions to support more traffic. <br/><br/> When the outage is over, you can readjust provisioned RUs as appropriate. If possible, Azure Cosmos DB automatically recovers unreplicated data in the failed region. This automatic recovery uses the conflict resolution method that you configure for accounts that use the API for NoSQL. For accounts that use other APIs, this automatic recovery uses *last write wins*. |



#### Additional information on read region outages

* The affected region is disconnected and marked offline. The [Azure Cosmos DB SDKs](../cosmos-db/nosql/sdk-dotnet-v3.md) redirect read calls to the next available region in the preferred region list.

* If none of the regions in the preferred region list are available, calls automatically fall back to the current write region.

* No changes are required in your application code to handle read region outages. When the affected read region is back online, it syncs with the current write region and is available again to serve read requests after it has fully caught up.

* Subsequent reads are redirected to the recovered region without requiring any changes to your application code. During both failover and rejoining of a previously failed region, Azure Cosmos DB continues to honor read consistency guarantees.

* Even in a rare and unfortunate event where an Azure write region is permanently irrecoverable, there's no data loss if your multiple-region Azure Cosmos DB account is configured with strong consistency. A multiple-region Azure Cosmos DB account has the durability characteristics specified earlier in the [Durability](#durability) section.

#### Additional information on write region outages

* During a write region outage, the Azure Cosmos DB account promotes a secondary region to be the new primary write region when *service-managed failover* is configured on the Azure Cosmos DB account. The failover occurs to another region in the order of region priority that you specify.

* Manual failover shouldn't be triggered and won't succeed in the presence of an outage of the source or destination region. The reason is that the failover procedure includes a consistency check that requires connectivity between the regions.

* When the previously affected region is back online, any write data that wasn't replicated when the region failed is made available through the [conflict feed](../cosmos-db/how-to-manage-conflicts.md#read-from-conflict-feed). Applications can read the conflict feed, resolve the conflicts based on the application-specific logic, and write the updated data back to the Azure Cosmos DB container as appropriate.

* After the previously affected write region recovers, it will show as "online" in Azure portal, and become available as a read region. At this point, it is safe to switch back to the recovered region as the write region by using [PowerShell, the Azure CLI, or the Azure portal](../cosmos-db/how-to-manage-database-account.yml#perform-manual-failover-on-an-azure-cosmos-db-account. There is *no data or availability loss* before, while, or after you switch the write region. Your application continues to be highly available.

> [!WARNING]
>  In the event of a write region outage, where the Azure Cosmos DB account promotes a secondary region to be the new primary write region via *service-managed failover*, the original write region will **not be be promoted back as the write region automatically** once it is recovered. It is your responsibility to switch back to the recovered region as the write region using [PowerShell, the Azure CLI, or the Azure portal](../cosmos-db/how-to-manage-database-account.yml#perform-manual-failover-on-an-azure-cosmos-db-account) (once safe to do so, as described above).  


#### Outage detection, notification, and management

For single-region accounts, clients experience a loss of read and write availability during an Azure Cosmos DB region outage. Multiple-region accounts experience different behaviors, as described in the following table.

| Write regions | Service-managed failover | What to expect | What to do |
| -- | -- | -- | -- |
| Single write region | Not enabled | If there's an outage in a read region when you're not using strong consistency, all clients redirect to other regions. There's no read or write availability loss, and there's no data loss. When you use strong consistency, an outage in a read region can affect write availability if fewer than two read regions remain.<br/><br/> If there's an outage in the write region, clients experience write availability loss. If you didn't select strong consistency, the service might not replicate some data to the remaining active regions. This replication depends on the selected [consistency level](../cosmos-db/consistency-levels.md#rto). If the affected region suffers permanent data loss, you might lose unreplicated data. <br/><br/> Azure Cosmos DB restores write availability when the outage ends. | During the outage, ensure that there are enough provisioned RUs in the remaining regions to support read traffic. <br/><br/> *Don't* trigger a manual failover during the outage, because it can't succeed. <br/><br/> When the outage is over, readjust provisioned RUs as appropriate. |
| Single write region | Enabled | If there's an outage in a read region when you're not using strong consistency, all clients redirect to other regions. There's no read or write availability loss, and there's no data loss. When you're using strong consistency, the outage of a read region can affect write availability if fewer than two read regions remain.<br/><br/> If there's an outage in the write region, clients experience write availability loss until Azure Cosmos DB elects a new region as the new write region according to your preferences. If you didn't select strong consistency, the service might not replicate some data to the remaining active regions. This replication depends on the selected [consistency level](../cosmos-db/consistency-levels.md#rto). If the affected region suffers permanent data loss, you might lose unreplicated data. | During the outage, ensure that there are enough provisioned RUs in the remaining regions to support read traffic. <br/><br/> *Don't* trigger a manual failover during the outage, because it can't succeed. <br/><br/> When the outage is over, you can move the write region back to the original region and readjust provisioned RUs as appropriate. Accounts that use the API for NoSQL can also recover the unreplicated data in the failed region from your [conflict feed](../cosmos-db/how-to-manage-conflicts.md#read-from-conflict-feed). |
| Multiple write regions | Not applicable | Recently updated data in the failed region might be unavailable in the remaining active regions. Eventual, consistent prefix, and session consistency levels guarantee a staleness of less than 15 minutes. Bounded staleness guarantees fewer than *K* updates or *T* seconds, depending on the configuration. If the affected region suffers permanent data loss, you might lose unreplicated data. | During the outage, ensure that there are enough provisioned RUs in the remaining regions to support more traffic. <br/><br/> When the outage is over, you can readjust provisioned RUs as appropriate. If possible, Azure Cosmos DB recovers unreplicated data in the failed region. This recovery uses the conflict resolution method that you configure for accounts that use the API for NoSQL. For accounts that use other APIs, this recovery uses *last write wins*. |


#### Testing for high availability

Even if your Azure Cosmos DB account is highly available, your application might not be correctly designed to remain highly available. To test the end-to-end high availability of your application as a part of your application testing or disaster recovery (DR) drills, temporarily disable service-managed failover for the account. Invoke [manual failover by using PowerShell, the Azure CLI, or the Azure portal](../cosmos-db/how-to-manage-database-account.yml#perform-manual-failover-on-an-azure-cosmos-db-account), and then monitor your application. After you complete the test, you can fail back over to the primary region and restore service-managed failover for the account.

  > [!IMPORTANT]
  > Don't invoke manual failover during an Azure Cosmos DB outage on either the source or destination region. Manual failover requires region connectivity to maintain data consistency, so it won't succeed.

## Related content


* [Consistency levels in Azure Cosmos DB](../cosmos-db/consistency-levels.md)

* [Request Units in Azure Cosmos DB](../cosmos-db/request-units.md)

* [Global data distribution with Azure Cosmos DB - under the hood](../cosmos-db/global-dist-under-the-hood.md)

* [Consistency levels in Azure Cosmos DB](../cosmos-db/consistency-levels.md)

* [Configure multi-region writes in your applications that use Azure Cosmos DB](../cosmos-db/how-to-multi-master.md)

* [Diagnose and troubleshoot the availability of Azure Cosmos DB SDKs in multiregional environments](../cosmos-db/troubleshoot-sdk-availability.md)


* [Reliability in Azure](availability-zones-overview.md)
