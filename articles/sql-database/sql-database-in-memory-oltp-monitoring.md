---
title: Monitor XTP in-memory storage | Microsoft Docs
description: Estimate and monitor XTP in-memory storage use, capacity; resolve capacity error 41823
services: sql-database
documentationcenter: ''
author: jodebrui
manager: jhubbard
editor: ''

ms.assetid: b617308e-692c-4938-8fa2-070034a3ecef
ms.service: sql-database
ms.custom: monitor & tune
ms.workload: "Inactive"
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/16/2018
ms.author: jodebrui

---
# Monitor In-Memory OLTP storage
When using [In-Memory OLTP](sql-database-in-memory.md), data in memory-optimized tables and table variables resides in In-Memory OLTP storage. Each Premium service tier has a maximum In-Memory OLTP storage size, which is documented in [single database resource limits](sql-database-resource-limits.md#single-database-storage-sizes-and-performance-levels) and [elastic pool resource limits](sql-database-resource-limits.md#elastic-pool-change-storage-size). Once this limit is exceeded, insert and update operations may start failing with error 41823 for standalone databases and error 41840 for elastic pools. At that point you need to either delete data to reclaim memory, or upgrade the performance tier of your database.

## Determine whether data fits within the In-Memory OLTP storage cap
Determine the storage caps of the different Premium service tiers. See [single database resource limits](sql-database-resource-limits.md#single-database-storage-sizes-and-performance-levels) and [elastic pool resource limits](sql-database-resource-limits.md#elastic-pool-change-storage-size).

Estimating memory requirements for a memory-optimized table works the same way for SQL Server as it does in Azure SQL Database. Take a few minutes to review that article on [MSDN](https://msdn.microsoft.com/library/dn282389.aspx).

Table and table variable rows, as well as indexes, count toward the max user data size. In addition, ALTER TABLE needs enough room to create a new version of the entire table and its indexes.

## Monitoring and alerting
You can monitor in-memory storage use as a percentage of the storage cap for your performance tier in the [Azure portal](https://portal.azure.com/): 

1. On the Database blade, locate the Resource utilization box and click on Edit.
2. Select the metric `In-Memory OLTP Storage percentage`.
3. To add an alert, click on the Resource Utilization box to open the Metric blade, then click on Add alert.

Or use the following query to show the in-memory storage utilization:

    SELECT xtp_storage_percent FROM sys.dm_db_resource_stats


## Correct out-of-In-Memory OLTP storage situations - Errors 41823 and 41840
Hitting the In-Memory OLTP storage cap in your database results in INSERT, UPDATE, ALTER and CREATE operations failing with error message 41823 (for standalone databases) or error 41840 (for elastic pools). Both errors cause the active transaction to abort.

Error messages 41823 and 41840 indicate that the memory-optimized tables and table variables in the database or pool have reached the maximum In-Memory OLTP storage size.

To resolve this error, either:

* Delete data from the memory-optimized tables, potentially offloading the data to traditional, disk-based tables; or,
* Upgrade the service tier to one with enough in-memory storage for the data you need to keep in memory-optimized tables.

> [!NOTE] 
> In rare cases, errors 41823 and 41840 can be transient, meaning there is enough available In-Memory OLTP storage, and retrying the operation succeeds. We therefore recommend to both monitor the overall available In-Memory OLTP storage and to retry when first encountering error 41823 or 41840. For more information about retry logic, see [Conflict Detection and Retry Logic with In-Memory OLTP](https://docs.microsoft.com/sql/relational-databases/in-memory-oltp/transactions-with-memory-optimized-tables#conflict-detection-and-retry-logic).

## Next steps
For monitoring guidance, see [Monitoring Azure SQL Database using dynamic management views](sql-database-monitoring-with-dmvs.md).
