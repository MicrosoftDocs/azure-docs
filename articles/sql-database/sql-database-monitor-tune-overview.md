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

Azure SQL Database provides tools and methods you can use to monitor usage easily, add or remove resources (such as CPU, memory, or I/O), troubleshoot potential problems, and make recommendations to improve the performance of a database. Features in Azure SQL Database can automatically fix problems in the databases. 

Automatic tuning enables a database to adapt to the workload and automatically optimize performance. However, some custom issues might need troubleshooting. This article explains some best practices and some tools you can use to troubleshoot performance problems.

To ensure that a database runs without problems, you should:
- [Monitor database performance](#monitor-database-performance) to make sure that the resources assigned to the database can handle the workload. If the database is hitting resource limits, consider:
   - Identifying and optimizing the top resource-consuming queries.
   - Adding more resources by [upgrading the service tier](https://docs.microsoft.com/azure/sql-database/sql-database-scale-resources).
- [Troubleshoot performance problems](#troubleshoot-performance-problems) to identify why a potential problem occurred and to identify the root cause of the problem. After you identify the root cause, take steps to fix the problem.

## Monitor database performance

To monitor the performance of a SQL database in Azure, start by monitoring the resources used relative to the level of database performance you chose. Monitor the following resources:
 - **CPU usage**: Check to see if the database is reaching 100 percent of CPU usage for an extended period of time. High CPU usage might indicate that you need to identify and tune queries that use the most compute power. High CPU usage might also indicate that the database or instance should be upgraded to a higher service tier. 
 - **Wait statistics**: Use [sys.dm_os_wait_stats (Transact-SQL)](/sql/relational-databases/system-dynamic-management-views/sys-dm-os-wait-stats-transact-sql) to determine how long queries are waiting. Queries can be waiting on resources, queue waits, or external waits. 
 - **IO usage**: Check to see if the database is reaching the IO limits of the underlying storage.
 - **Memory usage**: The amount of memory available for the database or instance is proportional to the number of vCores. Make sure the memory is enough for the workload. Page life expectancy is one of the parameters that can indicate how quickly the pages are removed from the memory.

The Azure SQL Database service includes tools and resources to help you troubleshoot and fix potential performance problems. You can identify opportunities to improve and optimize query performance without changing resources by reviewing [performance tuning recommendations](sql-database-advisor.md). 

Missing indexes and poorly optimized queries are common reasons for poor database performance. You can apply tuning recommendations to improve the performance of the workload. You can also let Azure SQL Database [automatically optimize performance of the queries](sql-database-automatic-tuning.md) by applying all identified recommendations. Then verify that the recommendations improved database performance.

> [!NOTE]
> Indexing is available in single database and elastic pools only. Indexing isn't available in a managed instance.

Choose from the following options to monitor and troubleshoot database performance:

- In the [Azure portal](https://portal.azure.com), select **SQL databases** and select the database. In the **Monitoring** chart, look for resources approaching their maximum utilization. DTU consumption is shown by default. Select **Edit** to change the time range and values shown.
- Tools such as SQL Server Management Studio provide many useful reports, like [Performance Dashboard](https://docs.microsoft.com/sql/relational-databases/performance/performance-dashboard). Use these reports to monitor resource usage and identify top resource-consuming queries. You can use [Query Store](https://docs.microsoft.com/sql/relational-databases/performance/monitoring-performance-by-using-the-query-store#Regressed) to identify queries whose performance has regressed.
- In the [Azure portal](https://portal.azure.com), use [Query Performance Insight](sql-database-query-performance.md) to identify the queries that use the most resources. This feature is available in single database and elastic pools only.
- Use [SQL Database Advisor](sql-database-advisor-portal.md) to view recommendations to help you create and drop indexes, parameterize queries, and fix schema problems. This feature is available in single database and elastic pools only.
- Use [Azure SQL Intelligent Insights](sql-database-intelligent-insights.md) to automatically monitor database performance. When a performance problem is detected, a diagnostic log is generated. The log provides details and a root cause analysis (RCA) of the problem. A performance-improvement recommendation is provided when possible.
- [Enable automatic tuning](sql-database-automatic-tuning-enable.md) to let Azure SQL Database automatically fix performance problems.
- Use [dynamic management views (DMVs)](sql-database-monitoring-with-dmvs.md), [extended events](sql-database-xevent-db-diff-from-svr.md), and [Query Store](https://docs.microsoft.com/sql/relational-databases/performance/monitoring-performance-by-using-the-query-store) for help with more detailed troubleshooting of performance problems.

> [!TIP]
> After you identify a performance problem, check out our [performance guidance](sql-database-performance-guidance.md) to find techniques to improve the performance of Azure SQL Database.

## Troubleshoot performance problems

To diagnose and resolve performance problems, begin by finding out the state of each active query and the conditions that cause performance problems relevant to each workload state. To improve Azure SQL Database performance, you need to understand that each active query request from the application is in either a running state or a waiting state. As you troubleshoot a performance problem in Azure SQL Database, keep the following diagram in mind.

![Workload states](./media/sql-database-monitor-tune-overview/workload-states.png)

A performance problem in a workload can be caused by CPU contention (a *running-related* condition) or individual queries that are waiting on something (a *waiting-related* condition).

Running-related problems might be caused by:
- **Compilation problems**: SQL Query Optimizer might produce a suboptimal plan because of stale statistics, an incorrect estimate of the number of rows to be processed, or an inaccurate estimate of required memory. If you know the query was executed faster in the past or on another instance (either a managed instance or a SQL Server instance), compare the actual execution plans to see if they're different. Try to apply query hints or rebuild statistics or indexes to get the better plan. Enable automatic plan correction in Azure SQL Database to automatically mitigate these problems.
- **Execution problems**: If the query plan is optimal, it's probably hitting the database's resource limits, such as log write throughput. Or it might be using fragmented indexes that should be rebuilt. Execution problems can also happen when a large number of concurrent queries need the same resources. *Waiting-related* problems are usually related to execution problems, because the queries that don't execute efficiently are probably waiting for some resources.

Waiting-related problems might be caused by:
- **Blocking**: One query might hold the lock on objects in the database while others try to access the same objects. You can identify blocking queries by using DMVs or monitoring tools.
- **IO problems**: Queries might be waiting for the pages to be written to the data or log files. In this case, check the `INSTANCE_LOG_RATE_GOVERNOR`, `WRITE_LOG`, or `PAGEIOLATCH_*` wait statistics in the DMV.
- **TempDB problems**: If the workload uses temporary tables or there are TempDB spills in the plans, the queries might have a problem with TempDB throughput. 
- **Memory-related problems**: If the workload doesn't have enough memory, the page life expectancy might drop, or the queries might get less memory than they need. In some cases, built-in intelligence in Query Optimizer will fix memory-related problems.
 
The following sections explain how to identify and troubleshoot some types of problems.

## Performance problems related to running

As a general guideline, if CPU usage is consistently at or above 80 percent, your performance problem is running-related. A running-related problem might be caused by insufficient CPU resources. Or it might be related to one of the following conditions:

- Too many running queries
- Too many compiling queries
- One or more executing queries that use a suboptimal query plan

If you find a running-related performance problem, your goal is to identify the precise problem by using one or more methods. These methods are the most common ways to identify running-related problems:

- Use the [Azure portal](sql-database-manage-after-migration.md#monitor-databases-using-the-azure-portal) to monitor CPU percentage usage.
- Use the following [DMVs](sql-database-monitoring-with-dmvs.md):

  - The [sys.dm_db_resource_stats](sql-database-monitoring-with-dmvs.md#monitor-resource-use) DMV returns CPU, I/O, and memory consumption for an SQL database. One row exists for every 15-second interval, even if there's no activity in the database. Historical data is maintained for one hour.
  - The [sys.resource_stats](sql-database-monitoring-with-dmvs.md#monitor-resource-use) DMV returns CPU usage and storage data for Azure SQL Database. The data is collected and aggregated in five-minute intervals.

> [!IMPORTANT]
> To troubleshoot CPU usage problems for T-SQL queries that use the sys.dm_db_resource_stats and sys.resource_stats DMVs, see [Identify CPU performance issues](sql-database-monitoring-with-dmvs.md#identify-cpu-performance-issues).

### <a name="ParamSniffing"></a> Queries that have PSP problems

A parameter sensitive plan (PSP) problem happens when the query optimizer generates a query execution plan that's optimal only for a specific parameter value (or set of values) and the cached plan is then not optimal for parameter values that are used in consecutive executions. Plans that aren't optimal can then cause query performance problems and degrade overall workload throughput. 

For more information on parameter sniffing and query processing, see the [Query-processing architecture guide](/sql/relational-databases/query-processing-architecture-guide#ParamSniffing).

Several workarounds can mitigate PSP problems. Each workaround has associated tradeoffs and drawbacks:

- Use the [RECOMPILE](https://docs.microsoft.com/sql/t-sql/queries/hints-transact-sql-query) query hint at each query execution. This workaround trades compilation time and increased CPU for better plan quality. The `RECOMPILE` option is often not possible for workloads that require a high throughput.
- Use the [OPTION (OPTIMIZE FOR…)](https://docs.microsoft.com/sql/t-sql/queries/hints-transact-sql-query) query hint to override the actual parameter value with a typical parameter value that produces a plan that's good enough for most parameter value possibilities. This option requires a good understanding of optimal parameter values and associated plan characteristics.
- Use the [OPTION (OPTIMIZE FOR UNKNOWN)](https://docs.microsoft.com/sql/t-sql/queries/hints-transact-sql-query) query hint to override the actual parameter value and instead use the density vector average. You can also do this by capturing the incoming parameter values in local variables and then using the local variables within the predicates instead of using the parameters themselves. For this fix, the average density must be *good enough*.
- Disable parameter sniffing entirely by using the [DISABLE_PARAMETER_SNIFFING](https://docs.microsoft.com/sql/t-sql/queries/hints-transact-sql-query) query hint.
- Use the [KEEPFIXEDPLAN](https://docs.microsoft.com/sql/t-sql/queries/hints-transact-sql-query) query hint to prevent recompilations in cache. This workaround assumes that the good-enough common plan is the one in cache already. You can also disable automatic statistics updates to reduce the chances that the good plan will be evicted and a new bad plan will be compiled.
- Force the plan by explicitly using the [USE PLAN](https://docs.microsoft.com/sql/t-sql/queries/hints-transact-sql-query) query hint by rewriting the query and adding the hint in the query text. Or set a specific plan by using Query Store or by enabling [automatic tuning](sql-database-automatic-tuning.md).
- Replace the single procedure with a nested set of procedures that can each be used based on conditional logic and the associated parameter values.
- Create dynamic string execution alternatives to a static procedure definition.

For more information about resolving PSP problems, see these blog posts:

- [I smell a parameter](https://blogs.msdn.microsoft.com/queryoptteam/2006/03/31/i-smell-a-parameter/)
- [Conor vs. dynamic SQL vs. procedures vs. plan quality for parameterized queries](https://blogs.msdn.microsoft.com/conor_cunningham_msft/2009/06/03/conor-vs-dynamic-sql-vs-procedures-vs-plan-quality-for-parameterized-queries/)
- [SQL query optimization techniques in SQL Server: Parameter sniffing](https://www.sqlshack.com/query-optimization-techniques-in-sql-server-parameter-sniffing/)

### Compile activity caused by improper parameterization

When a query has literals, either the database engine automatically parameterizes the statement or a user explicitly parameterizes the statement to reduce the number of compilations. A high number of compilations for a query using the same pattern but different literal values can result in high CPU usage. Similarly, if you only partially parameterize a query that continues to have literals, the database engine doesn't parameterize the query further.  

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

A query execution plan recompilation might result in a generated query plan that differs from the original cached plan. An existing original plan might be automatically recompiled for various reasons:
- Changes in the schema are referenced by the query.
- Data changes to the tables are referenced by the query. 
- Query context options were changed.

A compiled plan might be ejected from the cache for various reasons, such as:

- Instance restarts.
- Database-scoped configuration changes.
- Memory pressure.
- Explicit requests to clear the cache.

If you use a RECOMPILE hint, a plan won't be cached.

A recompilation (or fresh compilation after cache eviction) can still result in the generation of a query execution plan that's identical to the original. When the plan changes from the prior or original plan, these explanations are likely:

- **Changed physical design**: For example, newly created indexes more effectively cover the requirements of a query. The new indexes might be used on a new compilation if the query optimizer decides that using that new index is more optimal than using the data structure that was originally selected for the first version of the query execution.  Any physical changes to the referenced objects might result in a new plan choice at compile time.

- **Server resource differences**: When a plan in one system differs from the plan in another system, resource availability, such as the number of available processors, can influence which plan gets generated.  For example, if one system has more processors, a parallel plan might be chosen. 

- **Different statistics**: The statistics associated with the referenced objects might have changed or might be materially different from the original system's statistics.  If the statistics change and a recompilation happens, the query optimizer uses the statistics starting from when they changed. The revised statistics' data distributions and frequencies might differ from those of the original compilation.  These changes are used to create cardinality estimates. (*Cardinality estimates* are the number of rows that are expected to flow through the logical query tree.) Changes to cardinality estimates might lead you to choose different physical operators and associated orders of operations.  Even minor changes to statistics can result in a changed query execution plan.

- **Changed database compatibility level or cardinality estimator version**:  Changes to the database compatibility level can enable new strategies and features that might result in a different query execution plan.  Beyond the database compatibility level, a disabled or enabled trace flag 4199 or a changed state of the database-scoped configuration QUERY_OPTIMIZER_HOTFIXES can also influence query execution plan choices at compile time.  Trace flags 9481 (force legacy CE) and 2312 (force default CE) also affect the plan. 

### Resolve problem queries or provide more resources

After you identify the problem, you can either tune the problem queries or upgrade the compute size or service tier to increase the capacity of your SQL database to absorb the CPU requirements. 

For more information, see [Scale single database resources in Azure SQL Database](sql-database-single-database-scale.md) and [Scale elastic pool resources in Azure SQL Database](sql-database-elastic-pool-scale.md). For information about scaling a managed instance, see [Instance-level resource limits](sql-database-managed-instance-resource-limits.md#instance-level-resource-limits).

### Performance problems caused by increased workload volume

An increase in application traffic and workload volume can cause increased CPU usage. But you must be careful to properly diagnose this problem. When you see a high-CPU problem, answer these questions to determine whether the increase is caused by changes to the workload volume:

- Are the queries from the application the cause of the high-CPU problem?
- For the top CPU-consuming queries that you can identify:

   - Were multiple execution plans associated with the same query? If so, why?
   - For queries with the same execution plan, were the execution times consistent? Did the execution count increase? If so, the workload increase is likely causing performance problems.

In summary, if the query execution plan didn't execute differently but CPU usage increased along with execution count, the performance problem is likely related to a workload increase.

It's not always easy to identify a workload volume change that's driving a CPU problem. Consider these factors: 

- **Changed resource usage**: For example, consider a scenario where CPU usage increased to 80 percent for an extended period of time.  CPU usage alone doesn't mean the workload volume changed. Regressions in the query execution plan and changes in data distribution can also contribute to more resource usage even though the application executes the same workload.

- **The appearance of a new query**: An application might drive a new set of queries at different times.

- **An increase or decrease in the number of requests**: This scenario is the most obvious measure of a workload. The number of queries doesn't always correspond to more resource utilization. However, this metric is still a significant signal, assuming other factors are unchanged.

## Waiting-related performance problems 

If you're sure that your performance problem isn't related to high CPU usage or to running, your problem is related to waiting. Namely, your CPU resources aren't being used efficiently because the CPU is waiting on some other resource. In this case, identify what your CPU resources are waiting on. 

These methods are commonly used to show the top categories of wait types:

- Use [Query Store](https://docs.microsoft.com/sql/relational-databases/performance/monitoring-performance-by-using-the-query-store) to find wait statistics for each query over time. In Query Store, wait types are combined into wait categories. You can find the mapping of wait categories to wait types in [sys.query_store_wait_stats](https://docs.microsoft.com/sql/relational-databases/system-catalog-views/sys-query-store-wait-stats-transact-sql#wait-categories-mapping-table).
- Use [sys.dm_db_wait_stats](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-db-wait-stats-azure-sql-database) to return information about all the waits encountered by threads that executed during operation. You can use this aggregated view to diagnose performance problems with Azure SQL Database and also with specific queries and batches.
- Use [sys.dm_os_waiting_tasks](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-os-waiting-tasks-transact-sql) to return information about the queue of tasks that are waiting on some resource.

In high-CPU scenarios, Query Store and wait statistics might not reflect CPU usage if:

- High-CPU-consuming queries are still executing.
- The high-CPU-consuming queries were running when a failover happened.

DMVs that track Query Store and wait statistics show results for only successfully completed and timed-out queries. They don't show data for currently executing statements until the statements finish. Use the dynamic management view [sys.dm_exec_requests](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-requests-transact-sql) to track currently executing queries and the associated worker time.

The chart near the beginning of this article shows that the most common waits are:

- Locks (blocking)
- I/O
- Contention related to TempDB
- Memory grant waits

> [!IMPORTANT]
> For a set of T-SQL queries that use DMVs to troubleshoot waiting-related problems, see:
>
> - [Identify I/O performance issues](sql-database-monitoring-with-dmvs.md#identify-io-performance-issues)
> - [Identify memory grant waits](sql-database-monitoring-with-dmvs.md#identify-memory-grant-wait-performance-issues)
> - [TigerToolbox waits and latches](https://github.com/Microsoft/tigertoolbox/tree/master/Waits-and-Latches)
> - [TigerToolbox usp_whatsup](https://github.com/Microsoft/tigertoolbox/tree/master/usp_WhatsUp)

## Improve database performance with more resources

If no actionable items can improve your database performance, you can change the amount of resources available in Azure SQL Database. Assign more resources by changing the [DTU service tier](sql-database-service-tiers-dtu.md) of a single database. Or increase the eDTUs of an elastic pool at any time. Alternatively, if you're using the [vCore-based purchasing model](sql-database-service-tiers-vcore.md), either change the service tier or increase the resources allocated to your database.

For single databases, you can [change service tiers or compute resources](sql-database-single-database-scale.md) on demand to improve database performance. For multiple databases, consider using [elastic pools](sql-database-elastic-pool-guidance.md) to scale resources automatically.

## Tune and refactor application or database code

You can optimize the application code for the database, change indexes, force plans, or use hints to manually adapt the database to your workload. For information about manual tuning and rewriting the code, see [Performance tuning guidance](sql-database-performance-guidance.md).

## Next steps

- To enable automatic tuning in Azure SQL Database and let the automatic tuning feature fully manage your workload, see [Enable automatic tuning](sql-database-automatic-tuning-enable.md).
- To use manual tuning, review [Tuning recommendations in the Azure portal](sql-database-advisor-portal.md). Manually apply the recommendations that improve performance of your queries.
- Change the resources that are available in your database by changing [Azure SQL Database service tiers](sql-database-performance-guidance.md).
