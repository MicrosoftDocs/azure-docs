---
title: Monitor your workload using DMVs | Microsoft Docs
description: Learn how to monitor your workload using DMVs.
services: sql-data-warehouse
author: ronortloff
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.subservice: manage
ms.date: 04/12/2019
ms.author: rortloff
ms.reviewer: igorstan
---

# Monitor your workload using DMVs
This article describes how to use Dynamic Management Views (DMVs) to monitor your workload. This includes investigating query execution in Azure SQL Data Warehouse.

## Permissions
To query the DMVs in this article, you need either VIEW DATABASE STATE or CONTROL permission. Usually granting VIEW DATABASE STATE is the preferred permission as it is much more restrictive.

```sql
GRANT VIEW DATABASE STATE TO myuser;
```

## Monitor connections
All logins to SQL Data Warehouse are logged to [sys.dm_pdw_exec_sessions][sys.dm_pdw_exec_sessions].  This DMV contains the last 10,000 logins.  The session_id is the primary key and is assigned sequentially for each new logon.

```sql
-- Other Active Connections
SELECT * FROM sys.dm_pdw_exec_sessions where status <> 'Closed' and session_id <> session_id();
```

## Monitor query execution
All queries executed on SQL Data Warehouse are logged to [sys.dm_pdw_exec_requests][sys.dm_pdw_exec_requests].  This DMV contains the last 10,000 queries executed.  The request_id uniquely identifies each query and is the primary key for this DMV.  The request_id is assigned sequentially for each new query and is prefixed with QID, which stands for query ID.  Querying this DMV for a given session_id shows all queries for a given logon.

> [!NOTE]
> Stored procedures use multiple Request IDs.  Request IDs are assigned in sequential order. 
> 
> 

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

-- Find a query with the Label 'My Query'
-- Use brackets when querying the label column, as it it a key word
SELECT  *
FROM    sys.dm_pdw_exec_requests
WHERE   [label] = 'My Query';
```

From the preceding query results, **note the Request ID** of the query that you would like to investigate.

Queries in the **Suspended** state can be queued due to a large number of active running queries. These queries also appear in the [sys.dm_pdw_waits](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-waits-transact-sql) waits query with a type of UserConcurrencyResourceType. For information on concurrency limits, see [Performance tiers](performance-tiers.md) or [Resource classes for workload management](resource-classes-for-workload-management.md). Queries can also wait for other reasons such as for object locks.  If your query is waiting for a resource, see [Investigating queries waiting for resources][Investigating queries waiting for resources] further down in this article.

To simplify the lookup of a query in the [sys.dm_pdw_exec_requests](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-exec-requests-transact-sql) table, use [LABEL][LABEL] to assign a comment to your query that can be looked up in the sys.dm_pdw_exec_requests view.

```sql
-- Query with Label
SELECT *
FROM sys.tables
OPTION (LABEL = 'My Query')
;
```

### STEP 2: Investigate the query plan
Use the Request ID to retrieve the query's distributed SQL (DSQL) plan from [sys.dm_pdw_request_steps][sys.dm_pdw_request_steps].

```sql
-- Find the distributed query plan steps for a specific query.
-- Replace request_id with value from Step 1.

SELECT * FROM sys.dm_pdw_request_steps
WHERE request_id = 'QID####'
ORDER BY step_index;
```

When a DSQL plan is taking longer than expected, the cause can be a complex plan with many DSQL steps or just one step taking a long time.  If the plan is many steps with several move operations, consider optimizing your table distributions to reduce data movement. The [Table distribution][Table distribution] article explains why data must be moved to solve a query and explains some distribution strategies to minimize data movement.

To investigate further details about a single step, the *operation_type* column of the long-running query step and note the **Step Index**:

* Proceed with Step 3a for **SQL operations**: OnOperation, RemoteOperation, ReturnOperation.
* Proceed with Step 3b for **Data Movement operations**: ShuffleMoveOperation, BroadcastMoveOperation, TrimMoveOperation, PartitionMoveOperation, MoveOperation, CopyOperation.

### STEP 3a: Investigate SQL on the distributed databases
Use the Request ID and the Step Index to retrieve details from [sys.dm_pdw_sql_requests][sys.dm_pdw_sql_requests], which contains execution information of the query step on all of the distributed databases.

```sql
-- Find the distribution run times for a SQL step.
-- Replace request_id and step_index with values from Step 1 and 3.

SELECT * FROM sys.dm_pdw_sql_requests
WHERE request_id = 'QID####' AND step_index = 2;
```

When the query step is running, [DBCC PDW_SHOWEXECUTIONPLAN][DBCC PDW_SHOWEXECUTIONPLAN] can be used to retrieve the SQL Server estimated plan from the SQL Server plan cache for the step running on a particular distribution.

```sql
-- Find the SQL Server execution plan for a query running on a specific SQL Data Warehouse Compute or Control node.
-- Replace distribution_id and spid with values from previous query.

DBCC PDW_SHOWEXECUTIONPLAN(1, 78);
```

### STEP 3b: Investigate data movement on the distributed databases
Use the Request ID and the Step Index to retrieve information about a data movement step running on each distribution from [sys.dm_pdw_dms_workers][sys.dm_pdw_dms_workers].

```sql
-- Find the information about all the workers completing a Data Movement Step.
-- Replace request_id and step_index with values from Step 1 and 3.

SELECT * FROM sys.dm_pdw_dms_workers
WHERE request_id = 'QID####' AND step_index = 2;
```

* Check the *total_elapsed_time* column to see if a particular distribution is taking significantly longer than others for data movement.
* For the long-running distribution, check the *rows_processed* column to see if the number of rows being moved from that distribution is significantly larger than others. If so, this finding might indicate skew of your underlying data.

If the query is running, [DBCC PDW_SHOWEXECUTIONPLAN][DBCC PDW_SHOWEXECUTIONPLAN] can be used to retrieve the SQL Server estimated plan from the SQL Server plan cache for the currently running SQL Step within a particular distribution.

```sql
-- Find the SQL Server estimated plan for a query running on a specific SQL Data Warehouse Compute or Control node.
-- Replace distribution_id and spid with values from previous query.

DBCC PDW_SHOWEXECUTIONPLAN(55, 238);
```

<a name="waiting"></a>

## Monitor waiting queries
If you discover that your query is not making progress because it is waiting for a resource, here is a query that shows all the resources a query is waiting for.

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

## Monitor tempdb
Tempdb is used to hold intermediate results during query execution. High utilization of the tempdb database can lead to slow query performance. Each node in Azure SQL Data Warehouse has approximately 1 TB of raw space for tempdb. Below are tips for monitoring tempdb usage and for decreasing tempdb usage in your queries. 

### Monitoring tempdb with views
To monitor tempdb usage, first install the [microsoft.vw_sql_requests](https://github.com/Microsoft/sql-data-warehouse-samples/blob/master/solutions/monitoring/scripts/views/microsoft.vw_sql_requests.sql) view from the [Microsoft Toolkit for SQL Data Warehouse](https://github.com/Microsoft/sql-data-warehouse-samples/tree/master/solutions/monitoring). You can then execute the following query to see the tempdb usage per node for all executed queries:

```sql
-- Monitor tempdb
SELECT
	sr.request_id,
	ssu.session_id,
	ssu.pdw_node_id,
	sr.command,
	sr.total_elapsed_time,
	es.login_name AS 'LoginName',
	DB_NAME(ssu.database_id) AS 'DatabaseName',
	(es.memory_usage * 8) AS 'MemoryUsage (in KB)',
	(ssu.user_objects_alloc_page_count * 8) AS 'Space Allocated For User Objects (in KB)',
	(ssu.user_objects_dealloc_page_count * 8) AS 'Space Deallocated For User Objects (in KB)',
	(ssu.internal_objects_alloc_page_count * 8) AS 'Space Allocated For Internal Objects (in KB)',
	(ssu.internal_objects_dealloc_page_count * 8) AS 'Space Deallocated For Internal Objects (in KB)',
	CASE es.is_user_process
	WHEN 1 THEN 'User Session'
	WHEN 0 THEN 'System Session'
	END AS 'SessionType',
	es.row_count AS 'RowCount'
FROM sys.dm_pdw_nodes_db_session_space_usage AS ssu
	INNER JOIN sys.dm_pdw_nodes_exec_sessions AS es ON ssu.session_id = es.session_id AND ssu.pdw_node_id = es.pdw_node_id
	INNER JOIN sys.dm_pdw_nodes_exec_connections AS er ON ssu.session_id = er.session_id AND ssu.pdw_node_id = er.pdw_node_id
	INNER JOIN microsoft.vw_sql_requests AS sr ON ssu.session_id = sr.spid AND ssu.pdw_node_id = sr.pdw_node_id
WHERE DB_NAME(ssu.database_id) = 'tempdb'
	AND es.session_id <> @@SPID
	AND es.login_name <> 'sa' 
ORDER BY sr.request_id;
```

If you have a query that is consuming a large amount of memory or have received an error message related to allocation of tempdb, it is often due to a very large [CREATE TABLE AS SELECT (CTAS)](https://docs.microsoft.com/sql/t-sql/statements/create-table-as-select-azure-sql-data-warehouse) or [INSERT SELECT](https://docs.microsoft.com/sql/t-sql/statements/insert-transact-sql) statement running that is failing in the final data movement operation. This can usually be identified as a ShuffleMove operation in the distributed query plan right before the final INSERT SELECT.

The most common mitigation is to break your CTAS or INSERT SELECT statement into multiple load statements so the data volume will not exceed the 1TB per node tempdb limit. You can also scale your cluster to a larger size which will spread the tempdb size across more nodes reducing the tempdb on each individual node. 

## Monitor memory

Memory can be the root cause for slow performance and out of memory issues. Consider scaling your data warehouse if you find SQL Server memory usage reaching its limits during query execution.

The following query returns SQL Server memory usage and memory pressure per node:	
```sql
-- Memory consumption
SELECT
  pc1.cntr_value as Curr_Mem_KB, 
  pc1.cntr_value/1024.0 as Curr_Mem_MB,
  (pc1.cntr_value/1048576.0) as Curr_Mem_GB,
  pc2.cntr_value as Max_Mem_KB,
  pc2.cntr_value/1024.0 as Max_Mem_MB,
  (pc2.cntr_value/1048576.0) as Max_Mem_GB,
  pc1.cntr_value * 100.0/pc2.cntr_value AS Memory_Utilization_Percentage,
  pc1.pdw_node_id
FROM
-- pc1: current memory
sys.dm_pdw_nodes_os_performance_counters AS pc1
-- pc2: total memory allowed for this SQL instance
JOIN sys.dm_pdw_nodes_os_performance_counters AS pc2 
ON pc1.object_name = pc2.object_name AND pc1.pdw_node_id = pc2.pdw_node_id
WHERE
pc1.counter_name = 'Total Server Memory (KB)'
AND pc2.counter_name = 'Target Server Memory (KB)'
```
## Monitor transaction log size
The following query returns the transaction log size on each distribution. If one of the log files is reaching 160 GB, you should consider scaling up your instance or limiting your transaction size. 
```sql
-- Transaction log size
SELECT
  instance_name as distribution_db,
  cntr_value*1.0/1048576 as log_file_size_used_GB,
  pdw_node_id 
FROM sys.dm_pdw_nodes_os_performance_counters 
WHERE 
instance_name like 'Distribution_%' 
AND counter_name = 'Log File(s) Used Size (KB)'
```
## Monitor transaction log rollback
If your queries are failing or taking a long time to proceed, you can check and monitor if you have any transactions rolling back.
```sql
-- Monitor rollback
SELECT 
	SUM(CASE WHEN t.database_transaction_next_undo_lsn IS NOT NULL THEN 1 ELSE 0 END),
	t.pdw_node_id,
	nod.[type]
FROM sys.dm_pdw_nodes_tran_database_transactions t
JOIN sys.dm_pdw_nodes nod ON t.pdw_node_id = nod.pdw_node_id
GROUP BY t.pdw_node_id, nod.[type]
```

## Next steps
For more information about DMVs, see [System views][System views].


<!--Image references-->

<!--Article references-->
[SQL Data Warehouse best practices]: ./sql-data-warehouse-best-practices.md
[System views]: ./sql-data-warehouse-reference-tsql-system-views.md
[Table distribution]: ./sql-data-warehouse-tables-distribute.md
[Investigating queries waiting for resources]: ./sql-data-warehouse-manage-monitor.md#waiting

<!--MSDN references-->
[sys.dm_pdw_dms_workers]: https://msdn.microsoft.com/library/mt203878.aspx
[sys.dm_pdw_exec_requests]: https://msdn.microsoft.com/library/mt203887.aspx
[sys.dm_pdw_exec_sessions]: https://msdn.microsoft.com/library/mt203883.aspx
[sys.dm_pdw_request_steps]: https://msdn.microsoft.com/library/mt203913.aspx
[sys.dm_pdw_sql_requests]: https://msdn.microsoft.com/library/mt203889.aspx
[DBCC PDW_SHOWEXECUTIONPLAN]: https://msdn.microsoft.com/library/mt204017.aspx
[DBCC PDW_SHOWSPACEUSED]: https://msdn.microsoft.com/library/mt204028.aspx
[LABEL]: https://msdn.microsoft.com/library/ms190322.aspx
