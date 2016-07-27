<properties
   pageTitle="Monitor your workload using DMVs | Microsoft Azure"
   description="Learn how to monitor your workload using DMVs."
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
   ms.date="07/22/2016"
   ms.author="sonyama;barbkess;sahajs"/>

# Monitor your workload using DMVs

This article describes how to use Dynamic Management Views (DMVs) to monitor your workload and investigate query execution in Azure SQL Data Warehouse.

## Monitor connections

The [sys.dm_pdw_exec_sessions][] view allows you to monitor connections to your Azure SQL Data Warehouse database.  This view contains active sessions as well as a history of recently disconnected sessions.  The session_id is the primary key for this view and is assigned sequentially for each new logon.

```sql
SELECT * FROM sys.dm_pdw_exec_sessions where status <> 'Closed';
```

## Monitor query execution

To monitor query execution, start with [sys.dm_pdw_exec_requests][].  This view contains queries in progress as well as a history of queries which have recently completed.  The request_id uniquely identifies each query and is the primary key for this view.  The request_id is assigned sequentially for each new query.  Querying this table for a given session_id will show all queries for a given logon.

>[AZURE.NOTE] Stored procedures use multiple request_ids.  The request ids will be assigned in sequencial order. 

Here are steps to follow to investigate query execution plans and times for a particular query.

### STEP 1: Identify the query you wish to investigate

```sql
-- Monitor active queries
SELECT * 
FROM sys.dm_pdw_exec_requests 
WHERE status not in ('Completed','Failed','Cancelled')
  AND session_id <> session_id()
ORDER BY submit_time DESC;

-- Find top 10 queries longest running queries
SELECT TOP 10 * 
FROM sys.dm_pdw_exec_requests 
ORDER BY total_elapsed_time DESC;
```

From the above query results, **note the Request ID** of the query which you would like to investigate.

Queries in the Suspended state are being queued due to concurrency limits which is explained in detail in [Concurrency and workload management][].  These queries will also appear in the sys.dm_pdw_waits waits query with a type of UserConcurrencyResourceType.  Queries can also wait for other reasons such as for locks.  If your query is waiting for a resource, see [Investigating queries waiting for resources][].

### STEP 2: Find the longest running step of the query plan

Use the Request ID to retrieve a list of the query plan steps from [sys.dm_pdw_request_steps][]. Find the long-running step by looking at the total elapsed time.

```sql
-- Find the distributed query plan steps for a specific query.
-- Replace request_id with value from Step 1.

SELECT * FROM sys.dm_pdw_request_steps
WHERE request_id = 'QID####'
ORDER BY step_index;
```

Check the *operation_type* column of the long-running query step and note the **Step Index**:

- Proceed with Step 3a for **SQL operations**: OnOperation, RemoteOperation, ReturnOperation.
- Proceed with Step 3b for **Data Movement operations**: ShuffleMoveOperation, BroadcastMoveOperation, TrimMoveOperation, PartitionMoveOperation, MoveOperation, CopyOperation.

### STEP 3a: Find the execution progress of a SQL step

Use the Request ID and the Step Index to retrieve details from [sys.dm_pdw_sql_requests][] which contains information on the execution of the query on each distributed instances of SQL Server.

```sql
-- Find the distribution run times for a SQL step.
-- Replace request_id and step_index with values from Step 1 and 3.

SELECT * FROM sys.dm_pdw_sql_requests
WHERE request_id = 'QID####' AND step_index = 2;
```

If the query is running, [DBCC PDW_SHOWEXECUTIONPLAN][] can be used to retrieve the SQL Server estimated plan from the SQL Server plan cache for the currently running SQL Step within a particular distribution.

```sql
-- Find the SQL Server execution plan for a query running on a specific SQL Data Warehouse Compute or Control node.
-- Replace distribution_id and spid with values from previous query.

DBCC PDW_SHOWEXECUTIONPLAN(1, 78);
```

### STEP 3b: Find the execution progress of a DMS step

Use the Request ID and the Step Index to retrieve information about the Data Movement Step running on each distribution from [sys.dm_pdw_dms_workers][].

```sql
-- Find the information about all the workers completing a Data Movement Step.
-- Replace request_id and step_index with values from Step 1 and 3.

SELECT * FROM sys.dm_pdw_dms_workers
WHERE request_id = 'QID####' AND step_index = 2;
```

- Check the *total_elapsed_time* column to see if a particular distribution is taking significantly longer than others for data movement.
- For the long-running distribution, check the *rows_processed* column to see if the number of rows being moved from that distribution is significantly larger than others. If so, this may indicate skew of your underlying data.

If the query is running, [DBCC PDW_SHOWEXECUTIONPLAN][] can be used to retrieve the SQL Server estimated plan from the SQL Server plan cache for the currently running SQL Step within a particular distribution.

```sql
-- Find the SQL Server estimated plan for a query running on a specific SQL Data Warehouse Compute or Control node.
-- Replace distribution_id and spid with values from previous query.

DBCC PDW_SHOWEXECUTIONPLAN(55, 238);
```

<a name="waiting"></a>
## Monitor waiting queries

If you discover that your query is not making progress because it is waiting for a resource, here is a query which shows you all reasources a query is waiting for.  Repe

```sql
-- Find queries 
-- Replace request_id with value from Step 1.

SELECT waits.session_id,
      waits.request_id,  
      requests.command,
      requests.status,
      requests.start_time,  
      waits.type,
      waits.state,
      waits.object_type,
      waits.object_name
FROM   sys.dm_pdw_waits waits
   JOIN  sys.dm_pdw_exec_requests requests
   ON waits.request_id=requests.request_id
WHERE waits.request_id = 'QID####'
ORDER BY waits.object_name, waits.object_type, waits.state;
```

If the query is actively waiting on resources from another query, then the state will be **AcquireResources**.  If the query has all the required resources, then the state will be **Granted**.

## Next steps
For more information on Dynamic Management Views (DMVs), see [System views][].  
For tips on managing your SQL Data Warehouse, see [Manage overview][].  
For best practices, see [SQL Data Warehouse best practices][].

<!--Image references-->

<!--Article references-->
[Manage overview]: ./sql-data-warehouse-overview-manage.md
[SQL Data Warehouse best practices]: ./sql-data-warehouse-best-practices.md
[System views]: ./sql-data-warehouse-reference-tsql-system-views.md
[Concurrency and workload management]: ./sql-data-warehouse-develop-concurrency.md
[Investigating queries waiting for resources]: ./sql-data-warehouse-manage-monitor.md#waiting

<!--MSDN references-->
[sys.dm_pdw_dms_workers]: http://msdn.microsoft.com/library/mt203878.aspx
[sys.dm_pdw_exec_requests]: http://msdn.microsoft.com/library/mt203887.aspx
[sys.dm_pdw_exec_sessions]: http://msdn.microsoft.com/library/mt203883.aspx
[sys.dm_pdw_request_steps]: http://msdn.microsoft.com/library/mt203913.aspx
[sys.dm_pdw_sql_requests]: http://msdn.microsoft.com/library/mt203889.aspx
[DBCC PDW_SHOWEXECUTIONPLAN]: http://msdn.microsoft.com/library/mt204017.aspx
[DBCC PDW_SHOWSPACEUSED]: http://msdn.microsoft.com/library/mt204028.aspx
