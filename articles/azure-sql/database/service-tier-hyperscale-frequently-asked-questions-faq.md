---
title: Azure SQL Database Hyperscale FAQ
description: Answers to common questions customers ask about a database in SQL Database in the Hyperscale service tier - commonly called a Hyperscale database.
services: sql-database
ms.service: sql-database
ms.subservice: 
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: dimitri-furman
ms.author: dfurman
ms.reviewer:
ms.date: 03/03/2020
---
# Azure SQL Database Hyperscale FAQ
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

This article provides answers to frequently asked questions for customers considering a database in the Azure SQL Database Hyperscale service tier, referred to as just Hyperscale in the remainder of this FAQ. This article describes the scenarios that Hyperscale supports and the features that are compatible with Hyperscale.

- This FAQ is intended for readers who have a brief understanding of the Hyperscale service tier and are looking to have their specific questions and concerns answered.
- This FAQ isn’t meant to be a guidebook or answer questions on how to use a Hyperscale database. For an introduction to Hyperscale, we recommend you refer to the [Azure SQL Database Hyperscale](service-tier-hyperscale.md) documentation.

## General questions

### What is a Hyperscale database

A Hyperscale database is a database in SQL Database in the Hyperscale service tier that is backed by the Hyperscale scale-out storage technology. A Hyperscale database supports up to 100 TB of data and provides high throughput and performance, as well as rapid scaling to adapt to the workload requirements. Scaling is transparent to the application – connectivity, query processing, etc. work like any other database in Azure SQL Database.

### What resource types and purchasing models support Hyperscale

The Hyperscale service tier is only available for single databases using the vCore-based purchasing model in Azure SQL Database.  

### How does the Hyperscale service tier differ from the General Purpose and Business Critical service tiers

The vCore-based service tiers are differentiated based on database availability and storage type, performance, and maximum size, as described in the following table.

| | Resource type | General Purpose |  Hyperscale | Business Critical |
|:---:|:---:|:---:|:---:|:---:|
| **Best for** |All|Offers budget oriented balanced compute and storage options.|Most business workloads. Autoscaling storage size up to 100 TB, fast vertical and horizontal compute scaling, fast database restore.|OLTP applications with high transaction rate and low IO latency. Offers highest resilience to failures and fast failovers using multiple synchronously updated replicas.|
|  **Resource type** ||Single database / elastic pool / managed instance | Single database | Single database / elastic pool / managed instance |
| **Compute size**|Single database / elastic pool* | 1 to 80 vCores | 1 to 80  vCores* | 1 to 80 vCores |
| |SQL Managed Instance | 8, 16, 24, 32, 40, 64, 80  vCores | N/A | 8, 16, 24, 32, 40, 64, 80  vCores |
| **Storage type** | All |Premium remote storage (per instance) | De-coupled storage with local SSD cache (per instance) | Super-fast local SSD storage (per instance) |
| **Storage size** | Single database / elastic pool *| 5 GB – 4 TB | Up to 100 TB | 5 GB – 4 TB |
| | SQL Managed Instance  | 32 GB – 8 TB | N/A | 32 GB – 4 TB |
| **IOPS** | Single database | 500 IOPS per vCore with 7000 maximum IOPS | Hyperscale is a multi-tiered architecture with caching at multiple levels. Effective IOPS will depend on the workload. | 5000 IOPS with 200,000 maximum IOPS|
| | SQL Managed Instance | Depends on file size | N/A | 1375 IOPS/vCore |
|**Availability**|All|1 replica, no Read Scale-out, no local cache | Multiple replicas, up to 4 Read Scale-out, partial local cache | 3 replicas, 1 Read Scale-out, zone-redundant HA, full local storage |
|**Backups**|All|RA-GRS, 7-35 day retention (7 days by default)| RA-GRS, 7 day retention, constant time point-in-time recovery (PITR) | RA-GRS, 7-35 day retention (7 days by default) |

\* Elastic pools are not supported in the Hyperscale service tier

### Who should use the Hyperscale service tier

The Hyperscale service tier is intended for customers who have large on-premises SQL Server databases and want to modernize their applications by moving to the cloud, or for customers who are already using Azure SQL Database and want to significantly expand the potential for database growth. Hyperscale is also intended for customers who seek both high performance and high scalability. With Hyperscale, you get:

- Database size up to 100 TB
- Fast database backups regardless of database size (backups are based on storage snapshots)
- Fast database restores regardless of database size (restores are from storage snapshots)
- Higher log throughput regardless of database size and the number of vCores
- Read Scale-out using one or more read-only replicas, used for read offloading  and as hot standbys.
- Rapid scale up of compute, in constant time, to be more powerful to accommodate the heavy workload and then scale down, in constant time. This is similar to scaling up and down between a P6 and a P11, for example, but much faster as this is not a size of data operation.

### What regions currently support Hyperscale

The Hyperscale service tier is currently available in the regions listed under [Azure SQL Database Hyperscale Overview](service-tier-hyperscale.md#regions).

### Can I create multiple Hyperscale databases per server

Yes. For more information and limits on the number of Hyperscale databases per server, see [SQL Database resource limits for single and pooled databases on a server](resource-limits-logical-server.md).

### What are the performance characteristics of a Hyperscale database

The Hyperscale architecture provides high performance and throughput while supporting large database sizes.

### What is the scalability of a Hyperscale database

Hyperscale provides rapid scalability based on your workload demand.

- **Scaling Up/Down**

  With  Hyperscale, you can scale up the primary compute size in terms of resources like CPU and memory, and then scale down, in constant time. Because the storage is shared, scaling up and scaling down is not a size of data operation.  
- **Scaling In/Out**

  With Hyperscale, you also get the ability to provision one or more additional compute replicas that you can use to serve your read requests. This means that you can use these additional compute replicas as read-only replicas to offload your read workload from the primary compute. In addition to read-only, these replicas also serve as hot-standbys in case of a failover from the primary.

  Provisioning of each of these additional compute replicas can be done in constant time and is an online operation. You can connect to these additional read-only compute replicas by setting the `ApplicationIntent` argument on your connection string to `ReadOnly`. Any connections  with the `ReadOnly` application intent are automatically routed to one of the additional read-only compute replicas.

## Deep dive questions

### Can I mix Hyperscale and single databases in a single server

Yes, you can.

### Does Hyperscale require my application programming model to change

No, your application programming model stays as is. You use your connection string as usual and the other regular ways to interact with your Hyperscale database.

### What transaction isolation level is the default in a Hyperscale database

On the primary replica, the default transaction isolation level is RCSI (Read Committed Snapshot Isolation). On the Read Scale-out secondary replicas, the default isolation level is Snapshot.

### Can I bring my on-premises or IaaS SQL Server license to Hyperscale

Yes, [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/) is available for Hyperscale. Every SQL Server Standard core can map to 1 Hyperscale vCores. Every SQL Server Enterprise core can map to 4 Hyperscale vCores. You don’t need a SQL license for secondary replicas. The Azure Hybrid Benefit price will be automatically applied to Read Scale-out (secondary) replicas.

### What kind of workloads is Hyperscale designed for

Hyperscale supports all SQL Server workloads, but it is primarily optimized for OLTP. You can bring Hybrid (HTAP) and Analytical (data mart) workloads as well.

### How can I choose between Azure SQL Data Warehouse and Azure SQL Database Hyperscale

If you are currently running interactive analytics queries using SQL Server as a data warehouse, Hyperscale is a great option because you can host small and mid-size data warehouses (such as a few TB up to 100 TB) at a lower cost, and you can migrate your SQL Server data warehouse workloads to Hyperscale with minimal T-SQL code changes.

If you are running data analytics on a large scale with complex queries and sustained ingestion rates higher than 100 MB/s, or  using Parallel Data Warehouse (PDW), Teradata, or other Massively Parallel Processing (MPP) data warehouses, SQL Data Warehouse may be the best choice.
  
## Hyperscale compute questions

### Can I pause my compute at any time

Not at this time, however you can scale your compute and number of replicas down to reduce cost during non-peak times.

### Can I provision a compute replica with extra RAM for my memory-intensive workload

No. To get more RAM, you need to upgrade to a higher compute size. For more information, see [Hyperscale storage and compute sizes](resource-limits-vcore-single-databases.md#hyperscale---provisioned-compute---gen5).

### Can I provision multiple compute replicas of different sizes

No.

### How many Read Scale-out replicas are supported

The Hyperscale databases are created with one Read Scale-out replica (two replicas including primary) by default. You can scale the number of read-only replicas between 0 and 4 using [Azure portal](https://portal.azure.com) or [REST API](https://docs.microsoft.com/rest/api/sql/databases/createorupdate).

### For high availability, do I need to provision additional compute replicas

In Hyperscale databases, data resiliency is provided at the storage level. You only need one replica to provide resiliency. When the compute replica is down, a new replica is created automatically with no data loss.

However, if there’s only one replica, it may take some time to build the local cache in the new replica after failover. During the cache rebuild phase, the database fetches data directly from the page servers, resulting in higher storage latency and degraded query performance.

For mission-critical apps that require high availability with minimal failover impact, you should provision at least 2 compute replicas including the primary compute replica. This is the default configuration. That way there is a hot-standby replica available that serves as a failover target.

## Data size and storage questions

### What is the maximum database size supported with Hyperscale

100 TB.

### What is the size of the transaction log with Hyperscale

The transaction log with Hyperscale is practically infinite. You do not need to worry about running out of log space on a system that has a high log throughput. However, log generation rate might be throttled for continuous aggressively writing workloads. The peak sustained log generation rate is 100 MB/s.

### Does my `tempdb` scale as my database grows

Your `tempdb` database is located on local SSD storage and is sized proportionally to the compute size that you provision. Your `tempdb` is optimized to provide maximum performance benefits. `tempdb` size is not configurable and is managed for you.

### Does my database size automatically grow, or do I have to manage the size of data files

Your database size automatically grows as you insert/ingest more data.

### What is the smallest database size that Hyperscale supports or starts with

40 GB. A Hyperscale database is created with a starting size of 10 GB. Then, it starts growing by 10 GB every 10 minutes, until it reaches the size of 40 GB. Each of these 10 GB chucks is allocated in a different page server in order to provide more IOPS and higher I/O parallelism. Because of this optimization, even if you choose initial database size smaller than 40 GB, the database will grow to at least 40 GB automatically.

### In what increments does my database size grow

Each data file grows by 10 GB. Multiple data files may grow at the same time.

### Is the storage in Hyperscale local or remote

In Hyperscale, data files are stored in Azure standard storage. Data is fully cached on local SSD storage, on page servers that are close to the compute replicas. In addition, compute replicas have data caches on local SSD and in memory, to reduce the frequency of fetching data from remote page servers.

### Can I manage or define files or filegroups with Hyperscale

No. Data files are added automatically. The common reasons for creating additional filegroups do not apply in the Hyperscale storage architecture.

### Can I provision a hard cap on the data growth for my database

No.

### How are data files laid out with Hyperscale

The data files are controlled by page servers, with one page server per data file. As the data size grows, data files and associated page servers are added.

### Is database shrink supported

No.

### Is data compression supported

Yes, including row, page, and columnstore compression.

### If I have a huge table, does my table data get spread out across multiple data files

Yes. The data pages associated with a given table can end up in multiple data files, which are all part of the same filegroup. SQL Server uses [proportional fill strategy](https://docs.microsoft.com/sql/relational-databases/databases/database-files-and-filegroups#file-and-filegroup-fill-strategy) to distribute data over data files.

## Data migration questions

### Can I move my existing databases in Azure SQL Database to the Hyperscale service tier

Yes. You can move your existing databases in Azure SQL Database to Hyperscale. This is a one-way migration. You can’t move databases from Hyperscale to another service tier. For proofs of concept (POCs), we recommend you make a copy of your database and migrate the copy to Hyperscale.
  
### Can I move my Hyperscale databases to other service tiers

No. At this time, you can’t move a Hyperscale database to another service tier.

### Do I lose any functionality or capabilities after migration to the Hyperscale service tier

Yes. Some Azure SQL Database features are not supported in Hyperscale yet, including but not limited to long term backup retention. After you migrate your databases to Hyperscale, those features stop working.  We expect these limitations to be temporary.

### Can I move my on-premises SQL Server database, or my SQL Server database in a cloud virtual machine to Hyperscale

Yes. You can use all existing migration technologies to migrate to Hyperscale, including transactional replication, and any other data movement technologies (Bulk Copy, Azure Data Factory, Azure Databricks, SSIS). See also the [Azure Database Migration Service](../../dms/dms-overview.md), which supports many migration scenarios.

### What is my downtime during migration from an on-premises or virtual machine environment to Hyperscale, and how can I minimize it

Downtime for migration to Hyperscale is the same as the downtime when you migrate your databases to other Azure SQL Database service tiers. You can use [transactional replication](replication-to-sql-database.md#data-migration-scenario
) to minimize downtime migration for databases up to few TB in size. For very large databases (10+ TB), you can consider to migrate data using ADF, Spark, or other data movement technologies.

### How much time would it take to bring in X amount of data to Hyperscale

Hyperscale is capable of consuming 100 MB/s of new/changed data, but the time needed to move data into databases in Azure SQL Database is also affected by available network throughput, source read speed and the target database service level objective.

### Can I read data from blob storage and do fast load (like Polybase in SQL Data Warehouse)

You can have a client application read data from Azure Storage and load data load into a Hyperscale database (just like you can with any other database in Azure SQL Database). Polybase is currently not supported in Azure SQL Database. As an alternative to provide fast load, you can use [Azure Data Factory](https://docs.microsoft.com/azure/data-factory/), or use a Spark job in [Azure Databricks](https://docs.microsoft.com/azure/azure-databricks/) with the [Spark connector for SQL](spark-connector.md). The Spark connector to SQL supports bulk insert.

It is also possible to bulk read data from Azure Blob store using BULK INSERT or OPENROWSET: [Examples of Bulk Access to Data in Azure Blob Storage](https://docs.microsoft.com/sql/relational-databases/import-export/examples-of-bulk-access-to-data-in-azure-blob-storage?view=sql-server-2017#accessing-data-in-a-csv-file-referencing-an-azure-blob-storage-location).

Simple recovery or bulk logging model is not supported in Hyperscale. Full recovery model is required to provide high availability and point-in-time recovery. However, Hyperscale log architecture provides better data ingest rate compared to other Azure SQL Database service tiers.

### Does Hyperscale allow provisioning multiple nodes for parallel ingesting of large amounts of data

No. Hyperscale is a symmetric multi-processing (SMP) architecture and is not a massively parallel processing (MPP) or a multi-master architecture. You can only create multiple replicas to scale out read-only workloads.

### What is the oldest SQL Server version supported for migration to Hyperscale

SQL Server 2005. For more information, see [Migrate to a single database or a pooled database](migrate-to-database-from-sql-server.md#migrate-to-a-single-database-or-a-pooled-database). For compatibility issues, see [Resolving database migration compatibility issues](migrate-to-database-from-sql-server.md#resolving-database-migration-compatibility-issues).

### Does Hyperscale support migration from other data sources such as Amazon Aurora, MySQL, PostgreSQL, Oracle, DB2, and other database platforms

Yes. [Azure Database Migration Service](../../dms/dms-overview.md) supports many migration scenarios.

## Business continuity and disaster recovery questions

### What SLAs are provided for a Hyperscale database

See [SLA for Azure SQL Database](https://azure.microsoft.com/support/legal/sla/sql-database/v1_4/). Additional secondary compute replicas increase availability, up to 99.99% for a database with two or more secondary compute replicas.

### Are the database backups managed for me by Azure SQL Database

Yes.

### How often are the database backups taken

There are no traditional full, differential, and log backups for Hyperscale databases. Instead, there are regular storage snapshots of data files. Log that is generated is simply retained as-is for the configured retention period, allowing restore to any point in time within the retention period.

### Does Hyperscale support point-in-time restore

Yes.

### What is the Recovery Point Objective (RPO)/Recovery Time Objective (RTO) for database restore in Hyperscale

The RPO is 0 min. The RTO goal is less than 10 minutes, regardless of database size.

### Does database backup affect compute performance on my primary or secondary replicas

No. Backups are managed by the storage subsystem, and leverage storage snapshots. They do not impact user workloads.

### Can I perform geo-restore with a Hyperscale database

Yes. Geo-restore is fully supported. Unlike point-in-time restore, geo-restore requires a size-of-data operation. Data files are copied in parallel, so the duration of this operation depends primarily on the size of the largest file in the database, rather than on total database size. Geo-restore time will be significantly shorter if the database is restored in the Azure region that is [paired](https://docs.microsoft.com/azure/best-practices-availability-paired-regions) with the region of the source database.

### Can I set up geo-replication with Hyperscale database

Not at this time.

### Can I take a Hyperscale database backup and restore it to my on-premises server, or on SQL Server in a VM

No. The storage format for Hyperscale databases is different from any released version of SQL Server, and you don’t control backups or have access to them. To take your data out of a Hyperscale database, you can extract data using any data movement technologies, i.e. Azure Data Factory, Azure Databricks, SSIS, etc.

## Cross-feature questions

### Do I lose any functionality or capabilities after migration to the Hyperscale service tier

Yes. Some Azure SQL Database features are not supported in Hyperscale, including but not limited to long term backup retention. After you migrate your databases to Hyperscale, those features stop working.

### Will Polybase work with Hyperscale

No. Polybase is not supported in Azure SQL Database.

### Does Hyperscale have support for R and Python

Not at this time.

### Are compute nodes containerized

No. Hyperscale processes run on [Service Fabric](https://azure.microsoft.com/services/service-fabric/) nodes (VMs), not in containers.

## Performance questions

### How much write throughput can I push in a Hyperscale database

Transaction log throughput cap is set to 100 MB/s for any Hyperscale compute size. The ability to achieve this rate depends on multiple factors, including but not limited to workload type, client configuration, and having sufficient compute capacity on the primary compute replica to produce log at this rate.

### How many IOPS do I get on the largest compute

IOPS and IO latency will vary depending on the workload patterns. If the data being accessed is cached on the compute replica, you will see similar IO performance as with local SSD.

### Does my throughput get affected by backups

No. Compute is decoupled from the storage layer. This eliminates performance impact of backup.

### Does my throughput get affected as I provision additional compute replicas

Because the storage is shared and there is no direct physical replication happening between primary and secondary compute replicas, the throughput on primary replica will not be directly affected by adding secondary replicas. However, we may throttle continuous aggressively writing workload on the primary to allow log apply on secondary replicas and page servers to catch up, to avoid poor read performance on secondary replicas.

### How do I diagnose and troubleshoot performance problems in a Hyperscale database

For most performance problems, particularly the ones not rooted in storage performance, common SQL diagnostic and troubleshooting steps apply. For Hyperscale-specific storage diagnostics, see [SQL Hyperscale performance troubleshooting diagnostics](hyperscale-performance-diagnostics.md).

## Scalability questions

### How long would it take to scale up and down a compute replica

Scaling compute up or down should take 5-10 minutes regardless of data size.

### Is my database offline while the scaling up/down operation is in progress

No. The scaling up and down will be online.

### Should I expect connection drop when the scaling operations are in progress

Scaling up or down results in existing connections being dropped when a failover happens at the end of the scaling operation. Adding secondary replicas does not result in connection drops.

### Is the scaling up and down of compute replicas automatic or end-user triggered operation

End-user. Not automatic.  

### Does the size of my `tempdb` database also grow as the compute is scaled up

Yes. The `tempdb` database will scale up automatically as the compute grows.  

### Can I provision multiple primary compute replicas, such as a multi-master system, where multiple primary compute heads can drive a higher level of concurrency

No. Only the primary compute replica accepts read/write requests. Secondary compute replicas only accept read-only requests.

## Read scale-out questions

### How many secondary compute replicas can I provision

We create one secondary replica for Hyperscale databases by default. If you want to adjust the number of replicas, you can do so using [Azure portal](https://portal.azure.com) or [REST API](https://docs.microsoft.com/rest/api/sql/databases/createorupdate).

### How do I connect to these secondary compute replicas

You can connect to these additional read-only compute replicas by setting the `ApplicationIntent` argument on your connection string to `ReadOnly`. Any connections marked with `ReadOnly` are automatically routed to one of the additional read-only compute replicas.  

### How do I validate if I have successfully connected to secondary compute replica using SSMS or other client tools?

You can execute the following T-SQL query:
`SELECT DATABASEPROPERTYEX ('<database_name>', 'Updateability')`.
The result is `READ_ONLY` if you are connected to a read-only secondary replica, and `READ_WRITE` if you are connected to the primary replica. Note that the database context must be set to the name of the Hyperscale database, not to the `master` database.

### Can I create a dedicated endpoint for a Read Scale-out replica

No. You can only connect to Read Scale-out replicas by specifying `ApplicationIntent=ReadOnly`.

### Does the system do intelligent load balancing of the read workload

No. A new connection with read-only intent is redirected to an arbitrary Read Scale-out replica.

### Can I scale up/down the secondary compute replicas independently of the primary replica

No. The secondary compute replica are also used as high availability failover targets, so they need to have the same configuration as the primary to provide expected performance after failover.

### Do I get different `tempdb` sizing for my primary compute and my additional secondary compute replicas

No. Your `tempdb` database is configured based on the compute size provisioning, your secondary compute replicas are the same size as the primary compute.

### Can I add indexes and views on my secondary compute replicas

No. Hyperscale databases have shared storage, meaning that all compute replicas see the same tables, indexes, and views. If you want additional indexes optimized for reads on secondary, you must add them on the primary.

### How much delay is there going to be between the primary and secondary compute replicas

Data latency from the time a transaction is committed on the primary to the time it is visible on a secondary depends on current log generation rate. Typical data latency is in low milliseconds.

## Next steps

For more information about the Hyperscale service tier, see [Hyperscale service tier](service-tier-hyperscale.md).
