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

The intention of this article is to provide instruction on understanding blocking in Azure SQL databases, and then troubleshooting and resolving blocking. 

In this article, the term connection refers to a single logged-on session of the database. Each connection appears as a Session ID (SPID). Each of these SPIDs is often referred to as a process, although it is not a separate process context in the usual sense. Rather, each SPID consists of the server resources and data structures necessary to service the requests of a single connection from a given client. A single client application may have one or more connections. From the perspective of Azure SQL Database, there is no difference between multiple connections from a single client application on a single client computer and multiple connections from multiple client applications or multiple client computers; they are atomic. One connection can block another connection, regardless of the source client.

> [!NOTE]
> This content is specific to Azure SQL Database. Azure SQL Database is based on the latest stable version of the Microsoft SQL Server database engine, so much of the content is similar though troubleshooting options and tools may differ. For SQL Server, [see here](/troubleshoot/sql/performance/understand-resolve-blocking).

## What is blocking
 
Blocking is an unavoidable and by-design characteristic of any relational database management system (RDBMS) with lock-based concurrency. As mentioned previously, in SQL Server, blocking occurs when one session holds a lock on a specific resource and a second SPID attempts to acquire a conflicting lock type on the same resource. Typically, the time frame for which the first SPID locks the resource is small. When the owning session releases the lock, the second connection is then free to acquire its own lock on the resource and continue processing. This is normal behavior and may happen many times throughout the course of a day with no noticeable effect on system performance.

The duration and transaction context of a query determine how long its locks are held and, thereby, their impact on other queries. If the query is not executed within a transaction (and no lock hints are used), the locks for SELECT statements will only be held on a resource at the time it is actually being read, not during the query. For INSERT, UPDATE, and DELETE statements, the locks are held during the query, both for data consistency and to allow the query to be rolled back if necessary.

For queries executed within a transaction, the duration for which the locks are held are determined by the type of query, the transaction isolation level, and whether lock hints are used in the query. For a description of locking, lock hints, and transaction isolation levels, see the following articles:

* [Locking in the Database Engine](/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide)
* [Customizing Locking and Row Versioning](/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide#customizing-locking-and-row-versioning)
* [Lock Modes](/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide#lock_modes)
* [Lock Compatibility](/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide#lock_compatibility)
* [Transactions](/sql/t-sql/language-elements/transactions-transact-sql)

When locking and blocking persists to the point where there is a detrimental effect on system performance, it is due to one of the following reasons:

* A SPID holds locks on a set of resources for an extended period of time before releasing them. This type of blocking resolves itself over time but can cause performance degradation.

* A SPID holds locks on a set of resources and never releases them. This type of blocking does not resolve itself and prevents access to the affected resources indefinitely.

In the first scenario above, the situation can be very fluid as different SPIDs cause blocking on different resources over time, creating a moving target. For this reason, these situations can be difficult to troubleshoot using SQL Server Management Studio to narrow down the issue to individual queries. In contrast, the second situation results in a consistent state that can be easier to diagnose.

## Methodology for troubleshooting blocking

Regardless of which blocking situation we are in, the methodology for troubleshooting locking is the same. These logical separations are what will dictate the rest of the composition of this article. The concept is to find the head blocker and identify what that query is doing and why it is blocking. Once the problematic query is identified (that is, what is holding locks for the prolonged period), the next step is to analyze and determine why the blocking happening. After we understand the why, we can then make changes by redesigning the query and the transaction.

Steps in troubleshooting:

1. Identify the main blocking session (head blocker)

2. Find what query and transaction is causing the blocking (what is holding locks for a prolonged period)

3. Analyze/understand why the prolonged blocking occurs

4. Resolve blocking issue by redesigning query and transaction

Now let's dive in to discuss how to pinpoint the main blocking session with an appropriate data capture.

## Gathering blocking information

To counteract the difficulty of troubleshooting blocking problems, a database administrator can use SQL scripts that constantly monitor the state of locking and blocking in the Azure SQL database. To gather this data, there are essentially two methods. The first is to snapshot dynamic management objects (DMOs) and the second is to use XEvents to diagnose what was running. Some objects reference below are dynamic management views (DMVs) and some are dynamic management functions (DMFs).

## Gathering DMV information

Referencing DMVs to troubleshoot blocking has the goal of identifying the SPID (session ID) at the head of the blocking chain and the SQL Statement. Look for victim SPIDs that are being blocked. If any SPID is being blocked by another SPID, then investigate the SPID owning the resource (the blocking SPID). Is that owner SPID being blocked as well? You can walk the chain to find the head blocker then investigate why it is maintaining its lock.

Remember to run each of the below scripts in the target Azure SQL database.

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

* Refer to the sys.dm_exec_requests and reference the blocking_session_id column.  When blocking_session_id = 0, a session is not being blocked. While sys.dm_exec_requests lists only requests currently executing, any connection (active or not) will be listed in sys.dm_exec_sessions.

```sql
SELECT * FROM sys.dm_exec_requests er 
LEFT OUTER JOIN sys.dm_exec_sessions es ON er.session_id = es.session_id;
```

* Want to see if you have a long-term open transaction? Use another set of DMVs for viewing current open transactions, including sys.dm_tran_database_transactions, sys.dm_tran_session_transactions, sys.dm_exec_connections, and sys.dm_exec_sql_text. There are several DMVs associated with tracking transactions, see more [DMVs on transactions](/sql/relational-databases/system-dynamic-management-views/transaction-related-dynamic-management-views-and-functions-transact-sql) here. 

```sql
SELECT [s_tst].[session_id],
[database_name] = DB_NAME (s_tdt.database_id),
[s_tdt].[database_transaction_begin_time], 
[sql_text] = [s_est].[text] 
FROM sys.dm_tran_database_transactions [s_tdt]
INNER JOIN sys.dm_tran_session_transactions [s_tst] ON [s_tst].[transaction_id] = [s_tdt].[transaction_id]
INNER JOIN sys.dm_exec_connections [s_ec] ON [s_ec].[session_id] = [s_tst].[session_id]
CROSS APPLY sys.dm_exec_sql_text ([s_ec].[most_recent_sql_handle]) AS [s_est];
```

* Reference sys.dm_os_waiting_tasks that is at the thread/task layer of SQL. This returns information about what SQL Wait Type the request is currently experiencing. More information on
    [sys.dm_os_waiting_tasks](/sql/relational-databases/system-dynamic-management-views/sys-dm-os-waiting-tasks-transact-sql)
    here. Like sys.dm_exec_requests, only active requests are returned by sys.dm_os_waiting_tasks.

* Use the sys.dm_tran_locks DMV for more granular information on what locks have been placed by queries. More information about [sys.dm_tran_locks](/sql/relational-databases/system-dynamic-management-views/sys-dm-tran-locks-transact-sql) here. 

```sql
SELECT *
FROM sys.dm_tran_locks as t1  
INNER JOIN sys.dm_os_waiting_tasks as t2 ON t1.lock_owner_address = t2.resource_address;
```

* With DMVs, taking snapshots over time will provide data points that will allow you to review blocking over a specified time interval to identify persisted blocking or trends. 

## Extended events

In addition to the above information, it is often necessary to capture a trace of the activities on the server to thoroughly investigate a blocking problem on Azure SQL Database. For example, if a session executes multiple statements within a transaction, only the last statement that was submitted will be represented. However, one of the earlier statements may be the reason locks are still being held. A trace will enable you to see all the commands executed by a session within the current transaction.

There are two ways to capture traces in SQL Server; Extended Events (XEvents) and Profiler Traces. However, [SQL Server
Profiler](/sql/tools/sql-server-profiler/sql-server-profiler)
is deprecated trace technology not supported for Azure SQL Database. [Extended Events](/sql/relational-databases/extended-events/extended-events) is the newer tracing technology that allows more versatility and less impact to the observed system, and its interface is integrated into SQL Server Management Studio (SSMS). 

Refer to the document that explains how to use the [Extended Events New Session Wizard](/sql/relational-databases/extended-events/quick-start-extended-events-in-sql-server) in SSMS. For Azure SQL databases however, SSMS provides an Extended Events subfolder under each database in Object Explorer.  Use an Extended Events session wizard to capture these useful events: 

-   Category Errors:
    -   Attention
    -   Error_reported 
    -   Exchange_spill
    -   Execution_warning
    -   Hash_warning
    -   Sort_warning

-   Category Warnings:
    -   Missing_column_statistics
    -   Missing_join_predicate


-   Category Execution:
    -   Rpc_completed
    -   Rpc_starting
    -   Sp_cache_remove
    -   Sql_batch_completed
    -   Sql_batch_starting
    -   Sql_statement_recompile

-   Lock
    -   Lock_acquired
    -   Lock_deadlock

-   Session
    -   Existing_connection
    -   Login
    -   Logout

## Identifying and resolving common blocking scenarios

By examining the above information, you can determine the cause of most blocking problems. The rest of this article is a discussion of how to use this information to identify and resolve some common blocking scenarios. This discussion assumes you have used the blocking scripts (referenced earlier) to capture information on the blocking SPIDs and have made an XEvent with the events described above.

## Viewing script output 

* Examine the output of the DMVs sys.dm_exec_requests and sys.dm_exec_sessions to determine the heads of the blocking chains. Look for sessions that are blocked and the sessions blocking. Is there a common or root to the blocking chain?

*   Examine the output of the DMVs sys.dm_exec_requests and sys.dm_exec_sessions for information on the SPIDs at the head of the blocking chain. Look for the following fields: 

    -    `sys.dm_exec_requests.status`  
    This column shows the status of a particular request. Typically, a sleeping status indicates that the SPID has completed execution and is waiting for the application to submit another query or batch. A runnable or running status indicates that the SPID is currently processing a query. The following table gives  brief explanations of the various status values.

      | Status | Meaning |
      |:-|:-|
      | Background          | The SPID is running a background task, such as deadlock detection, log writer, or checkpoint. |
      | Sleeping            | The SPID is not currently executing. This usually indicates that the SPID is awaiting a command from the application. |
      | Running             | The SPID is currently running on a scheduler. |
      | Runnable            | The SPID is in the runnable queue of a scheduler and waiting to get scheduler time. |
      | Suspended           | The SPID is waiting for a resource, such as a lock or a latch. |    
                       
    -    `sys.dm_exec_sessions.open_transaction_count`  
    This field tells you the number of open transactions in this session. If this value is greater than 0, the SPID is within an open transaction and may be holding locks acquired by any statement within the transaction.

    -    `sys.dm_exec_requests.open_transaction_count`  
    Similarly, this field tells you the number of open transactions in this request. If this value is greater than 0, the SPID is within an open transaction and may be holding locks acquired by any statement within the transaction.

    -   `sys.dm_exec_requests.wait_type`, `wait_time`, and `last_wait_type`  
    If the `sys.dm_exec_requests.wait_type` is NULL, the request is not currently waiting for anything and the `last_wait_type` value indicates the last `wait_type` that the request encountered. For more information about `sys.dm_os_wait_stats` and a description of the most common wait types, see [sys.dm_os_wait_stats](/sql/relational-databases/system-dynamic-management-views/sys-dm-os-wait-stats-transact-sql). The `wait_time` value can be used to determine if the request is making progress. When a query against the sys.dm_exec_requests table returns a value in the `wait_time` column that is less than the `wait_time` value from a previous query of sys.dm_exec_requests, this indicates that the prior lock was acquired and released and is now waiting on a new lock (assuming non-zero `wait_time`). This can be verified by comparing the `wait_resource` between sys.dm_exec_requests output, which displays the resource for which the request is waiting.

    -   `sys.dm_exec_requests.wait_resource`
    This field indicates the resource that a blocked request is waiting on. The following table lists common `wait_resource` formats and their meaning:

    | Resource | Format | Example | Explanation | 
    |:-|:-|:-|:-|
    | Table | DatabaseID:ObjectID:IndexID | TAB: 5:261575970:1 | In this case, database ID 5 is the pubs sample database and object ID 261575970 is the titles table and 1 is the clustered index. |
    | Page | DatabaseID:FileID:PageID | PAGE: 5:1:104 | In this case, database ID 5 is pubs, file ID 1 is the primary data file, and page 104 is a page belonging to the titles table. To identify the object_id the page belongs to, use the dynamic management function [sys.dm_db_page_info](/sql/relational-databases/system-dynamic-management-views/sys-dm-db-page-info-transact-sql), passing in the DatabaseID, FileId, PageId from the `wait_resource`. | 
    | Key | DatabaseID:Hobt_id (Hash value for index key) | KEY: 5:72057594044284928 (3300a4f361aa) | In this case, database ID 5 is Pubs, Hobt_ID 72057594044284928 corresponds to index_id 2 for object id 261575970 (titles table). Use the sys.partitions catalog view to associate the hobt_id to a particular index_id and object_id. There is no way to unhash the index key hash to a specific key value. |
    | Row | DatabaseID:FileID:PageID:Slot(row) | RID: 5:1:104:3 | In this case, database ID 5 is pubs, file ID 1 is the primary data file, page 104 is a page belonging to the titles table, and slot 3 indicates the row's position on the page. |
    | Compile  | DatabaseID:FileID:PageID:Slot(row) | RID: 5:1:104:3 | In this case, database ID 5 is pubs, file ID 1 is the primary data file, page 104 is a page belonging to the titles table, and slot 3 indicates the row's position on the page. |

    -   Other columns

        The remaining columns in [sys.dm_exec_sessions](/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-sessions-transact-sql) and [sys.dm_exec_request](/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-requests-transact-sql) can provide insight into the root of a problem as well. Their usefulness varies depending on the circumstances of the problem. For example, you can determine if the problem happens only from certain clients (hostname), on certain network libraries (net_library), when the last batch submitted by a SPID was `last_request_start_time` in sys.dm_exec_sessions, and so on.


## Categorizing common blocking scenarios

The table below maps common symptoms to their probable causes. The number indicated in the Scenario column corresponds to the number in the [Common Blocking Scenarios and
Resolutions](#common-blocking-scenarios-and-resolutions)
section of this article below. The `wait_type`, `open_transaction_count`, and `status` columns refer to information returned by [sys.dm_exec_request](/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-requests-transact-sql), other columns may be returned by [sys.dm_exec_sessions](/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-sessions-transact-sql). The resolves? column indicates whether or not the blocking will resolve on its own.

| Scenario | Waittype | Open_Tran | Status | Resolves? | Other Symptoms | 
|:-|:-|:-|:-|:-|:-| 
| 1 | NOT NULL | >= 0 | runnable | Yes, when query finishes. | In sys.dm_exec_sessions, **reads**, **cpu_time**, and/or **memory_usage** columns will increase over time. Duration for the query will be high when completed. |
| 2  | NULL | \>0 | sleeping | No, but SPID can be killed. | An attention signal may be seen in the Extended Event session for this SPID, indicating a query time-out or cancel has occurred. |
| 3 |  NULL | \>= 0 | runnable | No. Will not resolve until client fetches all rows or closes connection. SPID can be killed, but it may take up to 30 seconds. | If open_transaction_count = 0, and the SPID holds locks while the transaction isolation level is default (READ COMMMITTED), this is a likely cause. | 
 | 4 | Varies | \>= 0 | runnable | No. Will not resolve until client cancels queries or closes connections. SPIDs can be killed, but may take up to 30 seconds. | The **hostname** column in sys.dm_exec_sessions for the SPID at the head of a blocking chain will be the same as one of the SPID it is blocking. | 
 | 5 | NULL  | \>0 | rollback | Yes. | An attention signal may be seen in the Extended Events session for this SPID, indicating a query time-out or cancel has occurred, or simply a rollback statement has been issued. | 
 | 6 | NULL | \>0 | sleeping | Eventually. When Windows NT determines the session is no longer active, the Azure SQL Database connection will be broken. | The `last_request_start_time` value in sys.dm_exec_sessions is much earlier than the current time. |

## Common blocking scenarios and resolutions

The scenarios listed below will have the characteristics listed in the table above. This section provides additional details when applicable, as well as paths to resolution.

1.  Blocking Caused by a Normally Running Query with a Long Execution Time

    Resolution:

    The solution to this type of blocking problem is to look for ways to optimize the query. Actually, this class of blocking problem may just be a performance problem, and require you to pursue it as such. For information on troubleshooting a specific slow-running query, see [How to troubleshoot slow-running queries on SQL Server](/troubleshoot/sql/performance/troubleshoot-slow-running-queries). For more information, see [Monitor and Tune for Performance](/sql/relational-databases/performance/monitor-and-tune-for-performance). 

    The Query Store reports, accessible via SSMS, are also a highly recommended and valuable tool for identifying the most costly queries, suboptimal execution plans, as well as the Intelligent Performance section of the Azure portal for the Azure SQL database in question, including [Query Performance Insight](query-performance-insight-use.md).

    If you have a long-running query that is blocking other users and cannot be optimized, consider moving it from an OLTP environment to a dedicated reporting system, a [synchronous read-only replica of the database](read-scale-out.md).

2.  Blocking Caused by a Sleeping SPID That Has Lost Track of the Transaction Nesting Level

    This type of blocking can often be identified by a SPID that is sleeping or awaiting a command, yet whose transaction nesting level (`@@TRANCOUNT`, `open_transaction_count` from sys.dm_exec_requests) is greater than zero. This can occur if the application experiences a query time-out, or issues a cancel without also issuing the required number of
    ROLLBACK and/or COMMIT statements. When a SPID receives a query time-out or a cancel, it will terminate the current query and batch, but does not automatically roll back or commit the transaction. The application is responsible for this, as Azure SQL Database cannot assume that an entire transaction must be rolled back due to a single query being canceled. The query time-out or cancel will appear as an ATTENTION signal event for the SPID in the Extended Event session.

    To demonstrate an uncommitted explicit transaction, issue the following query:

    ```sql
    BEGIN TRAN
    SELECT * FROM SYS.OBJECTS
    ```

    Then, execute this query in the same window:
    ```sql
    SELECT @@TRANCOUNT
    ROLLBACK TRAN
    ```

    The output of the second query indicates that the transaction nesting level is one. Had this been a `DELETE` or an
    `UPDATE` query, or had `HOLDLOCK` been used on the `SELECT`, all the locks acquired would still be held. Even with the query above, if another query had acquired and held locks earlier in the transaction, they would still be held when the above `SELECT` was canceled.

    Resolutions:
 -   Additionally, this class of blocking problem may also be a performance problem, and require you to pursue it as such. If the query execution time can be diminished, the query time-out or cancel would not occur. It is important that the application be able to handle the time-out or cancel scenarios should they arise, but you may also benefit from examining the performance of the query.
 -   Applications must properly manage transaction nesting levels, or they may cause a blocking problem following the cancellation of the query in this manner. This can be accomplished in one of several ways:
     
        -    In the error handler of the client application, execute `IF @@TRANCOUNT > 0 ROLLBACK TRAN` following any error, even if the client application does not believe a transaction is open. This is required, because a stored procedure called during the batch could have started a transaction without the client application's knowledge. Certain conditions, such as canceling the query, prevent the procedure from executing past the current statement, so even if the procedure has logic to check `IF @@ERROR <> 0` and abort the transaction, this rollback code will not be executed in such cases.
        
        -    If connection pooling is being used in an application that opens the connection and runs a small number of queries
        before releasing the connection back to the pool, such as a Web-based application, temporarily disabling connection
        pooling may help alleviate the problem until the client application is modified to handle the errors appropriately.
        By disabling connection pooling, releasing the connection will cause a physical disconnect of the Azure SQL Database connection, resulting in the server rolling back any open transactions.

        -    Use `SET XACT_ABORT ON` for the connection, or in any stored procedures that begin transactions and are not cleaning up following an error. In the event of a run-time error, this setting will abort any open transactions and return control to the client.
        
> [!NOTE]
> The connection is not reset until it is reused from the connection pool, so it is possible that a user could open a transaction and then release the connection to the connection pool, but it might not be reused for several seconds, during which time the transaction would remain open. If the connection is not reused, the transaction will be aborted when the connection times out and is removed from the connection pool. Thus, it is optimal for the client application to abort transactions in their error handler or use `SET XACT_ABORT ON` to avoid this potential delay.

> [!CAUTION]
> Following `SET XACT_ABORT ON`, T-SQL statements following a statement that causes an error will not be executed. This could affect the intended flow of existing code.


3.  Blocking Caused by a SPID Whose Corresponding Client Application Did Not Fetch All Result Rows to Completion

    After sending a query to the server, all applications must immediately fetch all result rows to completion. If an application does not fetch all result rows, locks can be left on the tables, blocking other users. If you are using an application that transparently submits SQL statements to the server, the application must fetch all result rows. If it does not (and if it cannot be configured to do so), you may be unable to resolve the blocking problem. To avoid the problem, you can restrict poorly behaved applications to a reporting or a decision-support database.

> Note
> See [guidance for retry logic](/azure/azure-sql/database/troubleshoot-common-connectivity-issues#retry-logic-for-transient-errors) for applications connecting to Azure SQL Database. 

    Resolution: The application must be rewritten to fetch all rows of the result to completion. This does not rule out the use of [OFFSET and FETCH in the ORDER BY clause](/sql/t-sql/queries/select-order-by-clause-transact-sql#using-offset-and-fetch-to-limit-the-rows-returned) of a query to perform server-side paging.


4.  Blocking Caused by a Distributed Client/Server Deadlock

    Unlike a conventional deadlock, a distributed deadlock is not detectable using the RDBMS lock manager. This is because only one of the resources involved in the deadlock is a SQL Server lock. The other side of the deadlock is at the client application level, over which SQL Server has no control. The following are two examples of how this can happen, and possible ways the application can avoid it.

    -   Client/Server Distributed Deadlock with a Single Client Thread

        If the client has multiple open connections, and a single thread of execution, the following distributed deadlock may occur. For brevity, the term `dbproc` used here refers to the client connection structure.

        ```
        SPID1------blocked on lock------->SPID2
            /\ (waiting to write results
            | back to client)
            | |
            | | Server side
            | ================================|==================================
            | <-- single thread --> | Client side
            | \/
            dbproc1 <------------------- dbproc2
            (waiting to fetch (effectively blocked on dbproc1, awaiting
            next row) single thread of execution to run)
        ```

        In the case shown above, a single client application thread has two open connections. It asynchronously submits a SQL operation on dbproc1. This means it does not wait on the call to return before proceeding. The application then submits another SQL operation on dbproc2, and awaits the results to start processing the returned data. When data starts coming back (whichever dbproc first responds, assume this is dbproc1), it processes to completion all the data returned on that dbproc. It fetches results from dbproc1 until SPID1 gets blocked on a lock held by SPID2 (because the two queries are running asynchronously on the server). At this point, dbproc1 will wait indefinitely for more data. SPID2 is not blocked on a lock, but tries to send data to its client, dbproc2. However, dbproc2 is effectively blocked on dbproc1 at the application layer as the single thread of execution for the application is in use by dbproc1. This results in a deadlock that SQL Server cannot detect or resolve because only one of the resources involved is a SQL Server resource.

    -   Client/server distributed deadlock with a thread per connection

        Even if a separate thread exists for each connection on the client, a variation of this distributed deadlock may still occur as shown by the following.

        ```
        SPID1------blocked on lock-------->SPID2
         /\ (waiting on net write) Server side
         | |
         | |
         | INSERT |SELECT
         | ================================|==================================
         | <-- thread per dbproc --> | Client side
         | \/
         dbproc1 <-----data row------- dbproc2
         (waiting on (blocked on dbproc1, waiting for it
         insert) to read the row from its buffer)
        ```

        This case is similar to Example A, except dbproc2 and SPID2 are running a `SELECT` statement with the intention of performing row-at-a-time processing and handing each row through a buffer to dbproc1 for an `INSERT`, `UPDATE`, or `DELETE` statement on the same table. Eventually, SPID1 (performing the `INSERT`, `UPDATE`, or `DELETE`) becomes blocked on a lock held by SPID2 (performing the `SELECT`). SPID2 writes a result row to the client dbproc2. Dbproc2 then tries to pass the row in a buffer to dbproc1, but finds dbproc1 is busy (it is blocked waiting on SPID1 to finish the current `INSERT`, which is blocked on SPID2). At this point, dbproc2 is blocked at the application layer by dbproc1 whose SPID (SPID1) is blocked at the database level by SPID2. Again, this results in a deadlock that SQL Server cannot detect or resolve because only one of the resources involved is a SQL Server resource.

        When a query time-out has been provided, if the distributed deadlock occurs, it will be broken when time-out happens. See the data provider documentation for more information on using a query time-out. Note this is different from the SQL Server 'remote query timeout' configuration option, which is not configurable in Azure SQL Database.

        For more information, see also [Troubleshooting connectivity issues and other errors with Azure SQL Database and Azure SQL Managed Instance](troubleshoot-common-errors-issues.md) and [Transient Fault Handling](/aspnet/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/transient-fault-handling).


5.  Blocking Caused by a SPID that is in rollback state

    A data modification query that is KILLed, or canceled outside of a user-defined transaction, will be rolled back. This can also occur as a side effect of the client network session disconnecting. Likewise, a query selected as the deadlock victim will be rolled back. A data modification query often cannot be rolled back any faster than the changes were initially applied. For example, if a `DELETE`, `INSERT`, or `UPDATE` statement had been running for an hour, it could take at least an hour to roll back. This is expected behavior, because the changes made must be rolled back, or transactional and physical integrity in the database would be compromised. Because this must happen, the database engine marks the SPID in a  rollback state (which means it cannot be KILLed or selected as a deadlock victim). This can often be identified by observing the output of sys.dm_exec_requests, which may indicate the ROLLBACK **command**, and the **percent_complete column** may show progress. 

    Resolution: You must wait for the SPID to finish rolling back the changes that were made. 

    To avoid this situation, do not perform large batch `INSERT`, `UPDATE`, or `DELETE` operations or index creation or maintenance operations during busy hours on OLTP systems. If possible, perform such operations during periods of low activity.

6.  Blocking Caused by an orphaned connection

    If the client application traps errors or the client workstation is restarted, the network session to the server may not be immediately canceled under some conditions. From the Azure SQL Database perspective, the client still appears to be present, and any locks acquired may still be retained. For more information, see [How to troubleshoot orphaned connections in SQL Server](/sql/t-sql/language-elements/kill-transact-sql#remarks). 

    Resolution: If the client application has disconnected without appropriately cleaning up its resources, you can terminate the SPID by using the `KILL` command. The `KILL` command takes the SPID value as input. For example, to kill SPID 9, issue the following command 

```sql
KILL 9
```

    The `KILL` command may take up to 30 seconds to complete, due to the interval between checks for the `KILL` command.

## Application involvement in blocking problems

    There may be a tendency to focus on server-side tuning and platform issues when facing a blocking problem. However, this does not usually lead to a resolution, and can absorb time and energy better directed at examining the client application and the queries it submits. No matter what level of visibility the application exposes regarding the database calls being made, a blocking problem nonetheless frequently requires both the inspection of the exact SQL statements submitted by the application and the application's exact behavior regarding query cancellation, connection management, fetching all result rows, and so on. If the development tool does not allow explicit control over connection management, query cancellation, query time-out, result fetching, and so on, blocking problems may not be resolvable. This potential should be closely examined before selecting an application development tool for Azure SQL Database, especially for business-critical OLTP environments. 

    It is vital that great care be exercised during the design and construction phase of the database and application. In particular, the resource consumption, isolation level, and transaction path length should be evaluated for each query. Each query and transaction should be as lightweight as possible. Good connection management discipline must be exercised. If this is not done, it is possible that the application may appear to have acceptable performance at low numbers of users, but the performance may degrade significantly as the number of users scales upward. 

    With proper application and query design, Azure SQL Database is capable of supporting many thousands of simultaneous users on a single server, with little blocking.

## See Also

* [Transaction Locking and Row Versioning Guide](/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide)