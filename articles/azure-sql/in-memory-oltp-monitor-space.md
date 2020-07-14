---
title: Monitor XTP In-memory storage 
description: Estimate and monitor XTP In-memory storage use, capacity; resolve capacity error 41823
services: sql-database
ms.service: sql-database
ms.subservice: performance
ms.custom: sqldbrb=2
ms.devlang: 
ms.topic: conceptual
author: juliemsft
ms.author: jrasnick
ms.reviewer: genemi
ms.date: 01/25/2019
---
# Monitor In-Memory OLTP storage in Azure SQL Database and Azure SQL Managed Instance
[!INCLUDE[appliesto-sqldb-sqlmi](includes/appliesto-sqldb-sqlmi.md)]

When using [In-Memory OLTP](in-memory-oltp-overview.md), data in memory-optimized tables and table variables resides in In-Memory OLTP storage.

## Determine whether data fits within the In-Memory OLTP storage cap

Determine the storage caps of the different service tiers. Each Premium and Business Critical service tier has a maximum In-Memory OLTP storage size.

- [DTU-based resource limits - single database](database/resource-limits-dtu-single-databases.md)
- [DTU-based resource limits - elastic pools](database/resource-limits-dtu-elastic-pools.md)
- [vCore-based resource limits - single databases](database/resource-limits-vcore-single-databases.md)
- [vCore-based resource limits - elastic pools](database/resource-limits-vcore-elastic-pools.md)
- [vCore-based resource limits - managed instance](managed-instance/resource-limits.md)

Estimating memory requirements for a memory-optimized table works the same way for SQL Server as it does in Azure SQL Database and Azure SQL Managed Instance. Take a few minutes to review [Estimate memory requirements](/sql/relational-databases/in-memory-oltp/estimate-memory-requirements-for-memory-optimized-tables).

Table and table variable rows, as well as indexes, count toward the max user data size. In addition, ALTER TABLE needs enough room to create a new version of the entire table and its indexes.

Once this limit is exceeded, insert and update operations may start failing with error 41823 for single databases in Azure SQL Database and databases in Azure SQL Managed Instance, and error 41840 for elastic pools in Azure SQL Database. At that point you need to either delete data to reclaim memory, or upgrade the service tier or compute size of your database.

## Monitoring and alerting

You can monitor In-memory storage use as a percentage of the storage cap for your compute size in the [Azure portal](https://portal.azure.com/):

1. On the Database blade, locate the Resource utilization box and click on Edit.
2. Select the metric `In-Memory OLTP Storage percentage`.
3. To add an alert, click on the Resource Utilization box to open the Metric blade, then click on Add alert.

Or use the following query to show the In-memory storage utilization:

```sql
    SELECT xtp_storage_percent FROM sys.dm_db_resource_stats
```

## Correct out-of-In-Memory OLTP storage situations - Errors 41823 and 41840

Hitting the In-Memory OLTP storage cap in your database results in INSERT, UPDATE, ALTER and CREATE operations failing with error message 41823 (for single databases) or error 41840 (for elastic pools). Both errors cause the active transaction to abort.

Error messages 41823 and 41840 indicate that the memory-optimized tables and table variables in the database or pool have reached the maximum In-Memory OLTP storage size.

To resolve this error, either:

- Delete data from the memory-optimized tables, potentially offloading the data to traditional, disk-based tables; or,
- Upgrade the service tier to one with enough in-memory storage for the data you need to keep in memory-optimized tables.

> [!NOTE]
> In rare cases, errors 41823 and 41840 can be transient, meaning there is enough available In-Memory OLTP storage, and retrying the operation succeeds. We therefore recommend to both monitor the overall available In-Memory OLTP storage and to retry when first encountering error 41823 or 41840. For more information about retry logic, see [Conflict Detection and Retry Logic with In-Memory OLTP](https://docs.microsoft.com/sql/relational-databases/In-memory-oltp/transactions-with-memory-optimized-tables#conflict-detection-and-retry-logic).

## Next steps

For monitoring guidance, see [Monitoring using dynamic management views](database/monitoring-with-dmvs.md).
