---
title: Monitoring performance Azure SQL Database Using DMVs | Microsoft Docs
description: Learn how to detect and diagnose common performance problems by using dynamic management views to monitor Microsoft Azure SQL Database.
services: sql-database
ms.service: sql-database
ms.subservice: performance
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: juliemsft
ms.author: jrasnick
ms.reviewer: carlrab
manager: craigg
ms.date: 12/19/2018
---
# Monitoring performance Azure SQL Database using dynamic management views

Microsoft Azure SQL Database enables a subset of dynamic management views to diagnose performance problems, which might be caused by blocked or long-running queries, resource bottlenecks, poor query plans, and so on. This topic provides information on how to detect common performance problems by using dynamic management views.

SQL Database partially supports three categories of dynamic management views:

- Database-related dynamic management views.
- Execution-related dynamic management views.
- Transaction-related dynamic management views.

For detailed information on dynamic management views, see [Dynamic Management Views and Functions (Transact-SQL)](https://msdn.microsoft.com/library/ms188754.aspx) in SQL Server Books Online.

## Permissions

In SQL Database, querying a dynamic management view requires **VIEW DATABASE STATE** permissions. The **VIEW DATABASE STATE** permission returns information about all objects within the current database.
To grant the **VIEW DATABASE STATE** permission to a specific database user, run the following query:

```sql
GRANT VIEW DATABASE STATE TO database_user;
```

In an instance of on-premises SQL Server, dynamic management views return server state information. In SQL Database, they return information regarding your current logical database only.

## Identify CPU performance issues

If CPU consumption is above 80% for extended periods of time, consider the following troubleshooting steps:

### The CPU issue is occurring now

If issue is occurring right now, there are two possible scenarios:

#### Many individual queries that cumulatively consume high CPU

Use the following query to identify top query hashes:

```sql
PRINT '-- top 10 Active CPU Consuming Queries (aggregated)--';
SELECT TOP 10 GETDATE() runtime, *
FROM(SELECT query_stats.query_hash, SUM(query_stats.cpu_time) 'Total_Request_Cpu_Time_Ms', SUM(logical_reads) 'Total_Request_Logical_Reads', MIN(start_time) 'Earliest_Request_start_Time', COUNT(*) 'Number_Of_Requests', SUBSTRING(REPLACE(REPLACE(MIN(query_stats.statement_text), CHAR(10), ' '), CHAR(13), ' '), 1, 256) AS "Statement_Text"
     FROM(SELECT req.*, SUBSTRING(ST.text, (req.statement_start_offset / 2)+1, ((CASE statement_end_offset WHEN -1 THEN DATALENGTH(ST.text)ELSE req.statement_end_offset END-req.statement_start_offset)/ 2)+1) AS statement_text
          FROM sys.dm_exec_requests AS req
               CROSS APPLY sys.dm_exec_sql_text(req.sql_handle) AS ST ) AS query_stats
     GROUP BY query_hash) AS t
ORDER BY Total_Request_Cpu_Time_Ms DESC;
```

#### Long running queries that consume CPU are still running

Use the following query to identify these queries:

```sql
PRINT '--top 10 Active CPU Consuming Queries by sessions--';
SELECT TOP 10 req.session_id, req.start_time, cpu_time 'cpu_time_ms', OBJECT_NAME(ST.objectid, ST.dbid) 'ObjectName', SUBSTRING(REPLACE(REPLACE(SUBSTRING(ST.text, (req.statement_start_offset / 2)+1, ((CASE statement_end_offset WHEN -1 THEN DATALENGTH(ST.text)ELSE req.statement_end_offset END-req.statement_start_offset)/ 2)+1), CHAR(10), ' '), CHAR(13), ' '), 1, 512) AS statement_text
FROM sys.dm_exec_requests AS req
     CROSS APPLY sys.dm_exec_sql_text(req.sql_handle) AS ST
ORDER BY cpu_time DESC;
GO
```

### The CPU issue occurred in the past

If the issue occurred in the past and you want to do root cause analysis, use [Query Store](https://docs.microsoft.com/sql/relational-databases/performance/monitoring-performance-by-using-the-query-store). Users with database access can use T-SQL to query Query Store data.  Query Store default configurations use a granularity of 1 hour.  Use the following query to look at activity for high CPU consuming queries. This query returns the top 15 CPU consuming queries.  Remember to change `rsi.start_time >= DATEADD(hour, -2, GETUTCDATE()`:

```sql
-- Top 15 CPU consuming queries by query hash
-- note that a query  hash can have many query id if not parameterized or not parameterized properly
-- it grabs a sample query text by min
WITH AggregatedCPU AS (SELECT q.query_hash, SUM(count_executions * avg_cpu_time / 1000.0) AS total_cpu_millisec, SUM(count_executions * avg_cpu_time / 1000.0)/ SUM(count_executions) AS avg_cpu_millisec, MAX(rs.max_cpu_time / 1000.00) AS max_cpu_millisec, MAX(max_logical_io_reads) max_logical_reads, COUNT(DISTINCT p.plan_id) AS number_of_distinct_plans, COUNT(DISTINCT p.query_id) AS number_of_distinct_query_ids, SUM(CASE WHEN rs.execution_type_desc='Aborted' THEN count_executions ELSE 0 END) AS Aborted_Execution_Count, SUM(CASE WHEN rs.execution_type_desc='Regular' THEN count_executions ELSE 0 END) AS Regular_Execution_Count, SUM(CASE WHEN rs.execution_type_desc='Exception' THEN count_executions ELSE 0 END) AS Exception_Execution_Count, SUM(count_executions) AS total_executions, MIN(qt.query_sql_text) AS sampled_query_text
                       FROM sys.query_store_query_text AS qt
                            JOIN sys.query_store_query AS q ON qt.query_text_id=q.query_text_id
                            JOIN sys.query_store_plan AS p ON q.query_id=p.query_id
                            JOIN sys.query_store_runtime_stats AS rs ON rs.plan_id=p.plan_id
                            JOIN sys.query_store_runtime_stats_interval AS rsi ON rsi.runtime_stats_interval_id=rs.runtime_stats_interval_id
                       WHERE rs.execution_type_desc IN ('Regular', 'Aborted', 'Exception')AND rsi.start_time>=DATEADD(HOUR, -2, GETUTCDATE())
                       GROUP BY q.query_hash), OrderedCPU AS (SELECT query_hash, total_cpu_millisec, avg_cpu_millisec, max_cpu_millisec, max_logical_reads, number_of_distinct_plans, number_of_distinct_query_ids, total_executions, Aborted_Execution_Count, Regular_Execution_Count, Exception_Execution_Count, sampled_query_text, ROW_NUMBER() OVER (ORDER BY total_cpu_millisec DESC, query_hash ASC) AS RN
                                                              FROM AggregatedCPU)
SELECT OD.query_hash, OD.total_cpu_millisec, OD.avg_cpu_millisec, OD.max_cpu_millisec, OD.max_logical_reads, OD.number_of_distinct_plans, OD.number_of_distinct_query_ids, OD.total_executions, OD.Aborted_Execution_Count, OD.Regular_Execution_Count, OD.Exception_Execution_Count, OD.sampled_query_text, OD.RN
FROM OrderedCPU AS OD
WHERE OD.RN<=15
ORDER BY total_cpu_millisec DESC;
```

Once you identify the problematic queries, it's time to tune those queries to reduce CPU utilization.  If you don't have time to tune the queries, you may also choose to upgrade the SLO of the database to work around the issue.

## Identify IO performance issues

When identifying IO performance issues, the top wait types associated with IO issues are:

- `PAGEIOLATCH_*`

  For data file IO issues (including `PAGEIOLATCH_SH`, `PAGEIOLATCH_EX`, `PAGEIOLATCH_UP`).  If the wait type name has **IO** in it, it points to an IO issue. If there is no **IO** in the page latch wait name, it points to a different type of problem (for example, tempdb contention).

- `WRITE_LOG`

  For transaction log IO issues.

### If the IO issue is occurring right now

Use the [sys.dm_exec_requests](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-requests-transact-sql) or [sys.dm_os_waiting_tasks](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-os-waiting-tasks-transact-sql) to see the `wait_type` and `wait_time`.

#### Identify data and log IO usage

Use the following query to identify data and log IO usage. If the data or log IO is above 80%, it means users have used the available IO for the SQL DB service tier.

```sql
SELECT end_time, avg_data_io_percent, avg_log_write_percent
FROM sys.dm_db_resource_stats
ORDER BY end_time DESC;
```

If the IO limit has been reached, you have two options:

- Option 1: Upgrade the compute size or service tier
- Option 2: Identify and tune the queries consuming the most IO.

#### View buffer-related IO using the Query Store

For option 2, you can use the following query against Query Store for buffer-related IO to view the last two hours of tracked activity:

```sql
-- top queries that waited on buffer
-- note these are finished queries
WITH Aggregated AS (SELECT q.query_hash, SUM(total_query_wait_time_ms) total_wait_time_ms, SUM(total_query_wait_time_ms / avg_query_wait_time_ms) AS total_executions, MIN(qt.query_sql_text) AS sampled_query_text, MIN(wait_category_desc) AS wait_category_desc
                    FROM sys.query_store_query_text AS qt
                         JOIN sys.query_store_query AS q ON qt.query_text_id=q.query_text_id
                         JOIN sys.query_store_plan AS p ON q.query_id=p.query_id
                         JOIN sys.query_store_wait_stats AS waits ON waits.plan_id=p.plan_id
                         JOIN sys.query_store_runtime_stats_interval AS rsi ON rsi.runtime_stats_interval_id=waits.runtime_stats_interval_id
                    WHERE wait_category_desc='Buffer IO' AND rsi.start_time>=DATEADD(HOUR, -2, GETUTCDATE())
                    GROUP BY q.query_hash), Ordered AS (SELECT query_hash, total_executions, total_wait_time_ms, sampled_query_text, wait_category_desc, ROW_NUMBER() OVER (ORDER BY total_wait_time_ms DESC, query_hash ASC) AS RN
                                                        FROM Aggregated)
SELECT OD.query_hash, OD.total_executions, OD.total_wait_time_ms, OD.sampled_query_text, OD.wait_category_desc, OD.RN
FROM Ordered AS OD
WHERE OD.RN<=15
ORDER BY total_wait_time_ms DESC;
GO
```

#### View total log IO for WRITELOG waits

If the wait type is `WRITELOG`, use the following query to view total log IO by statement:

```sql
-- Top transaction log consumers
-- Adjust the time window by changing
-- rsi.start_time >= DATEADD(hour, -2, GETUTCDATE())
WITH AggregatedLogUsed
AS (SELECT q.query_hash,
           SUM(count_executions * avg_cpu_time / 1000.0) AS total_cpu_millisec,
           SUM(count_executions * avg_cpu_time / 1000.0) / SUM(count_executions) AS avg_cpu_millisec,
           SUM(count_executions * avg_log_bytes_used) AS total_log_bytes_used,
           MAX(rs.max_cpu_time / 1000.00) AS max_cpu_millisec,
           MAX(max_logical_io_reads) max_logical_reads,
           COUNT(DISTINCT p.plan_id) AS number_of_distinct_plans,
           COUNT(DISTINCT p.query_id) AS number_of_distinct_query_ids,
           SUM(   CASE
                      WHEN rs.execution_type_desc = 'Aborted' THEN
                          count_executions
                      ELSE
                          0
                  END
              ) AS Aborted_Execution_Count,
           SUM(   CASE
                      WHEN rs.execution_type_desc = 'Regular' THEN
                          count_executions
                      ELSE
                          0
                  END
              ) AS Regular_Execution_Count,
           SUM(   CASE
                      WHEN rs.execution_type_desc = 'Exception' THEN
                          count_executions
                      ELSE
                          0
                  END
              ) AS Exception_Execution_Count,
           SUM(count_executions) AS total_executions,
           MIN(qt.query_sql_text) AS sampled_query_text
    FROM sys.query_store_query_text AS qt
        JOIN sys.query_store_query AS q
            ON qt.query_text_id = q.query_text_id
        JOIN sys.query_store_plan AS p
            ON q.query_id = p.query_id
        JOIN sys.query_store_runtime_stats AS rs
            ON rs.plan_id = p.plan_id
        JOIN sys.query_store_runtime_stats_interval AS rsi
            ON rsi.runtime_stats_interval_id = rs.runtime_stats_interval_id
    WHERE rs.execution_type_desc IN ( 'Regular', 'Aborted', 'Exception' )
          AND rsi.start_time >= DATEADD(HOUR, -2, GETUTCDATE())
    GROUP BY q.query_hash),
     OrderedLogUsed
AS (SELECT query_hash,
           total_log_bytes_used,
           number_of_distinct_plans,
           number_of_distinct_query_ids,
           total_executions,
           Aborted_Execution_Count,
           Regular_Execution_Count,
           Exception_Execution_Count,
           sampled_query_text,
           ROW_NUMBER() OVER (ORDER BY total_log_bytes_used DESC, query_hash ASC) AS RN
    FROM AggregatedLogUsed)
SELECT OD.total_log_bytes_used,
       OD.number_of_distinct_plans,
       OD.number_of_distinct_query_ids,
       OD.total_executions,
       OD.Aborted_Execution_Count,
       OD.Regular_Execution_Count,
       OD.Exception_Execution_Count,
       OD.sampled_query_text,
       OD.RN
FROM OrderedLogUsed AS OD
WHERE OD.RN <= 15
ORDER BY total_log_bytes_used DESC;
GO
```

## Identify `tempdb` performance issues

When identifying IO performance issues, the top wait types associated with `tempdb` issues is `PAGELATCH_*` (not `PAGEIOLATCH_*`). However, `PAGELATCH_*` waits do not always mean you have `tempdb` contention.  This wait may also mean that you have user-object data page contention due to concurrent requests targeting the same data page. To further confirm `tempdb` contention, use [sys.dm_exec_requests](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-requests-transact-sql) to confirm that the wait_resource value begins with `2:x:y` where 2 is `tempdb` is the database id, `x` is the file id, and `y` is the page id.  

For tempdb contention, a common method is to reduce or re-write application code that relies on `tempdb`.  Common `tempdb` usage areas include:

- Temp tables
- Table variables
- Table valued parameters
- Version store usage (specifically associated with long running transactions)
- Queries that have query plans that use sorts, hash joins, and spools

### Top queries that use table variables and temporary tables

Use the following query to identify top queries that use table variables and temporary tables:

```sql
SELECT plan_handle, execution_count, query_plan
INTO #tmpPlan
FROM sys.dm_exec_query_stats
     CROSS APPLY sys.dm_exec_query_plan(plan_handle);
GO

WITH XMLNAMESPACES('http://schemas.microsoft.com/sqlserver/2004/07/showplan' AS sp)
SELECT plan_handle, stmt.stmt_details.value('@Database', 'varchar(max)') 'Database', stmt.stmt_details.value('@Schema', 'varchar(max)') 'Schema', stmt.stmt_details.value('@Table', 'varchar(max)') 'table'
INTO #tmp2
FROM(SELECT CAST(query_plan AS XML) sqlplan, plan_handle FROM #tmpPlan) AS p
    CROSS APPLY sqlplan.nodes('//sp:Object') AS stmt(stmt_details);
GO

SELECT t.plan_handle, [Database], [Schema], [table], execution_count
FROM(SELECT DISTINCT plan_handle, [Database], [Schema], [table]
     FROM #tmp2
     WHERE [table] LIKE '%@%' OR [table] LIKE '%#%') AS t
    JOIN #tmpPlan AS t2 ON t.plan_handle=t2.plan_handle;
```

### Identify long running transactions

Use the following query to identify long running transactions. Long running transactions prevent version store cleanup.

```sql
SELECT DB_NAME(dtr.database_id) 'database_name',
       sess.session_id,
       atr.name AS 'tran_name',
       atr.transaction_id,
       transaction_type,
       transaction_begin_time,
       database_transaction_begin_time transaction_state,
       is_user_transaction,
       sess.open_transaction_count,
       LTRIM(RTRIM(REPLACE(
                              REPLACE(
                                         SUBSTRING(
                                                      SUBSTRING(
                                                                   txt.text,
                                                                   (req.statement_start_offset / 2) + 1,
                                                                   ((CASE req.statement_end_offset
                                                                         WHEN -1 THEN
                                                                             DATALENGTH(txt.text)
                                                                         ELSE
                                                                             req.statement_end_offset
                                                                     END - req.statement_start_offset
                                                                    ) / 2
                                                                   ) + 1
                                                               ),
                                                      1,
                                                      1000
                                                  ),
                                         CHAR(10),
                                         ' '
                                     ),
                              CHAR(13),
                              ' '
                          )
                  )
            ) Running_stmt_text,
       recenttxt.text 'MostRecentSQLText'
FROM sys.dm_tran_active_transactions AS atr
    INNER JOIN sys.dm_tran_database_transactions AS dtr
        ON dtr.transaction_id = atr.transaction_id
    LEFT JOIN sys.dm_tran_session_transactions AS sess
        ON sess.transaction_id = atr.transaction_id
    LEFT JOIN sys.dm_exec_requests AS req
        ON req.session_id = sess.session_id
           AND req.transaction_id = sess.transaction_id
    LEFT JOIN sys.dm_exec_connections AS conn
        ON sess.session_id = conn.session_id
    OUTER APPLY sys.dm_exec_sql_text(req.sql_handle) AS txt
    OUTER APPLY sys.dm_exec_sql_text(conn.most_recent_sql_handle) AS recenttxt
WHERE atr.transaction_type != 2
      AND sess.session_id != @@spid
ORDER BY start_time ASC;
```

## Identify memory grant wait performance issues

If your top wait type is `RESOURCE_SEMAHPORE` and you don't have a high CPU usage issue, you may have a memory grant waiting issue.

### Determine if a `RESOURCE_SEMAHPORE` wait is a top wait

Use the following query to determine if a `RESOURCE_SEMAHPORE` wait is a top wait

```sql
SELECT wait_type,
       SUM(wait_time) AS total_wait_time_ms
FROM sys.dm_exec_requests AS req
    JOIN sys.dm_exec_sessions AS sess
        ON req.session_id = sess.session_id
WHERE is_user_process = 1
GROUP BY wait_type
ORDER BY SUM(wait_time) DESC;
```

### Identity high memory-consuming statements

Use the following query to identify high memory-consuming statements:

```sql
SELECT IDENTITY(INT, 1, 1) rowId,
    CAST(query_plan AS XML) query_plan,
    p.query_id
INTO #tmp
FROM sys.query_store_plan AS p
    JOIN sys.query_store_runtime_stats AS r
        ON p.plan_id = r.plan_id
    JOIN sys.query_store_runtime_stats_interval AS i
        ON r.runtime_stats_interval_id = i.runtime_stats_interval_id
WHERE start_time > '2018-10-11 14:00:00.0000000'
      AND end_time < '2018-10-17 20:00:00.0000000';
GO
;WITH cte
AS (SELECT query_id,
        query_plan,
        m.c.value('@SerialDesiredMemory', 'INT') AS SerialDesiredMemory
    FROM #tmp AS t
        CROSS APPLY t.query_plan.nodes('//*:MemoryGrantInfo[@SerialDesiredMemory[. > 0]]') AS m(c) )
SELECT TOP 50
    cte.query_id,
    t.query_sql_text,
    cte.query_plan,
    CAST(SerialDesiredMemory / 1024. AS DECIMAL(10, 2)) SerialDesiredMemory_MB
FROM cte
    JOIN sys.query_store_query AS q
        ON cte.query_id = q.query_id
    JOIN sys.query_store_query_text AS t
        ON q.query_text_id = t.query_text_id
ORDER BY SerialDesiredMemory DESC;
```

### Identify the top 10 active memory grants

Use the following query to identify the top 10 active memory grants:

```sql
SELECT TOP 10
    CONVERT(VARCHAR(30), GETDATE(), 121) AS runtime,
       r.session_id,
       r.blocking_session_id,
       r.cpu_time,
       r.total_elapsed_time,
       r.reads,
       r.writes,
       r.logical_reads,
       r.row_count,
       wait_time,
       wait_type,
       r.command,
       OBJECT_NAME(txt.objectid, txt.dbid) 'Object_Name',
       LTRIM(RTRIM(REPLACE(
                              REPLACE(
                                         SUBSTRING(
                                                      SUBSTRING(
                                                                   text,
                                                                   (r.statement_start_offset / 2) + 1,
                                                                   ((CASE r.statement_end_offset
                                                                         WHEN -1 THEN
                                                                             DATALENGTH(text)
                                                                         ELSE
                                                                             r.statement_end_offset
                                                                     END - r.statement_start_offset
                                                                    ) / 2
                                                                   ) + 1
                                                               ),
                                                      1,
                                                      1000
                                                  ),
                                         CHAR(10),
                                         ' '
                                     ),
                              CHAR(13),
                              ' '
                          )
                  )
            ) stmt_text,
       mg.dop,                                               --Degree of parallelism
       mg.request_time,                                      --Date and time when this query requested the memory grant.
       mg.grant_time,                                        --NULL means memory has not been granted
       mg.requested_memory_kb / 1024.0 requested_memory_mb,  --Total requested amount of memory in megabytes
       mg.granted_memory_kb / 1024.0 AS granted_memory_mb,   --Total amount of memory actually granted in megabytes. NULL if not granted
       mg.required_memory_kb / 1024.0 AS required_memory_mb, --Minimum memory required to run this query in megabytes.
       max_used_memory_kb / 1024.0 AS max_used_memory_mb,
       mg.query_cost,                                        --Estimated query cost.
       mg.timeout_sec,                                       --Time-out in seconds before this query gives up the memory grant request.
       mg.resource_semaphore_id,                             --Non-unique ID of the resource semaphore on which this query is waiting.
       mg.wait_time_ms,                                      --Wait time in milliseconds. NULL if the memory is already granted.
       CASE mg.is_next_candidate --Is this process the next candidate for a memory grant
           WHEN 1 THEN
               'Yes'
           WHEN 0 THEN
               'No'
           ELSE
               'Memory has been granted'
       END AS 'Next Candidate for Memory Grant',
       qp.query_plan
FROM sys.dm_exec_requests AS r
    JOIN sys.dm_exec_query_memory_grants AS mg
        ON r.session_id = mg.session_id
           AND r.request_id = mg.request_id
    CROSS APPLY sys.dm_exec_sql_text(mg.sql_handle) AS txt
    CROSS APPLY sys.dm_exec_query_plan(r.plan_handle) AS qp
ORDER BY mg.granted_memory_kb DESC;
```

## Calculating database and objects sizes

The following query returns the size of your database (in megabytes):

```sql
-- Calculates the size of the database.
SELECT SUM(CAST(FILEPROPERTY(name, 'SpaceUsed') AS bigint) * 8192.) / 1024 / 1024 AS DatabaseSizeInMB
FROM sys.database_files
WHERE type_desc = 'ROWS';
GO
```

The following query returns the size of individual objects (in megabytes) in your database:

```sql
-- Calculates the size of individual database objects.
SELECT sys.objects.name, SUM(reserved_page_count) * 8.0 / 1024
FROM sys.dm_db_partition_stats, sys.objects
WHERE sys.dm_db_partition_stats.object_id = sys.objects.object_id
GROUP BY sys.objects.name;
GO
```

## Monitoring connections

You can use the [sys.dm_exec_connections](https://msdn.microsoft.com/library/ms181509.aspx) view to retrieve information about the connections established to a specific Azure SQL Database server and the details of each connection. In addition, the [sys.dm_exec_sessions](https://msdn.microsoft.com/library/ms176013.aspx) view is helpful when retrieving information about all active user connections and internal tasks.
The following query retrieves information on the current connection:

```sql
SELECT
    c.session_id, c.net_transport, c.encrypt_option,
    c.auth_scheme, s.host_name, s.program_name,
    s.client_interface_name, s.login_name, s.nt_domain,
    s.nt_user_name, s.original_login_name, c.connect_time,
    s.login_time
FROM sys.dm_exec_connections AS c
JOIN sys.dm_exec_sessions AS s
    ON c.session_id = s.session_id
WHERE c.session_id = @@SPID;
```

> [!NOTE]
> When executing the **sys.dm_exec_requests** and **sys.dm_exec_sessions views**, if you have **VIEW DATABASE STATE** permission on the database, you see all executing sessions on the database; otherwise, you see only the current session.

## Monitor resource use

You can monitor resource usage using [SQL Database Query Performance Insight](sql-database-query-performance.md) and [Query Store](https://msdn.microsoft.com/library/dn817826.aspx).

You can also monitor usage using these two views:

- [sys.dm_db_resource_stats](https://msdn.microsoft.com/library/dn800981.aspx)
- [sys.resource_stats](https://msdn.microsoft.com/library/dn269979.aspx)

### sys.dm_db_resource_stats

You can use the [sys.dm_db_resource_stats](https://msdn.microsoft.com/library/dn800981.aspx) view in every SQL database. The **sys.dm_db_resource_stats** view shows recent resource use data relative to the service tier. Average percentages for CPU, data IO, log writes, and memory are recorded every 15 seconds and are maintained for 1 hour.

Because this view provides a more granular look at resource use, use **sys.dm_db_resource_stats** first for any current-state analysis or troubleshooting. For example, this query shows the average and maximum resource use for the current database over the past hour:

```sql
SELECT  
    AVG(avg_cpu_percent) AS 'Average CPU use in percent',
    MAX(avg_cpu_percent) AS 'Maximum CPU use in percent',
    AVG(avg_data_io_percent) AS 'Average data IO in percent',
    MAX(avg_data_io_percent) AS 'Maximum data IO in percent',
    AVG(avg_log_write_percent) AS 'Average log write use in percent',
    MAX(avg_log_write_percent) AS 'Maximum log write use in percent',
    AVG(avg_memory_usage_percent) AS 'Average memory use in percent',
    MAX(avg_memory_usage_percent) AS 'Maximum memory use in percent'
FROM sys.dm_db_resource_stats;  
```

For other queries, see the examples in [sys.dm_db_resource_stats](https://msdn.microsoft.com/library/dn800981.aspx).

### sys.resource_stats

The [sys.resource_stats](https://msdn.microsoft.com/library/dn269979.aspx) view in the **master** database has additional information that can help you monitor the performance of your SQL database at its specific service tier and compute size. The data is collected every 5 minutes and is maintained for approximately 14 days. This view is useful for a longer-term historical analysis of how your SQL database uses resources.

The following graph shows the CPU resource use for a Premium database with the P2 compute size for each hour in a week. This graph starts on a Monday, shows 5 work days, and then shows a weekend, when much less happens on the application.

![SQL database resource use](./media/sql-database-performance-guidance/sql_db_resource_utilization.png)

From the data, this database currently has a peak CPU load of just over 50 percent CPU use relative to the P2 compute size (midday on Tuesday). If CPU is the dominant factor in the application’s resource profile, then you might decide that P2 is the right compute size to guarantee that the workload always fits. If you expect an application to grow over time, it's a good idea to have an extra resource buffer so that the application doesn't ever reach the performance-level limit. If you increase the compute size, you can help avoid customer-visible errors that might occur when a database doesn't have enough power to process requests effectively, especially in latency-sensitive environments. An example is a database that supports an application that paints webpages based on the results of database calls.

Other application types might interpret the same graph differently. For example, if an application tries to process payroll data each day and has the same chart, this kind of "batch job" model might do fine at a P1 compute size. The P1 compute size has 100 DTUs compared to 200 DTUs at the P2 compute size. The P1 compute size provides half the performance of the P2 compute size. So, 50 percent of CPU use in P2 equals 100 percent CPU use in P1. If the application does not have timeouts, it might not matter if a job takes 2 hours or 2.5 hours to finish, if it gets done today. An application in this category probably can use a P1 compute size. You can take advantage of the fact that there are periods of time during the day when resource use is lower, so that any "big peak" might spill over into one of the troughs later in the day. The P1 compute size might be good for that kind of application (and save money), as long as the jobs can finish on time each day.

Azure SQL Database exposes consumed resource information for each active database in the **sys.resource_stats** view of the **master** database in each server. The data in the table is aggregated for 5-minute intervals. With the Basic, Standard, and Premium service tiers, the data can take more than 5 minutes to appear in the table, so this data is more useful for historical analysis rather than near-real-time analysis. Query the **sys.resource_stats** view to see the recent history of a database and to validate whether the reservation you chose delivered the performance you want when needed.

> [!NOTE]
> You must be connected to the **master** database of your SQL Database server to query **sys.resource_stats** in the following examples.

This example shows you how the data in this view is exposed:

```sql
SELECT TOP 10 *
FROM sys.resource_stats
WHERE database_name = 'resource1'
ORDER BY start_time DESC
```

![The sys.resource_stats catalog view](./media/sql-database-performance-guidance/sys_resource_stats.png)

The next example shows you different ways that you can use the **sys.resource_stats** catalog view to get information about how your SQL database uses resources:

1. To look at the past week’s resource use for the database userdb1, you can run this query:

    ```sql
    SELECT *
    FROM sys.resource_stats
    WHERE database_name = 'userdb1' AND
        start_time > DATEADD(day, -7, GETDATE())
    ORDER BY start_time DESC;
    ```

2. To evaluate how well your workload fits the compute size, you need to drill down into each aspect of the resource metrics: CPU, reads, writes, number of workers, and number of sessions. Here's a revised query using **sys.resource_stats** to report the average and maximum values of these resource metrics:

    ```sql
    SELECT
        avg(avg_cpu_percent) AS 'Average CPU use in percent',
        max(avg_cpu_percent) AS 'Maximum CPU use in percent',
        avg(avg_data_io_percent) AS 'Average physical data IO use in percent',
        max(avg_data_io_percent) AS 'Maximum physical data IO use in percent',
        avg(avg_log_write_percent) AS 'Average log write use in percent',
        max(avg_log_write_percent) AS 'Maximum log write use in percent',
        avg(max_session_percent) AS 'Average % of sessions',
        max(max_session_percent) AS 'Maximum % of sessions',
        avg(max_worker_percent) AS 'Average % of workers',
        max(max_worker_percent) AS 'Maximum % of workers'
    FROM sys.resource_stats
    WHERE database_name = 'userdb1' AND start_time > DATEADD(day, -7, GETDATE());
    ```

3. With this information about the average and maximum values of each resource metric, you can assess how well your workload fits into the compute size you chose. Usually, average values from **sys.resource_stats** give you a good baseline to use against the target size. It should be your primary measurement stick. For an example, you might be using the Standard service tier with S2 compute size. The average use percentages for CPU and IO reads and writes are below 40 percent, the average number of workers is below 50, and the average number of sessions is below 200. Your workload might fit into the S1 compute size. It's easy to see whether your database fits in the worker and session limits. To see whether a database fits into a lower compute size with regards to CPU, reads, and writes, divide the DTU number of the lower compute size by the DTU number of your current compute size, and then multiply the result by 100:

    ```S1 DTU / S2 DTU * 100 = 20 / 50 * 100 = 40```

    The result is the relative performance difference between the two compute sizes in percentage. If your resource use doesn't exceed this amount, your workload might fit into the lower compute size. However, you need to look at all ranges of resource use values, and determine, by percentage, how often your database workload would fit into the lower compute size. The following query outputs the fit percentage per resource dimension, based on the threshold of 40 percent that we calculated in this example:

   ```sql
    SELECT
        (COUNT(database_name) - SUM(CASE WHEN avg_cpu_percent >= 40 THEN 1 ELSE 0 END) * 1.0) / COUNT(database_name) AS 'CPU Fit Percent',
        (COUNT(database_name) - SUM(CASE WHEN avg_log_write_percent >= 40 THEN 1 ELSE 0 END) * 1.0) / COUNT(database_name) AS 'Log Write Fit Percent',
        (COUNT(database_name) - SUM(CASE WHEN avg_data_io_percent >= 40 THEN 1 ELSE 0 END) * 1.0) / COUNT(database_name) AS 'Physical Data IO Fit Percent'
    FROM sys.resource_stats
    WHERE database_name = 'userdb1' AND start_time > DATEADD(day, -7, GETDATE());
    ```

    Based on your database service tier, you can decide whether your workload fits into the lower compute size. If your database workload objective is 99.9 percent and the preceding query returns values greater than 99.9 percent for all three resource dimensions, your workload likely fits into the lower compute size.

    Looking at the fit percentage also gives you insight into whether you should move to the next higher compute size to meet your objective. For example, userdb1 shows the following CPU use for the past week:

   | Average CPU percent | Maximum CPU percent |
   | --- | --- |
   | 24.5 |100.00 |

    The average CPU is about a quarter of the limit of the compute size, which would fit well into the compute size of the database. But, the maximum value shows that the database reaches the limit of the compute size. Do you need to move to the next higher compute size? Look at how many times your workload reaches 100 percent, and then compare it to your database workload objective.

    ```sql
    SELECT
        (COUNT(database_name) - SUM(CASE WHEN avg_cpu_percent >= 100 THEN 1 ELSE 0 END) * 1.0) / COUNT(database_name) AS 'CPU fit percent'
        ,(COUNT(database_name) - SUM(CASE WHEN avg_log_write_percent >= 100 THEN 1 ELSE 0 END) * 1.0) / COUNT(database_name) AS 'Log write fit percent'
        ,(COUNT(database_name) - SUM(CASE WHEN avg_data_io_percent >= 100 THEN 1 ELSE 0 END) * 1.0) / COUNT(database_name) AS 'Physical data IO fit percent'
        FROM sys.resource_stats
        WHERE database_name = 'userdb1' AND start_time > DATEADD(day, -7, GETDATE());
    ```

    If this query returns a value less than 99.9 percent for any of the three resource dimensions, consider either moving to the next higher compute size or use application-tuning techniques to reduce the load on the SQL database.

4. This exercise also considers your projected workload increase in the future.

For elastic pools, you can monitor individual databases in the pool with the techniques described in this section. But you can also monitor the pool as a whole. For information, see [Monitor and manage an elastic pool](sql-database-elastic-pool-manage-portal.md).

### Maximum concurrent requests

To see the number of concurrent requests, run this Transact-SQL query on your SQL database:

    ```sql
    SELECT COUNT(*) AS [Concurrent_Requests]
    FROM sys.dm_exec_requests R;
    ```

To analyze the workload of an on-premises SQL Server database, modify this query to filter on the specific database you want to analyze. For example, if you have an on-premises database named MyDatabase, this Transact-SQL query returns the count of concurrent requests in that database:

    ```sql
    SELECT COUNT(*) AS [Concurrent_Requests]
    FROM sys.dm_exec_requests R
    INNER JOIN sys.databases D ON D.database_id = R.database_id
    AND D.name = 'MyDatabase';
    ```

This is just a snapshot at a single point in time. To get a better understanding of your workload and concurrent request requirements, you'll need to collect many samples over time.

### Maximum concurrent logins

You can analyze your user and application patterns to get an idea of the frequency of logins. You also can run real-world loads in a test environment to make sure that you're not hitting this or other limits we discuss in this article. There isn’t a single query or dynamic management view (DMV) that can show you concurrent login counts or history.

If multiple clients use the same connection string, the service authenticates each login. If 10 users simultaneously connect to a database by using the same username and password, there would be 10 concurrent logins. This limit applies only to the duration of the login and authentication. If the same 10 users connect to the database sequentially, the number of concurrent logins would never be greater than 1.

> [!NOTE]
> Currently, this limit does not apply to databases in elastic pools.

### Maximum sessions

To see the number of current active sessions, run this Transact-SQL query on your SQL database:

    SELECT COUNT(*) AS [Sessions]
    FROM sys.dm_exec_connections

If you're analyzing an on-premises SQL Server workload, modify the query to focus on a specific database. This query helps you determine possible session needs for the database if you are considering moving it to Azure SQL Database.

    SELECT COUNT(*)  AS [Sessions]
    FROM sys.dm_exec_connections C
    INNER JOIN sys.dm_exec_sessions S ON (S.session_id = C.session_id)
    INNER JOIN sys.databases D ON (D.database_id = S.database_id)
    WHERE D.name = 'MyDatabase'

Again, these queries return a point-in-time count. If you collect multiple samples over time, you’ll have the best understanding of your session use.

For SQL Database analysis, you can get historical statistics on sessions by querying the [sys.resource_stats](https://msdn.microsoft.com/library/dn269979.aspx) view and reviewing the **active_session_count** column.

## Monitoring query performance

Slow or long running queries can consume significant system resources. This section demonstrates how to use dynamic management views to detect a few common query performance problems. An older but still helpful reference for troubleshooting, is the [Troubleshooting Performance Problems in SQL Server 2008](https://download.microsoft.com/download/D/B/D/DBDE7972-1EB9-470A-BA18-58849DB3EB3B/TShootPerfProbs2008.docx) article on Microsoft TechNet.

### Finding top N queries

The following example returns information about the top five queries ranked by average CPU time. This example aggregates the queries according to their query hash, so that logically equivalent queries are grouped by their cumulative resource consumption.

    ```sql
    SELECT TOP 5 query_stats.query_hash AS "Query Hash",
       SUM(query_stats.total_worker_time) / SUM(query_stats.execution_count) AS "Avg CPU Time",
       MIN(query_stats.statement_text) AS "Statement Text"
    FROM
       (SELECT QS.*,
        SUBSTRING(ST.text, (QS.statement_start_offset/2) + 1,
        ((CASE statement_end_offset
           WHEN -1 THEN DATALENGTH(ST.text)
           ELSE QS.statement_end_offset END
           - QS.statement_start_offset)/2) + 1) AS statement_text
    FROM sys.dm_exec_query_stats AS QS
    CROSS APPLY sys.dm_exec_sql_text(QS.sql_handle) as ST) as query_stats
    GROUP BY query_stats.query_hash
    ORDER BY 2 DESC;
    ```

### Monitoring blocked queries

Slow or long-running queries can contribute to excessive resource consumption and be the consequence of blocked queries. The cause of the blocking can be poor application design, bad query plans, the lack of useful indexes, and so on. You can use the sys.dm_tran_locks view to get information about the current locking activity in your Azure SQL Database. For example code, see [sys.dm_tran_locks (Transact-SQL)](https://msdn.microsoft.com/library/ms190345.aspx) in SQL Server Books Online.

### Monitoring query plans

An inefficient query plan also may increase CPU consumption. The following example uses the [sys.dm_exec_query_stats](https://msdn.microsoft.com/library/ms189741.aspx) view to determine which query uses the most cumulative CPU.

    ```sql
    SELECT
       highest_cpu_queries.plan_handle,
       highest_cpu_queries.total_worker_time,
       q.dbid,
       q.objectid,
       q.number,
       q.encrypted,
       q.[text]
    FROM
       (SELECT TOP 50
        qs.plan_handle,
        qs.total_worker_time
    FROM
        sys.dm_exec_query_stats qs
    ORDER BY qs.total_worker_time desc) AS highest_cpu_queries
    CROSS APPLY sys.dm_exec_sql_text(plan_handle) AS q
    ORDER BY highest_cpu_queries.total_worker_time DESC;
    ```

## See also

[Introduction to SQL Database](sql-database-technical-overview.md)
