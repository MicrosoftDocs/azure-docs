---
title: Monitor XTP In-memory storage | Microsoft Docs
description: Estimate and monitor XTP In-memory storage use, capacity; resolve capacity error 41823
services: sql-database
ms.service: sql-database
ms.subservice: operations
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: jodebrui
ms.author: jodebrui
ms.reviewer: genemi
manager: craigg
ms.date: 09/14/2018
---
# Monitor In-Memory OLTP storage
When using [In-Memory OLTP](sql-database-in-memory.md), data in memory-optimized tables and table variables resides in In-Memory OLTP storage. Each Premium and Business Critical service tier has a maximum In-Memory OLTP storage size. See [DTU-based resource limits - single database](sql-database-dtu-resource-limits-single-databases.md), [DTU-based resource limits - elastic pools](sql-database-dtu-resource-limits-elastic-pools.md),[vCore-based resource limits - single databases](sql-database-vcore-resource-limits-single-databases.md) and [vCore-based resource limits - elastic pools](sql-database-vcore-resource-limits-elastic-pools.md).

Once this limit is exceeded, insert and update operations may start failing with error 41823 for single databases and error 41840 for elastic pools. At that point you need to either delete data to reclaim memory, or upgrade the service tier or compute size of your database.

## Determine whether data fits within the In-Memory OLTP storage cap
Determine the storage caps of the different service tiers. See [DTU-based resource limits - single database](sql-database-dtu-resource-limits-single-databases.md), [DTU-based resource limits - elastic pools](sql-database-dtu-resource-limits-elastic-pools.md),[vCore-based resource limits - single databases](sql-database-vcore-resource-limits-single-databases.md) and [vCore-based resource limits - elastic pools](sql-database-vcore-resource-limits-elastic-pools.md).

Estimating memory requirements for a memory-optimized table works the same way for SQL Server as it does in Azure SQL Database. Take a few minutes to review that article on [MSDN](https://msdn.microsoft.com/library/dn282389.aspx).

Table and table variable rows, as well as indexes, count toward the max user data size. In addition, ALTER TABLE needs enough room to create a new version of the entire table and its indexes.

## Monitoring and alerting
You can monitor In-memory storage use as a percentage of the storage cap for your compute size in the [Azure portal](https://portal.azure.com/): 

1. On the Database blade, locate the Resource utilization box and click on Edit.
2. Select the metric `In-Memory OLTP Storage percentage`.
3. To add an alert, click on the Resource Utilization box to open the Metric blade, then click on Add alert.

Or use the following query to show the In-memory storage utilization:

    SELECT xtp_storage_percent FROM sys.dm_db_resource_stats


## Correct out-of-In-Memory OLTP storage situations - Errors 41823 and 41840
Hitting the In-Memory OLTP storage cap in your database results in INSERT, UPDATE, ALTER and CREATE operations failing with error message 41823 (for single databases) or error 41840 (for elastic pools). Both errors cause the active transaction to abort.

Error messages 41823 and 41840 indicate that the memory-optimized tables and table variables in the database or pool have reached the maximum In-Memory OLTP storage size.

To resolve this error, either:

* Delete data from the memory-optimized tables, potentially offloading the data to traditional, disk-based tables; or,
* Upgrade the service tier to one with enough in-memory storage for the data you need to keep in memory-optimized tables.

> [!NOTE] 
> In rare cases, errors 41823 and 41840 can be transient, meaning there is enough available In-Memory OLTP storage, and retrying the operation succeeds. We therefore recommend to both monitor the overall available In-Memory OLTP storage and to retry when first encountering error 41823 or 41840. For more information about retry logic, see [Conflict Detection and Retry Logic with In-Memory OLTP](https://docs.microsoft.com/sql/relational-databases/In-memory-oltp/transactions-with-memory-optimized-tables#conflict-detection-and-retry-logic).

## Next steps
For monitoring guidance, see [Monitoring Azure SQL Database using dynamic management views](sql-database-monitoring-with-dmvs.md).
