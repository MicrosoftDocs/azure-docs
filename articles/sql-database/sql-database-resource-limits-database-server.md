---
title: Azure SQL Database server resource limits | Microsoft Docs
description: This article provides an overview of the Azure SQL Database server resource limits for single databases and elastic pools. It also provides information regarding what happens when those resource limits are hit or exceeded.
services: sql-database
ms.service: sql-database
ms.subservice: single-database
ms.custom:
ms.devlang: 
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer: sashan,moslake,josack
manager: craigg
ms.date: 04/18/2019
---
# SQL Database resource limits for Azure SQL Database server

This article provides an overview of the SQL Database resource limits for a SQL Database server that manages single databases and elastic pools. It also provides information regarding what happens when those resource limits are hit or exceeded.

> [!NOTE]
> For managed instances limits, see [SQL Database resource limits for managed instances](sql-database-managed-instance-resource-limits.md).

## Maximum resource limits

| Resource | Limit |
| :--- | :--- |
| Databases per server | 5000 |
| Default number of servers per subscription in any region | 20 |
| Max number of servers per subscription in any region | 200 |  
| DTU / eDTU quota per server | 54,000 |  
| vCore quota per server/instance | 540 |
| Max pools per server | Limited by number of DTUs or vCores. For example, if each pool is 1000 DTUs, then a server can support 54 pools.|
|||

> [!NOTE]
> To obtain more DTU /eDTU quota, vCore quota, or more servers than the default amount, a new support request can be submitted in the Azure portal for the subscription with issue type “Quota”. The DTU / eDTU quota and database limit per server constrains the number of elastic pools per server.
> [!IMPORTANT]
> As the number of databases approaches the limit per SQL Database server, the following can occur:
> - Increasing latency in running queries against the master database.  This includes views of resource utilization statistics such as sys.resource_stats.
> - Increasing latency in management operations and rendering portal viewpoints that involve enumerating databases in the server.

### Storage size
- For single databases rources please refer to either [DTU-based resource limits](sql-database-dtu-resource-limits-single-databases.md) or [vCore-based resource limits](sql-database-vcore-resource-limits-single-databases.md) for the storage size limits per pricing tier.

## What happens when database resource limits are reached

### Compute (DTUs and eDTUs / vCores)

When database compute utilization (measured by DTUs and eDTUs, or vCores) becomes high, query latency increases and can even time out. Under these conditions, queries may be queued by the service and are provided resources for execution as resource become free.
When encountering high compute utilization, mitigation options include:

- Increasing the compute size of the database or elastic pool to provide the database with more compute resources. See [Scale single database resources](sql-database-single-database-scale.md) and [Scale elastic pool resources](sql-database-elastic-pool-scale.md).
- Optimizing queries to reduce the resource utilization of each query. For more information, see [Query Tuning/Hinting](sql-database-performance-guidance.md#query-tuning-and-hinting).

### Storage

When database space used reaches the max size limit, database inserts and updates that increase the data size fail and clients receive an [error message](sql-database-develop-error-messages.md). Database SELECTS and DELETES continue to succeed.

When encountering high space utilization, mitigation options include:

- Increasing the max size of the database or elastic pool, or add more storage. See [Scale single database resources](sql-database-single-database-scale.md) and [Scale elastic pool resources](sql-database-elastic-pool-scale.md).
- If the database is in an elastic pool, then alternatively the database can be moved outside of the pool so that its storage space is not shared with other databases.
- Shrink a database to reclaim unused space. For more information, see [Manage file space in Azure SQL Database](sql-database-file-space-management.md)

### Sessions and workers (requests)

The maximum number of sessions and workers are determined by the service tier and compute size (DTUs and eDTUs). New requests are rejected when session or worker limits are reached, and clients receive an error message. While the number of connections available can be controlled by the application, the number of concurrent workers is often harder to estimate and control. This is especially true during peak load periods when database resource limits are reached and workers pile up due to longer running queries.

When encountering high session or worker utilization, mitigation options include:

- Increasing the service tier or compute size of the database or elastic pool. See [Scale single database resources](sql-database-single-database-scale.md) and [Scale elastic pool resources](sql-database-elastic-pool-scale.md).
- Optimizing queries to reduce the resource utilization of each query if the cause of increased worker utilization is due to contention for compute resources. For more information, see [Query Tuning/Hinting](sql-database-performance-guidance.md#query-tuning-and-hinting).

## Transaction Log Rate Governance 
Transaction log rate governance is a process in Azure SQL Database used to limit high ingestion rates for workloads such as bulk insert, SELECT INTO, and index builds. These limits are tracked and enforced at the sub-second level to the rate of log record generation, limiting throughput regardless of how many IOs may be issued against data files.  Transaction log generation rates currently scale linearly up to a point that is hardware dependent, with the maximum log rate allowed being 96 MB/s with the vCore purchasing model. 

> [!NOTE]
> The actual physical IOs to transaction log files are not governed or limited. 

Log rates are set such that they can be achieved and sustained in a variety of scenarios, while the overall system can maintain its functionality with minimized impact to the user load. Log rate governance ensures that transaction log backups stay within published recoverability SLAs.  This governance also prevents an excessive backlog on secondary replicas.

As log records are generated, each operation is evaluated and assessed for whether it should be delayed in order to maintain a maximum desired log rate (MB/s per second). The delays are not added when the log records are flushed to storage, rather log rate governance is applied during log rate generation itself.

The actual log generation rates imposed at run time may also be influenced by feedback mechanisms, temporarily reducing the allowable log rates so the system can stabilize. Log file space management, avoiding running into out of log space conditions and Availability Group replication mechanisms can temporarily decrease the overall system limits. 

Log rate governor traffic shaping is surfaced via the following wait types (exposed in the [sys.dm_db_wait_stats](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-db-wait-stats-azure-sql-database) DMV):

| Wait Type | Notes |
| :--- | :--- |
| LOG_RATE_GOVERNOR | Database limiting |
| POOL_LOG_RATE_GOVERNOR | Pool limiting |
| INSTANCE_LOG_RATE_GOVERNOR | Instance level limiting |  
| HADR_THROTTLE_LOG_RATE_SEND_RECV_QUEUE_SIZE | Feedback control, availability group physical replication in Premium/Business Critical not keeping up |  
| HADR_THROTTLE_LOG_RATE_LOG_SIZE | Feedback control, limiting rates to avoid an out of log space condition |
|||

When encountering a log rate limit that is hampering desired scalability, consider the following options:
- Scale up to a larger tier in order to get the maximum 96 MB/s log rate. 
- If data being loaded is transient, i.e. staging data in an ETL process, it can be loaded into tempdb (which is minimally logged). 
- For analytic scenarios, load into a clustered columnstore covered table. This reduces the required log rate due to compression. This technique does increase CPU utilization and is only applicable to data sets that benefit from clustered columnstore indexes. 

## Next steps

- For information about general Azure limits, see [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md).
- For information about DTUs and eDTUs, see [DTUs and eDTUs](sql-database-purchase-models.md#dtu-based-purchasing-model).
- For information about tempdb size limits, see [TempDB in Azure SQL Database](https://docs.microsoft.com/sql/relational-databases/databases/tempdb-database#tempdb-database-in-sql-database).
