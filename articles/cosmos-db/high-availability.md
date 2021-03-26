---
title: High availability in Azure Cosmos DB 
description: This article describes how Azure Cosmos DB provides high availability
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 02/05/2021
ms.author: mjbrown
ms.reviewer: sngun

---

# How does Azure Cosmos DB provide high availability
[!INCLUDE[appliesto-all-apis](includes/appliesto-all-apis.md)]

Azure Cosmos DB provides high availability in two primary ways. First, Azure Cosmos DB replicates data across regions configured within a Cosmos account. Second, Azure Cosmos DB maintains 4 replicas of data within a region.

Azure Cosmos DB is a globally distributed database service and is a foundational service available in [all regions where Azure is available](https://azure.microsoft.com/global-infrastructure/services/?products=cosmos-db&regions=all). You can associate any number of Azure regions with your Azure Cosmos account and your data is automatically and transparently replicated. You can add or remove a region to your Azure Cosmos account at any time. Cosmos DB is available in all five distinct Azure cloud environments available to customers:

* **Azure public** cloud, which is available globally.

* **Azure China 21Vianet** is available through a unique partnership between Microsoft and 21Vianet, one of the country’s largest internet providers in China.

* **Azure Germany** provides services under a data trustee model, which ensures that customer data remains in Germany under the control of T-Systems International GmbH, a subsidiary of Deutsche Telekom, acting as the German data trustee.

* **Azure Government** is available in four regions in the United States to US government agencies and their partners.

* **Azure Government for Department of Defense (DoD)** is available in two regions in the United States to the US Department of Defense.

Within a region, Azure Cosmos DB maintains four copies of your data as replicas within physical partitions as shown in the following image:

:::image type="content" source="./media/high-availability/cosmosdb-data-redundancy.png" alt-text="Physical partitioning" border="false":::

* The data within Azure Cosmos containers is [horizontally partitioned](partitioning-overview.md).

* A partition-set is a collection of multiple replica-sets. Within each region, every partition is protected by a replica-set with all writes replicated and durably committed by a majority of replicas. Replicas are distributed across as many as 10-20 fault domains.

* Each partition across all the regions is replicated. Each region contains all the data partitions of an Azure Cosmos container and can serve reads as well as serve writes when multi-region writes is enabled.  

If your Azure Cosmos account is distributed across *N* Azure regions, there will be at least *N* x 4 copies of all your data. Having an Azure Cosmos account in more than 2 regions improves the availability of your application and provides low latency across the associated regions.

## SLAs for availability

Azure Cosmos DB provides comprehensive SLAs that encompass throughput, latency at the 99th percentile, consistency, and high availability. The table below shows the guarantees for high availability provided by Azure Cosmos DB for single and multi-region accounts. For higher write availability, configure your Azure Cosmos account to have multiple write regions.

|Operation type  | Single-region |Multi-region (single-region writes)|Multi-region (multi-region writes) |
|---------|---------|---------|-------|
|Writes    | 99.99    |99.99   |99.999|
|Reads     | 99.99    |99.999  |99.999|

> [!NOTE]
> In practice, the actual write availability for bounded staleness, session, consistent prefix and eventual consistency models is significantly higher than the published SLAs. The actual read availability for all consistency levels is significantly higher than the published SLAs.

## High availability with Azure Cosmos DB in the event of regional outages

For the rare cases of regional outage, Azure Cosmos DB makes sure your database is always highly available. The following details capture Azure Cosmos DB behavior during an outage, depending on your Azure Cosmos account configuration:

* With Azure Cosmos DB, before a write operation is acknowledged to the client, the data is durably committed by a quorum of replicas within the region that accepts the write operations. For more details, see [Consistency levels and throughput](./consistency-levels.md#consistency-levels-and-throughput)

* Multi-region accounts configured with multiple-write regions will be highly available for both writes and reads. Regional failovers are detected and handled in the Azure Cosmos DB client. They are also instantaneous and don't require any changes from the application.

* Single-region accounts may lose availability following a regional outage. It's always recommended to set up **at least two regions** (preferably, at least two write regions) with your Azure Cosmos account to ensure high availability at all times.

### Multi-region accounts with a single-write region (write region outage)

* During a write region outage, the Azure Cosmos account will automatically promote a secondary region to be the new primary write region when **enable automatic failover** is configured on the Azure Cosmos account. When enabled, the failover will occur to another region in the order of region priority you've specified.

* Note that manual failover should not be triggered and will not succeed in presence of an outage of the source or destination region. This is because of a consistency check required by the failover procedure which requires connectivity between the regions.

* When the previously impacted region is back online, any write data that was not replicated when the region failed, is made available through the [conflicts feed](how-to-manage-conflicts.md#read-from-conflict-feed). Applications can read the conflicts feed, resolve the conflicts based on the application-specific logic, and write the updated data back to the Azure Cosmos container as appropriate.

* Once the previously impacted write region recovers, it becomes automatically available as a read region. You can switch back to the recovered region as the write region. You can switch the regions by using [PowerShell, Azure CLI or Azure portal](how-to-manage-database-account.md#manual-failover). There is **no data or availability loss** before, during or after you switch the write region and your application continues to be highly available.

> [!IMPORTANT]
> It is strongly recommended that you configure the Azure Cosmos accounts used for production workloads to **enable automatic failover**. This enables Cosmos DB to failover the account databases to availabile regions automatically. In the absence of this configuration, the account will experience loss of write availability for all the duration of the write region outage, as manual failover will not succeed due to lack of region connectivity.

### Multi-region accounts with a single-write region (read region outage)

* During a read region outage, Azure Cosmos accounts using any consistency level or strong consistency with three or more read regions will remain highly available for reads and writes.

* Azure Cosmos accounts using strong consistency with three regions (one write, two read) will maintain write availability during a read region outage. For accounts with two regions and automatic failover enabled, the account will stop accepting writes until the region is marked as failed and automatic failover occurs.

* The impacted region is automatically disconnected and will be marked offline. The [Azure Cosmos DB SDKs](sql-api-sdk-dotnet.md) will redirect read calls to the next available region in the preferred region list.

* If none of the regions in the preferred region list is available, calls automatically fall back to the current write region.

* No changes are required in your application code to handle read region outage. When the impacted read region is back online it will automatically sync with the current write region and will be available again to serve read requests.

* Subsequent reads are redirected to the recovered region without requiring any changes to your application code. During both failover and rejoining of a previously failed region, read consistency guarantees continue to be honored by Azure Cosmos DB.

* Even in a rare and unfortunate event when the Azure region is permanently irrecoverable, there is no data loss if your multi-region Azure Cosmos account is configured with *Strong* consistency. In the event of a permanently irrecoverable write region, a multi-region Azure Cosmos account configured with bounded-staleness consistency, the potential data loss window is restricted to the staleness window (*K* or *T*) where K=100,000 updates or T=5 minutes, which ever happens first. For session, consistent-prefix and eventual consistency levels, the potential data loss window is restricted to a maximum of 15 minutes. For more information on RTO and RPO targets for Azure Cosmos DB, see [Consistency levels and data durability](./consistency-levels.md#rto)

## Availability Zone support

In addition to cross region resiliency, Azure Cosmos DB also supports **zone redundancy** in supported regions when selecting a region to associate with your Azure Cosmos account.

With Availability Zone (AZ) support, Azure Cosmos DB will ensure replicas are placed across multiple zones within a given region to provide high availability and resiliency to zonal failures. Availability Zones provide a 99.995% availability SLA with no changes to latency. In the event of a single zone failure, zone redundancy provides full data durability with RPO=0 and availability with RTO=0. Zone redundancy is a supplemental capability to regional replication. Zone redundancy alone cannot be relied upon to achieve regional resiliency.

Zone redundancy can only be configured when adding a new region to an Azure Cosmos account. For existing regions, zone redundancy can be enabled by removing the region then adding it back with the zone redundancy enabled. For a single region account, this requires adding one additional region to temporarily failover to, then removing and adding the desired region with zone redundancy enabled.

When configuring multi-region writes for your Azure Cosmos account, you can opt into zone redundancy at no extra cost. Otherwise, please see the table below regarding pricing for zone redundancy support. For a list of regions where availability zones is available, see the [Availability zones](../availability-zones/az-region.md).

The following table summarizes the high availability capability of various account configurations:

|KPI|Single-region without AZs|Single-region with AZs|Multi-region, single-region writes with AZs|Multi-region, multi-region writes with AZs|
|---------|---------|---------|---------|---------|
|Write availability SLA | 99.99% | 99.995% | 99.995% | 99.999% |
|Read availability SLA  | 99.99% | 99.995% | 99.995% | 99.999% |
|Zone failures – data loss | Data loss | No data loss | No data loss | No data loss |
|Zone failures – availability | Availability loss | No availability loss | No availability loss | No availability loss |
|Regional outage – data loss | Data loss |  Data loss | Dependent on consistency level. See [Consistency, availability, and performance tradeoffs](./consistency-levels.md) for more information. | Dependent on consistency level. See [Consistency, availability, and performance tradeoffs](./consistency-levels.md) for more information.
|Regional outage – availability | Availability loss | Availability loss | No availability loss for read region failure, temporary for write region failure | No availability loss |
|Price (***1***) | N/A | Provisioned RU/s x 1.25 rate | Provisioned RU/s x 1.25 rate (***2***) | Multi-region write rate |

***1*** For Serverless accounts request units (RU) are multiplied by a factor of 1.25.

***2*** 1.25 rate only applied to those regions in which AZ is enabled.

Availability Zones can be enabled via:

* [Azure portal](how-to-manage-database-account.md#addremove-regions-from-your-database-account)

* [Azure PowerShell](manage-with-powershell.md#create-account)

* [Azure CLI](manage-with-cli.md#add-or-remove-regions)

* [Azure Resource Manager templates](./manage-with-templates.md)

## Building highly available applications

* Review the expected [behavior of the Azure Cosmos SDKs](troubleshoot-sdk-availability.md) during these events and which are the configurations that affect it.

* To ensure high write and read availability, configure your Azure Cosmos account to span at least two regions with multiple-write regions. This configuration will provide the highest availability, lowest latency, and best scalability for both reads and writes backed by SLAs. To learn more, see how to [configure your Azure Cosmos account with multiple write-regions](tutorial-global-distribution-sql-api.md).

* For multi-region Azure Cosmos accounts that are configured with a single-write region, [enable automatic-failover by using Azure CLI or Azure portal](how-to-manage-database-account.md#automatic-failover). After you enable automatic failover, whenever there is a regional disaster, Cosmos DB will automatically failover your account.  

* Even if your Azure Cosmos account is highly available, your application may not be correctly designed to remain highly available. To test the end-to-end high availability of your application, as a part of your application testing or disaster recovery (DR) drills, temporarily disable automatic-failover for the account, invoke the [manual failover by using PowerShell, Azure CLI or Azure portal](how-to-manage-database-account.md#manual-failover), then monitor your application's failover. Once complete, you can fail back over to the primary region and restore automatic-failover for the account.

> [!IMPORTANT]
> Do not invoke manual failover during a Cosmos DB outage on either the source or destination regions, as it requires regions connectivity to maintain data consistency and it will not succeed.

* Within a globally distributed database environment, there is a direct relationship between the consistency level and data durability in the presence of a region-wide outage. As you develop your business continuity plan, you need to understand the maximum acceptable time before the application fully recovers after a disruptive event. The time required for an application to fully recover is known as recovery time objective (RTO). You also need to understand the maximum period of recent data updates the application can tolerate losing when recovering after a disruptive event. The time period of updates that you might afford to lose is known as recovery point objective (RPO). To see the RPO and RTO for Azure Cosmos DB, see [Consistency levels and data durability](./consistency-levels.md#rto)

## What to expect during a Cosmos DB region outage

For single-region accounts, clients will experience loss of read and write availability.

Multi-region accounts will experience different behaviors depending on the following table.

| Write regions | Automatic failover | What to expect | What to do |
| -- | -- | -- | -- |
| Single write region | Not enabled | In case of outage in a read region, all clients will redirect to other regions. No read or write availability loss. No data loss. <p/> In case of an outage in the write region, clients will experience write availability loss. If strong consistency level is not selected, some data may not have been replicated to the remaining active regions. This depends on the consistenvy level selected as described in [this section](consistency-levels#rto). If the affected region suffers permanent data loss, unreplicated data may be lost. <p/> Cosmos DB will restore write availability automatically when the outage ends. | During the outage, ensure that there are enough provisioned RUs in the remaining regions to support read traffic. <p/> Do *not* trigger a manual failover during the outage, as it will not succeed. <p/> When the outage is over, re-adjust provisioned RUs as appropriate. |
| Single write region | Enabled | In case of outage in a read region, all clients will redirect to other regions. No read or write availability loss. No data loss. <p/> In case of an outage in the write region, clients will experience write availability loss until Cosmos DB automatically elects a new region as the new write region according to your preferences. If strong consistency level is not selected, some data may not have been replicated to the remaining active regions. This depends on the consistenvy level selected as described in [this section](consistency-levels#rto). If the affected region suffers permanent data loss, unreplicated data may be lost. | During the outage, ensure that there are enough provisioned RUs in the remaining regions to support read traffic. <p/> Do *not* trigger a manual failover during the outage, as it will not succeed. <p/> When the outage is over, you may move the write region back to the original region, and re-adjust provisioned RUs as appropriate. Accounts using SQL APIs may also recover the non-replicated data in the failed region from your [conflicts feed](how-to-manage-conflicts.md#read-from-conflict-feed). |
| Multiple write regions | Not applicable | No read or write availability loss. <p/> Recently updated data in the failed region may be unavilable in the remaining active regions. Eventual, consistent prefix, and session consistency levels guarantee a staleness of <15mins. Bounded staleness guarantees less than K updates or T seconds, depending on the configuration. If the affected region suffers permanent data loss, unreplicated data may be lost. | During the outage, ensure that there are enough provisioned RUs in the remaining regions to support additional traffic. <p/> When the outage is over, you may re-adjust provisioned RUs as appropriate. If possible, Cosmos DB will automatically recover non-replicated data in the failed region using the configured conflict resolution method for SQL API accounts, and Last Write Wins for the others. |

## Next steps

Next you can read the following articles:

* [Availability and performance tradeoffs for various consistency levels](./consistency-levels.md)

* [Globally scaling provisioned throughput](./request-units.md)

* [Global distribution - under the hood](global-dist-under-the-hood.md)

* [Consistency levels in Azure Cosmos DB](consistency-levels.md)

* [How to configure your Cosmos account with multiple write regions](how-to-multi-master.md)

* [SDK behavior on multi-regional environments](troubleshoot-sdk-availability.md)