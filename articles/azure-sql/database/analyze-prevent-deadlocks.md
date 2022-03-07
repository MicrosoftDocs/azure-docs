---
title: Analyze and prevent deadlocks
titleSuffix: Azure SQL Database
description: Learn how to analyze deadlocks and prevent them from reoccurring in Azure SQL Database
author: LitKnd
ms.author: kendralittle
services: sql-database
ms.subservice: performance
ms.topic: conceptual
ms.date: 3/7/2022
---

# Analyze and prevent deadlocks in Azure SQL Database

This article teaches you how to identify deadlocks in Azure SQL Database, use deadlock graphs and Query Store to identify the queries in the deadlock, and plan and test changes to prevent deadlocks from reoccurring.

## How deadlocks occur in Azure SQL Database

Databases in Azure SQL Database use the read committed snapshot isolation level (RCSI) by default. [Blocking](understand-resolve-blocking.md) between sessions reading data and sessions writing data is minimized in this isolation level, which reduces blocking and deadlocks. However, blocking and deadlocks may still occur because:

- Queries that modify data may block one another
- Queries may run under different isolation levels due to hints in Transact-SQL
- The database isolation level may itself be changed.

### An example deadlock

A deadlock occurs when two or more tasks permanently block each other by each task having a lock on a resource that the other tasks are trying to lock. For example:

- **Session A** begins an explicit transaction and runs an update statement which acquires an exclusive lock on one row on table `SalesLT.Product`.
- **Session B** runs an update statement modifies the `SalesLt.ProductDescription` table with a query that joins to the `SalesLT.Product` table in order to find the correct rows to update.
    - **Session B** takes out an exclusive lock on 72 rows on the `SalesLt.ProductDescription` table.
    - **Session B** needs a shared lock on rows on the table `SalesLT.Product`, including the row which is locked by **Session A**. **Session B** is blocked on `SalesLT.Product`.
- **Session A** continues its transaction, and now runs an update against the `SalesLt.ProductDescription` table. **Session A** is blocked by Session B on `SalesLt.ProductDescription`.

<!-- TODO: Get image for this -->

Both transactions in a deadlock will wait forever unless either session is terminated or the deadlock is resolved by an external process. The database engine deadlock monitor periodically checks for tasks that are in a deadlock. If the deadlock monitor detects a cyclic dependency, it chooses one of the tasks as a victim and terminates its transaction with error 1205. This allows the other task to complete its transaction. The application with the transaction was chosen as the deadlock victim can retry the transaction, which usually completes after the other deadlocked transaction has finished.

Learn more about deadlocks in the [transaction locking and row versioning guide](/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide#deadlocks).

### Default isolation level in Azure SQL Database

Databases in Azure SQL Database use the read committed snapshot isolation level (RCSI) by default. RCSI is a [row-versioning based isolation level](/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide#Row_versioning) that provides statement-level consistency and offers higher concurrency than the [read committed isolation level](/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide#database-engine-isolation-levels). 

With RCSI enabled, the default isolation level of queries is modified. Queries use row versioning so that:

- Statements reading data do not block statements modifying data
- Statements modifying data do not block statements reading data. 

Optionally, you may also choose to enable Snapshot isolation level for a database in Azure SQL Database. Snapshot isolation is an additional row-based isolation level which provides transaction-level consistency for data.

You can identify if snapshot isolation and read committed snapshot isolation are enabled with Transact-SQL. Connect to your database in Azure SQL Database and run the following query:

```sql
SELECT name, snapshot_isolation_state_desc, is_read_committed_snapshot_on
FROM sys.databases
WHERE name = DB_NAME();
GO
```

### Interpreting deadlock events

When you get a notification, it's already over


### Top methods to prevent deadlocks

Add app retry logic if doesn't exist

Index tuning, breaking apart transactions, rewriting T-SQL, query hints

Avoid: NOLOCK hints, query hints, rushing T-SQL rewrites

## Monitor and alert on deadlocks

Session 1:

```sql
BEGIN TRAN

    UPDATE SalesLt.Product SET SellEndDate = SellEndDate + 1
        WHERE Color = 'Red';

```

Session 2:

```sql
BEGIN TRAN

 UPDATE SalesLt.ProductDescription SET Description = Description
    FROM SalesLt.ProductDescription as pd
    JOIN SalesLt.ProductModelProductDescription as pmpd on
        pd.ProductDescriptionID = pmpd.ProductDescriptionID
    JOIN SalesLT.ProductModel as pm on
        pmpd.ProductModelID = pm.ProductModelID
    JOIN SalesLT.Product as p on
        pm.ProductModelID=p.ProductModelID
    WHERE p.Color = 'Silver';
```

Session 1:

```sql
    UPDATE SalesLt.Product SET SellEndDate = SellEndDate + 1
        WHERE Color = 'Silver';

ROLLBACK
```

> Msg 1205, Level 13, State 51, Line 7
> Transaction (Process ID 91) was deadlocked on lock resources with another process and has been chosen as the deadlock victim. Rerun the transaction.

Session 2:

```sql
ROLLBACK
```

## Collect deadlock graphs in Azure SQL Database

Identify the most frequent deadlocks

```sql
WITH deadlock_events AS (
SELECT 
    CAST(event_data AS XML) AS [target_data_XML] 
    FROM sys.fn_xe_telemetry_blob_target_read_file('dl', null, null, null)
), deadlocks AS (
SELECT 
    target_data_XML.query('/event/data[@name=''deadlock_cycle_id'']/value').value('(/value)[1]', 'int') AS [deadlock_cycle_id],
    target_data_XML.query('/event/data[@name=''database_name'']/value').value('(/value)[1]', 'nvarchar(250)') AS [database_name],
    target_data_XML.value('(/event/@timestamp)[1]', 'DateTime2') AS [deadlock_timestamp],
    target_data_XML.query('/event/data[@name=''xml_report'']/value/deadlock') AS deadlock_xml,
    LTRIM(RTRIM(Replace(Replace(c.value('.', 'nvarchar(250)'),CHAR(10),' '),CHAR(13),' '))) as query_text
FROM deadlock_events
CROSS APPLY target_data_XML.nodes('(/event/data/value/deadlock/process-list/process/inputbuf)') AS T(C)
)
SELECT 
    [deadlock_cycle_id]
    [database_name],
    [deadlock_timestamp],
    deadlock_xml,
    query_text
FROM deadlocks
ORDER BY [deadlock_timestamp] DESC;
GO
```

How to save a deadlock graph as a file SSMS can open (Save as XDL file)



## Analyze a deadlock for Azure SQL Database

Step through the deadlock graph (adapt from TLocking & Row V)
Look through XML for more info and to copy/paste
Find full queries and plans in Query Store from the inputbuff
Look for patterns:
    Table or Index scans, especially on writes
        Implicit conversions can't seek
    Explicit transactions with multiple steps
    Lock hints for READCOMMITTED, repeatable read, or serializable
    Lock escalation
        Indexes in the database with row or page locks disabled
        PAGLOCK hints

## Prevent a deadlock from reoccurring

### Tune indexes

Why index tuning helps reduce deadlocks

```sql
CREATE NONCLUSTERED INDEX ix_Product_Color on SalesLt.Product  (Color, ProductModelID);
GO
```

### Freeze a plan with Query Store

Why freezing a plan can help reduce deadlocks

### Modify the Transact-SQL

Why this is not the first recommendation

#### Break apart transactions

#### Query hints

#### Adjust the deadlock priority

## Next steps

Learn more about performance in Azure SQL Database:

- [Understand and resolve Azure SQL Database blocking problems](understand-resolve-blocking.md)
- [Transaction Locking and Row Versioning Guide](/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide)
- [SET TRANSACTION ISOLATION LEVEL](/sql/t-sql/statements/set-transaction-isolation-level-transact-sql)
- [Azure SQL Database: Improving Performance Tuning with Automatic Tuning](/Shows/Data-Exposed/Azure-SQL-Database-Improving-Performance-Tuning-with-Automatic-Tuning)
- [Deliver consistent performance with Azure SQL](/learn/modules/azure-sql-performance/)
