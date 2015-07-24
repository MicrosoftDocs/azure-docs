<properties 
   pageTitle="Azure SQL Database Resource Limits"
   description="This page describes some common resource limit for Azure SQL Database."
   services="sql-database"
   documentationCenter="na"
   authors="rothja"
   manager="jeffreyg"
   editor="monicar" />
<tags 
   ms.service="sql-database"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="data-management"
   ms.date="07/13/2015"
   ms.author="jroth" />

# Azure SQL Database Resource Limits

Azure SQL Database monitors the usage of the shared resources, such as the transaction log, I/O, and many other resources. This enable Azure SQL Databse to keep databases within set resource boundaries. This resource boundary or threshold is called the resource limit. When the resource usage by the clients exceeds these limits, either at a tenant or physical node level, Azure SQL Database responds by managing the resource usage, which results in connection losses or request denials.

> [AZURE.NOTE] When resource limits prevent queries to analyze database performance problems, you might need to use the dedicated administrator connection (DAC), which is available beginning with Azure SQL Database V12. For more information about using the DAC, see [Diagnostic Connection for Database Administrators](https://msdn.microsoft.com/library/ms189595.aspx).

## Resource Limits Summary Table

The following table provides a summary of the limits for each resource beyond which Azure SQL Database denies request or terminates connections to the affected resource, and an error code is returned. In some cases the service tier (Basic, Standard, Premium) and performance level determine the exact limit. In those cases, see [Azure SQL Database Service Tiers and Performance Levels](https://msdn.microsoft.com/library/azure/dn741336.aspx).

[AZURE.INCLUDE [azure-sql-database-limits](../../includes/azure-sql-database-limits.md)]

## Understanding Error Codes

Sometimes the same error code is returned for multiple limitation conditions for a resource. These conditions are identified as states in the error message. For example, the following two error messages are displayed for the Transaction Log Length resource. Although the text of the message is the same, they have different State values (1 and 2 respectively) based on different limitation conditions.

Error Message 1:

	Msg 40552, Level 17, State 1, Line 1
	The session has been terminated because of excessive transaction log space usage.
	Try modifying fewer rows in a single transaction.

Error Message 2:

	Msg 40552, Level 17, State 2, Line 1
	The session has been terminated because of excessive transaction log space usage.
	Try modifying fewer rows in a single transaction.

The same situation applies to Resource ID that appear in some messages. The Resource ID translates to a system resource that is experiencing the limit. 

The remainder of this topic explains possible error codes in more detail, including instances where the State value and Resource ID provides additional information about the error. 

## Database Size

| &nbsp; | More Information |
| :--- | :--- |
| **Condition** | When the database space allotted to a user database is full, the user gets a database full error. |
| **Error code** | **40544**: The database has reached its size quota. Partition or delete data, drop indexes, or consult the documentation for possible resolutions. |
| **Limit** | Depends on the [Service Tier and Performance Level](https://msdn.microsoft.com/library/azure/dn741336.aspx). |
| **Type of requests denied** | Non-Select DML (Insert, Update, Merge that inserts or updates). |
| **Recommendation** | Use DELETE/DROP statements to remove data from the database until the size of the database is under the limit. |

## Logins

| &nbsp; | More Information |
| :--- | :--- |
| **Condition** | SQL Database governs the limit on the number of concurrent logins that can be established to a database. When the concurrent login limit for a database is reached, new login requests to the database are denied and error code 10928 is returned. |
| **Error code** | **10928**: Resource ID: 3. The %s limit for the database is %d and has been reached. See http://go.microsoft.com/fwlink/?LinkId=267637 for assistance. |
| **Limit** | Depends on the [Service Tier and Performance Level](https://msdn.microsoft.com/library/azure/dn741336.aspx). |
| **Recommendation** | Check dm_exec_connections to view which user connections are currently active.<br><br>Back-off and retry login after 10 seconds. |

> [AZURE.NOTE] The Resource ID value in the error message indicates the resource for which limit has been reached. For logins, Resource ID = 3.

## Memory Usage

| &nbsp; | More Information |
| :--- | :--- |
| **Condition** | When there are sessions waiting on memory grants for 20 seconds or more, sessions consuming greater than 16 MB of memory grant for more than 20 seconds are terminated in the descending order of time the resource has been held, so that the oldest session is terminated first. Termination of sessions stops as soon as the required memory becomes available. |
| **Error code** | **40553**: The session has been terminated because of excessive memory usage. Try modifying your query to process fewer rows. |
| **Limit** | More than 16 MB of memory grant for more than 20 seconds. |
| **Type of requests denied** | Queries that consume memory grants, which include queries that use sorts and hash joins. |
| **Recommendation** | Perform query tuning on queries that require sorts and/or hash joins. |

## Sessions

| &nbsp; | More Information |
| :--- | :--- |
| **Condition** | SQL Database governs the limit on the number of concurrent sessions that can be established to a database. When concurrent session limit for a database is reached, new connections to the database are denied and user will receive error code 10928. However, the existing sessions to the database are not terminated. |
| **Error code** | **10928**: Resource ID: 2. The %s limit for the database is %d and has been reached. See http://go.microsoft.com/fwlink/?LinkId=267637 for assistance. |
| **Limit** | Depends on the [Service Tier and Performance Level](https://msdn.microsoft.com/library/azure/dn741336.aspx). |
| **Recommendation** | Check dm_exec_requests to view which user requests are currently executing. |

> [AZURE.NOTE] The Resource ID value in the error message indicates the resource for which limit has been reached. For sessions, Resource ID = 2.

## Tempdb

| &nbsp; | More Information |
| :--- | :--- |
| **Condition** | Your requests on tempdb can be denied due to any of the following three conditions:<br><br>**State 1:** When a session uses more than 5 GB of tempdb space, the session is terminated.<br><br>**State 2:** Transactions in tempdb with logs beyond 2 GB size are truncated. Example operations that can consume log space in tempdb: insert, update, delete, merge, create index.<br><br>**State 3:** The uncommitted transactions in tempdb can block the truncation of log files. To prevent this, the distance from the oldest active transaction log sequence number (LSN) to the tail of the log (current LSN) in tempdb cannot exceed 20% of the size of the log file. When violated, the offending transaction in tempdb is terminated and rolled back so that the log can be truncated. |
| **Error code** | **40551**: The session has been terminated because of excessive tempdb usage. Try modifying your query to reduce the temporary table space usage. |
| **Limit** | **State 1:** 5 GB of tempdb space <br><br> **State 2:** 2 GB per transaction in tempdb <br><br>**State 3:** 20% of total log space in tempdb |
| **Type of requests denied** | Any DDL or DML statements on tempdb. |
| **Recommendation** | Modify queries to reduce the temporary table space usage, drop temporary objects after they are no longer needed, truncate tables, or remove unused tables. Reduce the size of data in your transaction in tempdb by reducing the number of rows or splitting the operation into multiple transactions. |

## Transaction Duration

| &nbsp; | More Information |
| :--- | :--- |
| **Condition** | Transactions request locks on resources like rows, pages, or tables, on which the transaction is dependent and then free the locks when they no longer have a dependency on the locked resources. Your requests can be denied due to any of the following two conditions:State 1: If a transaction has been running for more than 24 hours, it is terminated.State 2: If a transaction locks a resource required by an underlying system task for more than 20 seconds, it is terminated. |
| **Error code** | **40549**: Session is terminated because you have a long-running transaction. Try shortening your transaction. |
| **Limit** | **State 1:** 24 hours<br><br>**State 2:** 20 seconds if a transaction locks a resource required by an underlying system task |
| **Type of requests denied** | Any transaction that has been running for more than 24 hours or any DDL or DML statements that takes a lock, which results in blocking a system task. |
| **Recommendation** | Operations against SQL Database should not block on user input or have other dependencies that result in long-running transactions. |

## Transaction Lock Count

| &nbsp; | More Information |
| :--- | :--- |
| **Condition** | Sessions consuming greater than one million locks are terminated. |
| **Error code** | **40550**: The session has been terminated because it has acquired too many locks. Try reading or modifying fewer rows in a single transaction.  |
| **Limit** | 1 million locks per transaction |
| **Type of requests denied** | Any DDL or DML statements. |
| **Recommendation** | Following DMVs can be used to monitor transactions: **sys.dm_tran_active_transactions**, **sys.dm_tran_database_transactions**, **sys.dm_tran_locks**, and **sys.dm_tran_session_transactions**. Depending on the type of application, it may be possible to use coarser grain lock hints, like **PAGLOCK** or **TABLOCK**, to reduce the number of locks taken in a given statement/transaction. Note that this can negatively impact application concurrency. |

## Transaction Log Length

| &nbsp; | More Information |
| :--- | :--- |
| **Condition** | Your requests could be denied due to any of the following two conditions:<br><br>**State 1:** SQL Database supports transactions generating log of up to 2 GB in size. Transactions with logs beyond this limit are truncated. Example operations that can consume log space in this volume: insert, update, delete, merge, create index.<br><br>**State 2:** The uncommitted transactions can block the truncation of log files. To prevent this, the distance from the oldest active transaction log sequence number (LSN) to the tail of the log (current LSN) cannot exceed 20% of the size of the log file. When violated, the offending transaction is terminated and rolled back so that the log can be truncated. |
| **Error code** | **40552**: The session has been terminated because of excessive transaction log space usage. Try modifying fewer rows in a single transaction. |
| **Limit** | **State 1:** 2 GB per transaction<br><br>**State 2:** 20% of total log space |
| **Type of requests denied** | Any DDL or DML statements. |
| **Recommendation** | For row operations, reduce the size of data in your transaction, for example by reducing the number of rows or splitting the operation into multiple transactions.For table/index operations that require a single transaction, ensure that the following formula is adhered to: number of rows affected in table * (avg size of field being updated in bytes + 80) < 2 GB(In case of index rebuild, avg size of field being updated should be substituted by avg index size). |

## Worker Threads (max concurrent requests)

| &nbsp; | More Information |
| :--- | :--- |
| **Condition** | SQL Database governs the limit on the number of worker threads (concurrent requests) to a database. Any database with more than the allowed limit of concurrent requests will receive error 10928, and further requests on this database can be denied. |
| **Error codes** | **10928**: Resource ID: 1. The %s limit for the database is %d and has been reached. See http://go.microsoft.com/fwlink/?LinkId=267637 for assistance.<br><br>**10929**: Resource ID: 1. The %s minimum guarantee is %d, maximum limit is %d and the current usage for the database is %d. However, the server is currently too busy to support requests greater than %d for this database. See http://go.microsoft.com/fwlink/?LinkId=267637 for assistance. Otherwise, please try again later. |
| **Limit** | For Basic, Standard, and Premium tiers, it depends on the [Performance Level](https://msdn.microsoft.com/library/azure/dn741336.aspx). For older Web/Business edition databases, the maximum limit of concurrent requests is 180 and might be less depending on system activity. |
| **Recommendation** | Check dm_exec_requests to view which user requests are currently executing.<br><br>Back-off and retry request after 10 seconds. |

> [AZURE.NOTE] The Resource ID value in the error message indicates the resource for which limit has been reached. For worker threads, Resource ID = 1.

Errors due to governance on worker threads (10928/10929) replace the original engine throttling error (40501) for worker threads. Under normal conditions, users should no longer receive engine throttling error for worker threads.

In certain scenarios like the usage of federated database feature, it is possible to hit the worker thread cap error (10928) at the time of signing in to a database as this operation would utilize a worker thread underneath Connection.Open call. This may put the application above the worker thread cap threshold. Applications should have built-in logic to handle this error appropriately to handle such cases.

## See Also

[Azure SQL Database Resource Management](https://msdn.microsoft.com/library/azure/dn338083.aspx)

[Error Messages (Azure SQL Database)](https://msdn.microsoft.com/library/azure/ff394106.aspx)

[Azure SQL Database Best Practices to Prevent Request Denials or Connection Termination](https://msdn.microsoft.com/library/azure/dn338082.aspx)

