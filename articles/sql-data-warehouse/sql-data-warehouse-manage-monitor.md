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
   ms.date="04/14/2016"
   ms.author="sonyama;barbkess;sahajs"/>

# Monitor your workload using DMVs

This article describes how to use Dynamic Management Views (DMVs) to monitor your workload and investigate query execution in Azure SQL Data Warehouse.

## Monitor Connections

The [sys.dm_pdw_exec_sessions][] view allows you to monitor connections to your Azure SQL Data Warehouse database.  This view contains active sessions as well as a history of recently disconnected sessions.  The session_id is the primary key for this view and is assigned sequentially for each new logon.

```sql
SELECT * FROM sys.dm_pdw_exec_sessions where status <> 'Closed';
```

## Investigate Query Execution
To monitor query execution, start with [sys.dm_pdw_exec_requests][].  This view contains queries in progress as well as a history of queries which have recently completed.  The request_id uniquely identifies each query and is the primary key for this view.  The request_id is assigned sequentially for each new query.  Qyerying this table for a given session_id will show all queries for a given logon.

In the scenario where you would like to investigate query execution for a particular query, here are some common steps to follow.

### STEP 1: Find the query to investigate

```sql
-- Monitor running queries
SELECT * FROM sys.dm_pdw_exec_requests WHERE status = 'Running';

-- Find the 10 longest running queries
SELECT TOP 10 * FROM sys.dm_pdw_exec_requests ORDER BY total_elapsed_time DESC;
```

Note the Request ID of the query which you would like to investigate.

### STEP 2: Check if the query is waiting for resources

```sql
-- Find waiting tasks for your session.
-- Replace request_id with value from Step 1.

SELECT waits.session_id,
      waits.request_id,  
      requests.command,
      requests.status,
      requests.start_time,  
      waits.type,  
      waits.object_type,
      waits.object_name,  
      waits.state  
FROM   sys.dm_pdw_waits waits
   JOIN  sys.dm_pdw_exec_requests requests
   ON waits.request_id=requests.request_id
WHERE waits.request_id = 'QID33188'
ORDER BY waits.object_name, waits.object_type, waits.state;
```

The results of the above query will show you the wait state of your query.

- If the query is waiting on resources from another query, then the state will be **AcquireResources**.
- If the query has all the required resources and is not waiting, then the state will be **Granted**.  In this case, proceed to look at the query steps.

### STEP 3: Find the longest running step of the query plan

Use the Request ID to retrieve a list of the query plan steps from [sys.dm_pdw_request_steps][]. Find the long-running step by looking at the total elapsed time.

```sql

-- Find the distributed query plan steps for a specific query.
-- Replace request_id with value from Step 1.

SELECT * FROM sys.dm_pdw_request_steps
WHERE request_id = 'QID33209'
ORDER BY step_index;
```

Save the Step Index of the long-running step.

Check the *operation_type* column of the long-running query step:

- Proceed with Step 4a for **SQL operations**: OnOperation, RemoteOperation, ReturnOperation.
- Proceed with Step 4b for **Data Movement operations**: ShuffleMoveOperation, BroadcastMoveOperation, TrimMoveOperation, PartitionMoveOperation, MoveOperation, CopyOperation.

### STEP 4a: Find the execution progress of a SQL Step

Use the Request ID and the Step Index to retrieve information from [sys.dm_pdw_sql_requests][] which contains details on the execution of the query on the distributed instances of SQL Server. Note the the Distribution ID and SPID if the query is still running and you wish to get the plan from the SQL Server distribution.

```sql
-- Find the distribution run times for a SQL step.
-- Replace request_id and step_index with values from Step 1 and 3.

SELECT * FROM sys.dm_pdw_sql_requests
WHERE request_id = 'QID33209' AND step_index = 2;
```


If the query is currently running, [DBCC PDW_SHOWEXECUTIONPLAN][] can be used to retrieve the SQL Server execution plan for the currently running SQL Step for a particular distribution.

```sql
-- Find the SQL Server execution plan for a query running on a specific SQL Data Warehouse Compute or Control node.
-- Replace distribution_id and spid with values from previous query.

DBCC PDW_SHOWEXECUTIONPLAN(1, 78);

```

### STEP 4b: Find the execution progress of a DMS Step

Use the Request ID and the Step Index to retrieve information about the Data Movement Step running on each distribution from [sys.dm_pdw_dms_workers][].

```sql
-- Find the information about all the workers completing a Data Movement Step.
-- Replace request_id and step_index with values from Step 1 and 3.

SELECT * FROM sys.dm_pdw_dms_workers
WHERE request_id = 'QID33209' AND step_index = 2;

```

- Check the *total_elapsed_time* column to see if a particular distribution is taking significantly longer than others for data movement.
- For the long-running distribution, check the *rows_processed* column to see if the number of rows being moved from that distribution is significantly larger than others. If so, this may indicate skew of your underlying data.

If the query is currently running, [DBCC PDW_SHOWEXECUTIONPLAN][] can be used to retrieve the SQL Server execution plan for the currently running DMS Step for a particular distribution.

```sql
-- Find the SQL Server execution plan for a query running on a specific SQL Data Warehouse Compute or Control node.
-- Replace distribution_id and spid with values from previous query.

DBCC PDW_SHOWEXECUTIONPLAN(55, 238);

```

## Next steps
For more information on Transact-SQL and Dynamic Management Views (DMVs), see [reference overview][]
For more tips on managing your SQL Data Warehouse, see [manage overview][].

<!--Image references-->

<!--Article references-->
[manage overview]: sql-data-warehouse-overview-manage.md
[table design]: sql-data-warehouse-develop-table-design.md
[reference overview]: sql-data-warehouse-overview-reference.md
[manage data skew for distributed tables]: sql-data-warehouse-manage-distributed-data-skew.md

<!--MSDN references-->
[sys.dm_pdw_dms_workers]: http://msdn.microsoft.com/library/mt203878.aspx
[sys.dm_pdw_exec_requests]: http://msdn.microsoft.com/library/mt203887.aspx
[sys.dm_pdw_exec_sessions]: http://msdn.microsoft.com/library/mt203883.aspx
[sys.dm_pdw_request_steps]: http://msdn.microsoft.com/library/mt203913.aspx
[sys.dm_pdw_sql_requests]: http://msdn.microsoft.com/library/mt203889.aspx
[DBCC PDW_SHOWEXECUTIONPLAN]: http://msdn.microsoft.com/library/mt204017.aspx
[DBCC PDW_SHOWSPACEUSED]: http://msdn.microsoft.com/library/mt204028.aspx
