---
title: Monitoring & performance tuning - Azure SQL Database | Microsoft Docs
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

Azure SQL Database provides tools and methods to easily monitor usage, and add or remove resources (CPU, memory, I/O), troubleshoot potential issues, and make recommendations for improving performance of a database. Azure SQL Database has features that can automatically fix issues in the databases. Automatic tuning enables a database to adapt to the workload and automatically optimize performance. However, there are some custom issues that might need troubleshooting. This article explains some best practices and tools that can be used to troubleshoot the performance issues.

There are two main activities that should be done to ensure that a database is running without issues:
- [Monitor database performance](#monitoring-database-performance) to make sure that the resources assigned to the database can handle the workload. If you see that a database is hitting resource limits consider:
   - identifying and optimizing top resource consuming queries.
   - adding more resources by upgrading the service tier.
- [Troubleshoot performance issues](#troubleshoot-performance-issues) to identify why a potential issue occurred, identify the root cause of the issue. Once the root cause is determined implement steps to fix the issue.

## Monitoring database performance

Monitoring the performance of a SQL database in Azure starts with monitoring the resources used relative to the chosen level of database performance. The following resources should be monitored:
 - **CPU usage** - Check if the database is reaching 100% of CPU usage for an extended period of time. High CPU usage might indicate that queries using the most compute power should be identified and tuned. Or, high CPU usage might indicate that the database or instance should be upgraded to a higher service tier. 
 - **Wait statistics** - Use [sys.dm_os_wait_stats (Transact-SQL)](/sql/relational-databases/system-dynamic-management-views/sys-dm-os-wait-stats-transact-sql) to determine the waits that queries are experiencing. Queries can be waiting on resources, queue waits or external waits. 
 - **IO usage** - Check if the database is reaching the IO limits of the underlying storage.
 - **Memory usage** - The amount of memory available for the database or instance is proportional to the number of vCores. Verify the memory is enough for the workload. Page life expectancy is one of the parameters that can indicate how quickly the pages are removed from the memory.

Azure SQL Database service **includes the tools and resources to help troubleshoot and fix potential performance issues**. Opportunities can be identified to improve and optimize query performance without changing resources by reviewing [performance tuning recommendations](sql-database-advisor.md). Missing indexes and poorly optimized queries are common reasons for poor database performance. These tuning recommendations can be applied to improve performance of the workload. We can also let Azure SQL database [automatically optimize performance of the queries](sql-database-automatic-tuning.md) by applying all identified recommendations and verifying the recommendations improved database performance.

The following options are available for monitoring and troubleshooting database performance:

- In the [Azure portal](https://portal.azure.com), click **SQL databases**, select the database, and then use the Monitoring chart to look for resources approaching their maximum utilization. DTU consumption is shown by default. Click **Edit** to change the time range and values shown.
- Tools such as SQL Server Management Studio provide many useful reports like a [Performance Dashboard](https://docs.microsoft.com/sql/relational-databases/performance/performance-dashboard?view=sql-server-2017) to monitor resource utilization and identify top resource consuming queries.[Query Store](https://docs.microsoft.com/sql/relational-databases/performance/monitoring-performance-by-using-the-query-store#Regressed) can be used to identify queries with regressed performance.
- Use [Query Performance Insight](sql-database-query-performance.md) in the [Azure portal](https://portal.azure.com) to identify the queries utilizing the most resources. This feature is available in Single Database and Elastic Pools only.
- Use [SQL Database Advisor](sql-database-advisor-portal.md) to view recommendations for creating and dropping indexes, parameterizing queries, and fixing schema issues. This feature is available in Single Database and Elastic Pools only.
- Use [Azure SQL Intelligent Insights](sql-database-intelligent-insights.md) for automatic monitoring of the database performance. Once a performance issue is detected, a diagnostic log is generated with details and Root Cause Analysis (RCA) of the issue. Performance improvement recommendation is provided when possible.
- [Enable automatic tuning](sql-database-automatic-tuning-enable.md) and let Azure SQL database automatically fix identified performance issues.
- Use [dynamic management views (DMVs)](sql-database-monitoring-with-dmvs.md), [extended events](sql-database-xevent-db-diff-from-svr.md), and the [Query Store](https://docs.microsoft.com/sql/relational-databases/performance/monitoring-performance-by-using-the-query-store) for more detailed troubleshooting of performance issues.

> [!TIP]
> See [performance guidance](sql-database-performance-guidance.md) to find techniques that you can use to improve performance of Azure SQL Database after identifying the performance issue using one or more of the above methods.

## Troubleshoot performance issues

To diagnose and resolve performance issues, begin by understanding the state of each active query and the conditions that cause performance issues relevant to each workload state. To improve Azure SQL Database performance, understand that each active query request from the application is either in a running or a waiting state. When troubleshooting a performance issue in Azure SQL Database, keep the following chart in mind as we read through this article to diagnose and resolve performance issues.

![Workload states](./media/sql-database-monitor-tune-overview/workload-states.png)

For a workload with performance issues, the performance issue may be due to CPU contention (a **running-related** condition) or individual queries are waiting on something (a **waiting-related** condition).

The causes for **running-related** issues might be:
- **Compilation issues** - SQL Query Optimizer might produce a suboptimal plan due to stale statistics, incorrect estimation of the number of rows that will be processed, or inaccurate estimate of required memory. If we know the query was executed faster in the past or on other instance (either Managed Instance or SQL Server instance), take the actual execution plans and compare them to see if they are different. Try to apply query hints or rebuild statistics or rebuild indexes to get the better plan. Enable Automatic plan correction in Azure SQL Database to automatically mitigate these issues.
- **Execution issues** - If the query plan is optimal then it is probably hitting  resource limits in the database such as log write throughput or it is using fragmented indexes that should be rebuilt. A large number of concurrent queries that need the same resources might also be the cause of execution issues. **Waiting-related** issues in most of the cases are related to the execution issues, because the queries that are not executing efficiently are probably waiting for some resources.

The causes for **waiting-related** issues might be:
- **Blocking** - One query might hold the lock on objects in the database while others are trying to access the same objects. Blocking queries can be easily identified using DMVs or monitoring tools.
- **IO issues** - Queries might be waiting for the pages to be written to the data or log files. In this case see `INSTANCE_LOG_RATE_GOVERNOR`, `WRITE_LOG`, or `PAGEIOLATCH_*` wait statistics in the DMV.
- **TempDB issues** - If the workload uses temporary tables or there are TempDB spills in the plans the queries might have an issue with TempDB throughput. 
- **Memory-related issues** - There may not be enough memory for the workload so the page life expectancy might drop, or the queries are getting less memory than needed. In some cases, built-in intelligence in Query Optimizer will fix these issues.
 
 The following sections will explain how to identify and troubleshoot some of these issues.

## Running-related performance issues

As a general guideline, if the CPU utilization is consistently at or above 80%, there is a running-related performance issue. If there is a running-related issue, it may be caused by insufficient CPU resources or it may be related to one of the following conditions:

- Too many running queries
- Too many compiling queries
- One or more executing queries are using a suboptimal query plan

If it is determined that there is a running-related performance issue, the goal is to identify the precise issue using one or more methods. The most common methods for identifying running-related issues are:

- Use the [Azure portal](sql-database-manage-after-migration.md#monitor-databases-using-the-azure-portal) to monitor CPU percentage utilization.
- Use the following [dynamic management views](sql-database-monitoring-with-dmvs.md):

  - [sys.dm_db_resource_stats](sql-database-monitoring-with-dmvs.md#monitor-resource-use) returns CPU, I/O, and memory consumption for an Azure SQL Database. One row exists for every 15-second interval, even if there is no activity in the database. Historical data is maintained for one hour.
  - [sys.resource_stats](sql-database-monitoring-with-dmvs.md#monitor-resource-use) returns CPU usage and storage data for an Azure SQL Database. The data is collected and aggregated within five-minute intervals.

> [!IMPORTANT]
> For T-SQL queries using sys.dm_db_resource_stats and sys.resource_stats DMVs to troubleshoot CPU utilization issues, see [Identify CPU performance issues](sql-database-monitoring-with-dmvs.md#identify-cpu-performance-issues).

### <a name="ParamSniffing"></a> Troubleshoot queries with parameter-sensitive query execution plan issues

The parameter sensitive plan (PSP) problem refers to a scenario where the query optimizer generates a query execution plan that is optimal only for a specific parameter value (or set of values) and the cached plan is then non-optimal for parameter values used in consecutive executions. Non-optimal plans can then result in query performance issues and overall workload throughput degradation. For more information on parameter sniffing and query processing, see the [Query Processing Architecture Guide](/sql/relational-databases/query-processing-architecture-guide#ParamSniffing).

There are several workarounds used to mitigate these issues, each with associated tradeoffs and drawbacks:

- Use the [RECOMPILE](https://docs.microsoft.com/sql/t-sql/queries/hints-transact-sql-query) query hint at each query execution. This workaround trades compilation time and increased CPU for a better plan quality. Using the `RECOMPILE` option is often not possible for workloads that require a high throughput.
- Use the [OPTION (OPTIMIZE FOR…)](https://docs.microsoft.com/sql/t-sql/queries/hints-transact-sql-query) query hint to override the actual parameter value with a typical parameter value that produces a good enough plan for most parameter value possibilities.   This option requires a good understanding of optimal parameter values and associated plan characteristics.
- Use [OPTION (OPTIMIZE FOR UNKNOWN)](https://docs.microsoft.com/sql/t-sql/queries/hints-transact-sql-query) query hint to override the actual parameter value in exchange for using the density vector average. Another way to do this is by capturing the incoming parameter values into local variables and then using the local variables within the predicates instead of using the parameters themselves. The average density must be *good enough* with this particular fix.
- Disable parameter sniffing entirely using the [DISABLE_PARAMETER_SNIFFING](https://docs.microsoft.com/sql/t-sql/queries/hints-transact-sql-query) query hint.
- Use the [KEEPFIXEDPLAN](https://docs.microsoft.com/sql/t-sql/queries/hints-transact-sql-query) query hint to prevent recompiles while in cache. This workaround assumes the *good-enough* common plan is the one in cache already. You may also disable automatic updates to statistics in order to reduce the chance of the good plan being evicted and a new bad plan being compiled.
- Force the plan by explicitly using [USE PLAN](https://docs.microsoft.com/sql/t-sql/queries/hints-transact-sql-query) query hint (by explicitly specifying, by setting a specific plan using Query Store, or by enabling [Automatic Tuning](sql-database-automatic-tuning.md).
- Replace the single procedure with a nested set of procedures that can each be used based on conditional logic and the associated parameter values.
- Create dynamic string execution alternatives to a static procedure definition.

For more information about resolving these types of issues, see the blog posts:

- [I smell a parameter](https://blogs.msdn.microsoft.com/queryoptteam/2006/03/31/i-smell-a-parameter/)
- [dynamic sql versus plan quality for parameterized queries](https://blogs.msdn.microsoft.com/conor_cunningham_msft/2009/06/03/conor-vs-dynamic-sql-vs-procedures-vs-plan-quality-for-parameterized-queries/)
- [SQL Query Optimization Techniques in SQL Server: Parameter Sniffing](https://www.sqlshack.com/query-optimization-techniques-in-sql-server-parameter-sniffing/)

### Troubleshooting compile activity due to improper parameterization

When a query has literals, either the database engine chooses to automatically parameterize the statement or a user can explicitly parameterize it in order to reduce number of compiles. A high number of compiles for a query using the same pattern but different literal values can result in high CPU utilization. Similarly, if you only partially parameterize a query that continues to have literals, the database engine does not parameterize it further.  Below is an example of a partially parameterized query:

```sql
SELECT * 
FROM t1 JOIN t2 ON t1.c1 = t2.c1
WHERE t1.c1 = @p1 AND t2.c2 = '961C3970-0E54-4E8E-82B6-5545BE897F8F'
```

In the prior example, `t1.c1` takes `@p1` but `t2.c2` continues to take GUID as literal. In this case, if you change value for `c2`, the query will be treated as a different query and a new compilation will occur. To reduce compilations in the prior example, the solution is to also parameterize the GUID.

The following query shows the count of queries by query hash to determine if a query is properly parameterized or not:

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
### Factors influencing query plan changes

A query execution plan recompilation may result in a generated query plan that differs from what was originally cached. There are various reasons why an existing original plan might be automatically recompiled:
- Changes in the schema being referenced by the query
- Data changes to the tables being referenced by the query 
- Changes to query context options 

A compiled plan may be ejected from the cache for a variety of reasons, including instance restarts, database scoped configuration changes, memory pressure, and explicit requests to clear the cache. Additionally, using a RECOMPILE hint means a plan won't be cached.

A recompilation (or fresh compilation after cache eviction) can still result in the generation of an identical query execution plan from the one originally observed.  If there are changes to the plan compared to the prior or original plan, the following are the most common explanations for why a query execution plan changed:

- **Changed physical design**. For example, new indexes were created that more effectively cover the requirements of a query. The new indexes may be used on a new compilation if the query optimizer decides it is more optimal to leverage that new index than use the data structure originally selected for the first version of the query execution.  Any physical changes to the referenced objects may result in a new plan choice at compile time.

- **Server resource differences**. In a scenario where one plan differs on “system A” vs. “system B” – the availability of resources, such as number of available processors, can influence which plan gets generated.  For example, if one system has a higher number of processors, a parallel plan may be chosen. 

- **Different statistics**. The statistics associated with the referenced objects changed or are materially different from the original system’s statistics.  If the statistics change and a recompile occurs, the query optimizer will use statistics as of that specific point in time. The revised statistics may have  different data distributions and frequencies than the original compilation.  These changes are used to estimate cardinality estimates (number of rows anticipated to flow through the logical query tree).  Changes to cardinality estimates can lead us to choose different physical operators and associated order-of-operations.  Even minor changes to statistics can result in a changed query execution plan.

- **Changed database compatibility level or cardinality estimator version**.  Changes to the database compatibility level can enable new strategies and features that may result in a different query execution plan.  Beyond the database compatibility level, disabling or enabling trace flag 4199 or changing the state of the database scoped configuration QUERY_OPTIMIZER_HOTFIXES can also influence query execution plan choices at compile time.  Trace flags 9481 (force legacy CE) and 2312 (force default CE) are also plan affecting. 

### Resolve problem queries or provide more resources

Once you identify the issue, you can either tune the problem queries or upgrade the compute size or service tier to increase the capacity of your Azure SQL database to absorb the CPU requirements. For information on scaling resources for single databases, see [Scale single database resources in Azure SQL Database](sql-database-single-database-scale.md) and for scaling resources for elastic pools, see [Scale elastic pool resources in Azure SQL Database](sql-database-elastic-pool-scale.md). For information on scaling a managed instance, see [Instance-level resource limits](sql-database-managed-instance-resource-limits.md#instance-level-resource-limits).

### Determine if running issues due to increase workload volume

An increase in application traffic and workload can account for increased CPU utilization, but you must be careful to properly diagnose this issue. In a high-CPU scenario, answer these questions to determine if indeed a CPU increase is due to workload volume changes:

1. Are the queries from the application the cause of the high-CPU issue?
2. For the top CPU-consuming queries (that can be identified):

   - Determine if there were multiple execution plans associated with the same query. If so, determine why.
   - For queries with the same execution plan, determine if the execution times were consistent and if the execution count increased. If yes, there are likely performance issues due to workload increase.

To summarize, if the query execution plan didn't execute differently but CPU utilization increased along with execution count, there is likely a workload increase-related performance issue.

It is not always easy to conclude there is a workload volume change that is driving a CPU issue.   Factors to consider: 

- **Resource usage changed**

  For example, consider a scenario where CPU increased to 80% for an extended period of time.  CPU utilization alone doesn't mean workload volume changed.  Query execution plan regressions and data distribution changes can also contribute to more resource usage even though the application is executing the same exact workload.

- **New query appeared**

   An application may drive a new set of queries at different times.

- **Number of requests increased or decreased**

   This scenario is the most obvious measure of workload. The number of queries doesn't always correspond to more resource utilization. However, this metric is still a significant signal assuming other factors are unchanged.

## Waiting-related performance issues

Once you are certain that you are not facing a high-CPU, running-related performance issue, you are facing a waiting-related performance issue. Namely, your CPU resources are not being used efficiently because the CPU is waiting on some other resource. In this case, your next step is to identify what your CPU resources are waiting on. The most common methods for showing the top wait type categories are:

- The [Query Store](https://docs.microsoft.com/sql/relational-databases/performance/monitoring-performance-by-using-the-query-store) provides wait statistics per query over time. In Query Store, wait types are combined into wait categories. The mapping of wait categories to wait types is available in [sys.query_store_wait_stats](https://docs.microsoft.com/sql/relational-databases/system-catalog-views/sys-query-store-wait-stats-transact-sql#wait-categories-mapping-table).
- [sys.dm_db_wait_stats](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-db-wait-stats-azure-sql-database) returns information about all the waits encountered by threads that executed during operation. You can use this aggregated view to diagnose performance issues with Azure SQL Database and also with specific queries and batches.
- [sys.dm_os_waiting_tasks](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-os-waiting-tasks-transact-sql) returns information about the wait queue of tasks that are waiting on some resource.

In high-CPU scenarios, the Query Store and wait statistics do not always reflect CPU utilization for these two reasons:

- High-CPU consuming queries may still be executing and the queries haven't finished
- The high-CPU consuming queries were running when a failover occurred

Query Store and wait statistics-tracking dynamic management views only show results for successfully completed and timed-out queries and do not show data for currently executing statements (until they complete). The dynamic management view [sys.dm_exec_requests](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-requests-transact-sql) allows you to track currently executing queries and the associated worker time.

As shown in the previous chart, the most common waits are:

- Locks (blocking)
- I/O
- `tempdb`-related contention
- Memory grant waits

> [!IMPORTANT]
> For a set a T-SQL queries using these DMVs to troubleshoot these waiting-related issues, see:
>
> - [Identify I/O performance issues](sql-database-monitoring-with-dmvs.md#identify-io-performance-issues)
> - [Identify `tempdb` performance issues](sql-database-monitoring-with-dmvs.md#identify-io-performance-issues)
> - [Identify memory grant waits](sql-database-monitoring-with-dmvs.md#identify-memory-grant-wait-performance-issues)
> - [TigerToolbox - Waits and Latches](https://github.com/Microsoft/tigertoolbox/tree/master/Waits-and-Latches)
> - [TigerToolbox - usp_whatsup](https://github.com/Microsoft/tigertoolbox/tree/master/usp_WhatsUp)

## Improving database performance with more resources

Finally, if there are no actionable items that can improve performance of your database, you can change the amount of resources available in Azure SQL Database. Assign more resources by changing the [DTU service tier](sql-database-service-tiers-dtu.md) of a single database or increase the eDTUs of an elastic pool at any time. Alternatively, if you're using the [vCore-based purchasing model](sql-database-service-tiers-vcore.md), change either the service tier or increase the resources allocated to your database.

1. For single databases, you can [change service tiers](sql-database-single-database-scale.md) or [compute resources](sql-database-single-database-scale.md) on-demand to improve database performance.
2. For multiple databases, consider using [elastic pools](sql-database-elastic-pool-guidance.md) to scale resources automatically.

## Tune and refactor application or database code

You can change application code to more optimally use the database, change indexes, force plans, or use hints to manually adapt the database to your workload. Find guidance and tips for manual tuning and rewriting the code in the [performance guidance topic](sql-database-performance-guidance.md) article.

## Next steps

- To enable automatic tuning in Azure SQL Database and let automatic tuning feature fully manage your workload, see [Enable automatic tuning](sql-database-automatic-tuning-enable.md).
- To use manual tuning, you can review [Tuning recommendations in Azure portal](sql-database-advisor-portal.md) and manually apply the ones that improve performance of your queries.
- Change resources that are available in your database by changing [Azure SQL Database service tiers](sql-database-performance-guidance.md)
