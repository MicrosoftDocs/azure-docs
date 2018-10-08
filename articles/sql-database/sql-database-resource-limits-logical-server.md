---
title: Azure SQL Database resource limits - logical server | Microsoft Docs
description: This article provides an overview of the Azure SQL Database resource limits for single databases and pooled databases using elastic pools. It also provides information regarding what happens when those resource limits are hit or exceeded.
services: sql-database
ms.service: sql-database
ms.subservice: 
ms.custom:
ms.devlang: 
ms.topic: conceptual
author: CarlRabeler
ms.author: carlrab
ms.reviewer: sashan,moslake
manager: craigg
ms.date: 09/19/2018
---
# SQL Database resource limits for single and pooled databases on a logical server 

This article provides an overview of the SQL Database resource limits for single and pooled databases on a logical server. It also provides information regarding what happens when those resource limits are hit or exceeded.

> [!NOTE]
> For Managed Instance limits, see [SQL Database resource limits for managed instances](sql-database-managed-instance-resource-limits.md).

## Maximum resource limits

| Resource | Limit |
| :--- | :--- |
| Databases per server | 5000 |
| Default number of servers per subscription in any region | 20 |
| Max number of servers per subscription in any region | 200 |  
| DTU / eDTU quota per server | 54,000 |  
| vCore quota per server/instance | 540 |
| Max pools per server | Limited by number of DTUs or vCores |
||||

> [!NOTE]
> To obtain more DTU /eDTU quota, vCore quota, or more servers than the default amount, a new support request can be submitted in the Azure portal for the subscription with issue type “Quota”. The DTU / eDTU quota and database limit per server constrains the number of elastic pools per server. 

> [!IMPORTANT]
> As the number of databases approaches the limit per logical server, the following can occur:
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
- For information about DTUs and eDTUs, see [DTUs and eDTUs](sql-database-service-tiers.md#dtu-based-purchasing-model).
- For information about tempdb size limits, see [TempDB in Azure SQL Database](https://docs.microsoft.com/sql/relational-databases/databases/tempdb-database#tempdb-database-in-sql-database).
