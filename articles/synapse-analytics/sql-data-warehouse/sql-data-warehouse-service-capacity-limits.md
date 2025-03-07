---
title: Capacity limits for dedicated SQL pool
description: Maximum values allowed for various components of dedicated SQL pool in Azure Synapse Analytics.
author: heydh
ms.author: dhsundar
ms.reviewer: wiassaf, stwynant
ms.date: 03/01/2024
ms.service: azure-synapse-analytics
ms.subservice: sql-dw
ms.topic: conceptual
ms.custom:
  - azure-synapse
---

# Capacity limits for dedicated SQL pool in Azure Synapse Analytics

Maximum values allowed for various components of dedicated SQL pool in Azure Synapse Analytics.

## Workload management

| Category | Description | Maximum |
|:--- |:--- |:--- |
| [Data Warehouse Units (DWU)](what-is-a-data-warehouse-unit-dwu-cdwu.md) |Max DWU for a single dedicated SQL pool  | Gen1: DW6000<br></br>Gen2: DW30000c |
| [Data Warehouse Units (DWU)](what-is-a-data-warehouse-unit-dwu-cdwu.md) |Default [Database Transaction Unit (DTU)](/azure/azure-sql/database/service-tiers-dtu?bc=%2fazure%2fsynapse-analytics%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fsynapse-analytics%2ftoc.json) per server |54,000<br></br>By default, each SQL server (for example, `myserver.database.windows.net`) has a DTU Quota of 54,000, which allows up to DW6000c. This quota is simply a safety limit. You can increase your quota by [creating a support ticket](sql-data-warehouse-get-started-create-support-ticket.md) and selecting *Quota* as the request type.  To calculate your DTU needs, multiply the 7.5 by the total DWU needed, or multiply 9 by the total cDWU needed. For example:<br></br>DW6000 x 7.5 = 45,000 DTUs<br></br>DW7500c x 9 = 67,500 DTUs.<br></br>You can view your current DTU consumption from the SQL server option in the portal. Both paused and unpaused databases count toward the DTU quota. |
| Database connection |Maximum Concurrent open sessions |1024<br/><br/>The number of concurrent open sessions vary based on the selected DWU. DWU1000c and higher support a maximum of 1,024 open sessions. DWU500c and lower support a maximum concurrent open session limit of 512. Note, there are limits on the number of queries that can execute concurrently. When the concurrency limit is exceeded, the request goes into an internal queue where it waits to be processed.<br><br/>Idle session connections are not automatically closed. |
| Database connection |Maximum memory for prepared statements |20 MB |
| [Workload management](resource-classes-for-workload-management.md) |Maximum concurrent queries |128<br/><br/>A maximum of 128 concurrent queries can execute and remaining queries are queued.<br/><br/>The number of concurrent queries can decrease when users are assigned to higher resource classes or when the [data warehouse unit](memory-concurrency-limits.md) setting is lowered. Some queries, like DMV queries, are always allowed to run and do not affect the concurrent query limit. For more information on concurrent query execution, see the [concurrency maximums](memory-concurrency-limits.md) article. |
| [tempdb](sql-data-warehouse-tables-temporary.md) |Maximum GB |399 GB per DW100c. For example, at DWU1000c, `tempdb` is sized to 3.99 TB. |

## Database objects

| Category | Description | Maximum |
|:--- |:--- |:--- |
| Database |Max size | Gen1: 240 TB compressed on disk. This space is independent of `tempdb` or log space, and therefore this space is dedicated to permanent tables.  Clustered columnstore compression is estimated at 5X.  This compression allows the database to grow to approximately 1 PB when all tables are clustered columnstore (the default table type). <br/><br/> Gen2: Unlimited storage for columnstore tables.  Rowstore portion of the database is still limited to 240 TB compressed on disk. |
| Table |Max size |Unlimited size for columnstore tables. <br>60 TB for rowstore tables compressed on disk. |
| Table |Tables per database | 100,000 |
| Table |Columns per table |1,024 columns |
| Table |Bytes per column |Dependent on column [data type](sql-data-warehouse-tables-data-types.md). Limit is 8000 for char data types, 4000 for nvarchar, or 2 GB for MAX data types. |
| Table |Bytes per row, defined size |8,060 bytes<br/><br/>The number of bytes per row is calculated in the same manner as it is for SQL Server with page compression. Like SQL Server, row-overflow storage is supported, which enables **variable length columns** to be pushed off-row. When variable length rows are pushed off-row, only 24-byte root is stored in the main record. For more information, see [Row-Overflow Data Exceeding 8 KB](/previous-versions/sql/sql-server-2008-r2/ms186981(v=sql.105)). |
| Table |Partitions per table |15,000<br/><br/>For high performance, we recommend minimizing the number of partitions you need while still supporting your business requirements. As the number of partitions grows, the overhead for Data Definition Language (DDL) and Data Manipulation Language (DML) operations grows and causes slower performance. |
| Table |Characters per partition boundary value. |4000 |
| Index |Nonclustered indexes per table. |50<br/><br/>Applies to rowstore tables only. |
| Index |Clustered indexes per table. |1<br><br/>Applies to both rowstore and columnstore tables. |
| Index |Index key size. |900 bytes.<br/><br/>Applies to rowstore indexes only.<br/><br/>Indexes on varchar columns with a maximum size of more than 900 bytes can be created if the existing data in the columns does not exceed 900 bytes when the index is created. However, later INSERT or UPDATE actions on the columns that cause the total size to exceed 900 bytes will fail. |
| Index |Key columns per index. |16<br/><br/>Applies to rowstore indexes only. Clustered columnstore indexes include all columns. |
| Statistics |Size of the combined column values. |900 bytes. |
| Statistics |Columns per statistics object. |32 |
| Statistics |Statistics created on columns per table. |30,000 |
| Stored Procedures |Maximum levels of nesting. |8 |
| View |Columns per view |1,024 |
| Workload Classifier |User-defined classifier  |100 |

## Loads

| Category | Description | Maximum |
|:--- |:--- |:--- |
| Polybase Loads |MB per row |1<br/><br/>Polybase loads rows that are smaller than 1 MB. Loading LOB data types into tables with a Clustered Columnstore Index (CCI) is not supported.<br/> |
|Polybase Loads|Total number of files|1,000,000<br/><br/>Polybase loads cannot exceed more than 1M files. You might experience the following error: **Operation failed as split count exceeding upper bound of 1000000**.|

## Queries

| Category | Description | Maximum |
|:--- |:--- |:--- |
| Query |Queued queries on user tables. |1000 |
| Query |Concurrent queries on system views. |100 |
| Query |Queued queries on system views |1000 |
| Query |Maximum parameters |2098 |
| Batch |Maximum size |65,536*4096 |
| SELECT results |Columns per row |4096<br/><br/>You can never have more than 4,096 columns per row in the SELECT result. There is no guarantee that you can always have 4096. If the query plan requires a temporary table, the 1,024 columns per table maximum might apply. |
| SELECT |Nested subqueries |32<br/><br/>You can never have more than 32 nested subqueries in a SELECT statement. There is no guarantee that you can always have 32. For example, a JOIN can introduce a subquery into the query plan. The number of subqueries can also be limited by available memory. |
| SELECT |Columns per JOIN |1,024 columns<br/><br/>You can never have more than 1,024 columns in the JOIN. There is no guarantee that you can always have 1024. If the JOIN plan requires a temporary table with more columns than the JOIN result, the 1024 limit applies to the temporary table. |
| SELECT |Bytes per GROUP BY columns. |8060<br/><br/>The columns in the GROUP BY clause can have a maximum of 8,060 bytes. |
| SELECT |Bytes per ORDER BY columns |8,060 bytes<br/><br/>The columns in the ORDER BY clause can have a maximum of 8,060 bytes |
| Constants and identifiers per expression |Number of constants and referenced identifiers |65,535<br/><br/> The number of constants and identifiers that can be contained in a single expression of a query is limited. Exceeding this number results in SQL Server error 8632. For more information, see [Internal error: An expression services limit has been reached](https://support.microsoft.com/help/913050/error-message-when-you-run-a-query-in-sql-server-2005-internal-error-a). |
| String literals | Number of string literals in a statement | 32,500 <br/><br/>The number of string constants in a single expression of a query is limited. Exceeding this number results in SQL Server error 8632.|

## Metadata

Cumulative data in DMVs reset when a dedicated SQL pool is paused or when it is scaled.

| System view | Maximum rows |
|:--- |:--- |
| [sys.dm_pdw_dms_cores](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-dms-cores-transact-sql?view=azure-sqldw-latest&preserve-view=true) |100 |
| [sys.dm_pdw_dms_workers](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-dms-workers-transact-sql?view=azure-sqldw-latest&preserve-view=true) |Total number of DMS workers for the most recent 1000 SQL requests. |
| [sys.dm_pdw_errors](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-errors-transact-sql?view=azure-sqldw-latest&preserve-view=true) |10,000 |
| [sys.dm_pdw_exec_requests](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-exec-requests-transact-sql?view=azure-sqldw-latest&preserve-view=true) |10,000 |
| [sys.dm_pdw_exec_sessions](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-exec-sessions-transact-sql?view=azure-sqldw-latest&preserve-view=true) |10,000 |
| [sys.dm_pdw_request_steps](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-request-steps-transact-sql?view=azure-sqldw-latest&preserve-view=true) |Total number of steps for the most recent 1000 SQL requests that are stored in `sys.dm_pdw_exec_requests`. |
| [sys.dm_pdw_sql_requests](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-sql-requests-transact-sql?view=azure-sqldw-latest&preserve-view=true) |The most recent 1000 SQL requests that are stored in `sys.dm_pdw_exec_requests`. |

## Related content

- [Cheat sheet for dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics](cheat-sheet.md)
- [Best practices for dedicated SQL pools in Azure Synapse Analytics](../sql/best-practices-dedicated-sql-pool.md)
- [Synapse implementation success methodology: Evaluate dedicated SQL pool design](../guidance/implementation-success-evaluate-dedicated-sql-pool-design.md)
