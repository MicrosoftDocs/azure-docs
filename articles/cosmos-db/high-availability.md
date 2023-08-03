---
title: High availability in Azure Cosmos DB 
description: This article describes how to build a highly available solution by using Azure Cosmos DB
author: seesharprun
ms.service: cosmos-db
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 02/24/2022
ms.author: sidandrews
ms.reviewer: mjbrown
---

# Achieve high availability with Azure Cosmos DB

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

To build a solution with high availability, you have to evaluate the reliability characteristics of all its components. Azure Cosmos DB provides features and configuration options to help you achieve high availability for your solution.

This article uses the following terms:

* **Recovery time objective (RTO)**: The time between the beginning of an outage that affects Azure Cosmos DB and the recovery to full availability.
* **Recovery point objective (RPO)**: The time between the last write that was correctly restored and the time of the beginning of the outage that affects Azure Cosmos DB.

> [!NOTE]
> Expected and maximum RPOs and RTOs depend on the kind of outage that Azure Cosmos DB is experiencing. For instance, an outage of a single node has different expected RTO and RPO than the outage of a whole region.

This article details the events that can affect Azure Cosmos DB availability and the corresponding Azure Cosmos DB configuration options.

## Replica maintenance

Azure Cosmos DB is a multitenant service that manages all details of individual compute nodes transparently. Users don't have to worry about any kind of patching or planned maintenance. Azure Cosmos DB guarantees [SLAs for availability](#slas) and P99 latency through all automatic maintenance operations that the system performs.

## Replica outages

*Replica outages* are outages of individual nodes in an Azure Cosmos DB cluster that's deployed in an Azure region.

Azure Cosmos DB automatically mitigates replica outages by guaranteeing at least three replicas of your data in each Azure region for your account within a four-replica quorum. This guarantee results in an RTO of 0 and an RPO of 0 for individual node outages, without requiring application changes or configurations.

In many Azure regions, it's possible to distribute your Azure Cosmos DB cluster across [availability zones](/azure/architecture/reliability/architect). Availability zones can increase SLAs because they're physically separate and provide a distinct power source, network, and cooling. When you deploy an Azure Cosmos DB account by using availability zones, Azure Cosmos DB provides an RTO of 0 and an RPO of 0, even in a zone outage.

When you deploy in a single Azure region, with no extra user input, Azure Cosmos DB is resilient to node outages. Enabling redundancy across availability zones makes Azure Cosmos DB resilient to zone outages at the cost of increased [charges](#slas).

You can configure zone redundancy only when you're adding a new region to an Azure Cosmos DB account. For existing regions, you can enable zone redundancy by removing the region then adding it back with the zone redundancy enabled. For a single-region account, this approach requires you to add a region to temporarily fail over to, and then remove and add the desired region with zone redundancy enabled.

By default, an Azure Cosmos DB account doesn't use multiple availability zones. You can enable deployment across multiple availability zones in the following ways:

* [Azure portal](how-to-manage-database-account.md#addremove-regions-from-your-database-account)

* [Azure CLI](sql/manage-with-cli.md#add-or-remove-regions)

* [Azure Resource Manager templates](./manage-with-templates.md)

If your Azure Cosmos DB account is distributed across *N* Azure regions, there will be *N* x 4 copies of all your data. For more information on how Azure Cosmos DB replicates data in each region, see [Global distribution with Azure Cosmos DB](./global-dist-under-the-hood.md). Having an Azure Cosmos DB account in more than two regions improves the availability of your application and provides low latency across the associated regions.

## Region outages

*Region outages* are outages that affect all Azure Cosmos DB nodes in an Azure region, across all availability zones. For the rare cases of region outages, you can configure Azure Cosmos DB to support various outcomes of durability and availability.

### Durability

When an Azure Cosmos DB account is deployed in a single region, generally no data loss occurs. Data access is restored after Azure Cosmos DB services recover in the affected region. Data loss might occur only with an unrecoverable disaster in the Azure Cosmos DB region.

To help you protect against complete data loss that might result from catastrophic disasters in a region, Azure Cosmos DB provides two backup modes:

- [Continuous backups](./continuous-backup-restore-introduction.md) back up each region every 100 seconds. They enable you to restore your data to any point in time with 1-second granularity. In each region, the backup is dependent on the data committed in that region.
- [Periodic backups](./periodic-backup-restore-introduction.md) fully back up all partitions from all containers under your account, with no synchronization across partitions. The minimum backup interval is 1 hour.

When an Azure Cosmos DB account is deployed in multiple regions, data durability depends on the consistency level that you configure on the account. The following table details, for all consistency levels, the RPO of an Azure Cosmos DB account that's deployed in at least two regions.

|**Consistency level**|**RPO for region outage**|
|---------|---------|
|Session, consistent prefix, eventual|Less than 15 minutes|
|Bounded staleness|*K* and *T*|
|Strong|0|

*K* = The number of versions (that is, updates) of an item.

*T* = The time interval since the last update.

For multiple-region accounts, the minimum value of *K* and *T* is 100,000 write operations or 300 seconds. This value defines the minimum RPO for data when you're using bounded staleness.

For more information on the differences between consistency levels, see [Consistency levels in Azure Cosmos DB](./consistency-levels.md).

### Availability

If your solution requires continuous availability during region outages, you can configure Azure Cosmos DB to replicate your data across multiple regions and to transparently fail over to available regions when required.

Single-region accounts might lose availability after a regional outage. To ensure high availability at all times, we recommend that you set up your Azure Cosmos DB account with *a single write region and at least a second (read) region* and enable *service-managed failover*.

Service-managed failover allows Azure Cosmos DB to fail over the write region of a multiple-region account in order to preserve availability at the cost of data loss, as described earlier in the [Durability](#durability) section. Regional failovers are detected and handled in the Azure Cosmos DB client. They don't require any changes from the application. For instructions on how to enable multiple read regions and service-managed failover, see [Manage an Azure Cosmos DB account using the Azure portal](./how-to-manage-database-account.md).

> [!IMPORTANT]
> If you have chosen single-region write configuration with multiple read regions, we strongly recommend that you configure the Azure Cosmos DB accounts used for production workloads to *enable service-managed failover*. This configuration enables Azure Cosmos DB to fail over the account databases to available regions.
> In the absence of this configuration, the account will experience loss of write availability for the whole duration of the write region outage. Manual failover won't succeed because of a lack of region connectivity.
> 

### Multiple write regions

You can configure Azure Cosmos DB to accept writes in multiple regions. This configuration is useful for reducing write latency  in geographically distributed applications.

When you configure an Azure Cosmos DB account for multiple write regions, strong consistency isn't supported and write conflicts might arise. For more information on how to resolve these conflicts, see [Conflict types and resolution policies when using multiple write regions](./conflict-resolution-policies.md).

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

* Using a round-robin policy to determine the target region for a read or write operation on a per-request basis

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

### What to expect during a region outage

Clients of single-region accounts will experience loss of read and write availability until service is restored.

Multiple-region accounts experience different behaviors depending on the following configurations and outage types.

| Configuration | Outage | Availability impact | Durability impact| What to do |
| -- | -- | -- | -- | -- |
| Single write region  | Read region outage | All clients automatically redirect reads to other regions. There's no read or write availability loss for all configurations. The exception is a configuration of two regions with strong consistency, which loses write availability until restoration of the service. Or, *if you enable service-managed failover*, the service marks the region as failed and a failover occurs. | No data loss. | During the outage, ensure that there are enough provisioned Request Units (RUs) in the remaining regions to support read traffic. <br/><br/> When the outage is over, readjust provisioned RUs as appropriate. |
| Single write region | Write region outage | Clients redirect reads to other regions. <br/><br/> *Without service-managed failover*, clients experience write availability loss. Restoration of write availability occurs automatically when the outage ends. <br/><br/> *With service-managed failover*, clients experience write availability loss until the service manages a failover to a new write region that you select. | If you don't select the strong consistency level, the service might not replicate some data to the remaining active regions. This replication depends on the [consistency level](consistency-levels.md#rto) that you select. If the affected region suffers permanent data loss, you could lose unreplicated data. | During the outage, ensure that there are enough provisioned RUs in the remaining regions to support read traffic. <br/><br/> *Don't* trigger a manual failover during the outage, because it can't succeed. <br/><br/> When the outage is over, readjust provisioned RUs as appropriate. Accounts that use the API for NoSQL might also recover the unreplicated data in the failed region from your [conflict feed](how-to-manage-conflicts.md#read-from-conflict-feed). |
| Multiple write regions | Any regional outage | There's a possibility of temporary loss of write availability, which is analogous to a single write region with service-managed failover. The failover of the [conflict-resolution region](#conflict-resolution-region) might also cause a loss of write availability if a high number of conflicting writes happen at the time of the outage. | Recently updated data in the failed region might be unavailable in the remaining active regions, depending on the selected [consistency level](consistency-levels.md). If the affected region suffers permanent data loss, you might lose unreplicated data. | During the outage, ensure that there are enough provisioned RUs in the remaining regions to support more traffic. <br/><br/> When the outage is over, you can readjust provisioned RUs as appropriate. If possible, Azure Cosmos DB automatically recovers unreplicated data in the failed region. This automatic recovery uses the conflict resolution method that you configure for accounts that use the API for NoSQL. For accounts that use other APIs, this automatic recovery uses *last write wins*. |

### Additional information on read region outages

* The affected region is disconnected and marked offline. The [Azure Cosmos DB SDKs](nosql/sdk-dotnet-v3.md) redirect read calls to the next available region in the preferred region list.

* If none of the regions in the preferred region list are available, calls automatically fall back to the current write region.

* No changes are required in your application code to handle read region outages. When the affected read region is back online, it syncs with the current write region and is available again to serve read requests after it has fully caught up.

* Subsequent reads are redirected to the recovered region without requiring any changes to your application code. During both failover and rejoining of a previously failed region, Azure Cosmos DB continues to honor read consistency guarantees.

* Even in a rare and unfortunate event where an Azure write region is permanently irrecoverable, there's no data loss if your multiple-region Azure Cosmos DB account is configured with strong consistency. A multiple-region Azure Cosmos DB account has the durability characteristics specified earlier in the [Durability](#durability) section.

### Additional information on write region outages

* During a write region outage, the Azure Cosmos DB account promotes a secondary region to be the new primary write region when *service-managed failover* is configured on the Azure Cosmos DB account. The failover occurs to another region in the order of region priority that you specify.

* Manual failover shouldn't be triggered and won't succeed in the presence of an outage of the source or destination region. The reason is that the failover procedure includes a consistency check that requires connectivity between the regions.

* When the previously affected region is back online, any write data that wasn't replicated when the region failed is made available through the [conflict feed](how-to-manage-conflicts.md#read-from-conflict-feed). Applications can read the conflict feed, resolve the conflicts based on the application-specific logic, and write the updated data back to the Azure Cosmos DB container as appropriate.

* After the previously affected write region recovers, it will become available as a read region. You can switch back to the recovered region as the write region by using [PowerShell, the Azure CLI, or the Azure portal](how-to-manage-database-account.md#manual-failover). There is *no data or availability loss* before, while, or after you switch the write region. Your application continues to be highly available.

## SLAs

The following table summarizes the high-availability capabilities of various account configurations.

|KPI|Single-region writes without availability zones|Single-region writes with availability zones|Multiple-region, single-region writes without availability zones|Multiple-region, single-region writes with availability zones|Multiple-region, multiple-region writes with or without availability zones|
|---------|---------|---------|---------|---------|---------|
|Write availability SLA | 99.99% | 99.995% | 99.99% | 99.995% | 99.999% |
|Read availability SLA  | 99.99% | 99.995% | 99.999% | 99.999% | 99.999% |
|Zone failures: data loss | Data loss | No data loss | No data loss | No data loss | No data loss |
|Zone failures: availability | Availability loss | No availability loss | No availability loss | No availability loss | No availability loss |
|Regional outage: data loss | Data loss |  Data loss | Dependent on consistency level. For more information, see [Consistency, availability, and performance tradeoffs](./consistency-levels.md). | Dependent on consistency level. For more information, see [Consistency, availability, and performance tradeoffs](./consistency-levels.md). | Dependent on consistency level. For more information, see [Consistency, availability, and performance tradeoffs](./consistency-levels.md).
|Regional outage: availability | Availability loss | Availability loss | No availability loss for read region failure, temporary for write region failure | No availability loss for read region failure, temporary for write region failure | No read availability loss, temporary write availability loss in the affected region |
|Price (***1***) | Not applicable | Provisioned RU/s x 1.25 rate | Provisioned RU/s x *N* regions | Provisioned RU/s x 1.25 rate x *N* regions (***2***) | Multiple-region write rate x *N* regions |

***1*** For serverless accounts, RUs are multiplied by a factor of 1.25.

***2*** The 1.25 rate applies only to regions in which you enable availability zones.

## Tips for building highly available applications

* Review the expected [behavior of the Azure Cosmos DB SDKs](troubleshoot-sdk-availability.md) during events and which configurations affect it.

* To ensure high write and read availability, configure your Azure Cosmos DB account to span at least two regions (or three, if you're using strong consistency). Remember that the best configuration to achieve high availability for a region outage is a single write region with service-managed failover. To learn more, see [Tutorial: Set up Azure Cosmos DB global distribution using the API for NoSQL](nosql/tutorial-global-distribution.md).

* For multiple-region Azure Cosmos DB accounts that are configured with a single write region, [enable service-managed failover by using the Azure CLI or the Azure portal](how-to-manage-database-account.md#automatic-failover). After you enable service-managed failover, whenever there's a regional disaster, Azure Cosmos DB will fail over your account without any user input.

* Even if your Azure Cosmos DB account is highly available, your application might not be correctly designed to remain highly available. To test the end-to-end high availability of your application as a part of your application testing or disaster recovery (DR) drills, temporarily disable service-managed failover for the account. Invoke [manual failover by using PowerShell, the Azure CLI, or the Azure portal](how-to-manage-database-account.md#manual-failover), and then monitor your application. After you complete the test, you can fail back over to the primary region and restore service-managed failover for the account.

  > [!IMPORTANT]
  > Don't invoke manual failover during an Azure Cosmos DB outage on either the source or destination region. Manual failover requires region connectivity to maintain data consistency, so it won't succeed.

* Within a globally distributed database environment, there's a direct relationship between the consistency level and data durability in the presence of a region-wide outage. As you develop your business continuity plan, you need to understand the maximum acceptable time before the application fully recovers after a disruptive event (that is, the RTO). You also need to understand the maximum period of recent data updates that the application can tolerate losing when it's recovering after a disruptive event (that is, the RPO). For more information about RTO and RPO, see [Consistency levels in Azure Cosmos DB](./consistency-levels.md#rto).

## What to expect during an Azure Cosmos DB region outage

For single-region accounts, clients experience a loss of read and write availability during an Azure Cosmos DB region outage. Multiple-region accounts experience different behaviors, as described in the following table.

| Write regions | Service-managed failover | What to expect | What to do |
| -- | -- | -- | -- |
| Single write region | Not enabled | If there's an outage in a read region when you're not using strong consistency, all clients redirect to other regions. There's no read or write availability loss, and there's no data loss. When you use strong consistency, an outage in a read region can affect write availability if fewer than two read regions remain.<br/><br/> If there's an outage in the write region, clients experience write availability loss. If you didn't select strong consistency, the service might not replicate some data to the remaining active regions. This replication depends on the selected [consistency level](consistency-levels.md#rto). If the affected region suffers permanent data loss, you might lose unreplicated data. <br/><br/> Azure Cosmos DB restores write availability when the outage ends. | During the outage, ensure that there are enough provisioned RUs in the remaining regions to support read traffic. <br/><br/> *Don't* trigger a manual failover during the outage, because it can't succeed. <br/><br/> When the outage is over, readjust provisioned RUs as appropriate. |
| Single write region | Enabled | If there's an outage in a read region when you're not using strong consistency, all clients redirect to other regions. There's no read or write availability loss, and there's no data loss. When you're using strong consistency, the outage of a read region can affect write availability if fewer than two read regions remain.<br/><br/> If there's an outage in the write region, clients experience write availability loss until Azure Cosmos DB elects a new region as the new write region according to your preferences. If you didn't select strong consistency, the service might not replicate some data to the remaining active regions. This replication depends on the selected [consistency level](consistency-levels.md#rto). If the affected region suffers permanent data loss, you might lose unreplicated data. | During the outage, ensure that there are enough provisioned RUs in the remaining regions to support read traffic. <br/><br/> *Don't* trigger a manual failover during the outage, because it can't succeed. <br/><br/> When the outage is over, you can move the write region back to the original region and readjust provisioned RUs as appropriate. Accounts that use the API for NoSQL can also recover the unreplicated data in the failed region from your [conflict feed](how-to-manage-conflicts.md#read-from-conflict-feed). |
| Multiple write regions | Not applicable | Recently updated data in the failed region might be unavailable in the remaining active regions. Eventual, consistent prefix, and session consistency levels guarantee a staleness of less than 15 minutes. Bounded staleness guarantees fewer than *K* updates or *T* seconds, depending on the configuration. If the affected region suffers permanent data loss, you might lose unreplicated data. | During the outage, ensure that there are enough provisioned RUs in the remaining regions to support more traffic. <br/><br/> When the outage is over, you can readjust provisioned RUs as appropriate. If possible, Azure Cosmos DB recovers unreplicated data in the failed region. This recovery uses the conflict resolution method that you configure for accounts that use the API for NoSQL. For accounts that use other APIs, this recovery uses *last write wins*. |

## Next steps

Next, you can read the following articles:

* [Consistency levels in Azure Cosmos DB](./consistency-levels.md)

* [Request Units in Azure Cosmos DB](./request-units.md)

* [Global data distribution with Azure Cosmos DB - under the hood](global-dist-under-the-hood.md)

* [Consistency levels in Azure Cosmos DB](consistency-levels.md)

* [Configure multi-region writes in your applications that use Azure Cosmos DB](how-to-multi-master.md)

* [Diagnose and troubleshoot the availability of Azure Cosmos DB SDKs in multiregional environments](troubleshoot-sdk-availability.md)



