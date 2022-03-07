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

Default isolation level in Azure SQL Database
    How to change it
What a deadlock is
    When you get a notification, it's already over
Summary of top fixes
    Add app retry logic if doesn't exist
    Index tuning, breaking apart transactions, rewriting T-SQL, query hints

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

How to save a deadlock graph as a file SSMS can open
Query DMV

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

Identify the most frequent deadlocks

Save as XDL file

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

```sql
CREATE NONCLUSTERED INDEX ix_Product_Color on SalesLt.Product  (Color, ProductModelID);
GO
```

### Freeze a plan with Query Store


### Modify the Transact-SQL

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
