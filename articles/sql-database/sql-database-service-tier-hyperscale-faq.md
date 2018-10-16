---
title: Azure SQL Database Hyperscale FAQ | Microsoft Docs
description: Answers to common questions customers ask about an Azure SQL database in the Hyperscale service tier - commonly called a Hyperscale database.
services: sql-database
ms.service: sql-database
ms.subservice: 
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: CarlRabeler
ms.author: carlrab
ms.reviewer:
manager: craigg
ms.date: 10/15/2018
---
# FAQ about Azure SQL Hyperscale databases

This article provides answers to frequently asked questions for customers considering a database in the Azure SQL Database Hyperscale service tier, commonly called a Hyperscale database (currently in public preview). This article describes the scenarios that Hyperscale supports and the cross-feature services are compatible with SQL Database Hyperscale in general.

- This FAQ is intended for readers who have a brief understanding of the Hyperscale service tier and are looking to have their specific questions and concerns answered.
- This FAQ isn’t meant to be a guidebook or answer questions on how to use a SQL Database Hyperscale database. For that, we recommend you refer to the [Azure SQL Database Hyperscale](sql-database-service-tier-hyperscale.md) documentation.

## General questions

### What is a Hyperscale database

A Hyperscale database is an Azure SQL database in the Hyperscale service tier that is backed by the Hyperscale scale-out storage technology. A Hyperscale database supports up to 100 TB of data and provides high throughput and performance, as well as rapid scaling to adapt to the workload requirements. Scaling is transparent to the application – connectivity, query processing, and so on, work like any other SQL database.

### What resource types and purchasing models support Hyperscale

The Hyperscale service tier is only available for single databases using the vCore-based purchasing model in Azure SQL Database.  

### How does the Hyperscale service tier differ from the General Purpose and Business Critical service tiers

The vCore-based service tiers are primarily differentiated based upon availability, storage type and IOPs.

- The General Purpose service tier is appropriate for most business workloads, offering a balanced set of compute and storage options where IO latency or failover times are not the priority.
- The Hyperscale service tier is optimized for very large database workloads.
- The Business Critical service tier is appropriate for business workloads where IO latency is a priority.

| | Resource type | General Purpose |  Hyperscale | Business Critical |
|:---|:---:|:---:|:---:|:---:|:---:|
| **Best for** |All|  Most business workloads. Offers budget oriented balanced compute and storage options. | Data applications with large data capacity requirements and the ability to auto-scale storage and scale compute fluidly. | OLTP applications with high transaction rate and lowest latency IO. Offers highest resilience to failures using several, isolated replicas.|
|  **Resource type** ||Single database / elastic pool / managed instance | Single database | Single database / elastic pool / managed instance |
| **Compute size**|Single database / elastic pool * | 1 to 80 vCores | 1 to 80  vCores* | 1 to 80 vCores |
| |Managed instance | 8, 16, 24, 32, 40, 64, 80  vCores | N/A | 8, 16, 24, 32, 40, 64, 80  vCores |
| **Storage type** | All |Premium remote storage (per instance) | De-coupled storage with local SSD cache (per instance) | Super-fast local SSD storage (per instance) |
| **Storage size** | Single database / elastic pool | 5 GB – 4 TB | Up to 100 TB | 5 GB – 4 TB |
| | Managed instance  | 32 GB – 8 TB | N/A | 32 GB – 4 TB |
| **IO throughput** | Single database** | 500 IOPS per vCore with 7000 maximum IOPS | Unknown yet | 5000 IOPS with 200,000 maximum IOPS|
| | Managed instance | Depends on size of file | N/A | Managed Instance: Depends on size of file|
|**Availability**|All|1 replica, no read-scale, no local cache | Multiple replicas, up to 15 read-scale, partial local cache | 3 replicas, 1 read-scale, zone-redundant HA, full local cache |
|**Backups**|All|RA-GRS, 7-35 days (7 days by default)| RA-GRS, 7-35 days (7 days by default), constant time point-in0time recovery (PITR) | RA-GRS, 7-35 days (7 days by default) |

\* Elastic pools not supported in the Hyperscale service tier

### Who should use the Hyperscale service tier

The Hyperscale service tier is primarily intended for customers who have large on-premises SQL Server databases and want to modernize their applications by moving to the cloud or for customers who are already using Azure SQL Database and want to significantly expand the potential for database growth. Hyperscale is also intended for customers who seek both high performance and high scalability. With Hyperscale, you get:

- Support for up to 100 TB of database size
- Fast database backups regardless of database size (backups are based on file snapshots)
- Fast database restores regardless of database size (restores are from file snapshots)
- Higher log throughput results in fast transaction commit times regardless of database size
- Read scale out to one or more read-only nodes to offload your read workload, and for hot-standbys.
- Rapid scale up of compute, in constant time, to be more powerful to accommodate the heavy workload and then scale down, in constant time. This is similar to scaling up and down between a P6 to a P11, for example, but much faster as this is not a size of data operation.

### What regions currently support Hyperscale

Hyperscale is currently available for single databases in the following regions:  West US1, West US2, East US1, Central US, West Europe, North Europe, UK West, SouthEast Asia, Japan East, Korea Central, Australia SouthEast, and Australia East.

### Can I create multiple Hyperscale databases per logical server

Yes. For more information and limits on the number of Hyperscale databases per logical server, see [SQL Database resource limits for single and pooled databases on a logical server](sql-database-resource-limits-logical-server.md).

### What are the performance characteristic of a Hyperscale database

The SQL Database Hyperscale architecture provides high performance and throughput while supporting large database sizes. The precise performance profile and characteristics is not available during public preview.

### What is the scalability of a Hyperscale database

SQL Database Hyperscale provides rapid scalability based on your workload demand.

- **Scaling Up/Down**

  With  Hyperscale, you can scale up the primary compute size in terms of resources like CPU, memory and then scale down, in constant time. Because the storage is shared, scaling up and scaling down is not a size of data operation.  
- **Scaling In/Out**

  With Hyperscale, you also get the ability to provision one or more additional compute nodes that you can use to serve your read requests. This means that you can use these additional compute nodes as read-only nodes to offload your read workload from the primary compute. In addition to read-only, these nodes also serve as hot-standby’s in the event of a fail over from the primary.

  Provisioning of each of these additional compute nodes can be done in constant time and is an online operation. You can connect to these additional read-only compute nodes by setting the `ApplicationIntent` argument on your connection string to `read_only`. Any connections marked with `read-only` are automatically routed to one of the additional read-only compute nodes.

## Deep dive questions

### Can I mix Hyperscale and single databases a my logical server

Yes, you can.

### Does Hyperscale require my application programming model to change

No, your application programming model stays as is. You use your connection string as usual and the other regular modes to interact with your Azure SQL database.

### What transaction isolation levels are going to be default on SQL Database Hyperscale database

On the primary node, the transaction isolation level is RCSI (Read Committed Snapshot Isolation). On the read scale secondary nodes, the isolation level is Snapshot.

### Can I bring my on-premises or IaaS SQL Server license to SQL Database Hyperscale

Yes, [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/) is available for Hyperscale. Every SQL Server Standard core can map to 1 Hyperscale vCores. Every SQL Server Enterprise core can map to 4 Hyperscale vCores. You don’t need a SQL license for secondary replicas. The Azure Hybrid Benefit price will be automatically applied to read-scale (secondary) replicas.

### What kind of workloads is SQL Database Hyperscale designed for

SQL Database Hyperscale supports all SQL Server workloads, but it is primarily optimized for OLTP. You can bring Hybrid and Analytical (data mart) workloads as well.

### How can I choose between Azure SQL Data Warehouse and SQL Database Hyperscale

If you are currently running interactive analytics queries using SQL Server as a data warehouse, SQL Database Hyperscale is a great option because you can host relatively small data warehouses (such as a few TB up to 10’s of TB) at a lower cost and you can migrate your data warehouse workload to SQL Database Hyperscale without T-SQL code changes.

If you are running data analytics on a large scale with complex queries and using Parallel Data Warehouse (PDW), Teradata or other Massively Parallel Processor (MPP)) data warehouses, SQL Data Warehouse may be the best choice.
  
## SQL Database Hyperscale compute questions

### Can I pause my compute at any time

No.

### Can I provision a compute with extra RAM for my memory-intensive workload

No. To get more RAM, you need to upgrade to a higher compute size. Gen4 hardware provides more RAM compared to Gen5 hardware. For more information, see [Hyperscale storage and compute sizes](sql-database-vcore-resource-limits-single-databases.md#hyperscale-service-tier-preview).

### Can I provision multiple compute nodes of different sizes

No.

### How many read-scale replicas are supported

In public preview, the Hyperscale databases are created with one read-scale replica (two replicas in total) by default. If you want to add or remove read-scale replicas, please file a support request using the Azure portal.

### For high availability, do I need to provision additional compute nodes

In Hyperscale databases, the high availability is provided at the storage level. You only need one replica to provide high availability. When the compute replica is down, a new replica is created automatically with no data loss.

However, if there’s only one replica, it may take some time to build the local cache in the new replica after failover. During the cache rebuild phase, the database fetches data directly from the page servers, resulting in degraded IOPS and query performance.

For mission-critical apps that require high availability, you should provision at least 2 compute nodes including the primary compute node (default). That way there is a hot-standby available in the case of a failover.

## Data size and storage questions

### What is the max db size supported with SQL Database Hyperscale

100 TB

### What is the size of the transaction log with Hyperscale

The transaction log with Hyperscale is practically infinite. You do not need to worry about running out of log space on a system that has a high log throughput. However, the log generation rate might be throttled for continuous aggressive workloads. The peak and average log generation rate is not yet known (still in preview).

### Does my temp db scale as my database grows

Your `tempdb` database is located on local SSD storage and is configured based on the compute size that you provision. Your `tempdb` is optimized and laid out to provide maximum performance benefits. The `tempdb` size is not configurable and is managed for you by storage sub-system.

### Does my database size automatically grow, or do I have to manage the size of the data files

Your database size automatically grows as you insert/ingest more data.

### What is the smallest database size that SQL Database Hyperscale supports or starts with

5 GB

### In what increments does my database size grow

1 GB

### Is the storage in SQL Database Hyperscale local or remote

In Hyperscale, data files are stored in Azure standard storage. Data is heavily cached on local SSD storage, on machines close to the compute nodes. In addition, compute nodes have a cache on local SSD and in-memory (Buffer Pool, and so on), to reduce the frequency of fetching data from remote nodes.

### Can I manage or define files or filegroups with Hyperscale

No
  
### Can I provision a hard cap on the data growth for my database

No

### How are data files laid out with SQL Database Hyperscale

The data files are controlled by page servers. As the data size grows, data files and associated page server nodes are added.

### Is database shrink supported

No

### Is database compression supported

Yes

### If I have a huge table, does my table data get spread out across multiple data files

Yes. The data pages associated with a given table can end up in multiple data files, which are all part of the same filegroup. SQL Server uses a [proportional fill strategy](https://docs.microsoft.com/sql/relational-databases/databases/database-files-and-filegroups#file-and-filegroup-fill-strategy) to distribute data over data files.

## Data migration questions

### Can I move my existing Azure SQL databases to the Hyperscale service tier

Yes. You can move your existing Azure SQL databases to Hyperscale. In public preview, this is a one-way migration. You can’t move databases from Hyperscale to another service tier. We recommend you make a copy of your production databases and migrate to Hyperscale for proof of concepts (POCs).
  
### Can I move my Hyperscale databases to other editions

No. In public preview, you can’t move a Hyperscale database to another service tier.

### Do I lose any functionality or capabilities after migration to the Hyperscale service tier

Yes. Some of Azure SQL Database features are not supported in Hyperscale during public preview, including but not limited to TDE and long term retention backup. After you migrate your databases to Hyperscale, those features stop working.

### Can I move my  on-premises SQL Server database or my SQL Server virtual machine database to Hyperscale

Yes. You can use all existing migration technologies to migrate to Hyperscale, including BACPAC, transactional replication, logical data loading. See also the [Azure Database Migration Service](../dms/dms-overview.md).

### What is my downtown during migration from an on-premises or virtual machine environment to Hyperscale and how can I minimize it

Downtime is the same as the downtime when you migrate your databases to a single database in Azure SQL Database. You can use [transactional replication](replication-to-sql-database.md#data-migration-scenario
) to minimize downtime migration for databases up to few TB in size. For very large database (10+ TB), you can consider to migrate data using ADF, Spark, or other data movement technologies.

### How much time would it take to bring in X amount of data to SQL Database Hyperscale

Not yet known (still in preview)

### Can I read data from blob storage and do fast load (like Polybase and SQL Data Warehouse)

You can read data from Azure Storage and load data load into a Hyperscale database (just like you can do with a regular single database). Polybase is currently not supported on Azure SQL Database. You can do Polybase using [Azure Data Factory](https://docs.microsoft.com/azure/data-factory/) or running a Spark job in [Azure Databricks](https://docs.microsoft.com/azure/azure-databricks/) with the [Spark connector for SQL](sql-database-spark-connector.md). The Spark connector to SQL supports bulk insert.

Simple recovery or bulk logging model is not supported in Hyperscale. Full recovery model is required to provide high availability. However, Hyperscale provides a better data ingest rate compared to a single Azure SQL database because of the new log architecture.

### Does SQL Database Hyperscale allow provisioning multiple nodes for ingesting large amounts of data

No. SQL Database Hyperscale is a SMP architecture and is not an asymmetric multiprocessing or a multi-master architecture. You can only create multiple replicas to scale out read-only workloads.

### What is the oldest SQL Server version will SQL Database Hyperscale support migration from

SQL Server 2005. For more information, see [Migrate to a single database or a pooled database](sql-database-cloud-migrate.md#migrate-to-a-single-database-or-a-pooled-database). For compatibility issues, see [Resolving database migration compatibility issues](sql-database-cloud-migrate.md#resolving-database-migration-compatibility-issues).

### Does SQL Database Hyperscale support migration from other data sources such as Aurora, MySQL, Oracle, DB2, and other database platforms

Yes. Coming from different data sources other than SQL Server requires logical migration. You can use the [Azure Database Migration Service](../dms/dms-overview.md) for a logical migration.

## Business continuity and disaster recovery questions

### What SLA’s are provided for a Hyperscale database

In general, an SLA is not provided during public preview. However, Hyperscale provides the same level of high availability with current SQL DB offerings. See [SLA](http://azure.microsoft.com/support/legal/sla/).

### Are the database backups managed for me by the Azure SQL Database service

Yes

### How often are the database backups taken

There are no traditional full, differential, and log backups for SQL Database Hyperscale databases. Instead, there are regular snapshots of the data files and log that is generated is simply retained as is for the retention period configured or available to you.

### Does SQL Database Hyperscale support Point in Time Restore

Yes

### What is the Recovery Point Objective (RPO)/Recovery Time Objective (RTO) with backup/restore in SQL Database Hyperscale

The RPO is 0 min. The RTO goal is  less than 10 minutes, regardless of database size. However, during public preview, you may experience longer restore time.

### Do backups of large databases affect compute performance on my primary

No. Backups are managed by the storage subsystem, and leverage file snapshots. They do not impact the user workload on the primary.

### Can I perform geo-restore with a SQL Database Hyperscale database

No, not during public preview.

### Can I setup Geo-Replication with SQL Database Hyperscale database

No, not during public preview.

### Do my secondary compute nodes get geo-replicated with SQL Database Hyperscale

No, not during public preview.

### Can I take a SQL Database Hyperscale database backup and restore it to my on-premises server or SQL Server in VM

No. The storage format for Hyperscale databases is different from traditional SQL Server, and you don’t control backups or have access to them. To take your data out of a SQL Database Hyperscale database, either use the export service or use scripting plus BCP.

## Cross Feature questions

### Do I lose any functionality or capabilities after migration to the Hyperscale service tier

Yes. Some of Azure SQL Database features are not supported in Hyperscale during public preview, including but not limited to TDE and long term retention backup. After you migrate your databases to Hyperscale, those features stop working.

### Will Polybase work with SQL Database Hyperscale

No. Polybase isn’t supported on Azure SQL Database.

### Does the compute have support for R and python

No. R and Python are not supported in Azure SQL Database.

### Are the compute nodes containerized

No. Your database resides on a compute VM and not a container.

## Performance questions

### How much throughput can I push on the largest SQL Database Hyperscale compute

Not yet known (still in preview)

### How many IOPS do I get on the largest SQL Database Hyperscale compute

Not yet known (still in preview)

### Does my throughput get affected by backups

No. Compute is decoupled from the storage layer to avoid impact on compute.

### Does my throughput get affected as I provision additional compute nodes

Because the storage is shared and there is no direct physical replication happening between primary and secondary compute nodes, technically, the throughput on primary node will be affected by adding read-scale nodes. However, we may throttle continuous aggressive workload to allow log apply on secondary nodes and page servers to catch up, and avoid bad read performance on secondary nodes.

## Scalability questions

### How long would it take to scale up and down a compute node

Several minutes

### Is my database offline while the scaling up/down operation is in progress

No. The scaling up and down will be online.

### Should I expect connection drop when the scaling operations are in progress

Scaling up or down results in existing connections being dropped when failover happens to the compute node with the target size. Adding read replicas does not result in connection drops.

### Is the scaling up and down of compute nodes automatic or end-user triggered operation

End-user. Not automatic.  

### Does my `tempb` also grow as the compute is scaled up

Yes. Temp db will scale up automatically as the compute grows.  

### Can I provision multiple primary computes such as a multi-master system where multiple primary compute heads can drive a higher level of concurrency

No. Only the primary compute node accepts read/write requests. Secondary compute nodes only accept read-only requests.

## Read scale questions

### How many secondary compute nodes can I provision

In public preview, we create 2 replicas for Hyperscale databases by default. If you want to adjust the number of replicas, please file a support request using the Azure portal.

### How do I connect to these secondary compute nodes

You can connect to these additional read-only compute nodes by setting the `ApplicationIntent` argument on your connection string to `read_only`. Any connections marked with `read-only` are automatically routed to one of the additional read-only compute nodes.  

### Can I create a dedicated endpoint for the read-scale replica

No. In public preview, you can only connect to read-scale replica by specifying `ApplicationIntent=ReadOnly`.

### Does the system do intelligent load balancing of the read workload

No. In preview, the read only workload is re-directed to a random read-scale replica.

### Can I scale up/down the secondary compute nodes independently of the primary compute

No, not during public preview.

### Do I get different temp db sizing for my primary compute and my additional secondary compute nodes

No. Your `tempdb` is configured based on the compute size provisioning, during public preview, your secondary compute nodes are the same size as the primary compute.

### Can I add indexes and views on my secondary compute nodes

No. Hyperscale databases have shared storage, meaning that all compute nodes see the same tables, indexes and views. If you want additional indexes optimized for reads on secondary – you must add them on the primary first.

### How much delay is there going to be between the primary and secondary compute node

From the time a transaction is committed on the primary, depending on the log generation rate, it can either be instantaneous or in low milliseconds.

## Next steps

For more information about the Hyperscale service tier, see [Hyperscale service tier (preview)](sql-database-service-tier-hyperscale.md).
