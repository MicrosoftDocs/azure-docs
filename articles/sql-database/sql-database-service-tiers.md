---
title: 'Azure SQL Database service and performance tiers | Microsoft Docs'
description: Compare SQL Database service tiers and performance levels for single databases, and introduce SQL elastic pools
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
ms.date: 07/18/2017
ms.author: carlrab

---
# What are Azure SQL Database service tiers and resource limits

Azure SQL Database manages the resources available to a single database or a database in an elastic pool using two mechanisms:
- CPU, memory, storage, log I/O, and data I/O resource are managed using [Service tiers, performance levels, and storage amounts](#what-are-azure-sql-database-service-tiers?)
- [Other resource limits](#how-are-other-resource-limits-enforced?) are enforced by denying new requests when limits are reached.

## What are Azure SQL Datbase service tiers?

[Azure SQL Database](sql-database-technical-overview.md) offers four service tiers for both [single databases](sql-database-single-database-resources.md) and databases in [elastic pools](sql-database-elastic-pool.md) databases. These service tiers are: **Basic**, **Standard**, **Premium**, and **Premium RS**. Within each service tier are multiple performance levels ([DTUs](sql-database-what-is-a-dtu.md)) and storage options to handle different workloads and data sizes. Higher performance levels provide additional compute and storage resources designed to deliver increasingly higher throughput and capacity. You can change service tiers, performance levels, and storage dynamically without downtime. 
- **Basic**, **Standard**, and **Premium** service tiers all have an uptime SLA of 99.99%, flexible business continuity options, security features, and hourly billing. 
- The **Premium RS** tier provides the same performance levels as the Premium tier with a reduced SLA because it runs with a lower number of redundant copies than a database in the other service tiers. So, in the event of a service failure, you may need to recover your database from a backup with up to a 5-minute lag.

One of the design goals of the **Basic**, **Standard**, **Premium**, and **Premium RS** service tiers is for Azure SQL Database to behave as if the database is running on its own machine, isolated from other databases. Resource governance emulates this behavior. If the aggregated resource utilization reaches the maximum available CPU, Memory, Log I/O, and Data I/O resources assigned to the database, resource governance queues queries in execution and assign resources to the queued queries as they free up.

As on a dedicated machine, utilizing all available resources results in a longer execution of currently executing queries, which can result in command timeouts on the client. Applications with aggressive retry logic and applications that execute queries against the database with a high frequency can encounter errors messages when trying to execute new queries when the limit of concurrent requests has been reached.

## Choosing a service tier

### Recommendations:
Monitor the resource utilization and the average response times of queries when nearing the maximum utilization of a database. When encountering higher query latencies you generally have three options:

1. Reduce the number of incoming requests to the database to prevent timeout and the pile up of requests.
2. Assign a higher performance level to the database.
3. Optimize queries to reduce the resource utilization of each query. For more information, see the [Query Tuning/Hinting](sql-database-performance-guidance.md#query-tuning-and-hinting).

The following table provides examples of the tiers best suited for different application workloads.

| Service tier | Target workloads |
| :--- | --- |
| **Basic** | Best suited for a small database, supporting typically one single active operation at a given time. Examples include databases used for development or testing, or small-scale infrequently used applications. |
| **Standard** |The go-to option for cloud applications with low to medium IO performance requirements, supporting multiple concurrent queries. Examples include workgroup or web applications. |
| **Premium** | Designed for high transactional volume with high IO performance requirements, supporting many concurrent users. Examples are databases supporting mission critical applications. |
| **Premium RS** | Designed for IO-intensive workloads that do not require the highest availability guarantees. Examples include testing high-performance workloads, or an analytical workload where the database is not the system of record. |
|||

You can create single databases with dedicated resources within a service tier at a specific [performance level](sql-database-service-tiers.md#single-database-service-tiers-and-performance-levels) or you can also create databases within a [SQL elastic pool](sql-database-service-tiers.md#elastic-pool-service-tiers-and-performance-in-edtus). In a SQL elastic pool, the compute and storage resources are shared across multiple databases within a single logical server. 

Resources available for single databases are expressed in terms of Database Transaction Units (DTUs) and resources for SQL elastic pools are expressed in terms of elastic Database Transaction Units (eDTUs). For more on DTUs and eDTUs, see [What are DTUs and eDTUs?](sql-database-what-is-a-dtu.md)

To decide on a service tier, start by determining the minimum database features that you need:

| **Service tier limits for single databases** | **Basic** | **Standard** | **Premium** | **Premium RS**|
| :-- | --: | --: | --: | --: |
| Maximum single database size | 2 GB | 1 TB | 4* TB  | 1 TB  |
| Maximum single database DTUs | 5 | 100 | 4000 | 1000 |
| Database backup retention period | 7 days | 35 days | 35 days | 35 days |
||||||

| **Service tier limits for elastic pools** | **Basic** | **Standard** | **Premium** | **Premium RS**|
| :-- | --: | --: | --: | --: |
| Maximum elastic pool size | 156 GB | 4 TB* | 4 TB* | 1 TB |
| Maximum database size in an elastic pool | 2 GB | 1 TB | 1 TB | 1 TB |
| Maximum number of databases per pool | 500  | 500 | 100 | 100 |
| Maximum DTUs per database in an elastic pool | 5 | 3000 | 4000 | 1000 |
| Database backup retention period | 7 days | 35 days | 35 days | 35 days |
||||||

> [!IMPORTANT]
> More than 1 TB of storage is available in preview in the following regions: US East2, West US, US Gov Virginia, West Europe, Germany Central, South East Asia, Japan East, Australia East, Canada Central, and Canada East.  
>

## Choosing a performance level

Once you have determined the appropriate service tier, you are ready to determine the performance level (the number of DTUs) and the storage amount for the database. 

- The S2 and S3 performance levels in the **Standard** tier are often a good starting point. 
- For databases with high CPU or IO requirements, the performance levels in the **Premium** tier are the right starting point. 
- The **Premium** tier offers more CPU and starts at 10x more IO compared to the highest performance level in the **Standard** tier.
- The **PremiumRS** tier offers the performance of the **Premium** tier at a lower cost, but with a reduced SLA.

> [!IMPORTANT]
> Review the [SQL elastic pools](sql-database-elastic-pool.md) topic for the details about grouping databases into SQL elastic pools to share compute and storage resources. The remainder of this topic focuses on service tiers and performance levels for single databases.
>

## Choosing storage amounts

Each performance level within a service tier comes with a certain about of storage that is included in the price for the single database or elastic pool. In additional to this amount of included storage, you can provision additional storage for a single database or an elastic pool. Storage sizes greater than the storage included are in preview.  If the storage max size set exceeds the amount of storage included, then an additional cost for the extra storage applies. The price of extra storage is the amount of extra storage multiplied by the unit price of extra storage for the service tier. For details, see the [SQL Database pricing page](https://azure.microsoft.com/pricing/details/sql-database/).  

Examples showing how the price of extra storage is determined:

- **Single database**: Suppose an S3 database has provisioned 1 TB. The amount of storage included for S3 is 250 GB, and so the extra storage amount is 1 TB – 250 GB = 774 GB. The unit price for extra storage in the Standard tier is approximately $0.085/GB/month during preview, and so the extra storage price is 774 GB * $0.085/GB/month = $65.79/month. Therefore, the total price for the S3 database is $150/month for DTUs + $65.79/month for extra storage = $215.79/month.
- **Elastic pool**: Suppose a 125 eDTU Premium pool has provisioned 1 TB. The amount of storage included for a 125 eDTU Premium pool is 250 GB, and so the extra storage amount is 1 TB – 250 GB = 774 GB. The unit price for extra storage in the Premium tier is approximately $0.17/GB/month during preview, and so the extra storage price is 774 GB * $0.17/GB/month = $131.58/month. Therefore, the total price for the pool is $697.13/month for pool eDTUs + $131.58/month for extra storage = $828.71/month.

## How are other resource limits enforced?

Resources other than CPU, Memory, Log I/O, and Data I/O are enforced by denying new requests when limits are reached. These resource limits vary based on the service tier and performance level for [single databases](sql-database-single-database-resources.md#single-database-service-tiers-performance-levels-and-storage-amounts) and for [elastic pools](sql-database-elastic-pool.md#elastic-pool-service-tiers-performance-levels-and-storage-amounts). When a database reaches the configured maximum size limit, inserts and updates that increase data size fail, while selects and deletes continue to work. Clients receive an [error message](sql-database-develop-error-messages.md) depending on the limit that has been reached.

For example, the number of connections to a SQL database and the number of concurrent requests that can be processed are restricted. SQL Database allows the number of connections to the database to be greater than the number of concurrent requests to support connection pooling. While the number of connections that are available can easily be controlled by the application, the number of parallel requests is often times harder to estimate and to control. Especially during peak loads when the application either sends too many requests or the database reaches its resource limits and starts piling up worker threads due to longer running queries, errors can be encountered.

## Next steps

- Learn about [Single database resources](sql-database-single-database-resources.md).
- Learn about elastic pools, see [Elastic pools](sql-database-elastic-pool.md).
- Learn about [Azure Subscription and Service Limits, Quotas, and Constraints](../azure-subscription-service-limits.md)
* Learn more about [DTUs and eDTUs](sql-database-what-is-a-dtu.md).
* Learn about monitoring DTU usage, see [Monitoring and performance tuning](sql-database-troubleshoot-performance.md).

