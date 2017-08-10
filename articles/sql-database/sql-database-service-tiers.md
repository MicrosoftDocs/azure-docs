---
title: 'Azure SQL Database service and resource limits | Microsoft Docs'
description: Compare SQL Database service tiers and resource limits for single databases, and introduce SQL elastic pools
keywords: database options,database performance
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: f5c5c596-cd1e-451f-92a7-b70d4916e974
ms.service: sql-database
ms.custom: DBs & servers
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-management
ms.date: 08/20/2017
ms.author: carlrab

---
# Azure SQL Database service tiers and resource limits

Azure SQL Database manages the resources available to a single database or a database in an elastic pool using two mechanisms:
- CPU, memory, storage, log I/O, and data I/O resource are managed using [Service tiers, performance levels, and storage amounts](#what-are-azure-sql-database-service-tiers?)
- [Other resource limits](#how-are-other-resource-limits-enforced?) are enforced by denying new requests when limits are reached.

## What are Azure SQL Database service tiers?

[Azure SQL Database](sql-database-technical-overview.md) offers four service tiers for both [single databases](sql-database-single-database-resources.md) and databases in [elastic pools](sql-database-elastic-pool.md) databases. These service tiers are: **Basic**, **Standard**, **Premium**, and **Premium RS**. Within each service tier are multiple performance levels ([DTUs](sql-database-what-is-a-dtu.md)) and storage options to handle different workloads and data sizes. Higher performance levels provide additional compute and storage resources designed to deliver increasingly higher throughput and capacity. You can change service tiers, performance levels, and storage dynamically without downtime. 
- **Basic**, **Standard**, and **Premium** service tiers all have an uptime SLA of 99.99%, flexible business continuity options, security features, and hourly billing. 
- The **Premium RS** tier provides the same performance levels as the Premium tier with a reduced SLA because it runs with a lower number of redundant copies than a database in the other service tiers. So, in the event of a service failure, you may need to recover your database from a backup with up to a 5-minute lag.

One of the design goals of the **Basic**, **Standard**, **Premium**, and **Premium RS** service tiers is for Azure SQL Database to behave as if the database is running on its own machine, isolated from other databases. Resource governance emulates this behavior. If the aggregated resource utilization reaches the maximum available CPU, Memory, Log I/O, and Data I/O resources assigned to the database, resource governance queues queries in execution and assign resources to the queued queries as they free up.

As on a dedicated machine, utilizing all available resources results in a longer execution of currently executing queries, which can result in command timeouts on the client. Applications with aggressive retry logic and applications that execute queries against the database with a high frequency can encounter errors messages when trying to execute new queries when the limit of concurrent requests has been reached.

## Choosing a service tier

Monitor the resource utilization and the average response times of queries when nearing the maximum utilization of a database. When encountering higher query latencies you generally have three options:

1. Reduce the number of incoming requests to the database to prevent timeout and the pile up of requests.
2. Assign a higher performance level to the database.
3. Optimize queries to reduce the resource utilization of each query. For more information, see [Query Tuning/Hinting](sql-database-performance-guidance.md#query-tuning-and-hinting).

The following table provides examples of the tiers best suited for different application workloads.

| Service tier | Target workloads |
| :--- | --- |
| **Basic** | Best suited for a small database, supporting typically one single active operation at a given time. Examples include databases used for development or testing, or small-scale infrequently used applications. |
| **Standard** |The go-to option for cloud applications with low to medium IO performance requirements, supporting multiple concurrent queries. Examples include workgroup or web applications. |
| **Premium** | Designed for high transactional volume with high IO performance requirements, supporting many concurrent users. Examples are databases supporting mission critical applications. |
| **Premium RS** | Designed for IO-intensive workloads that do not require the highest availability guarantees. Examples include testing high-performance workloads, or an analytical workload where the database is not the system of record. |
|||

Compute resources include CPU, data IO, and log IO, and are expressed in terms of Database Transaction Units (DTUs) for single databases and elastic Database Transaction Units (eDTUs) for elastic pools. For more on DTUs and eDTUs, see [What are DTUs and eDTUs?](sql-database-what-is-a-dtu.md).

You can create single databases with dedicated compute (DTUs) or you can create databases within an [elastic pool](sql-database-elastic-pool.md) where compute (eDTUs) and storage resources are shared across multiple databases.

To decide on a service tier, start by determining the minimum database features that you need:

| **Service tier limits for single databases** | **Basic** | **Standard** | **Premium** | **Premium RS**|
| :-- | --: | --: | --: | --: |
| Maximum storage size* | 2 GB | 1 TB | 4 TB  | 1 TB  |
| Maximum DTUs | 5 | 100 | 4000 | 1000 |
| Backup retention period | 7 days | 35 days | 35 days | 35 days |
||||||

| **Service tier limits for elastic pools** | **Basic** | **Standard** | **Premium** | **Premium RS**|
| :-- | --: | --: | --: | --: |
| Maximum storage size per database*  | 2 GB | 1 TB | 1 TB | 1 TB |
| Maximum storage size per pool* | 156 GB | 4 TB | 4 TB | 1 TB |
| Maximum eDTUs per database | 5 | 3000 | 4000 | 1000 |
| Maximum eDTUs per pool | 1600 | 3000 | 4000 | 1000 |
| Maximum number of databases per pool | 500  | 500 | 100 | 100 |
| Backup retention period per database | 7 days | 35 days | 35 days | 35 days |
||||||

> [!IMPORTANT]
> Storage sizes greater than the amount of storage included are in preview and extra costs apply. For details, see [SQL Database pricing](https://azure.microsoft.com/pricing/details/sql-database/). In the Premium tier, more than 1 TB of storage is currently available in the following regions: US East2, West US, US Gov Virginia, West Europe, Germany Central, South East Asia, Japan East, Australia East, Canada Central, and Canada East. See [P11-P15 Current Limitations](sql-database-single-database-resources.md#current-limitations-of-p11-and-p15-databases-with-a-maximum-size-greater-than-1-tb).  
> 

## Choosing compute

- The **Standard** tier is often a good starting point that balances performance and price. More conservatively, if compute requirements are unknown, start first in **Premium**, and then downsize if possible to **Standard** or even **Basic**. 
- For databases requiring high IO throughput or low IO latency, **Premium** is the right starting point.  The **Premium** tier provides an order of magnitude more IO per DTU (and per eDTU) compared to the **Standard** tier.
- The **PremiumRS** tier offers the performance of the **Premium** tier at a lower cost, but with a reduced SLA.

## Choosing storage 

### Single database

- The DTU price for a single database includes a certain amount of storage at no additional cost.  Extra storage beyond the included amount can be provisioned for an additional cost up to the max size limit in increments of 250 GB up to 1 TB, and then in increments of 256 GB beyond 1 TB.  For included storage amounts and max size limits, see [Single database](sql-database-single-database-resources.md#single-database-service-tiers-performance-levels-and-storage-amounts).
- Extra storage for a single database can be provisioned by increasing its max size using the  [Azure portal](sql-database-single-database-resources.md#manage-single-database-resources-using-the-azure-portal), [Transact-SQL](/sql/t-sql/statements/alter-database-azure-sql-database), [PowerShell](/powershell/module/azurerm.sql/set-azurermsqldatabase), [Azure CLI](/cli/azure/sql/db#update), or [REST API](/rest/api/sql/).  
- The price of extra storage for a single database is the extra storage amount multiplied by the extra storage unit price of the service tier.  For details on the price of extra storage, see the [SQL Database pricing page](https://azure.microsoft.com/pricing/details/sql-database/).

### Elastic pool

- The eDTU price for an elastic pool includes a certain amount of storage at no additional cost.  Extra storage beyond the included amount can be provisioned for an additional cost up to the max size limit in increments of 250 GB up to 1 TB, and then in increments of 256 GB beyond 1 TB.  For included storage amounts and max size limits, see [Elastic pools](sql-database-elastic-pool.md#elastic-pool-service-tiers-performance-levels-and-storage-amounts).
- Extra storage for an elastic pool can be provisioned by increasing its max size using the [Azure portal](sql-database-elastic-pool.md#manage-sql-database-elastic-pools-using-the-azure-portal), [PowerShell](/powershell/module/azurerm.sql/set-azurermsqlelasticpool), [Azure CLI](/cli/azure/sql/elastic-pool#update), or [REST API](/rest/api/sql/).
- The price of extra storage for an elastic pool is the extra storage amount multiplied by the extra storage unit price of the service tier.  For details on the price of extra storage, see the [SQL Database pricing page](https://azure.microsoft.com/pricing/details/sql-database/).

## How are other resource limits enforced?

Resources other than CPU, Memory, Log I/O, and Data I/O are enforced by denying new requests when limits are reached. These resource limits vary based on the service tier and performance level for [single databases](sql-database-single-database-resources.md#single-database-service-tiers-performance-levels-and-storage-amounts) and for [elastic pools](sql-database-elastic-pool.md#elastic-pool-service-tiers-performance-levels-and-storage-amounts). When a database reaches the configured maximum size limit, inserts and updates that increase data size fail, while selects and deletes continue to work. Clients receive an [error message](sql-database-develop-error-messages.md) depending on the limit that has been reached.

For example, the number of connections to a SQL database and the number of concurrent requests that can be processed are restricted. SQL Database allows the number of connections to the database to be greater than the number of concurrent requests to support connection pooling. While the number of connections that are available can easily be controlled by the application, the number of parallel requests is often times harder to estimate and to control. Especially during peak loads when the application either sends too many requests or the database reaches its resource limits and starts piling up worker threads due to longer running queries, errors can be encountered.

## Next steps

- Learn about [Single database resources](sql-database-single-database-resources.md).
- Learn about elastic pools, see [Elastic pools](sql-database-elastic-pool.md).
- Learn about [Azure Subscription and Service Limits, Quotas, and Constraints](../azure-subscription-service-limits.md)
* Learn more about [DTUs and eDTUs](sql-database-what-is-a-dtu.md).
* Learn about monitoring DTU usage, see [Monitoring and performance tuning](sql-database-troubleshoot-performance.md).

