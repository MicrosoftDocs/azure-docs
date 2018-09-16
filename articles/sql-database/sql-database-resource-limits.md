---
title: Azure SQL Database resource limits overview | Microsoft Docs
description: This page describes some common DTU-based resource limits for single databases in Azure SQL Database.
services: sql-database
author: CarlRabeler
manager: craigg
ms.service: sql-database
ms.custom: DBs & servers
ms.topic: conceptual
ms.date: 09/14/2018
ms.author: carlrab

---
# Overview Azure SQL Database resource limits 

This article provides an overview of the Azure SQL Database resource limits and provides information regarding what happens when those resource limits are hit or exceeded.

## What is the maximum number of servers and databases?

| Maximum | Logical server | Managed instance |
| :--- | :--- | :--- |
| Databases per server/instance | 5000 | 100 |
| Default number of servers per subscription in any region | 20 | N/A |
| Max number of servers per subscription in any region | 200 | N/A | 
| DTU / eDTU quota per server | 54,000 | N/A |  
| vCore quota per server/instance | 540 | 80 |
| Max pools per server | Limited by number of DTUs or vCores | N/A |
||||

> [!NOTE]
> To obtain more DTU /eDTU quota, vCore quota, or more servers than the default amount, a new support request can be submitted in the Azure portal for the subscription with issue type “Quota”. The DTU / eDTU quota and database limit per server constrains the number of elastic pools per server. 

> [!IMPORTANT]
> As the number of databases approaches the limit per server, the following can occur:
> -	Increasing latency in running queries against the master database.  This includes views of resource utilization statistics such as sys.resource_stats.
> -	Increasing latency in management operations and rendering portal viewpoints that involve enumerating databases in the server.

## What happens when database resource limits are reached?

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

## Next steps

- See [SQL Database FAQ](sql-database-faq.md) for answers to frequently asked questions.
- For information about general Azure limits, see [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md).
- For information about DTUs and eDTUs, see [DTUs and eDTUs](sql-database-service-tiers.md#what-are-database-transaction-units-dtus).
- For information about tempdb size limits, see https://docs.microsoft.com/sql/relational-databases/databases/tempdb-database#tempdb-database-in-sql-database.
