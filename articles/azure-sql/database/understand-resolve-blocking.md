---
title: Understand and resolve Azure SQL blocking problems
titleSuffix: Azure SQL Database 
description: "An overview of Azure SQL database specific topics on blocking and troubleshooting."
services: sql-database
ms.service: sql-database
ms.subservice: performance
ms.custom: 
ms.devlang:
ms.topic: conceptual
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: 
ms.date: 12/28/2020
---
# Understand and resolve Azure SQL Database blocking problems
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

## Objective

The intention of this article is to provide instruction on first understanding what blocking is in Azure SQL databases and furthermore how to investigate its occurrence. 

In this article, the term connection refers to a single logged-on session of the database. Each connection appears as a Session ID (SPID). Each of these SPIDs is often referred to as a process, although it is not a separate process context in the usual sense. Rather, each SPID consists of the server resources and data structures necessary to service the requests of a single connection from a given client. A single client application may have one or more connections. From the perspective of SQL Server, there is no difference between multiple connections from a single client application on a single client computer and multiple connections from multiple client applications or multiple client computers; they are atomic. One connection can block another connection, regardless of the source client.

> [!NOTE]
> This content is specific to Azure SQL Database. Azure SQL Database is based on the latest stable version of the Microsoft SQL Server database engine, so much of the content is similar though troubleshooting options and tools may differ. For SQL Server, [see here](https://docs.microsoft.com/en-us/troubleshoot/sql/performance/understand-resolve-blocking).

## What is blocking
 
Blocking is an unavoidable and by-design characteristic of any relational database management system (RDBMS) with lock-based concurrency. As mentioned previously, in SQL Server, blocking occurs when one session holds a lock on a specific resource and a second SPID attempts to acquire a conflicting lock type on the same resource. Typically, the time frame for which the first SPID locks the resource is small. When the owning session releases the lock, the second connection is then free to acquire its own lock on the resource and continue processing. This is normal behavior and may happen many times throughout the course of a day with no noticeable effect on system performance.

The duration and transaction context of a query determine how long its locks are held and, thereby, their impact on other queries. If the query is not executed within a transaction (and no lock hints are used), the locks for SELECT statements will only be held on a resource at the time it is actually being read, not for the duration of the query. For INSERT, UPDATE, and DELETE statements, the locks are held for the duration of the query, both for data consistency and to allow the query to be rolled back if necessary.

For queries executed within a transaction, the duration for which the locks are held are determined by the type of query, the transaction isolation level, and whether lock hints are used in the query. For a description of locking, lock hints, and transaction isolation levels, see the following topics in SQL Server Books Online:

* [Locking in the Database Engine](https://docs.microsoft.com/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide)
* [Customizing Locking and Row Versioning](https://docs.microsoft.com/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide#customizing-locking-and-row-versioning)
* [Lock Modes](https://docs.microsoft.com/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide#lock_modes)
* [Lock Compatibility](https://docs.microsoft.com/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide#lock_compatibility)
* [Transactions](https://docs.microsoft.com/sql/t-sql/language-elements/transactions-transact-sql)

When locking and blocking persists to the point where there is a detrimental effect on system performance, it is due to one of the following reasons:

* A SPID holds locks on a set of resources for an extended period of time before releasing them. This type of blocking resolves itself over time but can cause performance degradation.

* A SPID holds locks on a set of resources and never releases them. This type of blocking does not resolve itself and prevents access to the affected resources indefinitely.

In the first scenario above, the situation can be very fluid as different SPIDs cause blocking on different resources over time, creating a moving target. For this reason, these situations can be difficult to troubleshoot using SQL Server Management Studio,  to narrow down the issue to individual queries. In contrast, the second situation results in a consistent state that can be easier to diagnose.

## Methodology for troubleshooting blocking

Regardless of which blocking situation we are in, the methodology for troubleshooting locking is the same. These logical separations are what will dictate the rest of the composition of this article. The concept is to find the head blocker and identify what that query is doing and why it is blocking. Once the problematic query is identified (that is, what is holding locks for the prolonged period), the next step is to analyze and determine why the blocking happening. After we understand the why, we can then make changes by redesigning the query and the transaction.

To briefly enumerate this:

1. Identify the main blocking session (head blocker)

2. Find what query and transaction is causing the blocking (what is holding locks for a prolonged period)

3. Analyze/understand why the prolonged blocking occurs

4. Resolve blocking issue by redesigning query and transaction

Now let's dive in to discuss how to pinpoint the main blocking session with an appropriate data capture.

## Gathering blocking information

To counteract the difficulty of troubleshooting blocking problems, a database administrator can use SQL scripts that constantly monitor the state of locking and blocking in the Azure SQL database. To gather this data, there are essentially two methods. The first is to snapshot dynamic management objects (DMOs) within SQL Server, and the second is to use XEvents to diagnose what was running. Some objects reference below are dynamic management views (DMVs) and some are dynamic management functions (DMFs).

## Gathering DMV information

Referencing DMVs to troubleshoot blocking has the goal of identifying the SPID (session ID) at the head of the blocking chain and the SQL Statement. Look for victim SPIDs that are being blocked. If any SPID is being blocked by another SPID, then investigate the SPID owning the resource (the blocking SPID). Is that owner SPID being blocked as well or not (the head blocker)? You essentially want to walk the chain to find the head blocker then investigate why it is maintaining its lock. To do this, you can use one of the following methods:

* The sp_who and sp_who2 commands are older commands to show all current sessions. The DMV sys.dm_exec_sessions returns more data in a result set that is easier to query and filter. You will find sys.dm_exec_sessions at the core to other queries below. 

* If you already have a particular session identified, you can use `DBCC INPUTBUFFER(<session_id>)` to find the last statement that was submitted by a session. Similar results can be returned with the sys.dm_exec_input_buffer dynamic management function (DMF), in a result set that is easier to query and filter, providing the session_id and the request_id. For example, to return the most recent query submitted by session_id 66 and request_id 0:

```sql
SELECT * FROM sys.dm_exec_input_buffer (66,0) 
```

* Run the query below to find the actively executing queries and their input buffer, using the dm_exec_sql_text DMV. Keep in mind to be populated in sys.dm_exec_requests, the query must be actively executing with SQL.

```sql
SELECT * FROM sys.dm_exec_requests er 
INNER JOIN sys.dm_exec_sessions es ON er.session_id = es.session_id 
CROSS APPLY sys.dm_exec_sql_text (sql_handle);
```

* Refer to the sys.dm_exec_requests and reference the blocking_session_id column.  When blocking_session_id = 0, a session is not being blocked. While sys.dm_exec_requests lists only those requests currently executing, any process (active or not) will be listed in sys.dm_exec_sessions.

```sql
SELECT * FROM sys.dm_exec_requests er 
LEFT OUTER JOIN sys.dm_exec_sessions es ON er.session_id = es.session_id;
```

* Want to see if you have a long-term open transaction? Use another set of DMVs for viewing current open transactions, including sys.dm_tran_database_transactions, sys.dm_tran_session_transactions, sys.dm_exec_connections, and sys.dm_exec_sql_text. There are several DMVs associated with tracking transactions, see more [DMVs on transactions](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/transaction-related-dynamic-management-views-and-functions-transact-sql) here. 

```sql
SELECT [s_tst].[session_id],
[database_name]    = DB_NAME (s_tdt.database_id),
[s_tdt].[database_transaction_begin_time], 
[sql_text] = [s_est].[text] 
FROM sys.dm_tran_database_transactions [s_tdt]
INNER JOIN sys.dm_tran_session_transactions [s_tst] ON [s_tst].[transaction_id] = [s_tdt].[transaction_id]
INNER JOIN sys.dm_exec_connections [s_ec] ON [s_ec].[session_id] = [s_tst].[session_id]
CROSS APPLY sys.dm_exec_sql_text ([s_ec].[most_recent_sql_handle]) AS [s_est];
```

* Reference sys.dm_os_waiting_tasks that is at the thread/task layer of SQL. This returns information about what SQL Wait Type the request is currently experiencing. More information on
    [sys.dm_os_waiting_tasks](https://docs.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-os-waiting-tasks-transact-sql)
    here. Like sys.dm_exec_requests, only active requests are returned by sys.dm_os_waiting_tasks.

* Use the sys.dm_tran_locks DMV for more granular information on what locks have been placed by queries. More information about [sys.dm_tran_locks](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-tran-locks-transact-sql) here. 

```sql
SELECT *
FROM sys.dm_tran_locks as t1  
INNER JOIN sys.dm_os_waiting_tasks as t2  
    ON t1.lock_owner_address = t2.resource_address;
```

* With DMVs, taking snapshots over time will provide data points that will allow you to review blocking over a specified time interval to identify persisted blocking or trends. The go-to tool for Microsoft Support to troubleshoot such issues is using the PSSDiag data collector. This tool uses the "SQL Server Perf Stats" to snapshot DMVs referenced above over time. As this
tool is constantly evolving, please review the latest public version of [DiagManager](https://github.com/Microsoft/DiagManager) on GitHub.


## See Also

* [Transaction Locking and Row Versioning Guide](https://docs.microsoft.com/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide)