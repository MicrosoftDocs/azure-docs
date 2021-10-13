---
title: High availability in Azure Cosmos DB 
description: This article describes how to build a highly available solution using Cosmos DB
author: elioda
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 07/07/2021
ms.author: elioda
ms.reviewer: sngun

---

# Achieve high availability with Cosmos DB
[!INCLUDE[appliesto-all-apis](includes/appliesto-all-apis.md)]

To build a highly-available solution, you have to evaluate the reliability characteristics of all its components. Cosmos DB is designed to provide multiple features and configuration options to achieve high availability for all solutions' availability needs.

We will use the terms **RTO** (Recovery Time Objective), to indicate the time between the beginning of an outage impacting Cosmos DB and the recovery to full availability, and **RPO** (Recovery Point Objective), to indicate the time between the last write correctly restored and the time of the beginning of the outage affecting Cosmos DB.

> [!NOTE]
> Expected and maximum RPOs and RTOs depend on the kind of outage that Cosmos DB is experiencing. For instance, an outage of a single node will have different expected RTO and RPO than a whole region outage.

This article details the events that can affect Cosmos DB availability and the corresponding Cosmos DB configuration options to achieve the availability characteristics required by your solution.

## Node maintenance
Cosmos DB is a fully-managed multi-tenant service that manages all details of individual compute nodes transparently. Users do not have to worry about any kind of patching and planned maintenance. Using redundancy and with no user involvement, Cosmos DB guarantees SLAs for availability and P99 latency through all automatic maintenance operations performed by the system.

Refer to the [SLAs section](#SLAs) for the guaranteed availability SLAs.

## Node outages
Node outages refer to outages of individual nodes in a Cosmos DB cluster deployed in an Azure region.
Cosmos DB automatically mitigates node outages by guaranteeing at least two replicas of your data at all times in each Azure region where your account is deployed.
This results in RTO = 0 and and RPO = 0, for individual node outages, with no application changes or configurations required.

In many Azure regions, it is possible to distribute your Cosmos DB cluster across **availability zones**, which results increased SLAs, as availability zones are physically separate and provide distinct power source, network, and cooling. See [Availability Zones](https://docs.microsoft.com/en-us/azure/architecture/reliability/architect).
When using this option, Cosmos DB provides RTO = 0 and and RPO = 0 even in case of outages of a whole availability zone.

When deploying in a single Azure region, with no extra user input, Cosmos DB is resilient to node outages. Enabling redundancy across availability zones makes Cosmos DB resilient to entire availability zone outages at the cost of increased charges. Both SLAs and price are reported in the [SLAs section](#SLAs).

Zone redundancy can only be configured when adding a new region to an Azure Cosmos account. For existing regions, zone redundancy can be enabled by removing the region then adding it back with the zone redundancy enabled. For a single region account, this requires adding one additional region to temporarily failover to, then removing and adding the desired region with zone redundancy enabled.

By default, a Cosmos DB account does not use multiple availability zones. You can enable deployment across multiple availability zones in the following ways:

* [Azure portal](how-to-manage-database-account.md#addremove-regions-from-your-database-account)

If your Azure Cosmos account is distributed across *N* Azure regions, there will be *N* x 4 copies of all your data. For a more detailed overview of data distribution, see [Global data distribution under the hood](global-dist-under-the-hood.md). Having an Azure Cosmos account in more than 2 regions improves the availability of your application and provides low latency across the associated regions.

* [Azure CLI](sql/manage-with-cli.md#add-or-remove-regions)

* [Azure Resource Manager templates](./manage-with-templates.md)

Refer to [Global distribution with Azure Cosmos DB- under the hood](./global-dist-under-the-hood.md) for more information on how Cosmos DB replicates data in each region.

## Region outages
Region outages refer to outages that affect all Cosmos DB nodes in an Azure region, across all availability zones.
In the rare cases of region outages, Cosmos DB can be configured to support various outcomes of durability and availability.

### Durability
In case of Cosmos DB accounts that use a single region, most of the times no data loss occurs and data access is restored after Cosmos DB services recovers in the affected region. Data loss may occur only in case of unrecoverable disasters in the Cosmos DB region.

You can configure Cosmos DB to continuously create backup copies in multiple regions. Backup copies lag a few minutes compared to the database, but protect against complete data loss that may result from catastrophic distasters in a region.
Refer to [Configure Azure Cosmos DB account with periodic backup](./configure-periodic-backup-restore.md) and [Continuous backup](./migrate-continuous-backup.md) for more information on Cosmos DB backups.

In case of Cosmos DB accounts in multiple regions, data durability depends on the consistency level configured on the account. The following table details, for all consistency levels, the RPO of Cosmos DB account deployed in at least 2 regions.

|**Consistency level**|**RPO in case of region outage**|
|---------|---------|
|Session, Consistent Prefix, Eventual|< 15 minutes|
|Bounded Staleness|*K* & *T*|
|Strong|0|

*K* = The number of *"K"* versions (i.e., updates) of an item.

*T* = The time interval *"T"* since the last update.

For multi-region accounts the minimum value of *K* and *T* is 100,000 write operations or 300 seconds. This defines the minimum RPO for data when using Bounded Staleness.

Refer to [Consistency levels](./consistency-levels.md) for more information on the differences between consistency levels.

### Availability
If your solution requires continuous availability in case of region outages, Cosmos DB can be configured to replicate your data across multiple regions and to transparently failover to available regions when required. 

Single-region accounts may lose availability following a regional outage. To ensure high availability at all times it's recommended to set up your Azure Cosmos DB account with **a single write region and at least a second (read) region** and enable **Service-Managed failover**.

Service-managed failover allows Cosmos DB to failover the write region of multi-region account, in order to preserve availability at the cost of data loss as per [durability section](#durability). Regional failovers are detected and handled in the Azure Cosmos DB client. They don't require any changes from the application.
Refer to [How to manage an Azure Cosmos DB account](./how-to-manage-database-account.md) for the instructions on how to enable multiple read regions and service-managed failover.

> [!IMPORTANT]
> It is strongly recommended that you configure the Azure Cosmos accounts used for production workloads to **enable automatic failover**. This enables Cosmos DB to failover the account databases to available regions automatically. In the absence of this configuration, the account will experience loss of write availability for all the duration of the write region outage, as manual failover will not succeed due to lack of region connectivity.

### Multiple write regions
Azure Cosmos DB can be configured to accept writes in multiple regions. This is useful to reduce write latency in geographically distributed applications. When using multiple write regions, strong consistency is not supported and write conflicts may arise. Refer to [Conflict types and resolution policies when using multiple write regions](./conflict-resolution-policies.md) for more information on how resolve conflicts in multiple write region configurations.

Given the internal Azure Cosmos DB architecture, using multiple write regions does not guarantee write availability during a region outage. The best configuration to achieve high availability in case of region outage is single write region with service-managed failover.

### What to expect during a region outage
Client of single-region accounts will experience loss of read and write availability until service is restored.

Multi-region accounts will experience different behaviors depending on the following table.

| Configuration | Outage | Availability impact | Durability impact| What to do |
| -- | -- | -- | -- | -- |
| Single write region  | Read region outage | All clients will automatically redirect reads to other regions. No read or write availability loss for all configurations, except 2 regions with strong consistency which loses write availability until the service is restored or, if **service-managed failover** is enabled, the region is marked as failed and a failover occurs. | No data loss. | During the outage, ensure that there are enough provisioned RUs in the remaining regions to support read traffic. <p/> When the outage is over, re-adjust provisioned RUs as appropriate. |
| Single write region | Write region outage | Clients will redirect reads to other regions. <p/> **Without service-manages failover**, clients will experience write availability loss, until write availability is restored automatically when the outage ends. <p/> **With service-managed failover** clients will experience write availability loss until the services manages a failover to a new write region selected according to your preferences. | If strong consistency level is not selected, some data may not have been replicated to the remaining active regions. This depends on the consistency level selected as described in [this section](consistency-levels.md#rto). If the affected region suffers permanent data loss, unreplicated data may be lost. | During the outage, ensure that there are enough provisioned RUs in the remaining regions to support read traffic. <p/> Do *not* trigger a manual failover during the outage, as it will not succeed. <p/> When the outage is over, re-adjust provisioned RUs as appropriate. Accounts using SQL APIs may also recover the non-replicated data in the failed region from your [conflicts feed](how-to-manage-conflicts.md#read-from-conflict-feed). |
| Multiple write regions | Any regional outage | Possibility of temporary write availability loss, analogously to single write region with service-managed failover. | Recently updated data in the failed region may be unavailable in the remaining active regions, depending on the selected [consistency level](consistency-levels.md). If the affected region suffers permanent data loss, unreplicated data may be lost. | During the outage, ensure that there are enough provisioned RUs in the remaining regions to support additional traffic. <p/> When the outage is over, you may re-adjust provisioned RUs as appropriate. If possible, Cosmos DB will automatically recover non-replicated data in the failed region using the configured conflict resolution method for SQL API accounts, and Last Write Wins for accounts using other APIs. |

### Additional informations on read region outages

* The impacted region is automatically disconnected and will be marked offline. The [Azure Cosmos DB SDKs](sql-api-sdk-dotnet.md) will redirect read calls to the next available region in the preferred region list.

* If none of the regions in the preferred region list is available, calls automatically fall back to the current write region.

* No changes are required in your application code to handle read region outage. When the impacted read region is back online it will automatically sync with the current write region and will be available again to serve read requests.

* Subsequent reads are redirected to the recovered region without requiring any changes to your application code. During both failover and rejoining of a previously failed region, read consistency guarantees continue to be honored by Azure Cosmos DB.

* Even in a rare and unfortunate event when the Azure region is permanently irrecoverable, there is no data loss if your multi-region Azure Cosmos account is configured with *Strong* consistency. In the rare event of a permanently irrecoverable write region, a multi-region Azure Cosmos account has the durability characteristics specified in the [Durability](#durability) section.

### Additional informations on write region outages

* During a write region outage, the Azure Cosmos account will automatically promote a secondary region to be the new primary write region when **service-managed failover** is configured on the Azure Cosmos account. The failover will occur to another region in the order of region priority you've specified.

* Note that manual failover should not be triggered and will not succeed in presence of an outage of the source or destination region. This is because of a consistency check required by the failover procedure which requires connectivity between the regions.

* When the previously impacted region is back online, any write data that was not replicated when the region failed, is made available through the [conflicts feed](how-to-manage-conflicts.md#read-from-conflict-feed). Applications can read the conflicts feed, resolve the conflicts based on the application-specific logic, and write the updated data back to the Azure Cosmos container as appropriate.

* Once the previously impacted write region recovers, it becomes automatically available as a read region. You can switch back to the recovered region as the write region. You can switch the regions by using [PowerShell, Azure CLI or Azure portal](how-to-manage-database-account.md#manual-failover). There is **no data or availability loss** before, during or after you switch the write region and your application continues to be highly available.

## SLAs
The following table summarizes the high availability capability of various account configurations:

|KPI|Single-region without AZs|Single-region with AZs|Multi-region, single-region writes without AZs|Multi-region, single-region writes with AZs|Multi-region, multi-region writes with or without AZs|
|---------|---------|---------|---------|---------|---------|
|Write availability SLA | 99.99% | 99.995% | 99.99% | 99.995% | 99.999% |
|Read availability SLA  | 99.99% | 99.995% | 99.999% | 99.999% | 99.999% |
|Zone failures – data loss | Data loss | No data loss | No data loss | No data loss | No data loss |
|Zone failures – availability | Availability loss | No availability loss | No availability loss | No availability loss | No availability loss |
|Regional outage – data loss | Data loss |  Data loss | Dependent on consistency level. See [Consistency, availability, and performance tradeoffs](./consistency-levels.md) for more information. | Dependent on consistency level. See [Consistency, availability, and performance tradeoffs](./consistency-levels.md) for more information. | Dependent on consistency level. See [Consistency, availability, and performance tradeoffs](./consistency-levels.md) for more information.
|Regional outage – availability | Availability loss | Availability loss | No availability loss for read region failure, temporary for write region failure | No availability loss for read region failure, temporary for write region failure | No availability loss |
|Price (***1***) | N/A | Provisioned RU/s x 1.25 rate | Provisioned RU/s x n regions | Provisioned RU/s x 1.25 rate x n regions (***2***) | Multi-region write rate x n regions |

***1*** For Serverless accounts request units (RU) are multiplied by a factor of 1.25.

***2*** 1.25 rate only applied to those regions in which AZ is enabled.

> [!IMPORTANT]
> Given the internal Azure Cosmos DB architecture, using multiple write regions does not guarantee write availability during a region outage. The best configuration to achieve high availability in case of region outage is single write region with service-managed failover.

## Building highly available applications

* Review the expected [behavior of the Azure Cosmos SDKs](troubleshoot-sdk-availability.md) during these events and which are the configurations that affect it.

* To ensure high write and read availability, configure your Azure Cosmos account to span at least two regions and three, if using strong consistency. Remember that the best configuration to achieve high availability in case of region outage is single write region with service-managed failover. To learn more, see how to [configure your Azure Cosmos account with multiple write-regions](tutorial-global-distribution-sql-api.md).

* For multi-region Azure Cosmos accounts that are configured with a single-write region, [enable service-managed failover by using Azure CLI or Azure portal](how-to-manage-database-account.md#automatic-failover). After you enable automatic failover, whenever there is a regional disaster, Cosmos DB will failover your account without any user inputs.

* Even if your Azure Cosmos account is highly available, your application may not be correctly designed to remain highly available. To test the end-to-end high availability of your application, as a part of your application testing or disaster recovery (DR) drills, temporarily disable automatic-failover for the account, invoke the [manual failover by using PowerShell, Azure CLI or Azure portal](how-to-manage-database-account.md#manual-failover), then monitor your application's failover. Once complete, you can fail back over to the primary region and restore automatic-failover for the account.

> [!IMPORTANT]
> Do not invoke manual failover during a Cosmos DB outage on either the source or destination regions, as it requires regions connectivity to maintain data consistency and it will not succeed.

* Within a globally distributed database environment, there is a direct relationship between the consistency level and data durability in the presence of a region-wide outage. As you develop your business continuity plan, you need to understand the maximum acceptable time before the application fully recovers after a disruptive event. The time required for an application to fully recover is known as recovery time objective (RTO). You also need to understand the maximum period of recent data updates the application can tolerate losing when recovering after a disruptive event. The time period of updates that you might afford to lose is known as recovery point objective (RPO). To see the RPO and RTO for Azure Cosmos DB, see [Consistency levels and data durability](./consistency-levels.md#rto)

## What to expect during a Cosmos DB region outage

For single-region accounts, clients will experience loss of read and write availability.

Multi-region accounts will experience different behaviors depending on the following table.

| Write regions | Automatic failover | What to expect | What to do |
| -- | -- | -- | -- |
| Single write region | Not enabled | In case of outage in a read region, all clients will redirect to other regions. No read or write availability loss. No data loss. <p/> In case of an outage in the write region, clients will experience write availability loss. If strong consistency level is not selected, some data may not have been replicated to the remaining active regions. This depends on the consistency level selected as described in [this section](consistency-levels.md#rto). If the affected region suffers permanent data loss, unreplicated data may be lost. <p/> Cosmos DB will restore write availability automatically when the outage ends. | During the outage, ensure that there are enough provisioned RUs in the remaining regions to support read traffic. <p/> Do *not* trigger a manual failover during the outage, as it will not succeed. <p/> When the outage is over, re-adjust provisioned RUs as appropriate. |
| Single write region | Enabled | In case of outage in a read region, all clients will redirect to other regions. No read or write availability loss. No data loss. <p/> In case of an outage in the write region, clients will experience write availability loss until Cosmos DB automatically elects a new region as the new write region according to your preferences. If strong consistency level is not selected, some data may not have been replicated to the remaining active regions. This depends on the consistency level selected as described in [this section](consistency-levels.md#rto). If the affected region suffers permanent data loss, unreplicated data may be lost. | During the outage, ensure that there are enough provisioned RUs in the remaining regions to support read traffic. <p/> Do *not* trigger a manual failover during the outage, as it will not succeed. <p/> When the outage is over, you may move the write region back to the original region, and re-adjust provisioned RUs as appropriate. Accounts using SQL APIs may also recover the non-replicated data in the failed region from your [conflicts feed](how-to-manage-conflicts.md#read-from-conflict-feed). |
| Multiple write regions | Not applicable | No read or write availability loss. <p/> Recently updated data in the failed region may be unavailable in the remaining active regions. Eventual, consistent prefix, and session consistency levels guarantee a staleness of <15mins. Bounded staleness guarantees less than K updates or T seconds, depending on the configuration. If the affected region suffers permanent data loss, unreplicated data may be lost. | During the outage, ensure that there are enough provisioned RUs in the remaining regions to support additional traffic. <p/> When the outage is over, you may re-adjust provisioned RUs as appropriate. If possible, Cosmos DB will automatically recover non-replicated data in the failed region using the configured conflict resolution method for SQL API accounts, and Last Write Wins for accounts using other APIs. |

## Next steps

Next you can read the following articles:

* [Availability and performance tradeoffs for various consistency levels](./consistency-levels.md)

* [Globally scaling provisioned throughput](./request-units.md)

* [Global distribution - under the hood](global-dist-under-the-hood.md)

* [Consistency levels in Azure Cosmos DB](consistency-levels.md)

* [How to configure your Cosmos account with multiple write regions](how-to-multi-master.md)

* [SDK behavior on multi-regional environments](troubleshoot-sdk-availability.md)