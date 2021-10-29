---
title: Troubleshoot memory issues 
titleSuffix: Azure SQL Database
description: Provides steps to troubleshoot Azure SQL Database out of memory issues
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.topic: troubleshooting
ms.custom: 
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: 
ms.date: 11/03/2021
---

# Troubleshooting out of memory errors with Azure SQL Database  
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

You may see error messages when the SQL database engine has failed to allocate sufficient memory to run the query. This can be caused by a variety of reasons including the limits of selected service objective, aggregate workload memory demands, and memory demands by the query."

> [!NOTE]
> **This article is focused on Azure SQL Database.** For more on troubleshooting out of memory issues in SQL Server, see [MSSQLSERVER_701](/sql/relational-databases/errors-events/mssqlserver-701-database-engine-error).

Try the following avenues of investigation in response to:

- Error code 701 with error message "There is insufficient system memory in resource pool '%ls' to run this query."
- Error code 802 with error message "There is insufficient memory available in the buffer pool."

## Investigate memory allocation

### Use DMVs to investigate currently executing queries 

In most cases, the query that failed is not the cause of this error. 

The following sample query for Azure SQL Database return important information on transactions that are currently accumulating memory grants or holding open transactions. Look also for queries with large row counts. These filters could help identify a query consuming an unusual amount of memory. 

Target the top queries identified for examination and performance tuning, and evaluate whether or not they are executing as intended. Consider the timing of memory-intensive reporting queries or maintenance operations.

Run the following example queries in the database that experienced the error (not in the `master` database of the Azure SQL logical server).  

```sql
--Sessions with open transactions or memory grants
SELECT
--Session connection information 
  s.[session_id], s.open_transaction_count, s.host_name, s.program_name, s.login_name, s.client_interface_name, s.is_user_process
--Session history and status
, s.last_request_start_time, s.last_request_end_time, s.reads, s.writes, s.logical_reads, session_status = s.[status], request_status = r.status
--Query 
, query_text = t.text, input_buffer = ib.event_info, query_plan_xml = qp.query_plan, request_row_count = r.row_count, session_row_count = s.row_count
--Memory usage
, r.granted_query_memory, mg.grant_time, mg.requested_memory_kb, mg.granted_memory_kb, mg.required_memory_kb, mg.used_memory_kb, mg.max_used_memory_kb     
FROM sys.dm_exec_sessions s 
LEFT OUTER JOIN sys.dm_exec_requests AS r 
    ON r.[session_id] = s.[session_id]
LEFT OUTER JOIN sys.dm_exec_query_memory_grants AS mg 
    ON mg.[session_id] = s.[session_id]
OUTER APPLY sys.dm_exec_sql_text (r.[sql_handle]) AS t
OUTER APPLY sys.dm_exec_input_buffer(s.[session_id], NULL) AS ib 
OUTER APPLY sys.dm_exec_query_plan (r.[plan_handle]) AS qp 
WHERE mg.granted_memory_kb > 0 OR s.open_transaction_count > 0 
ORDER BY mg.granted_memory_kb desc, mg.requested_memory_kb desc, r.row_count desc;
```

### Use Query Store to investigate past queries

While the previous sample query reports only live query results, the following query leverages the [Query Store](/sql/relational-databases/performance/monitoring-performance-by-using-the-query-store) to return information on past query execution. 

The following sample query for Azure SQL Database return important information on query executions recorded by the Query Store. Target the top queries identified for examination and performance tuning, and evaluate whether or not they are executing as intended. 

```sql
WITH XMLNAMESPACES
    (DEFAULT 'http://schemas.microsoft.com/sqlserver/2004/07/showplan')   
SELECT DISTINCT TOP 10 PERCENT
  StatementText = Stmt.value('(@StatementText)[1]', 'nvarchar(4000)') 
--Plan memory information
, Plan_RequiredMemory = Stmt.value('(QueryPlan/MemoryGrantInfo/@SerialRequiredMemory)[1]', 'int') 
, Plan_DesiredMemory = Stmt.value('(QueryPlan/MemoryGrantInfo/@SerialDesiredMemory)[1]', 'int') 
, qsp.plan_id, qsp.query_id, qsp.plan_group_id, qsp.query_plan
--Query info from Query Store
, qsp.last_execution_time
, query_count_executions = sum(qsrs.count_executions) OVER (PARTITION BY qsp.query_id)
, qsrs.avg_query_max_used_memory
, qsrs.last_query_max_used_memory
, qsrs.min_query_max_used_memory
, qsrs.max_query_max_used_memory
, qsrs.stdev_query_max_used_memory 
FROM (SELECT query_plan_xml = CAST(query_plan as xml), * FROM sys.query_store_plan) AS qsp
CROSS APPLY qsp.query_plan_xml.nodes('/ShowPlanXML/BatchSequence/Batch/Statements/StmtSimple') AS nodes(Stmt)
INNER JOIN sys.query_store_query AS qsq
    ON qsp.query_id = qsq.query_id
INNER JOIN sys.query_store_query_text AS qsqt
    ON qsq.query_text_id = qsqt.query_text_id 
INNER JOIN sys.query_store_runtime_stats AS qsrs
    ON qsp.plan_id = qsrs.plan_id 
WHERE DATEADD(hour, -24, sysdatetime()) > qsp.last_execution_time --past 24 hours
ORDER BY Plan_RequiredMemory DESC, Plan_DesiredMemory DESC;
```

### Extended events
In addition to the previous information, it may be helpful to capture a trace of the activities on the server to thoroughly investigate an out of memory issue in Azure SQL Database. 

There are two ways to capture traces in SQL Server; Extended Events (XEvents) and Profiler Traces. However, [SQL Server Profiler](/sql/tools/sql-server-profiler/sql-server-profiler)
is deprecated trace technology not supported for Azure SQL Database. [Extended Events](/sql/relational-databases/extended-events/extended-events) is the newer tracing technology that allows more versatility and less impact to the observed system, and its interface is integrated into SQL Server Management Studio (SSMS). 

Refer to the document that explains how to use the [Extended Events New Session Wizard](/sql/relational-databases/extended-events/quick-start-extended-events-in-sql-server) in SSMS. For Azure SQL databases however, SSMS provides an Extended Events subfolder under each database in Object Explorer. Use an Extended Events session wizard to capture these useful events, and identify the queries generating them: 

-   Category Errors:
    - hash_spill_details
    - exchange_spill

-   Category Execution:
    - excessive_non_grant_memory_used

-   Category Memory:
    - query_memory_grant_blocking
    - query_memory_grant_usage


### In-memory OLTP out of memory 

You may encounter Error code 41805: There is insufficient memory in the resource pool '%ls' to run this operation on memory-optimized tables. Reduce the amount of data in memory-optimized tables, or scale up the database to a higher service objective to have more memory. For more information on out of memory issues with SQL Server In-Memory OLTP, see [Resolve Out Of Memory issues](/sql/relational-databases/in-memory-oltp/resolve-out-of-memory-issues).

## Next steps

- [Intelligent query processing in SQL databases](/sql/relational-databases/performance/intelligent-query-processing)
- [Query processing architecture guide](/sql/relational-databases/query-processing-architecture-guide)    
- [Performance Center for SQL Server Database Engine and Azure SQL Database](/sql/relational-databases/performance/performance-center-for-sql-server-database-engine-and-azure-sql-database.md)  
- [Troubleshooting connectivity issues and other errors with Azure SQL Database and Azure SQL Managed Instance](troubleshoot-common-errors-issues.md)
- [Troubleshoot transient connection errors in SQL Database and SQL Managed Instance](troubleshoot-common-connectivity-issues.md)
- [Demonstrating Intelligent Query Processing](https://github.com/Microsoft/sql-server-samples/tree/master/samples/features/intelligent-query-processing)   

