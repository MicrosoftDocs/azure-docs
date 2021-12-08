---
title: Diagnose and troubleshoot high CPU
titleSuffix: Azure SQL Database
description: Learn to diagnose and troubleshoot high CPU problems in Azure SQL Database.
services: sql-database
ms.service: sql-database
ms.subservice: performance
ms.custom: sqldbrb=2
ms.devlang: 
ms.topic: how-to
author: LitKnd
ms.author: kendralittle
ms.reviewer: mathoma
ms.date: 12/15/2021
---
# Diagnose and troubleshoot high CPU on Azure SQL Database

[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

[Azure SQL Database](sql-database-paas-overview.md) provides built-in tools to identify the causes of high CPU usage and to optimize CPU performance. You can use these tools to troubleshoot high CPU usage while it's occurring, or reactively after the incident has completed. You can also enable [automatic tuning](automatic-tuning-overview.md) to proactively reduce CPU usage over time for your database. This article teaches you to diagnose and troubleshoot high CPU with built-in tools in Azure SQL Database.

## Understand vCore count

It's helpful to understand the number of virtual cores (vCores) available to your database when diagnosing a high CPU incident. The number of vCores helps you understand the CPU resources available to your database.

### Identify vCore count in the Azure portal

You can quickly identify the vCore count for a database in the Azure portal if you are using a [vCore-based service tier](service-tiers-vcore.md) with the provisioned compute tier. In this case, the **pricing tier** listed for the database on its **Overview** page will contain the core count. For example, a database's pricing tier might be 'General Purpose: Gen5, 16 vCores'.

### Identify vCore count with Transact-SQL

You can identify the current vCore count for any database with Transact-SQL.  VCores for a database in the [serverless](serverless-tier-overview.md) compute tier will vary depending on your min and max vCore setting, resource demand, and resource availability.

Open [SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms) or [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio), connect to your database, and run the following query:

```sql
SELECT 
    COUNT(*) as vCores
FROM sys.dm_os_schedulers
WHERE status = N'VISIBLE ONLINE';
GO
```

## Identify the causes of high CPU

Common causes of new and unusual high CPU utilization are:

* New queries in the workload that use a large amount of CPU.
* [Query plan regression](intelligent-insights-troubleshoot-performance.md#plan-regression) resulting in one or more queries consuming more CPU.
* An increase in the frequency of regularly running queries.
* A significant increase in compilation or recompilation of query plans.

To understand what is causing your high CPU incident, identify when high CPU utilization is occurring against your database and the top queries using CPU at that time. Examine:

1. Are new queries using significant CPU appearing in the workload?
1. Are some queries in the workload using more CPU per execution than they did in the past? If so, have the query plans changed?
1. Is the overall execution count of queries higher than it used to be?
1. Is there evidence of a large amount of compilation or recompilation occurring?

You can measure and analyze CPU utilization using the Azure portal, Query Store interactive tools in SSMS, and Transact-SQL queries in SSMS and Azure Data Studio.

The Azure portal and Query Store show execution statistics, such as CPU metrics, for completed queries. If you are experiencing a current high CPU incident that may be caused by one or more ongoing long-running queries, [identify currently running queries with Transact-SQL](#identify-currently-running-queries-with-transact-sql).

### Review CPU usage metrics and related top queries in the Azure portal

Use the Azure portal to track various CPU metrics, including the percentage of available CPU used by your database over time. The Azure portal combines CPU metrics with information from your database's Query Store, which allows you to identify which queries consumed CPU in your database at a given time.

Follow these steps to find CPU percentage metrics.

1. Navigate to the database in the Azure portal.
1. Under **Intelligent Performance** in the left menu, select **Query Performance Insight**.

The default view of Query Performance Insight shows 24 hours of data. CPU usage is shown as a percentage of total available CPU used for the database. The top five queries running in that period are displayed in vertical bars above the CPU usage graph.

Select a band of time on the chart or use the **Customize** menu to explore specific time periods. You may also increase the number of queries shown.

:::image type="content" source="./media/high-cpu-troubleshoot/azure-portal-query-performance-insight.png" alt-text="Screenshot shows Query Performance Insight in the Azure portal.":::

Select each query ID exhibiting high CPU to open details for the query. Details include query text along with performance history for the query. Examine if CPU has increased for the query recently. Take note of the query ID to further investigate the query plan.

Follow these steps to use a query ID in SSMS's interactive Query Store tools to examine the query's execution plan over time.

1. Open SSMS
1. Connect to your Azure SQL Database in Object Explorer. 
1. Expand the database node in Object Explorer
1. Expand the **Query Store** folder. 
1. Open the **Tracked Queries** pane. 
1. Enter the query ID in the **Tracking query** box at the top left of the screen and press enter.
 
The page will show the execution plan(s) and related metrics for the query over the most recent 24 hours.

### Identify currently running queries with Transact-SQL

Transact-SQL allows you to identify currently running queries with CPU time they have used so far. You can also use Transact-SQL to query recent CPU usage in your database, top queries by CPU, and queries that compiled the most often.

To query CPU metrics, open SSMS or Azure Data Studio. Open a new query against your database. Find currently running queries with CPU usage and execution plans by executing the following query.

```sql
SELECT 
   req.session_id,
   req.status,
   req.start_time,
   req.cpu_time 'cpu_time_ms',
   req.logical_reads,
   req.dop,
   s.login_name,
   s.host_name,
   s.program_name,
   object_name(st.objectid,st.dbid) 'ObjectName',
   substring
      (REPLACE
        (REPLACE
          (SUBSTRING
            (st.text
            , (req.statement_start_offset/2) + 1
            , (
               (CASE req.statement_end_offset
                  WHEN -1
                  THEN DATALENGTH(st.text)  
                  ELSE req.statement_end_offset
                  END
                    - req.statement_start_offset)/2) + 1)
       , CHAR(10), ' '), CHAR(13), ' '), 1, 512)  AS statement_text,
    qp.query_plan,
    qsx.query_plan as query_plan_with_transient_statistics
FROM sys.dm_exec_requests as req  
JOIN sys.dm_exec_sessions as s on req.session_id=s.session_id
CROSS APPLY sys.dm_exec_sql_text(req.sql_handle) as st
OUTER APPLY sys.dm_exec_query_plan(req.plan_handle) as qp
OUTER APPLY sys.dm_exec_query_statistics_xml(req.session_id) as qsx
ORDER BY req.cpu_time desc;
GO
```

This query returns two copies of the execution plan. The column `query_plan` contains the execution plan from [sys.dm_exec_query_plan()](/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-query-plan-transact-sql). This version of the query plan contains only estimates of row counts and does not contain any execution statistics.

If the column `query_plan_with_transient_statistics` returns an execution plan, this plan provides more information. The `query_plan_with_transient_statistics` column returns data from [sys.dm_exec_query_statistics_xml()](/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-query-statistics-xml-transact-sql), which includes transient statistics such as the actual number of rows returned so far.

### Review CPU usage metrics for the last hour

The following query against `sys.dm_db_resource_stats` returns the average CPU used over 15-second intervals for approximately the last hour.

```sql
SELECT
    end_time,
    avg_cpu_percent,
    avg_instance_cpu_percent
FROM sys.dm_db_resource_stats
ORDER BY end_time DESC; 
GO
```

Review the examples in [sys.dm_db_resource_stats](/sql/relational-databases/system-dynamic-management-views/sys-dm-db-resource-stats-azure-sql-database) for more queries.

### Query the top recent 15 queries by CPU usage

Query Store tracks execution statistics, including CPU usage, for queries. The following query returns the top 15 queries that have run in the last 2 hours, sorted by CPU usage.

```sql
WITH AggregatedCPU AS 
    (SELECT
        q.query_hash, 
        SUM(count_executions * avg_cpu_time / 1000.0) AS total_cpu_millisec, 
        SUM(count_executions * avg_cpu_time / 1000.0)/ SUM(count_executions) AS avg_cpu_millisec, 
        MAX(rs.max_cpu_time / 1000.00) AS max_cpu_millisec, 
        MAX(max_logical_io_reads) max_logical_reads, 
        COUNT(DISTINCT p.plan_id) AS number_of_distinct_plans, 
        COUNT(DISTINCT p.query_id) AS number_of_distinct_query_ids, 
        SUM(CASE WHEN rs.execution_type_desc='Aborted' THEN count_executions ELSE 0 END) AS Aborted_Execution_Count, 
        SUM(CASE WHEN rs.execution_type_desc='Regular' THEN count_executions ELSE 0 END) AS Regular_Execution_Count, 
        SUM(CASE WHEN rs.execution_type_desc='Exception' THEN count_executions ELSE 0 END) AS Exception_Execution_Count, 
        SUM(count_executions) AS total_executions, 
        MIN(qt.query_sql_text) AS sampled_query_text
    FROM sys.query_store_query_text AS qt
    JOIN sys.query_store_query AS q ON qt.query_text_id=q.query_text_id
    JOIN sys.query_store_plan AS p ON q.query_id=p.query_id
    JOIN sys.query_store_runtime_stats AS rs ON rs.plan_id=p.plan_id
    JOIN sys.query_store_runtime_stats_interval AS rsi ON rsi.runtime_stats_interval_id=rs.runtime_stats_interval_id
    WHERE 
            rs.execution_type_desc IN ('Regular', 'Aborted', 'Exception') AND 
        rsi.start_time>=DATEADD(HOUR, -2, GETUTCDATE())
     GROUP BY q.query_hash), 
OrderedCPU AS 
    (SELECT *, 
    ROW_NUMBER() OVER (ORDER BY total_cpu_millisec DESC, query_hash ASC) AS RN
    FROM AggregatedCPU)
SELECT *
FROM OrderedCPU AS OD
WHERE OD.RN<=15
ORDER BY total_cpu_millisec DESC;
GO
```

This query groups by a hashed value of the query. If you find a high value in the `number_of_distinct_query_ids` column, investigate if a frequently run query is not properly parameterized. Non-parameterized queries require CPU for each compilation and [impact the performance of Query Store](/sql/relational-databases/performance/best-practice-with-the-query-store#Parameterize).

To learn more about an individual query, note the query hash and use it to [Identify the CPU usage and query plan for a given query hash](#identify-the-cpu-usage-and-query-plan-for-a-given-query-hash).

### Query the most frequently compiled queries by query hash

Compiling a query plan is a CPU-intensive process. SQL Server utilizes a pool of memory to [cache plans for reuse](/sql/relational-databases/query-processing-architecture-guide#execution-plan-caching-and-reuse). Some queries may be frequently compiled if they are not parameterized or if [RECOMPILE hints](/sql/t-sql/queries/hints-transact-sql-query) force recompilation.

Query Store tracks the number of times queries are compiled. Run the following query to identify the top 20 queries in Query Store by compilation count, along with the average number of compilations per minute:

```sql
SELECT TOP (20)
    query_hash,
    MIN(initial_compile_start_time) as initial_compile_start_time,
    MAX(last_compile_start_time) as last_compile_start_time,
    CASE WHEN DATEDIFF(mi,MIN(initial_compile_start_time), MAX(last_compile_start_time)) > 0
        THEN 1.* SUM(count_compiles) / DATEDIFF(mi,MIN(initial_compile_start_time), MAX(last_compile_start_time)) 
        ELSE 0 
        END as avg_compiles_minute,
    SUM(count_compiles) as count_compiles
FROM sys.query_store_query AS q
GROUP BY query_hash
ORDER BY count_compiles DESC;
GO
```

To learn more about an individual query, note the query hash and use it to [Identify the CPU usage and query plan for a given query hash](#identify-the-cpu-usage-and-query-plan-for-a-given-query-hash).

### Identify the CPU usage and query plan for a given query hash

Run the following query to find the individual query ID, query text, and query execution plans for a given `query_hash`. Substitute in a valid `query_hash` for your workload.

```sql
declare @query_hash binary(8);
/* Substitue in the value for your query hash */
SET @query_hash = 0x6557BE7936AA2E91;

with query_ids as (
    SELECT
        q.query_hash,
        q.query_id,
        p.query_plan_hash,
        SUM(qrs.count_executions) * AVG(qrs.avg_cpu_time) as total_cpu_time,
        SUM(qrs.count_executions) AS sum_executions,
        AVG(qrs.avg_cpu_time) AS avg_cpu_time
        FROM sys.query_store_query q
    JOIN sys.query_store_plan p on q.query_id=p.query_id
    CROSS APPLY (SELECT TRY_CONVERT(XML, p.query_plan) AS query_plan_xml) AS qpx
    JOIN sys.query_store_runtime_stats qrs on p.plan_id = qrs.plan_id
    JOIN sys.query_store_runtime_stats_interval qsrsi on qrs.runtime_stats_interval_id=qsrsi.runtime_stats_interval_id
    WHERE q.query_hash = @query_hash
    GROUP BY q.query_id, q.query_hash, p.query_plan_hash)
SELECT qid.*,
    qt.query_sql_text,
    p.count_compiles,
    cast(p.query_plan as XML) as query_plan
FROM query_ids as qid
JOIN sys.query_store_query AS q ON qid.query_id=q.query_id
JOIN sys.query_store_query_text AS qt on q.query_text_id = qt.query_text_id
JOIN sys.query_store_plan AS p ON qid.query_id=p.query_id and qid.query_plan_hash=p.query_plan_hash
ORDER BY total_cpu_time DESC;
GO
```

This query returns one row for each variation of an execution plan for the `query_hash` across the entire history of your Query Store. The results are sorted by total CPU time.

### Use interactive Query Store tools to track CPU time over history

If you prefer to use graphic tools, follow these steps to use the interactive Query Store tools in SSMS.

1. Open SSMS and connect to your database in Object Explorer.
1. Expand the database node in Object Explorer
1. Expand the **Query Store** folder.
1. Open the **Overall Resource Consumption** pane.
 
Total CPU time for your database over the last month in milliseconds is shown in the bottom-left portion of the pane. In the default view, CPU time is aggregated by day.

:::image type="content" source="./media/high-cpu-troubleshoot/ssms-query-store-resources-consumption.png" alt-text="Screenshot shows the Overall Resource Consumption view of Query Store in SSMS.":::

Select **Configure** in the top right of the pane to select a different time period. You can also change the unit of aggregation. For example, you can choose to see data for a specific date range and aggregate the data by hour.

### Use interactive Query Store tools to identify top queries by CPU time

Select a bar in the chart to drill in and see queries running in a specific time period. The **Top Resource Consuming Queries** pane will open. Alternately, you can open **Top Resource Consuming Queries** from the Query Store node under your database in Object Explorer directly.

:::image type="content" source="./media/high-cpu-troubleshoot/ssms-query-store-top-resource-consuming-queries.png" alt-text="Screenshot shows the Top Resource Consuming Queries pane for Query Store in SSMS.":::

In the default view, the **Top Resource Consuming Queries** pane shows queries by **Duration (ms)**. Duration may be different than CPU time, as queries using parallelism may use much more CPU time than their overall duration. To see queries by CPU time, select the **Metric** drop-down at the top left of the pane and select **CPU Time(ms)**.

Each bar in the top-left quadrant represents a query. Select a bar to see details for that query. The top-right quadrant of the screen shows how many execution plans are in Query Store for that query, and maps them according to when they were executed and how much of your selected metric was used. Select each plan ID to control which query execution plan is displayed in the bottom half of the screen.

## Reduce CPU usage
Part of your troubleshooting should include learning more about the queries identified in the previous section. You can reduce CPU usage by tuning indexes, modifying your application patterns, tuning queries, and adjusting CPU-related settings for your database.

1. If you found new queries using significant CPU appearing in the workload, validate that indexes have been optimized for those queries. You can [tune indexes manually](#tune-indexes-manually) or [reduce CPU usage with automatic index tuning](#reduce-cpu-usage-with-automatic-index-tuning). Evaluate if your [max degree of parallelism](#reduce-cpu-usage-by-tuning-the-max-degree-of-parallelism) setting is correct for your increased workload.
1. If you found queries in the workload with [query plan regression](intelligent-insights-troubleshoot-performance.md#plan-regression), consider [automatic plan correction (force plan)](#reduce-cpu-usage-with-automatic-plan-correction-force-plan). You can also [manually force a plan in Query Store](/sql/relational-databases/system-stored-procedures/sp-query-store-force-plan-transact-sql) or tune the Transact-SQL for the query to result in a consistently high-performing query plan.
1. If you found that the overall execution count of queries is higher than it used to be, [tune indexes for your highest CPU consuming queries](#tune-indexes-manually) and consider [automatic index tuning](#reduce-cpu-usage-with-automatic-index-tuning). Evaluate if your [max degree of parallelism](#reduce-cpu-usage-by-tuning-the-max-degree-of-parallelism) setting is correct for your increased workload.
1. If you found evidence that a large amount of compilation or recompilation is occurring, [tune the queries so that they are properly parameterized or do not require recompile hints](#tune-your-application-queries-and-database-settings).

Consider the following strategies in this section.

### Reduce CPU usage with automatic index tuning

Effective index tuning reduces CPU usage for many queries. Optimized indexes reduce the logical and physical reads for a query, which often results in the query needing to do less work.

Azure SQL Database offers [automatic index management](automatic-tuning-overview.md#automatic-tuning-options), which uses machine learning to monitor your workload and optimize rowstore disk-based nonclustered indexes for your database.

[Review performance recommendations](database-advisor-find-recommendations-portal.md), including index recommendations, in the Azure portal. You can apply these recommendations manually or [enable the CREATE INDEX automatic tuning option](automatic-tuning-enable.md) to create and verify the performance of new indexes in your database.

### Reduce CPU usage with automatic plan correction (force plan)

Another common cause of high CPU incidents is [execution plan choice regression](/sql/relational-databases/automatic-tuning/automatic-tuning#what-is-execution-plan-choice-regression). Azure SQL Database offers the [force plan](automatic-tuning-overview.md#automatic-tuning-options) automatic tuning option to identify regressions in query execution plans. With this automatic tuning feature enabled, Azure SQL Database will test if forcing a query execution plan results in reliable improved performance for queries with execution plan regression.

If your database was created after March  2020, the **force plan** automatic tuning option was automatically enabled. If your database was created prior to this time, you may wish to [enable the force plan automatic tuning option](automatic-tuning-enable.md).

### Tune indexes manually

Use the methods described in [Identify the causes of high CPU](#identify-the-causes-of-high-cpu) to identify query plans for your top CPU consuming queries. These execution plans will aid you in [identifying and adding nonclustered indexes](performance-guidance.md#identifying-and-adding-missing-indexes) to speed up your queries.

Each disk based [nonclustered index](/sql/relational-databases/indexes/clustered-and-nonclustered-indexes-described) in your database requires storage space and must be maintained by the SQL engine. Modify existing indexes instead of adding new indexes when possible and ensure that new indexes successfully reduce CPU usage. For an overview of nonclustered indexes, see [Nonclustered Index Design Guidelines](/sql/relational-databases/sql-server-index-design-guide#Nonclustered).

For some workloads, columnstore indexes may be the best choice to reduce CPU of frequent read queries. See [Columnstore indexes - Design guidance](/sql/relational-databases/indexes/columnstore-indexes-design-guidance) for high-level recommendations on scenarios when columnstore indexes may be appropriate.

### Tune your application, queries, and database settings

In examining your top queries, you may find [application characteristics to tune](performance-guidance.md#application-characteristics) such as "chatty" behavior, workloads that would benefit from sharding, and suboptimal database access design. For read-heavy workloads, consider [application-tier caching](performance-guidance.md#application-tier-caching) as a long-term strategy to scale out frequently read data.

You may also choose to manually tune the top CPU using queries identified in your workload. Manual tuning options include rewriting Transact-SQL statements, [forcing plans](/sql/relational-databases/system-stored-procedures/sp-query-store-force-plan-transact-sql) in Query Store, and applying [query hints](/sql/t-sql/queries/hints-transact-sql-query).

If you identify non-parameterized queries with a high number of plans, consider parameterizing these queries. This may be done by modifying the queries, creating a [plan guide to force parameterization](/sql/relational-databases/performance/specify-query-parameterization-behavior-by-using-plan-guides) of a specific query, or by enabling [forced parameterization](/sql/relational-databases/query-processing-architecture-guide#execution-plan-caching-and-reuse) at the database level.

If you identify queries with high compilation rates, identify what causes the frequent compilation. The most common cause of frequent compilation is [RECOMPILE hints](/sql/t-sql/queries/hints-transact-sql-query). Whenever possible, identify when the ``RECOMPILE`` hint was added and what problem it was meant to solve. Investigate whether an alternate performance tuning solution can be implemented to provide consistent performance for the query without a ``RECOMPILE`` hint.

### Reduce CPU usage by tuning the max degree of parallelism

The [max degree of parallelism (MAXDOP)](configure-max-degree-of-parallelism.md#overview) setting controls intra-query parallelism in the database engine. Higher MAXDOP values generally result in more parallel threads per query, and faster query execution.

In some cases, a large number of parallel queries running concurrently can slow down a workload and cause high CPU usage. Excessive parallelism is most likely to occur in databases with a large number of vCores where MAXDOP is set to a high number or to zero. When MAXDOP is set to zero, the database engine sets the number of [schedulers](/sql/relational-databases/thread-and-task-architecture-guide#sql-server-task-scheduling) to be used by parallel threads to the total number of logical cores or 64, whichever is smaller.

You can identify the max degree of parallelism setting for your database with Transact-SQL. Connect to your database with SSMS or Azure Data Studio and run the following query:

```sql
SELECT 
    name, 
    value, 
    value_for_secondary, 
    is_value_default 
FROM sys.database_scoped_configurations
WHERE name=N'MAXDOP';
GO
```

Consider experimenting with small changes in the MAXDOP configuration at the database level, or, modifying individual problematic queries to use a non-default MAXDOP using a query hint. For more information, see the examples in [configure max degree of parallelism](configure-max-degree-of-parallelism.md).

## When to add CPU resources

In some cases you may find that your workload's queries and indexes are properly tuned, or that performance tuning requires changes that you cannot make in the short term due to internal processes or other reasons. Adding more CPU resources may be beneficial for these databases. You can [scale database resources with minimal downtime](scale-resources.md).

You can add more CPU resources to your Azure SQL Database by configuring the vCore count or the [hardware generation](service-tiers-sql-database-vcore.md#hardware-generations) for databases using the [vCore purchase model](service-tiers-sql-database-vcore.md).

Under the [DTU-based purchase model](service-tiers-dtu.md), you can raise your service tier and increase the number of database transaction units (DTUs). A DTU represents a blended measure of CPU, memory, reads, and writes.  One benefit of the vCore purchase model is that it allows more granular control over the hardware in use and the number of vCores. You can [migrate Azure SQL Database from the DTU-based model to the vCore-based model](migrate-dtu-to-vcore.md) to transition between purchase models.

If your workload would benefit from scaling out storage and compute resources beyond the [general purpose](service-tier-general-purpose.md) and [business critical](service-tier-business-critical.md) service tiers for Azure SQL Database, consider the [hyperscale service tier](service-tier-hyperscale.md).

## Next steps

* [Monitoring Azure SQL Database and Azure SQL Managed Instance performance using dynamic management views](monitoring-with-dmvs.md)
* [SQL Server index architecture and design guide](/sql/relational-databases/sql-server-index-design-guide)
* [Enable automatic tuning to monitor queries and improve workload performance](automatic-tuning-enable.md)
* [Query processing architecture guide](/sql/relational-databases/query-processing-architecture-guide)
* [Best practices with Query Store](/sql/relational-databases/performance/best-practice-with-the-query-store)