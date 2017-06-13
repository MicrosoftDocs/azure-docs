---
title: Azure SQL Database Resource Limits | Microsoft Docs
description: This page describes some common resource limits for Azure SQL Database.
services: sql-database
documentationcenter: na
author: janeng
manager: jhubbard
editor: ''

ms.assetid: 884e519f-23bb-4b73-a718-00658629646a
ms.service: sql-database
ms.custom: DBs & servers
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-management
wms.date: 05/31/2017
ms.author: janeng

---
# Azure SQL Database resource limits
## Overview
Azure SQL Database manages the resources available to a database using two different mechanisms: **Resources Governance** and **Enforcement of Limits**. This topic explains these two main areas of resource management.

## Resource governance
One of the design goals of the Basic, Standard, Premium, and Premium RS service tiers is for Azure SQL Database to behave as if the database is running on its own machine, isolated from other databases. Resource governance emulates this behavior. If the aggregated resource utilization reaches the maximum available CPU, Memory, Log I/O, and Data I/O resources assigned to the database, resource governance queues queries in execution and assign resources to the queued queries as they free up.

As on a dedicated machine, utilizing all available resources results in a longer execution of currently executing queries, which can result in command timeouts on the client. Applications with aggressive retry logic and applications that execute queries against the database with a high frequency can encounter errors messages when trying to execute new queries when the limit of concurrent requests has been reached.

### Recommendations:
Monitor the resource utilization and the average response times of queries when nearing the maximum utilization of a database. When encountering higher query latencies you generally have three options:

1. Reduce the number of incoming requests to the database to prevent timeout and the pile up of requests.
2. Assign a higher performance level to the database.
3. Optimize queries to reduce the resource utilization of each query. For more information, see the Query Tuning/Hinting section in the Azure SQL Database Performance Guidance article.

## Enforcement of limits
Resources other than CPU, Memory, Log I/O, and Data I/O are enforced by denying new requests when limits are reached. When a database reaches the configured maximum size limit, inserts and updates that increase data size fail, while selects and deletes continue to work. Clients receive an [error message](sql-database-develop-error-messages.md) depending on the limit that has been reached.

For example, the number of connections to a SQL database and the number of concurrent requests that can be processed are restricted. SQL Database allows the number of connections to the database to be greater than the number of concurrent requests to support connection pooling. While the number of connections that are available can easily be controlled by the application, the number of parallel requests is often times harder to estimate and to control. Especially during peak loads when the application either sends too many requests or the database reaches its resource limits and starts piling up worker threads due to longer running queries, errors can be encountered.

## Service tiers and performance levels
There are service tiers and performance levels for both single database and elastic pools.

### Single databases
For a single database, the limits of a database are defined by the database service tier and performance level. The following table describes the characteristics of Basic, Standard, Premium, and Premium RS databases at varying performance levels.

[!INCLUDE [SQL DB service tiers table](../../includes/sql-database-service-tiers-table.md)]

> [!IMPORTANT]
> Customers using P11 and P15 performance levels can use up to 4 TB of included storage at no additional charge. This 4 TB option is currently available in the following regions: US East2, West US, US Gov Virginia, West Europe, Germany Central, South East Asia, Japan East, Australia East, Canada Central, and Canada East.
>

### Elastic pools
[Elastic pools](sql-database-elastic-pool.md) share resources across databases in the pool. The following table describes the characteristics of Basic, Standard, Premium, and Premium RS elastic pools.

[!INCLUDE [SQL DB service tiers table for elastic databases](../../includes/sql-database-service-tiers-table-elastic-pools.md)]

For an expanded definition of each resource listed in the previous tables, see the descriptions in [Service tier capabilities and limits](sql-database-performance-guidance.md#service-tier-capabilities-and-limits). For an overview of service tiers, see [Azure SQL Database Service Tiers and Performance Levels](sql-database-service-tiers.md).

## Other SQL Database limits
| Area | Limit | Description |
| --- | --- | --- |
| Databases using Automated export per subscription |10 |Automated export allows you to create a custom schedule for backing up your SQL databases. The preview of this feature will end on March 1, 2017.  |
| Databases per server |Up to 5000 |Up to 5000 databases are allowed per server. |
| DTUs per server |45000 |45000 DTUs are allowed per server for provisioning standalone databases and elastic pools. The total number of standalone databases and pools allowed per server is limited only by the number of server DTUs.  

> [!IMPORTANT]
> Azure SQL Database Automated Export is now in preview and will be retired on March 1, 2017. Starting December 1st, 2016, you will no longer be able to configure automated export on any SQL database. All your existing automated export jobs will continue to work until March 1st, 2017. After December 1st, 2016, you can use [long-term backup retention](sql-database-long-term-retention.md) or [Azure Automation](../automation/automation-intro.md) to archive SQL databases periodically using PowerShell periodically according to a schedule of your choice. For a sample script, you can download the [sample script from GitHub](https://github.com/Microsoft/sql-server-samples/tree/master/samples/manage/azure-automation-automated-export).
>


## Resources
[Azure Subscription and Service Limits, Quotas, and Constraints](../azure-subscription-service-limits.md)

[Azure SQL Database Service Tiers and Performance Levels](sql-database-service-tiers.md)

[Error messages for SQL Database client programs](sql-database-develop-error-messages.md)
