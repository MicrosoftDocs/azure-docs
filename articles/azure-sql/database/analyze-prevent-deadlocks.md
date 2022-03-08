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

Each database in Azure SQL Database has the read committed snapshot isolation level (RCSI) isolation level enabled by default. [Blocking](understand-resolve-blocking.md) between sessions reading data and sessions writing data is minimized under RCSI, which uses row versioning to increase concurrency. However, blocking and deadlocks may still occur in databases in Azure SQL Database because:

- Queries that modify data may block one another.
- Queries may run under isolation levels which increase blocking due to hints in Transact-SQL.
- RCSI may be disabled by a user, causing the database to run under the read committed isolation level, which increases blocking and deadlocks.

### An example deadlock

A deadlock occurs when two or more tasks permanently block each other by each task having a lock on a resource that the other tasks are trying to lock. For example:

- **Session A** begins an explicit transaction and runs an update statement which acquires an exclusive lock on one row on table `SalesLT.Product`.
- **Session B** runs an update statement that modifies the `SalesLt.ProductDescription` table. The update statement joins to the `SalesLT.Product` table to find the correct rows to update.
    - **Session B** takes out an exclusive lock on 72 rows on the `SalesLt.ProductDescription` table.
    - **Session B** needs a shared lock on rows on the table `SalesLT.Product`, including the row which is locked by **Session A**. **Session B** is blocked on `SalesLT.Product`.
- **Session A** continues its transaction, and now runs an update against the `SalesLt.ProductDescription` table. **Session A** is blocked by Session B on `SalesLt.ProductDescription`.

<!-- TODO: Get image for this -->

All transactions in a deadlock will wait indefinitely unless a session is terminated or the deadlock is resolved by an external process. The database engine deadlock monitor periodically checks for tasks that are in a deadlock. If the deadlock monitor detects a cyclic dependency, it chooses one of the tasks as a victim and terminates its transaction with error 1205. Breaking the deadlock in this way allows the other task or tasks in the deadlock to complete their transactions. The application with the transaction chosen as the deadlock victim can retry the transaction, which usually completes after the other transaction or transactions involved in the deadlock have finished.

Learn more about deadlocks in the [Transaction locking and row versioning guide](/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide#deadlocks).

### Default isolation level in Azure SQL Database

Databases in Azure SQL Database enable the read committed snapshot isolation level (RCSI) by default. RCSI is a [row-versioning based isolation level](/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide#Row_versioning) that provides statement-level consistency and offers higher concurrency than the [read committed isolation level](/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide#database-engine-isolation-levels). 

With RCSI enabled, the default isolation level of queries is modified. Queries use row versioning so that:

- Statements reading data do not block statements modifying data.
- Statements modifying data do not block statements reading data. 

Optionally, you may also choose to [enable Snapshot isolation level](/sql/t-sql/statements/alter-database-transact-sql-set-options?view=azuresqldb-current&preserve-view=true#b-enable-snapshot-isolation-on-a-database) for a database in Azure SQL Database. Snapshot isolation is an additional row-based isolation level which provides transaction-level consistency for data and which uses row versions to select rows to update.

You can identify if RCSI and/or snapshot isolation are enabled with Transact-SQL. Connect to your database in Azure SQL Database and run the following query:

```sql
SELECT name, is_read_committed_snapshot_on, snapshot_isolation_state_desc
FROM sys.databases
WHERE name = DB_NAME();
GO
```

If RCSI is enabled, the `is_read_committed_snapshot_on` column will return the value **1**. If snapshot isolation is enabled, the `snapshot_isolation_state_desc` column will return the value **ON**.

If RCSI has been disabled for a database in Azure SQL Database, investigate with your team if this was done for a specific reason before re-enabling it. Application code may have been written expecting that queries reading data will be blocked by queries writing data, resulting in incorrect data from race conditions when RCSI is enabled.

### Interpreting deadlock events

A deadlock event is emitted after the deadlock manager in Azure SQL Database detects a deadlock and selects a transaction as the victim. In other words, if you set up alerts for deadlocks, the notification fires after an individual deadlock has been resolved. There is no user action that needs to be taken for that deadlock. Applications should be written to include retry logic so that they automatically continue after receiving error 1205 from a deadlock.

It is useful to set up alerts, however, as deadlocks may reoccur. Alerts that deadlocks are occurring enable you to investigate if a pattern of repeat deadlocks is happening in your database, in which case you may choose to take action to prevent deadlocks from reoccurring. Learn more about alerting in [Monitor and alert on deadlocks](#monitor-and-alert-on-deadlocks) in this article.

### Top methods to prevent deadlocks

The lowest risk and most effective approach to preventing deadlocks from reoccurring is generally to tune nonclustered indexes to optimize queries involved in the deadlock.

- Risk is low for this approach because index tuning does not require changes to the query code itself, reducing the risk of making a mistake in a rewrite that causes incorrect data to be returned to the user.
- Effective index tuning helps queries find the data to read and modify more efficiently. By reducing the amount of data that a query needs to access, the surface area for blocking can be reduced and deadlocks can often be prevented.

When index tuning is not successful at preventing deadlocks, other methods are available:

- If the deadlock occurs only when a particular plan is chosen for one of the queries involved in the deadlock, [forcing a query plan](/sql/relational-databases/system-stored-procedures/sp-query-store-force-plan-transact-sql) with Query Store may prevent deadlocks from reoccurring.
- Rewriting Transact-SQL for one or more transactions involved in the deadlock can also help prevent deadlocks. Breaking apart explicit transactions into smaller transactions may require careful coding and testing to ensure data validity in high concurrency scenarios.

Learn more in the [prevent a deadlock from reoccurring](#prevent-a-deadlock-from-reoccurring) section of this article.

## Monitor and alert on deadlocks

In this article, we will use the `AdventureWorksLT` sample database to set up alerts for deadlocks, cause an example deadlock, analyze the deadlock graph for the example deadlock, and test changes to prevent the deadlock from reoccurring.

We will use the [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms) (SSMS) client in this article, as it contains functionality to display deadlock graphs in an interactive visual mode. You can use other clients such as [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio) to follow along with the examples, but you may only be able to view deadlock graphs as XML.


### Create the AdventureWorksLT database

To follow along with the examples, create a new database in Azure SQL Database and select **Sample** data as the **Data source**.  For detailed instructions on how to do this with the Azure portal, Azure CLI, or PowerShell, select the approach of your choice in [Quickstart: Create an Azure SQL Database single database](single-database-create-quickstart.md).

### Set up deadlock alerts in the Azure portal

To set up alerts for deadlock events, follow the steps in the article [Create alerts for Azure SQL Database and Azure Synapse Analytics using the Azure portal](alerts-insights-configure-portal.md). Select **Deadlocks** as the signal name for the alert. Configure the **Action group** to notify you using the method of your choice, such as the **Email/SMS/Push/Voice** action type.

### Cause a deadlock in the AdventureWorksLT database

To cause a deadlock, you will need to connect two sessions to the `AdventureWorksLT` database. We'll refer to these sessions as **Session A** and **Session B**. 

In **Session A**, run the following Transact-SQL. This code begins an [explicit transaction](/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide#starting-transactions) and runs a single statement that updates the `SalesLt.Product` table. To do this, the transaction acquires an exclusive lock on one row on table `SalesLT.Product`. We leave the transaction open.

```sql
BEGIN TRAN

    UPDATE SalesLt.Product SET SellEndDate = SellEndDate + 1
        WHERE Color = 'Red';

```

Now, in **Session B**, run the following Transact-SQL. This code does not explicitly begin a transaction. Instead, it operates in [autocommit transaction mode](/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide#starting-transactions). This statement updates the `SalesLt.ProductDescription` table. The update will take out an exclusive lock on 72 rows on the `SalesLt.ProductDescription` table. The query joins to other tables, including the `SalesLt.Product` table. 

```sql
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
To complete this update, **Session B** needs a shared lock on rows on the table `SalesLT.Product`, including the row which is locked by **Session A**. **Session B** will be blocked on `SalesLT.Product`.

Return to **Session A**. Paste the following code into the session. This runs a second UPDATE statement as part of the open transaction.

```sql
    UPDATE SalesLt.Product SET SellEndDate = SellEndDate + 1
        WHERE Color = 'Silver';
```

This second update statement in **Session A** will be blocked by **Session B** on the `SalesLt.ProductDescription`.

**Session A** and **Session B** are now mutually blocking one another. Neither transaction can proceed, as they each need a resource which is locked by the other.

After a few seconds, you should see a deadlock occur, with **Session A** chosen as the deadlock victim. An error message will appear in **Session A** with text similar to the following:

> Msg 1205, Level 13, State 51, Line 7
> Transaction (Process ID 91) was deadlocked on lock resources with another process and has been chosen as the deadlock victim. Rerun the transaction.

**Session B** will complete successfully.

If you [set up deadlock alerts in the Azure portal](#set-up-deadlock-alerts-in-the-azure-portal), you should receive a notification shortly after the deadlock occurs.

## Collect deadlock graphs in Azure SQL Database

You can query recent deadlock history in a database in Azure SQL Database using the [sys.fn_xe_telemetry_blob_target_read_file](/sql/relational-databases/system-functions/sys-fn-xe-file-target-read-file-transact-sql) dynamic management function (DMF) in the `master` database. This DMF reads from an extended events trace automatically maintained by Azure SQL Database. Specify `dl` as the path to query deadlock events.

Connect to the `master` database on the [logical server](logical-servers.md) for your database in Azure SQL Database to run the following query:

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
	[deadlock_cycle_id], [database_name], [deadlock_timestamp], deadlock_xml, query_text
FROM deadlocks
ORDER BY [deadlock_timestamp] DESC;
GO
```

If you have run the code to cause the example deadlock multiple times, the output will look similar to this screenshot:

:::image type="content" source="media/analyze-prevent-deadlocks/ssms-query-deadlocks-azure-sql-database.png" alt-text="A screenshot of SSMS. A query has been run to return a list of deadlocks." lightbox="media/analyze-prevent-deadlocks/ssms-query-deadlocks-azure-sql-database.png":::

The `deadlock_cycle_id` column is present to help identify rows associated with the same deadlock. In this example, the same deadlock is reoccurring between two sessions, so two rows are present for each deadlock.

### Save a deadlock graph as an XDL file that can be displayed graphically in SSMS

To save a deadlock graph as a file which can be graphically displayed by SSMS:

1. Select the value in the `deadlock_xml` column from any row to open the deadlock graph's XML in a new window in SSMS.
1. Select **File** and **Save As...**.
1. Set **Save as type** to **All Files**.
1. Set the **File name** to the name of your choice, with the extension set to **.xdl**.
1. Select **Save**.

    :::image type="content" source="media/analyze-prevent-deadlocks/ssms-save-deadlock-file-xdl.png" alt-text="A screenshot in SSMS of saving a deadlock graph XML file to a file with the xsd extension."  lightbox="media/analyze-prevent-deadlocks/ssms-save-deadlock-file-xdl.png":::

1. Close the file by selecting the **X** on the tab at the top of the window, or by selecting **File**, then **Close**. 
1. Reopen the file in SSMS by selecting **File**, then **Open**, then **File**. Select the file you saved with the `.xdl` extension.

    The deadlock graph will now display in SSMS.

    :::image type="content" source="media/analyze-prevent-deadlocks/ssms-deadlock-graph-xdl-file-graphic-display.png" alt-text="Screenshot of an xdl file opened in SSMS. The deadlock graph is displayed graphically, with processes indicated by ovals and lock resources as rectangles."  lightbox="media/analyze-prevent-deadlocks/ssms-deadlock-graph-xdl-file-graphic-display.png":::

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

#### Techniques to avoid in preventing deadlocks

Avoid: NOLOCK hints, disabling row and page locks on indexes, query hints (when possible)


## Next steps

Learn more about performance in Azure SQL Database:

- [Understand and resolve Azure SQL Database blocking problems](understand-resolve-blocking.md)
- [Transaction Locking and Row Versioning Guide](/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide)
- [SET TRANSACTION ISOLATION LEVEL](/sql/t-sql/statements/set-transaction-isolation-level-transact-sql)
- [Azure SQL Database: Improving Performance Tuning with Automatic Tuning](/Shows/Data-Exposed/Azure-SQL-Database-Improving-Performance-Tuning-with-Automatic-Tuning)
- [Deliver consistent performance with Azure SQL](/learn/modules/azure-sql-performance/)
