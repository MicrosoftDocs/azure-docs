<properties
   pageTitle="SQL Data Warehouse capacity limits | Microsoft Azure"
   description="Maximum values for databases, tables, connections, and queries for SQL Data Warehouse."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="sonyam"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="05/13/2016"
   ms.author="sonyama;barbkess;jrj"/>

# SQL Data Warehouse capacity limits

The below tables contains the maximum values allowed for various components of Azure SQL Data Warehouse.

## Workload management

| Category            | Description                                  | Maximum            |
| :------------------ | :------------------------------------------- | :----------------- |
| Data Warehouse Units (DWU)| Compute, Memory, and IO Resources      | 2000               |
| Database connection | Concurrent open sessions                     | 1024<br/><br/>We support a maximum of 1024 active connections, each of which can submit requests to a SQL Data Warehouse database at the same time. Note, that there are limits on the number of queries that can actually execute concurrently. When the concurrency limit is exceeded, the request goes into an internal queue where it waits to be processed.|
| Database connection | Maximum memory for prepared statements       | 20 MB              |
| Workload management | Maximum concurrent queries                   | 32<br/><br/> By default, SQL Data Warehouse will execute a maximum of 32 concurrent queries and queue remaining queries.<br/><br/>The concurrency level may decrease when users are assigned to a higher resource class. Some queries, like DMV queries, are always allowed to run.  For more information, see [Concurrency and workload management][].|

## Database objects

| Category          | Description                                  | Maximum            |
| :---------------- | :------------------------------------------- | :----------------- |
| Database          | Maximum size                                 | 60 TB Compressed<br/><br/>SQL Data Warehouse allows up to 60 TB of raw space on disk per database.  The space on disk is the compressed size for permanent tables.  This space is independent of tempdb or log space, and therefore this space is dedicated to permanent tables.   Clustered columnstore compression is estimated at 5X which means that the uncompressed size of the database could grow to approximately 300 TB when all tables are clustered columnstore (the default table type).  The 60 TB limit will be increased to 240 TB at the end of public preview, which will allow most databases to grow to over 1 PB of uncompressed data.|
| Table             | Max size                                     | 60 TB compressed on disk   |
| Table             | Tables per database                          | 2 billion          |
| Table             | Columns per table                            | 1024 columns       |
| Table             | Bytes per column                             | 8000 bytes         |
| Table             | Bytes per row, defined size                  | 8060 bytes<br/><br/>The number of bytes per row is calculated in the same manner as it is for SQL Server with page compression on. Like SQL Server, SQL Data Warehouse supports row-overflow storage which enables variable length columns to be pushed off-row. Only a 24-byte root is stored in the main record for variable length columns pushed out of row. For more information, see the [Row-Overflow Data Exceeding 8 KB][] topic in SQL Server Books Online.<br/><br/>For a list of the SQL Data Warehouse data type sizes, see [CREATE TABLE (Azure SQL Data Warehouse)][]. |
| Table             | Partitions per table                    | 15,000<br/><br/>For high performance, we recommend minimizing the number of partitions you need while still supporting your business requirements. As the number of partitions grows, the overhead for Data Definition Language (DDL) and Data Manipulation Language (DML) operations grows and causes slower performance.|
| Table             | Characters per partition boundary value.| 4000 |
| Index             | Non-clustered indexes per table.        | 999<br/><br/>Applies to rowstore tables only.|
| Index             | Clustered indexes per table.            | 1<br><br/>Applies to both rowstore and columnstore tables.|
| Index             | Rows in a columnstore index rowgroup | 1,024<br/><br/>Each columnstore index is implemented as multiple columnstore indexes. Note that if you insert 1,024 rows into a SQL Data Warehouse columnstore index, the rows will not all go to the same rowgroup.|
| Index             | Concurrent builds of clustered columnstore indexes. | 32<br/><br/>Applies when the clustered columnstore indexes are all being built on different tables. Only one clustered columnstore index build is allowed per table. Additional requests will wait in a queue.|
| Index             | Index key size.                          | 900 bytes.<br/><br/>Applies to rowstore indexes only.<br/><br/>Indexes on varchar columns with a maximum size of more than 900 bytes can be created if the existing data in the columns does not exceed 900 bytes when the index is created. However, later INSERT or UPDATE actions on the columns that cause the total size to exceed 900 bytes will fail.|
| Index             | Key columns per index.                   | 16<br/><br/>Applies to rowstore indexes only. Clustered columnstore indexes include all columns.|
| Statistics        | Size of the combined column values.      | 900 bytes.         |
| Statistics        | Columns per statistics object.           | 32                 |
| Statistics        | Statistics created on columns per table. | 30,000            |
| Stored Procedures | Maximum levels of nesting.               | 8                 |
| View              | Columns per view                         | 1,024             |


## Loads
| Category          | Description                                  | Maximum            |
| :---------------- | :------------------------------------------- | :----------------- |
| Polybase Loads    | Bytes per row                                | 32,768<br/><br/>Polybase loads are limited to loading rows both smaller than 32K and cannot load to VARCHR(MAX), NVARCHAR(MAX) or VARBINARY(MAX).  While this limit exists today, it will be removed fairly soon.<br/><br/>


## Queries

| Category          | Description                                  | Maximum            |
| :---------------- | :------------------------------------------- | :----------------- |
| Query             | Queued queries on user tables.               | 1000               |
| Query             | Concurrent queries on system views.          | 100                |
| Query             | Queued queries on system views               | 1000               |
| Query             | Maximum parameters                           | 2098               |
| Batch             | Maximum size                                 | 65,536*4096        |
| SELECT results    | Columns per row                              | 4096<br/><br/>You can never have more than 4096 columns per row in the SELECT result. There is no guarantee that you can always have 4096. If the query plan requires a temporary table, the 1024 columns per table maximum might apply.|
| SELECT            | Nested subqueries                            | 32<br/><br/>You can never have more than 32 nested subqueries in a SELECT statement. There is no guarantee that you can always have 32. For example, a JOIN can introduce a subquery into the query plan. The number of subqueries can also be limited by available memory.|
| SELECT            | Columns per JOIN                             | 1024 columns<br/><br/>You can never have more than 1024 columns in the JOIN. There is no guarantee that you can always have 1024. If the JOIN plan requires a temporary table with more columns than the JOIN result, the 1024 limit applies to the temporary table. |
| SELECT            | Bytes per GROUP BY columns.                  | 8060<br/><br/>The columns in the GROUP BY clause can have a maximum of 8060 bytes.|
| SELECT            | Bytes per ORDER BY columns                   | 8060 bytes.<br/><br/>The columns in the ORDER BY clause can have a maximum of 8060 bytes.|
| Identifiers and constants per statement | Number of referenced identifiers and constants. | 65,535<br/><br/>SQL Data Warehouse limits the number of identifiers and constants that can be contained in a single expression of a query. This limit is 65,535. Exceeding this number results in SQL Server error 8632. For more information, see [Internal error: An expression services limit has been reached][].|


## Metadata

| System view                        | Maximum rows |
| :--------------------------------- | :------------|
| sys.dm_pdw_component_health_alerts | 10,000       |
| sys.dm_pdw_dms_cores               | 100          |
| sys.dm_pdw_dms_workers             | Total number of DMS workers for the most recent 1000 SQL requests. |
| sys.dm_pdw_errors                  | 10,000       |
| sys.dm_pdw_exec_requests           | 10,000       |
| sys.dm_pdw_exec_sessions           | 10,000       |
| sys.dm_pdw_request_steps           | Total number of steps for the most recent 1000 SQL requests that are stored in sys.dm_pdw_exec_requests. |
| sys.dm_pdw_os_event_logs           | 10,000       |
| sys.dm_pdw_sql_requests            | The most recent 1000 SQL requests that are stored in sys.dm_pdw_exec_requests. |


## Details about the DMS buffer size

SQL Data Warehouse uses an internal buffer to move rows among the backend compute nodes. The service that moves rows is called Data Movement Service (DMS) and it uses a storage format that is different from SQL Server.

To improve parallel query performance, DMS pads all variable length data to the maximum SQL database defined size. For example, the value 'hello' for an `nvarchar(2000) NOT NULL` will actually use 4002 bytes in the DMS buffer. It uses 2 bytes for each of the 2000 characters plus plus 2 bytes for the NULL terminator.

### How to determine the row size for the DMS buffer
This example describes the DMS defined sizes of variable-length data and then shows how to calculate the DMS buffer size for a row.
 
In the DMS buffer, variable-length data size is the sum of the following: 

- Defined size for characters.
- NULL types use 8 bytes for the NULL indicator.
- ASCII types use 1 character for the NULL terminator.
- Unicode types use 2 characters for the NULL terminator.
             
| Data Type               | DMS buffer size             |
| :---------------------- | :-------------------------- |                
| char(1000) NULL         | 1009 bytes = 1000 +8 + 1    |
| char(1000) NOT NULL     | 1001 bytes = 1000 + 1       |
| nchar(1000 NULL         | 2010 bytes = 2000 + 8 + 2   |
| varchar(1000) NULL      | 1009 bytes = 1000 + 8 + 1   |
| varchar(1000) NOT NULL  | 1009 bytes = 1000  + 1      |
| nvarchar(1000) NULL     | 2010 bytes = 2000 + 8 + 2   |
| nvarchar(1000) NOT NULL | 2010 bytes = 2000  + 2      |
                
In the DMS buffer, fixed-width columns use the SQL Server native size. If the type is nullable, DMS requires an extra 8 bytes. For the SQL Server size, see the max_length field in sys.types. 

For example:

| Fixed-Width Data Type | DMS buffer size    |
| :-------------------- | :----------------- |
| int NULL              | 12 bytes = 4 + 8   |
| int NOT NULL          | 4 bytes = 4 + 0    | 
                
Putting it altogether, the DMS buffer defined size for the following row is 31,134 bytes, which will fit in the DMS buffer.

| Column | Data Type           | Column Size               |
| :----- | :------------------ | :------------------------ |
| col1   | datetime2 (7) NULL  | 20 bytes = 8 + 8          |
| col2   | float (4) NULL      | 12 bytes = 4 + 8          |
| col3   | nchar (6) NULL      | 22 bytes = 12 + 8 + 2     |
| col4   | char (7000) NULL    | 7009 bytes = 7000 + 8 + 1 |
| col5   | nvarchar (4000)     | 8002 bytes = 8000 + 2.    |
| col6   | varchar (8000) NULL | 8009 bytes = 8000 + 8 + 1 |
| col7   | varbinary (8000)    | 8000 bytes                |
| col8   | binary (60)         | 60 bytes                  |
                
              
### Example of exceeding the DMS buffer size

This example shows how you could successfully insert a row into SQL Data Warehouse, but then incur a DMS overflow error when DMS needs to move the row for a distribution incompatible join. The lesson to be learned is to create smaller rows that will fit into the DMS buffer.

In the following example, we create table T1. The maximum possible size of the row when all the nvarchar variables have 4000 Unicode characters is more than 40,000 bytes, which exceeds the maximum DMS buffer size.

Since the actual defined size of an nvarchar uses 26 bytes, the row definition is less than 8060 bytes and can fit on a SQL Server page. Therefore the CREATE TABLE statement succeeds, even though DMS will fail when it tries to load this row into the DMS buffer.

```sql
CREATE TABLE T1
  (
    c0 int NOT NULL,
    CustomerKey int NOT NULL,
    c1 nvarchar(4000),
    c2 nvarchar(4000),
    c3 nvarchar(4000),
    c4 nvarchar(4000),
    c5 nvarchar(4000)
  )
WITH ( DISTRIBUTION = HASH (c0) )
;
```

This next step shows that we can successfully use INSERT to insert data into the table. This statement loads the data directly into SQL Server without using DMS, and so it does not incur a DMS buffer overflow failure. Integration Services will also load this row successfully.</para>

```sql
--The INSERT operation succeeds because the row is inserted directly into SQL Server without requiring DMS to buffer the row.
INSERT INTO T1
VALUES (
    25,
    429817,
    N'Each row must fit into the DMS buffer size of 32,768 bytes.',
    N'Each row must fit into the DMS buffer size of 32,768 bytes.',
    N'Each row must fit into the DMS buffer size of 32,768 bytes.',
    N'Each row must fit into the DMS buffer size of 32,768 bytes.',
    N'Each row must fit into the DMS buffer size of 32,768 bytes.'
  )
```

To prepare for demonstrating data movement, this example creates a second table with CustomerKey for the distribution column.

```sql
--This second table is distributed on CustomerKey. 
CREATE TABLE T2
  (
    c0 int NOT NULL,
    CustomerKey int NOT NULL,
    c1 nvarchar(4000),
    c2 nvarchar(4000),
    c3 nvarchar(4000),
    c4 nvarchar(4000),
    c5 nvarchar(4000)
  )
WITH ( DISTRIBUTION = HASH (CustomerKey) )
;

INSERT INTO T2
VALUES (
    32,
    429817,
    N'Each row must fit into the DMS buffer size of 32,768 bytes.',
    N'Each row must fit into the DMS buffer size of 32,768 bytes.',
    N'Each row must fit into the DMS buffer size of 32,768 bytes.',
    N'Each row must fit into the DMS buffer size of 32,768 bytes.',
    N'Each row must fit into the DMS buffer size of 32,768 bytes.'
  )
```
Since both tables are not distributed on CustomerKey, a join between T1 and T2 on CustomerKey is distribution incompatible. DMS will need to load at least one row and copy it to a different distribution.

```sql
SELECT * FROM T1 JOIN T2 ON T1.CustomerKey = T2.CustomerKey;
```

As expected, DMS fails to perform the join because the row, when all the nvarchar columns are padded, is larger than the DMS buffer size of 32,768 bytes. The following error message occurs.

```sql
Msg 110802, Level 16, State 1, Line 126

An internal DMS error occurred that caused this operation to fail. Details: Exception: Microsoft.SqlServer.DataWarehouse.DataMovement.Workers.DmsSqlNativeException, Message: SqlNativeBufferReader.ReadBuffer, error in OdbcReadBuffer: SqlState: , NativeError: 0, 'COdbcReadConnection::ReadBuffer: not enough buffer space for one row | Error calling: pReadConn-&gt;ReadBuffer(pBuffer, bufferOffset, bufferLength, pBytesRead, pRowsRead) | state: FFFF, number: 81, active connections: 8', Connection String: Driver={SQL Server Native Client 11.0};APP=DmsNativeReader:P13521-CMP02\sqldwdms (4556) - ODBC;Trusted_Connection=yes;AutoTranslate=no;Server=P13521-SQLCMP02,1500
```

## Next steps
For more reference information, see [SQL Data Warehouse reference overview][].

<!--Image references-->

<!--Article references-->
[SQL Data Warehouse reference overview]: sql-data-warehouse-overview-reference.md
[Concurrency and workload management]: sql-data-warehouse-develop-concurrency.md

<!--MSDN references-->
[Row-Overflow Data Exceeding 8 KB](https://msdn.microsoft.com/library/ms186981.aspx)
[CREATE TABLE (Azure SQL Data Warehouse)](https://msdn.microsoft.com/library/mt203953.aspx)
[Internal error: An expression services limit has been reached](http://support.microsoft.com/kb/913050/)
