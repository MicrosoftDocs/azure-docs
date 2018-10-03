---
title: Capacity limits - Azure SQL Data Warehouse | Microsoft Docs
description: Maximum values allowed for various components of Azure SQL Data Warehouse.
services: sql-data-warehouse
author: sachinpMSFT
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.component: implement
ms.date: 07/26/2018
ms.author: anvang
ms.reviewer: igorstan
---

# SQL Data Warehouse capacity limits
Maximum values allowed for various components of Azure SQL Data Warehouse.

## Workload management
| Category | Description | Maximum |
|:--- |:--- |:--- |
| [Data Warehouse Units (DWU)](what-is-a-data-warehouse-unit-dwu-cdwu.md) |Max DWU for a single SQL Data Warehouse | Gen1: DW6000<br></br>Gen2: DW30000c |
| [Data Warehouse Units (DWU)](what-is-a-data-warehouse-unit-dwu-cdwu.md) |Default DTU per server |54,000<br></br>By default, each SQL server (for example, myserver.database.windows.net) has a DTU Quota of 54,000, which allows up to DW6000c. This quota is simply a safety limit. You can increase your quota by [creating a support ticket](sql-data-warehouse-get-started-create-support-ticket.md) and selecting *Quota* as the request type.  To calculate your DTU needs, multiply the 7.5 by the total DWU needed, or multiply 9.0 by the total cDWU needed. For example:<br></br>DW6000 x 7.5 = 45,000 DTUs<br></br>DW6000c x 9.0 = 54,000 DTUs.<br></br>You can view your current DTU consumption from the SQL server option in the portal. Both paused and unpaused databases count toward the DTU quota. |
| Database connection |Concurrent open sessions |1024<br/><br/>Each of the 1024 active sessions can submit requests to a SQL Data Warehouse database at the same time. Note, there are limits on the number of queries that can execute concurrently. When the concurrency limit is exceeded, the request goes into an internal queue where it waits to be processed. |
| Database connection |Maximum memory for prepared statements |20 MB |
| [Workload management](resource-classes-for-workload-management.md) |Maximum concurrent queries |128<br/><br/> SQL Data Warehouse can execute a maximum of 128 concurrent queries and queues remaining queries.<br/><br/>The number of concurrent queries can decrease when users are assigned to higher resource classes or when SQL Data Warehouse has a lower [data warehouse unit](memory-and-concurrency-limits.md) setting. Some queries, like DMV queries, are always allowed to run and do not impact the concurrent query limit. For more details on concurrent query execution, see the [concurrency maximums](memory-and-concurrency-limits.md#concurrency-maximums) article. |
| [tempdb](sql-data-warehouse-tables-temporary.md) |Maximum GB |399 GB per DW100. Therefore at DWU1000, tempdb is sized to 3.99 TB. |

## Database objects
| Category | Description | Maximum |
|:--- |:--- |:--- |
| Database |Max size | Gen1: 240 TB compressed on disk. This space is independent of tempdb or log space, and therefore this space is dedicated to permanent tables.  Clustered columnstore compression is estimated at 5X.  This compression allows the database to grow to approximately 1 PB when all tables are clustered columnstore (the default table type). <br/><br/> Gen2: 240TB for rowstore and unlimited storage for columnstore tables |
| Table |Max size |60 TB compressed on disk |
| Table |Tables per database |10,000 |
| Table |Columns per table |1024 columns |
| Table |Bytes per column |Dependent on column [data type](sql-data-warehouse-tables-data-types.md). Limit is 8000 for char data types, 4000 for nvarchar, or 2 GB for MAX data types. |
| Table |Bytes per row, defined size |8060 bytes<br/><br/>The number of bytes per row is calculated in the same manner as it is for SQL Server with page compression. Like SQL Server, SQL Data Warehouse supports row-overflow storage, which enables **variable length columns** to be pushed off-row. When variable length rows are pushed off-row, only 24-byte root is stored in the main record. For more information, see [Row-Overflow Data Exceeding 8-KB](https://msdn.microsoft.com/library/ms186981.aspx). |
| Table |Partitions per table |15,000<br/><br/>For high performance, we recommend minimizing the number of partitions you need while still supporting your business requirements. As the number of partitions grows, the overhead for Data Definition Language (DDL) and Data Manipulation Language (DML) operations grows and causes slower performance. |
| Table |Characters per partition boundary value. |4000 |
| Index |Non-clustered indexes per table. |50<br/><br/>Applies to rowstore tables only. |
| Index |Clustered indexes per table. |1<br><br/>Applies to both rowstore and columnstore tables. |
| Index |Index key size. |900 bytes.<br/><br/>Applies to rowstore indexes only.<br/><br/>Indexes on varchar columns with a maximum size of more than 900 bytes can be created if the existing data in the columns does not exceed 900 bytes when the index is created. However, later INSERT or UPDATE actions on the columns that cause the total size to exceed 900 bytes will fail. |
| Index |Key columns per index. |16<br/><br/>Applies to rowstore indexes only. Clustered columnstore indexes include all columns. |
| Statistics |Size of the combined column values. |900 bytes. |
| Statistics |Columns per statistics object. |32 |
| Statistics |Statistics created on columns per table. |30,000 |
| Stored Procedures |Maximum levels of nesting. |8 |
| View |Columns per view |1,024 |

## Loads
| Category | Description | Maximum |
|:--- |:--- |:--- |
| Polybase Loads |MB per row |1<br/><br/>Polybase loads only to rows that are smaller than 1 MB, and cannot load to VARCHAR(MAX), NVARCHAR(MAX) or VARBINARY(MAX).<br/><br/> |

## Queries
| Category | Description | Maximum |
|:--- |:--- |:--- |
| Query |Queued queries on user tables. |1000 |
| Query |Concurrent queries on system views. |100 |
| Query |Queued queries on system views |1000 |
| Query |Maximum parameters |2098 |
| Batch |Maximum size |65,536*4096 |
| SELECT results |Columns per row |4096<br/><br/>You can never have more than 4096 columns per row in the SELECT result. There is no guarantee that you can always have 4096. If the query plan requires a temporary table, the 1024 columns per table maximum might apply. |
| SELECT |Nested subqueries |32<br/><br/>You can never have more than 32 nested subqueries in a SELECT statement. There is no guarantee that you can always have 32. For example, a JOIN can introduce a subquery into the query plan. The number of subqueries can also be limited by available memory. |
| SELECT |Columns per JOIN |1024 columns<br/><br/>You can never have more than 1024 columns in the JOIN. There is no guarantee that you can always have 1024. If the JOIN plan requires a temporary table with more columns than the JOIN result, the 1024 limit applies to the temporary table. |
| SELECT |Bytes per GROUP BY columns. |8060<br/><br/>The columns in the GROUP BY clause can have a maximum of 8060 bytes. |
| SELECT |Bytes per ORDER BY columns |8060 bytes<br/><br/>The columns in the ORDER BY clause can have a maximum of 8060 bytes |
| Identifiers  per statement |Number of referenced identifiers |65,535<br/><br/>SQL Data Warehouse limits the number of identifiers that can be contained in a single expression of a query. Exceeding this number results in SQL Server error 8632. For more information, see [Internal error: An expression services limit has been reached][Internal error: An expression services limit has been reached]. |
| String literals | Number of string literals in a statement | 20,000 <br/><br/>SQL Data Warehouse limits the number of string constants in a single expression of a query. Exceeding this number results in SQL Server error 8632.|

## Metadata
| System view | Maximum rows |
|:--- |:--- |
| sys.dm_pdw_component_health_alerts |10,000 |
| sys.dm_pdw_dms_cores |100 |
| sys.dm_pdw_dms_workers |Total number of DMS workers for the most recent 1000 SQL requests. |
| sys.dm_pdw_errors |10,000 |
| sys.dm_pdw_exec_requests |10,000 |
| sys.dm_pdw_exec_sessions |10,000 |
| sys.dm_pdw_request_steps |Total number of steps for the most recent 1000 SQL requests that are stored in sys.dm_pdw_exec_requests. |
| sys.dm_pdw_os_event_logs |10,000 |
| sys.dm_pdw_sql_requests |The most recent 1000 SQL requests that are stored in sys.dm_pdw_exec_requests. |

## Next steps
For recommendations on using SQL Data Warehouse, see the [Cheat Sheet](cheat-sheet.md).
