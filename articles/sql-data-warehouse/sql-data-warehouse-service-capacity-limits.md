---
title: SQL Data Warehouse capacity limits | Microsoft Docs
description: Maximum values for connections, databases, tables and queries for SQL Data Warehouse.
services: sql-data-warehouse
documentationcenter: NA
author: kevinvngo
manager: jhubbard
editor: ''

ms.assetid: e1eac122-baee-4200-a2ed-f38bfa0f67ce
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.custom: reference
ms.date: 10/31/2016
ms.author: kevin;barbkess

---
# SQL Data Warehouse capacity limits
The following tables contain the maximum values allowed for various components of Azure SQL Data Warehouse.

## Workload management
| Category | Description | Maximum |
|:--- |:--- |:--- |
| [Data Warehouse Units (DWU)][Data Warehouse Units (DWU)] |Max DWU for a single SQL Data Warehouse |6000 |
| [Data Warehouse Units (DWU)][Data Warehouse Units (DWU)] |Max DWU for a single SQL server |6000 by default<br/><br/> By default, each SQL server (e.g. myserver.database.windows.net) has a DTU Quota of 45,000 which allows up to 6000 DWU. This quota is simply a safety limit. You can increase your quota by [creating a support ticket][creating a support ticket] and selecting *Quota* as the request type.  To calculate your DTU needs, multiply the 7.5 by the total DWU needed. You can view your current DTU consumption from the SQL server blade in the portal. Both paused and un-paused databases count toward the DTU quota. |
| Database connection |Concurrent open sessions |1024<br/><br/>We support a maximum of 1024 active connections, each of which can submit requests to a SQL Data Warehouse database at the same time. Note, that there are limits on the number of queries that can actually execute concurrently. When the concurrency limit is exceeded, the request goes into an internal queue where it waits to be processed. |
| Database connection |Maximum memory for prepared statements |20 MB |
| [Workload management][Workload management] |Maximum concurrent queries |32<br/><br/> By default, SQL Data Warehouse can execute a maximum of 32 concurrent queries and queues remaining queries.<br/><br/>The concurrency level may decrease when users are assigned to a higher resource class or when SQL Data Warehouse is configured with low DWU. Some queries, like DMV queries, are always allowed to run. |
| [Tempdb][Tempdb] |Max size of Tempdb |399 GB per DW100. Therefore at DWU1000 Tempdb is sized to 3.99 TB |

## Database objects
| Category | Description | Maximum |
|:--- |:--- |:--- |
| Database |Max size |240 TB compressed on disk<br/><br/>This space is independent of tempdb or log space, and therefore this space is dedicated to permanent tables.  Clustered columnstore compression is estimated at 5X.  This compression allows the database to grow to approximately 1 PB when all tables are clustered columnstore (the default table type). |
| Table |Max size |60 TB compressed on disk |
| Table |Tables per database |2 billion |
| Table |Columns per table |1024 columns |
| Table |Bytes per column |Dependent on column [data type][data type].  Limit is 8000 for char data types, 4000 for nvarchar, or 2 GB for MAX data types. |
| Table |Bytes per row, defined size |8060 bytes<br/><br/>The number of bytes per row is calculated in the same manner as it is for SQL Server with page compression. Like SQL Server, SQL Data Warehouse supports row-overflow storage which enables **variable length columns** to be pushed off-row. When variable length rows are pushed off-row, only 24-byte root is stored in the main record. For more information, see the [Row-Overflow Data Exceeding 8 KB][Row-Overflow Data Exceeding 8 KB] MSDN article. |
| Table |Partitions per table |15,000<br/><br/>For high performance, we recommend minimizing the number of partitions you need while still supporting your business requirements. As the number of partitions grows, the overhead for Data Definition Language (DDL) and Data Manipulation Language (DML) operations grows and causes slower performance. |
| Table |Characters per partition boundary value. |4000 |
| Index |Non-clustered indexes per table. |999<br/><br/>Applies to rowstore tables only. |
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
| Polybase Loads |MB per row |1<br/><br/>Polybase loads are limited to loading rows both smaller than 1MB and cannot load to VARCHR(MAX), NVARCHAR(MAX) or VARBINARY(MAX).<br/><br/> |

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
| SELECT |Bytes per ORDER BY columns |8060 bytes.<br/><br/>The columns in the ORDER BY clause can have a maximum of 8060 bytes. |
| Identifiers and constants per statement |Number of referenced identifiers and constants. |65,535<br/><br/>SQL Data Warehouse limits the number of identifiers and constants that can be contained in a single expression of a query. This limit is 65,535. Exceeding this number results in SQL Server error 8632. For more information, see [Internal error: An expression services limit has been reached][Internal error: An expression services limit has been reached]. |

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
For more reference information, see [SQL Data Warehouse reference overview][SQL Data Warehouse reference overview].

<!--Image references-->

<!--Article references-->
[Data Warehouse Units (DWU)]: ./sql-data-warehouse-overview-what-is.md
[SQL Data Warehouse reference overview]: ./sql-data-warehouse-overview-reference.md
[Workload management]: ./sql-data-warehouse-develop-concurrency.md
[Tempdb]: ./sql-data-warehouse-tables-temporary.md
[data type]: ./sql-data-warehouse-tables-data-types.md
[creating a support ticket]: /sql-data-warehouse-get-started-create-support-ticket.md

<!--MSDN references-->
[Row-Overflow Data Exceeding 8 KB]: https://msdn.microsoft.com/library/ms186981.aspx
[Internal error: An expression services limit has been reached]: https://support.microsoft.com/kb/913050
