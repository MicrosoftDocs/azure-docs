<properties
   pageTitle="SQL Data Warehouse service characteristics | Microsoft Azure"
   description="Maximum values for connections, queries, Transact-SQL DDL and DML, and system views for SQL Data Warehouse."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="barbkess"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="02/11/2016"
   ms.author="barbkess;jrj;sonyama"/>

# SQL Data Warehouse service characteristics

These characteristics include maximum values that Azure SQL Data Warehouse has established to support the most demanding analytics workloads while also ensuring each individual query has the resources it needs for optimal performance.

## Connections

| Category          | Description                                  | Maximum            |
| :---------------- | :------------------------------------------- | :----------------- |
| Session           | Concurrent open sessions                     | 1024<br/><br/>We support 1024 concurrent connections which can all submit concurrent requests to the data warehouse. Note, there are limits on the number of queries that can execute concurrently. When a limit is exceeded the request goes into an internal queue where it waits to be processed.|
| Session           | Maximum memory for prepared statements       | 20 MB              |
| Logins            | Logins per SQL server.                       | 500,000            |


## Query Processing

| Category          | Description                                  | Maximum            |
| :---------------- | :------------------------------------------- | :----------------- |
| Query             | Concurrent queries on user tables.           | 32<br/><br/>Additional queries will go to an internal queue where they will wait to be processed. Regardless of the number of queries executing at the same time, each query is optimized to make full use of the massively parallel processing architecture.|
| Query             | Queued queries on user tables.               | 1000               |
| Query             | Concurrent queries on system views.          | 100                |
| Query             | Queued queries on system views               | 1000               |
| Query             | Maximum parameters                           | 2098               |
| Batch             | Maximum size                                 | 65,536*4096        |


## Data Definition Language (DDL)

| Category          | Description                                  | Maximum            |
| :---------------- | :------------------------------------------- | :----------------- |
| Table             | Tables per database                          | 2 billion          |
| Table             | Columns per table                            | 1024 columns       |
| Table             | Bytes per column                             | 8000 bytes         |
| Table             | Bytes per row, defined size                  | 8060 bytes<br/><br/>The number of bytes per row is calculated in the same manner as it is for SQL Server with page commpression on. It cannot be more than 8060 bytes. To estimate the row size, see the row size calculations in [Estimate the Size of a Clustered Index](https://msdn.microsoft.com/library/ms178085.aspx) on MSDN.<br/><br/>For a list of the SQL Data Warehouse data type sizes, see [CREATE TABLE (Azure SQL Data Warehouse)](https://msdn.microsoft.com/library/mt203953.aspx). |
| Table             | Partitions per table                    | 15,000<br/><br/>For high performance, we recommend minimizing the number of partitions you need while still supporting your business requirements. As the number of partitions grows, the overhead for DDL and DML operations grows and causes slower performance.|
| Table             | Characters per partition boundary value.| 4000 |
| Index             | Non-clustered indexes per table.        | 999<br/><br/>Applies to rowstore tables only.|
| Index             | Clustered indexes per table.            | 1<br><br/>Applies to both rowstore and columnstore tables.|
| Index             | Rows in a columnstore index rowgroup | 1,024<br/><br/>Each columnstore index is implementd as multiple columnstore indexes. Note that if you insert 1,024 rows into a SQL Data Warehouse columnstore index, the rows will not all go to the same rowgroup.|
| Index             | Concurrent builds of clustered columnstore indexes. | 32<br/><br/>Applies when the clustered columnstore indexes are all being built on different tables. Only 1 clustered columnstore index build is allowed per table. Additional requests will wait in a queue.|
| Index             | Index key size.                          | 900 bytes.<br/><br/>Applies to rowstore indexes only.<br/><br/>Indexes on varchar columns with a maximum size of more than 900 bytes can be created if the existing data in the columns does not exceed 900 bytes when the index is created. However, later INSERT or UPDATE actions on the columns that cause the total size to exceed 900 bytes will fail.|
| Index             | Key columns per index.                   | 16<br/><br/>Applies to rowstore indexes only. Clustered columnstore indexes include all columns.|
| Statistics        | Size of the combined column values.      | 900 bytes.         |
| Statistics        | Columns per statistics object.           | 32                 |
| Statistics        | Statistics created on columns per table. | 30,000            |
| Stored Procedures | Maximum levels of nesting.               | 8                 |
| View              | Columns per view                         | 1,024             |


## Data Manipulation Language (DML)

| Category          | Description                                  | Maximum            |
| :---------------- | :------------------------------------------- | :----------------- |
| SELECT results    | Columns per row                          | 4096<br/><br/>You can never have more than 4096 columns per row in the SELECT result. There is no guarantee that you can always have 4096. If the query plan requires a temporary table, the 1024 columns per table maximum might apply.|
| SELECT results    | Bytes per row                            | >8060<br/><br/>The number of bytes per row in the SELECT result can be more than the 8060 byte maximum that is allowed for table rows. If the query plan for the SELECT statement requires a temporary table, the 8060 byte table maximum might apply.|
| SELECT results    | Bytes per column                         | >8000<br/><br/>The number of bytes per column in the SELECT result can be more than the 8000 byte maximum that is allowed for table columns. If the query plan for the SELECT statement requires a temporary table, the 8000 byte table maximum might apply.|
| SELECT            | Nested subqueries                        | 32<br/><br/>You can never have more than 32 nested subqueries in a SELECT statement. There is no guarantee that you can always have 32. For example, a JOIN can introduce a subquery into the query plan. The number of subqueries can also be limited by available memory.|
| SELECT            | Columns per JOIN                         | 1024 columns<br/><br/>You can never have more than 1024 columns in the JOIN. There is no guarantee that you can always have 1024. If the JOIN plan requires a temporary table with more columns than the JOIN result, the 1024 limit applies to the temporary table. |
| SELECT            | Bytes per GROUP BY columns.              | 8060<br/><br/>The columns in the GROUP BY clause can have a maximum of 8060 bytes.|
| SELECT            | Bytes per ORDER BY columns               | 8060 bytes.<br/><br/>The columns in the ORDER BY clause can have a maximum of 8060 bytes.|
| INSERT            | Bytes per column, fixed and variable width. | 8000 bytes. Attempts to insert more bytes than defined for the column will result in an error.|
| INSERT            | Bytes per row, variable width columns.   | >8060 bytes. Data in excess of 8060 bytes is placed in overflow storage area.|
| UPDATE            | Bytes per column, fixed and variable width. | 8000 bytes. Attempts to update a column to a value requiring more bytes than defined for the column will result in an error.|
| Identifiers and constants per statement | Number of referenced identifiers and constants. | 65,535<br/><br/>SQL Data Warehouse limits the number of identifiers and constants that can be contained in a single expression of a query. This limit is 65,535. Exceeding this number results in SQL Server error 8632. For more information, see [Internal error: An expression services limit has been reached](http://support.microsoft.com/kb/913050/).|

## System views

| System view                        | Maximum rows |
| :--------------------------------- | :------------|
| sys.dm_pdw_component_health_alerts | 10,000       |
| sys.dm_pdw_dms_cores               | 100          |
| sys.dm_pdw_dms_workers             | Total number of DMS workers for the most recent 1000 SQL requests. |
| sys.dm_pdw_dms_worker_pairs        | 10,000       |
| sys.dm_pdw_errors                  | 10,000       |
| sys.dm_pdw_exec_requests           | 10,000       |
| sys.dm_pdw_exec_sessions           | 10,000       |
| sys.dm_pdw_request_steps           | Total number of steps for the most recent 1000 SQL requests that are stored in sys.dm_pdw_exec_requests. |
| sys.dm_pdw_os_event_logs           | 10,000       |
| sys.dm_pdw_sql_requests            | The most recent 1000 SQL requests that are stored in sys.dm_pdw_exec_requests. |

## Next steps
For more reference information, see [SQL Data Warehouse reference overview][].

<!--Image references-->

<!--Article references-->
[SQL Data Warehouse reference overview]: sql-data-warehouse-overview-reference.md

<!--MSDN references-->

