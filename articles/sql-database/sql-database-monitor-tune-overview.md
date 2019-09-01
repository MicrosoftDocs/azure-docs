---
title: Monitoring and performance tuning - Azure SQL Database | Microsoft Docs
description: Tips for performance tuning in Azure SQL Database through evaluation and improvement.
services: sql-database
ms.service: sql-database
ms.subservice: performance
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: jovanpop-msft
ms.author: jovanpop
ms.reviewer: jrasnick, carlrab
ms.date: 01/25/2019
---
# Monitoring and performance tuning

Azure SQL Database provides tools and methods you can use to easily monitor usage, add or remove resources (such as CPU, memory, or I/O), troubleshoot potential problems, and make recommendations to improve the performance of a database. Features in Azure SQL Database can automatically fix problems in the databases. Automatic tuning enables a database to adapt to the workload and automatically optimize performance. However, some custom issues might need troubleshooting. This article explains some best practices and some tools you can use to troubleshoot performance problems.

To ensure that a database runs without problems, you should:
- [Monitor database performance](#monitoring-database-performance) to make sure that the resources assigned to the database can handle the workload. If the database is hitting resource limits, consider:
   - Identifying and optimizing the top resource-consuming queries.
   - Adding more resources by upgrading the service tier.
- [Troubleshoot performance problems](#troubleshoot-performance-problems) to identify why a potential problem occurred and to identify the root cause of the problem. After you identify the root cause, take steps to fix the problem.

## Monitor database performance

To monitor the performance of a SQL database in Azure, start by monitoring the resources used relative to the level of database performance you chose. Monitor the following resources:
 - **CPU usage**: Check to see if the database is reaching 100% of CPU usage for an extended period of time. High CPU usage might indicate that you need to identify and tune queries that use the most compute power. High CPU usage might also indicate that the database or instance should be upgraded to a higher service tier. 
 - **Wait statistics**: Use [sys.dm_os_wait_stats (Transact-SQL)](/sql/relational-databases/system-dynamic-management-views/sys-dm-os-wait-stats-transact-sql) to determine how long queries are waiting. Queries can be waiting on resources, queue waits, or external waits. 
 - **IO usage**: Check to see if the database is reaching the IO limits of the underlying storage.
 - **Memory usage**: The amount of memory available for the database or instance is proportional to the number of vCores. Make sure the memory is enough for the workload. Page life expectancy is one of the parameters that can indicate how quickly the pages are removed from the memory.

The Azure SQL Database service includes tools and resources to help you troubleshoot and fix potential performance problems. You can identify opportunities to improve and optimize query performance without changing resources by reviewing [performance tuning recommendations](sql-database-advisor.md). Missing indexes and poorly optimized queries are common reasons for poor database performance. You can apply the tuning recommendations to improve performance of the workload. You can also let Azure SQL Database [automatically optimize performance of the queries](sql-database-automatic-tuning.md) by applying all identified recommendations. Then verify that the recommendations improved database performance.

Choose from the following options to monitor and troubleshoot database performance:

- In the [Azure portal](https://portal.azure.com), select **SQL databases**, select the database, and then use the Monitoring chart to look for resources approaching their maximum utilization. DTU consumption is shown by default. Select **Edit** to change the time range and values shown.
- Tools such as SQL Server Management Studio provide many useful reports like [Performance Dashboard](https://docs.microsoft.com/sql/relational-databases/performance/performance-dashboard?view=sql-server-2017). Use these reports to monitor resource usage and identify top resource-consuming queries. You can use [Query Store](https://docs.microsoft.com/sql/relational-databases/performance/monitoring-performance-by-using-the-query-store#Regressed) to identify queries that have regressed in performance.
- In the [Azure portal](https://portal.azure.com), use [Query Performance Insight](sql-database-query-performance.md) to identify the queries that use the most resources. This feature is available in single database and elastic pools only.
- Use [SQL Database Advisor](sql-database-advisor-portal.md) to view recommendations to help you create and drop indexes, parameterize queries, and fix schema problems. This feature is available in single database and elastic pools only.
- Use [Azure SQL Intelligent Insights](sql-database-intelligent-insights.md) to automatically monitor database performance. When a performance problem is detected, a diagnostic log is generated. The log provides details and a root cause analysis (RCA) of the problem. A performance-improvement recommendation is provided when possible.
- [Enable automatic tuning](sql-database-automatic-tuning-enable.md) and let Azure SQL Database automatically fix performance problems that are identified.
- Use [dynamic management views (DMVs)](sql-database-monitoring-with-dmvs.md), [extended events](sql-database-xevent-db-diff-from-svr.md), and [Query Store](https://docs.microsoft.com/sql/relational-databases/performance/monitoring-performance-by-using-the-query-store) for help with more detailed troubleshooting of performance problems.

> [!TIP]
> After you identify a performance problem, check out our [performance guidance](sql-database-performance-guidance.md) to find techniques to improve the performance of Azure SQL Database.

## Troubleshoot performance problems

To diagnose and resolve performance problems, begin by finding out the state of each active query and the conditions that cause performance problems relevant to each workload state. To improve Azure SQL Database performance, you need to understand that each active query request from the application is in either a running state or a waiting state. As you troubleshoot a performance problem in Azure SQL Database, keep the following diagram in mind.

![Workload states](./media/sql-database-monitor-tune-overview/workload-states.png)

A performance problem in a workload can be caused by CPU contention (a *running-related* condition) or individual queries that are waiting on something (a *waiting-related* condition).

Running-related problems might be caused by:
- **Compilation problems**: SQL Query Optimizer might produce a suboptimal plan because of stale statistics, an incorrect estimate of the number of rows that will be processed, or an inaccurate estimate of required memory. If you know the query was executed faster in the past or on another instance (either a managed instance or a SQL Server instance), compare the actual execution plans to see if they're different. Try to apply query hints or rebuild statistics or indexes to get the better plan. Enable automatic plan correction in Azure SQL Database to automatically mitigate these problems.
- **Execution problems**: If the query plan is optimal, it's probably hitting the database's resource limits, such as log write throughput. Or it might be using fragmented indexes that should be rebuilt. Execution problems can also happen when a large number of concurrent queries need the same resources. *Waiting-related* problems are usually related to execution problems, because the queries that don't execute efficiently are probably waiting for some resources.

Waiting-related problems might be caused by:
- **Blocking**: One query might hold the lock on objects in the database while others try to access the same objects. You can identify blocking queries by using DMVs or monitoring tools.
- **IO problems**: Queries might be waiting for the pages to be written to the data or log files. In this case, check the `INSTANCE_LOG_RATE_GOVERNOR`, `WRITE_LOG`, or `PAGEIOLATCH_*` wait statistics in the DMV.
- **TempDB problems**: If the workload uses temporary tables or there are TempDB spills in the plans, the queries might have a problem with TempDB throughput. 
- **Memory-related problems**: If the workload doesn't have enough memory, the page life expectancy might drop, or the queries might get less memory than they need. In some cases, built-in intelligence in Query Optimizer will fix memory-related problems.
 
The following sections explain how to identify and troubleshoot some of these problems.

## Performance problems related to running

As a general guideline, if CPU usage is consistently at or above 80 percent, your performance problem is running related. A running-related problem might be caused by insufficient CPU resources. Or it might be related to one of the following conditions:

- Too many running queries
- Too many compiling queries
- One or more executing queries that use a suboptimal query plan

If you find a running-related performance problem, your goal is to identify the precise problem by using one or more methods. These are the most common methods to identify running-related problems:

- Use the [Azure portal](sql-database-manage-after-migration.md#monitor-databases-using-the-azure-portal) to monitor CPU percentage usage.
- Use the following [DMVs](sql-database-monitoring-with-dmvs.md):

  - [sys.dm_db_resource_stats](sql-database-monitoring-with-dmvs.md#monitor-resource-use) returns CPU, I/O, and memory consumption for an Azure SQL Database. One row exists for every 15-second interval, even if there's no activity in the database. Historical data is maintained for one hour.
  - [sys.resource_stats](sql-database-monitoring-with-dmvs.md#monitor-resource-use) returns CPU usage and storage data for Azure SQL Database. The data is collected and aggregated in five-minute intervals.

> [!IMPORTANT]
> To troubleshoot CPU utilization problems for T-SQL queries that use sys.dm_db_resource_stats and sys.resource_stats DMVs, see [Identify CPU performance issues](sql-database-monitoring-with-dmvs.md#identify-cpu-performance-issues).

### <a name="ParamSniffing"></a> Queries that have PSP problems

A parameter sensitive plan (PSP) problem happens when the query optimizer generates a query execution plan that is optimal only for a specific parameter value (or set of values) and the cached plan is then not optimal for parameter values that are used in consecutive executions. Plans that aren't optimal can then cause query performance problems and degrade overall workload throughput. For more information on parameter sniffing and query processing, see the [Query-processing architecture guide](/sql/relational-databases/query-processing-architecture-guide#ParamSniffing).

Several workarounds can mitigate PSP problems. Each workaround has associated tradeoffs and drawbacks:

- Use the [RECOMPILE](https://docs.microsoft.com/sql/t-sql/queries/hints-transact-sql-query) query hint at each query execution. This workaround trades compilation time and increased CPU for better plan quality. The `RECOMPILE` option is often not possible for workloads that require a high throughput.
- Use the [OPTION (OPTIMIZE FOR…)](https://docs.microsoft.com/sql/t-sql/queries/hints-transact-sql-query) query hint to override the actual parameter value with a typical parameter value that produces a plan that's good enough for most parameter value possibilities. This option requires a good understanding of optimal parameter values and associated plan characteristics.
- Use the [OPTION (OPTIMIZE FOR UNKNOWN)](https://docs.microsoft.com/sql/t-sql/queries/hints-transact-sql-query) query hint to override the actual parameter value and instead use the density vector average. You can also do this by capturing the incoming parameter values in local variables and then using the local variables within the predicates instead of using the parameters themselves. For this fix, the average density must be *good enough*.
- Disable parameter sniffing entirely by using the [DISABLE_PARAMETER_SNIFFING](https://docs.microsoft.com/sql/t-sql/queries/hints-transact-sql-query) query hint.
- Use the [KEEPFIXEDPLAN](https://docs.microsoft.com/sql/t-sql/queries/hints-transact-sql-query) query hint to prevent recompilations in cache. This workaround assumes that the good-enough common plan is the one in cache already. You can also disable automatic statistics updates to reduce the chance that the good plan will be evicted and a new bad plan will be compiled.
- Force the plan by explicitly using the [USE PLAN](https://docs.microsoft.com/sql/t-sql/queries/hints-transact-sql-query) query hint by explicitly specifying, by setting a specific plan using Query Store, or by enabling [automatic tuning](sql-database-automatic-tuning.md).
- Replace the single procedure with a nested set of procedures that can each be used based on conditional logic and the associated parameter values.
- Create dynamic string execution alternatives to a static procedure definition.

For more information about resolving PSP problems, see these blog posts:

- [I smell a parameter](https://blogs.msdn.microsoft.com/queryoptteam/2006/03/31/i-smell-a-parameter/)
- [Conor vs. dynamic SQL vs. procedures vs. plan quality for parameterized queries](https://blogs.msdn.microsoft.com/conor_cunningham_msft/2009/06/03/conor-vs-dynamic-sql-vs-procedures-vs-plan-quality-for-parameterized-queries/)
- [SQL query optimization techniques in SQL Server: Parameter sniffing](https://www.sqlshack.com/query-optimization-techniques-in-sql-server-parameter-sniffing/)

### Compile activity caused by improper parameterization

When a query has literals, either the database engine automatically parameterizes the statement or a user explicitly parameterizes the statement to reduce number of compilations. A high number of compilations for a query using the same pattern but different literal values can result in high CPU utilization. Similarly, if you only partially parameterize a query that continues to have literals, the database engine doesn't parameterize the query further.  

Here's an example of a partially parameterized query:

```sql
SELECT * 
FROM t1 JOIN t2 ON t1.c1 = t2.c1
WHERE t1.c1 = @p1 AND t2.c2 = '961C3970-0E54-4E8E-82B6-5545BE897F8F'
```

In this example, `t1.c1` takes `@p1`, but `t2.c2` continues to take GUID as literal. In this case, if you change the value for `c2`, the query is treated as a different query, and a new compilation will happen. To reduce compilations in this example, you would also parameterize the GUID.

The following query shows the count of queries by query hash to determine whether a query is properly parameterized:

```sql
SELECT  TOP 10  
  q.query_hash
  , count (distinct p.query_id ) AS number_of_distinct_query_ids
  , min(qt.query_sql_text) AS sampled_query_text
FROM sys.query_store_query_text AS qt
  JOIN sys.query_store_query AS q
     ON qt.query_text_id = q.query_text_id
  JOIN sys.query_store_plan AS p 
     ON q.query_id = p.query_id
  JOIN sys.query_store_runtime_stats AS rs 
     ON rs.plan_id = p.plan_id
  JOIN sys.query_store_runtime_stats_interval AS rsi
     ON rsi.runtime_stats_interval_id = rs.runtime_stats_interval_id
WHERE
  rsi.start_time >= DATEADD(hour, -2, GETUTCDATE())
  AND query_parameterization_type_desc IN ('User', 'None')
GROUP BY q.query_hash
ORDER BY count (distinct p.query_id) DESC
```

### Factors that affect query plan changes

A query execution plan recompilation might result in a generated query plan that differs from what was originally cached. An existing original plan might be automatically recompiled for various reasons:
- Changes in the schema are referenced by the query.
- Data changes to the tables are referenced by the query. 
- Query context options were changed.

A compiled plan might be ejected from the cache for various reasons, such as:

- Instance restarts.
- Database-scoped configuration changes.
- Memory pressure.
- Explicit requests to clear the cache.

If you use a RECOMPILE hint, a plan won't be cached.

A recompilation (or fresh compilation after cache eviction) can still result in the generation of a query execution plan that's identical to the original. When the plan changes from the prior or original plan, these are the most common explanations:

- **Changed physical design.** For example, newly created indexes more effectively cover the requirements of a query. The new indexes might be used on a new compilation if the query optimizer decides that leveraging that new index is more optimal than using the data structure that was originally selected for the first version of the query execution.  Any physical changes to the referenced objects might result in a new plan choice at compile time.

- **Server resource differences.** When a plan in one system differs from the plan in another system, resource availability, such as the number of available processors, can influence which plan gets generated.  For example, if one system has more processors, a parallel plan might be chosen. 

- **Different statistics.** The statistics associated with the referenced objects changed or might be materially different from the original system's statistics.  If the statistics change and a recompilation happens, the query optimizer uses statistics starting from that point in time. The revised statistics' data distributions and frequencies might differ from those of the original compilation.  These changes are used to create cardinality estimates (the number of rows that are expected to flow through the logical query tree). Changes to cardinality estimates might lead you to choose different physical operators and associated orders of operations.  Even minor changes to statistics can result in a changed query execution plan.

- **Changed database compatibility level or cardinality estimator version.**  Changes to the database compatibility level can enable new strategies and features that might result in a different query execution plan.  Beyond the database compatibility level, a disabled or enabled trace flag 4199 or a changed the state of the database scoped configuration QUERY_OPTIMIZER_HOTFIXES can also influence query execution plan choices at compile time.  Trace flags 9481 (force legacy CE) and 2312 (force default CE) also affect the plan. 

### Resolve problem queries or provide more resources

Once you identify the problem, you can either tune the problem queries or upgrade the compute size or service tier to increase the capacity of your Azure SQL database to absorb the CPU requirements. For information on scaling resources for single databases, see [Scale single database resources in Azure SQL Database](sql-database-single-database-scale.md) and for scaling resources for elastic pools, see [Scale elastic pool resources in Azure SQL Database](sql-database-elastic-pool-scale.md). For information on scaling a managed instance, see [Instance-level resource limits](sql-database-managed-instance-resource-limits.md#instance-level-resource-limits).

### Determine if running problems are caused by increased workload volume

An increase in application traffic and workload can account for increased CPU utilization, but you must be careful to properly diagnose this problem. In a high-CPU scenario, answer these questions to determine if indeed a CPU increase is due to workload volume changes:

1. Are the queries from the application the cause of the high-CPU problem?
2. For the top CPU-consuming queries (that can be identified):

   - Determine if there were multiple execution plans associated with the same query. If so, determine why.
   - For queries with the same execution plan, determine if the execution times were consistent and if the execution count increased. If yes, there are likely performance problems due to workload increase.

To summarize, if the query execution plan didn't execute differently but CPU utilization increased along with execution count, there is likely a workload increase-related performance problem.

It is not always easy to conclude there is a workload volume change that is driving a CPU problem.   Factors to consider: 

- **Resource usage changed**

  For example, consider a scenario where CPU increased to 80% for an extended period of time.  CPU utilization alone doesn't mean workload volume changed.  Query execution plan regressions and data distribution changes can also contribute to more resource usage even though the application is executing the same exact workload.

- **New query appeared**

   An application may drive a new set of queries at different times.

- **Number of requests increased or decreased**

   This scenario is the most obvious measure of workload. The number of queries doesn't always correspond to more resource utilization. However, this metric is still a significant signal assuming other factors are unchanged.

## Performance problems related to waiting 

Once you are certain that you are not facing a high-CPU, running-related performance problem, you are facing a waiting-related performance problem. Namely, your CPU resources are not being used efficiently because the CPU is waiting on some other resource. In this case, your next step is to identify what your CPU resources are waiting on. The most common methods for showing the top wait type categories are:

- The [Query Store](https://docs.microsoft.com/sql/relational-databases/performance/monitoring-performance-by-using-the-query-store) provides wait statistics per query over time. In Query Store, wait types are combined into wait categories. The mapping of wait categories to wait types is available in [sys.query_store_wait_stats](https://docs.microsoft.com/sql/relational-databases/system-catalog-views/sys-query-store-wait-stats-transact-sql#wait-categories-mapping-table).
- [sys.dm_db_wait_stats](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-db-wait-stats-azure-sql-database) returns information about all the waits encountered by threads that executed during operation. You can use this aggregated view to diagnose performance problems with Azure SQL Database and also with specific queries and batches.
- [sys.dm_os_waiting_tasks](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-os-waiting-tasks-transact-sql) returns information about the wait queue of tasks that are waiting on some resource.

In high-CPU scenarios, the Query Store and wait statistics do not always reflect CPU utilization for these two reasons:

- High-CPU consuming queries may still be executing and the queries haven't finished
- The high-CPU consuming queries were running when a failover occurred

Query Store and wait statistics-tracking DMVs only show results for successfully completed and timed-out queries and do not show data for currently executing statements (until they complete). The dynamic management view [sys.dm_exec_requests](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-requests-transact-sql) allows you to track currently executing queries and the associated worker time.

As shown in the previous chart, the most common waits are:

- Locks (blocking)
- I/O
- `tempdb`-related contention
- Memory grant waits

> [!IMPORTANT]
> For a set a T-SQL queries using these DMVs to troubleshoot these waiting-related problems, see:
>
> - [Identify I/O performance issues](sql-database-monitoring-with-dmvs.md#identify-io-performance-issues)
> - [Identify `tempdb` performance issues](sql-database-monitoring-with-dmvs.md#identify-io-performance-issues)
> - [Identify memory grant waits](sql-database-monitoring-with-dmvs.md#identify-memory-grant-wait-performance-issues)
> - [TigerToolbox - Waits and Latches](https://github.com/Microsoft/tigertoolbox/tree/master/Waits-and-Latches)
> - [TigerToolbox - usp_whatsup](https://github.com/Microsoft/tigertoolbox/tree/master/usp_WhatsUp)

## Improve database performance with more resources

Finally, if there are no actionable items that can improve performance of your database, you can change the amount of resources available in Azure SQL Database. Assign more resources by changing the [DTU service tier](sql-database-service-tiers-dtu.md) of a single database or increase the eDTUs of an elastic pool at any time. Alternatively, if you're using the [vCore-based purchasing model](sql-database-service-tiers-vcore.md), change either the service tier or increase the resources allocated to your database.

1. For single databases, you can [change service tiers](sql-database-single-database-scale.md) or [compute resources](sql-database-single-database-scale.md) on-demand to improve database performance.
2. For multiple databases, consider using [elastic pools](sql-database-elastic-pool-guidance.md) to scale resources automatically.

## Tune and refactor application or database code

You can change application code to more optimally use the database, change indexes, force plans, or use hints to manually adapt the database to your workload. Find guidance and tips for manual tuning and rewriting the code in the [performance guidance topic](sql-database-performance-guidance.md) article.

## Next steps

- To enable automatic tuning in Azure SQL Database and let automatic tuning feature fully manage your workload, see [Enable automatic tuning](sql-database-automatic-tuning-enable.md).
- To use manual tuning, you can review [Tuning recommendations in Azure portal](sql-database-advisor-portal.md) and manually apply the ones that improve performance of your queries.
- Change resources that are available in your database by changing [Azure SQL Database service tiers](sql-database-performance-guidance.md)
