---
title: Troubleshoot Azure SQL Database performance issues with Intelligent Insights | Microsoft Docs
description: Intelligent Insights helps you troubleshoot Azure SQL Database performance issues.”
services: sql-database
documentationcenter: ''
author: danimir
manager: drasumic
editor: carlrab

ms.assetid: 
ms.service: sql-database
ms.custom: monitor & tune
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: NA
ms.date: 09/25/2017
ms.author: v-daljep

---
# Troubleshoot Azure SQL Database performance issues with Intelligent Insights

This page provides information on Azure SQL Database performance issues detected through [Intelligent Insights](sql-database-intelligent-insights.md) database performance diagnostics log. This diagnostics log can be sent to [Azure Log Analytics](../log-analytics/log-analytics-azure-sql.md), [Azure Event Hub](../monitoring-and-diagnostics/monitoring-stream-diagnostic-logs-to-event-hubs.md), [Azure Storage](sql-database-metrics-diag-logging.md#stream-into-azure-storage), or a third-party solution for custom DevOps alerting and reporting capabilities.

> [!NOTE]
> For a quick Azure SQL Database performance troubleshooting guide through Intelligent Insights, see [Recommended flow of troubleshooting](sql-database-intelligent-insights-troubleshoot-performance.md#recommended-troubleshooting-flow) flowchart in this document.
>

## Detectable database performance patterns

Intelligent Insights automatically detects performance issues with Azure SQL Database based on a query execution wait times, errors, or timeouts and it outputs detected performance patterns to the diagnostics log. Detectable performance patterns are summarized in the following table:

| Detectable performance patterns | Details outputted |
| :------------------- | ------------------- |
| [Reaching resource limits](sql-database-intelligent-insights-troubleshoot-performance.md#reaching-resource-limits) | Consumption of available resources (DTUs), database worker threads, or database login sessions available on the monitored subscription has reached limits causing Azure SQL Database performance issues. |
| [Workload increase](sql-database-intelligent-insights-troubleshoot-performance.md#workload-increase) | Workload increase or continuous accumulation of workload on the database was detected causing Azure SQL Database performance issues. |
| [Memory pressure](sql-database-intelligent-insights-troubleshoot-performance.md#memory-pressure) | Workers requesting memory grants are waiting for memory allocations for statistically significant amounts of time, or there exists accumulation in increase of workers requesting memory grants affecting Azure SQL Database performance. |
| [Locking](sql-database-intelligent-insights-troubleshoot-performance.md#locking) | Excessive database locking was detected impacting Azure SQL Database performance. |
| [Increased MAXDOP](sql-database-intelligent-insights-troubleshoot-performance.md#increased-maxdop) | Max degree of parallelism option (MAXDOP) has changed and it is affecting the query execution efficiency.  |
| [Pagelatch contention](sql-database-intelligent-insights-troubleshoot-performance.md#pagelatch-contention) | Pagelatch contention was detected impacting Azure SQL Database performance. Multiple threads are concurrently attempting to access the same in-memory data buffer pages resulting in increased wait times affecting Azure SQL database performance. |
| [Missing index](sql-database-intelligent-insights-troubleshoot-performance.md#missing-index) | Missing index issue was detected impacting Azure SQL Database performance. |
| [New query](sql-database-intelligent-insights-troubleshoot-performance.md#new-query) | New query was detected affecting overall Azure SQL Database performance.  |
| [Unusual wait statistic](sql-database-intelligent-insights-troubleshoot-performance.md#unusual-wait-statistic) | Unusual database wait times were detected affecting Azure SQL Database performance. |
| [TempDB contention](sql-database-intelligent-insights-troubleshoot-performance.md#tempdb-contention) | Multiple threads are trying to access the same TempDB resources causing a bottleneck affecting Azure SQL Database performance. |
| [Elastic Pool DTU shortage](sql-database-intelligent-insights-troubleshoot-performance.md#elastic-pool-dtu-shortage) | Shortage of available eDTUs in the elastic pool is affecting Azure SQL Database performance. |
| [Plan regression](sql-database-intelligent-insights-troubleshoot-performance.md#plan-regression) | New plan or a change in the workload of an existing plan was detected affectomg Azure SQL Database performance. |
| [Database-scoped configuration value change](sql-database-intelligent-insights-troubleshoot-performance.md#database-scoped-configuration-value-change) | Configuration change on the database is affecting Azure SQL Database performance. |
| [Slow client](sql-database-intelligent-insights-troubleshoot-performance.md#slow-client) | Slow application client, unable to consume output from the Azure SQL Database fast enough, was detected impacting Azure SQL Database performance. |
| [Pricing tier downgrade](sql-database-intelligent-insights-troubleshoot-performance.md#pricing-tier-downgrade) | Pricing tier downgrade action decreased available resources affecting Azure SQL Database performance. |

> [!TIP]
> For continuous performance optimization of Azure SQL Database you might want to consider enabling [Azure SQL Database Automatic Tuning](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-automatic-tuning) – a unique feature of Azure SQL built-in intelligence that continuously monitors your Azure SQL database and automatically tunes indexes and applies query execution plan corrections.
>

The following section describes the previously listed detectable performance patterns in more detail.

## Reaching resource limits

### What is happening

This detectable performance pattern combines performance issues related to reaching available resource limits, worker limits, and session limits. Once this performance issue has been detected, a description field of the diagnostics log indicates if the performance issue is related to resource, worker, or session limits.

Resources on Azure SQL Database are typically referred as [DTU resources](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-what-is-a-dtu) consisting of a blended measure of CPU and I/O (data and transaction log I/O) resources. Reaching resource limits pattern is recognized when detected query performance degradation is caused by reaching any of the measured resource limits.

Session limits resource denotes to the number of available concurrent logins to the Azure SQL Database. This performance pattern is recognized in the case applications that are connecting to the Azure SQL Databases have reached the number of available concurrent logins to the database. In case applications attempt to use more sessions than are available on a database, the query performance is affected.

Reaching worker limits is a specific case of reaching resource limits since available workers are not counted in the DTU usage. Reaching worker limits on a database can cause the rise of a resource-specific wait times and therefore a query performance degradation.

### Troubleshooting

Diagnostics log outputs query hashes of queries that have affected the performance and resource consumption percentages. You might use this information as a starting point of optimizing your database workload. In particular, you might want to consider optimizing the queries affecting the performance degradation, adding indexes, or optimize applications with a more even workload distribution. In case you are unable to reduce workloads or make optimization, you perhaps might want to consider increasing the pricing tier of your Azure SQL Database subscription to increase the amount of resources available.

If you have reached the available session limits, you might want to consider optimizing your applications in terms of reducing the number of logins made to the database. If you are unable to reduce the number of logins from your applications to the database, you might consider increasing the pricing tier of your database, or perhaps splitting and moving your database into multiple databases for more balanced workload distribution.

For more suggestions on resolving session limits, see [How to deal with the limits of Azure SQL Database maximum logins](https://blogs.technet.microsoft.com/latam/2015/06/01/how-to-deal-with-the-limits-of-azure-sql-database-maximum-logins/). In order to find out the available resource limits for your subscription tier, see [Azure SQL Database resource limits](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-resource-limits).

## Workload increase

### What is happening

This performance pattern identifies issues caused by workload increase, or in its more severe form a workload pile-up.

This detection is made through combination of several metrics. The basic metric measured is detecting an increase in workload compared with the past workload baseline. The other form of detection is based on measuring a large increase in active worker threads that is large enough to impact the query performance.

In its more severe form where the workload is continuously piling-up due to the Azure SQL Database not being able to handle the workload. The result is continuously growing workload size - i.e. the workload pile-up condition. Due to this condition, the time workload is waiting for execution is growing and it represents one of the most severe database performance issues. This issue is detected through monitoring increase in the number of aborted worker threads. 

### Troubleshooting

Diagnostics log outputs the number of queries whose execution has increased, and query hash of the query with the largest contribution to the workload increase. You might use this information as a starting point of optimizing the workload, and especially for the query identified as the largest contributor to the workload increase.

You also might want to consider distributing the workloads more evenly to the database. You might also want to consider optimize the query affecting the performance and adding indexes. Another approach to consider might be distributing your workload amongst multiple databases. If this is not possible, you might want to consider increasing the pricing tier of your Azure SQL Database subscription to increase the amount of resources available.

## Memory pressure

### What is happening

This performance pattern indicates degradation in the current database performance caused by the memory pressure, or in its more severe form a memory pile-up condition compared to the past 7-day performance baseline.

Memory pressure denotes a performance condition in which there is a large enough number of worker threads requesting memory grants in the Azure SQL Database. This is causing a high memory utilization condition in which the Azure SQL Database is not able to efficiently allocate memory to all workers requesting it. One of the most common reasons for this issue is related to the amount of memory available to the Azure SQL Database on one hand, and on the other hand an increase in workload that is causing the increase in worker threads and the memory pressure.

More severe form of memory pressure is the memory pile-up condition indicating there is a higher number of worker threads requesting memory grants than there are queries releasing the memory. This number of worker threads requesting memory grants might also be continuously increasing (that is piling-up), as the engine is unable to allocate memory efficiently enough to meet the demand. Memory pile-up condition represents one of the most severe database performance issues.

### Troubleshooting

Diagnostics log outputs the memory object store details with the clerk (that is worker thread) marked as the highest reason for high memory usage and relevant timestamps. This information could be used as a basis for the troubleshooting. 

You might want to consider optimize or remove queries related to the clerks with the highest memory usage. You might also want to make sure that you are not querying data that you do not plan to use. Good practice is to always use a WHERE clause in your queries. In addition, it is recommended that you create non-clustered indexes to seek the data, rather than to scan the data.

You also might want to consider reducing the workload, optimize or distribute over multiple databases. Another approach to consider might be distributing your workload amongst multiple databases. If this is not possible, you might want to consider increasing the pricing tier of your Azure SQL Database subscription to increase the amount of memory resources available to the database.

For additional troubleshooting suggestions, see [Memory Grants Meditation: The mysterious SQL Server memory consumer with Many Names](https://blogs.msdn.microsoft.com/sqlmeditation/2013/01/01/memory-meditation-the-mysterious-sql-server-memory-consumer-with-many-names/).

## Locking

### What is happening

This performance pattern indicates degradation in the current database performance in which excessive database locking was detected compared to the past 7-day performance baseline. 

In modern RDBMS locking is essential for implementing multithreaded systems in which performance is maximized through running multiple simultaneous workers and parallel database transactions where possible. In simple terms, locking in this context refers to the built-in access mechanism in which only a single transaction can exclusively access rows, pages, tables and files required and not compete with another transaction for resources. When the transaction that has locked the resources for use is done with them, the lock on those resources is released allowing other transactions to access required resources. For more information on locking, see [Locking in the Database Engine](https://msdn.microsoft.com/library/ms190615.aspx).

In case transactions executed by the SQL engine are waiting for prolonged periods of time to access resources locked for use, this wait time is impacting the slowdown of the workload execution performance. 

### Troubleshooting

Diagnostic log outputs locking details that can be used as a basis for the troubleshooting. You might want to analyze the reported blocking queries, that is queries that are introducing the locking performance degradation and remove them. In some cases, you might be successful in optimizing the blocking queries.
The simplest and safest way to mitigate the issue is to keep transactions short and to reduce the lock footprint of the most expensive queries. You might want to consider breaking up large batch of operations into smaller operations. Good practice is to reduce query lock footprint by making the query as efficient as possible. Consider reducing large scans as they increase chances of deadlocks and impact adversely the overall database performance. For identified queries that cause locking, you might want to consider creating new indexes, or to add columns to the existing index to avoid the table scans. For more suggestions, see [How to resolve blocking problems that are caused by lock escalation in SQL Server](https://support.microsoft.com/en-us/help/323630/how-to-resolve-blocking-problems-that-are-caused-by-lock-escalation-in).

## Increased MAXDOP

### What is happening

This detectable performance pattern indicates a condition in which a chosen query execution plan has been parallelized more than it should. Azure SQL Database query optimizer enhances the workload performance by making decision on executing query in parallel to speedup things where possible. In some cases however parallel workers processing a query spend more time on waiting on each other to synchronize and merge results compared to executing the same query with a fewer parallel workers, or even in some cases a single worker thread.

The expert system analyzes the current database performance compared to the baseline period and it determines if a previously running query is running slower than before due to the query execution plan being more parallelized than it should.

Server Configuration Option MAXDOP on Azure SQL Database is used to control how many CPU cores can be used to execute the same query in parallel. 

### Troubleshooting

Diagnostics log outputs query hashes related to the queries for which duration of execution has increased due to being parallelized more than they should have been. The log also outputs CXP wait times. This time represents the time a single organizer/coordinator thread (thread 0) is waiting for all other threads to finish before merging the results and moving ahead. In addition, diagnostics log outputs the wait times the poor performing queries were waiting in execution overall. This information is the basis for the troubleshooting of the issue.

You might want to look first into possibility to optimize or simplify complex queries. Good practice is to break up long batch jobs into smaller ones. In addition, ensure that you have indexes created supporting your queries. You can also consider to manually enforce the MAXDOP (max degree of parallelism) for a particular query that has been flagged as poor performing. This operation is configured through using T-SQL, see [Configure the max degree of parallelism Server Configuration Option](https://docs.microsoft.com/en-us/sql/database-engine/configure-windows/configure-the-max-degree-of-parallelism-server-configuration-option).

Setting the Server Configuration Option MAXDOP zero (0) as a default value would denote that Azure SQL Database can use all available logical CPU cores to parallelize threads executing a single query. Setting MAXDOP to one (1) denotes that only one core can be used for a single query execution – in practical terms this would mean that parallelism is turned off. Depending on the case per case basis, available cores to the database, and diagnostic log information, you might want to tune the MAXDOP option to the number of cores for parallel query execution that resolved the issue in your case.

## Pagelatch contention

### What is happening

This performance pattern indicates the current database workload performance degradation due to pagelatch contention compared to the past 7-day workload baseline.

Latches are lightweight synchronization mechanisms used by Azure SQL Database to enable multithreading and to guarantee consistency of in-memory structures including indices, data pages and other internal structures.

There are many types of latches available on the Azure SQL Database. For simplicity purposes, buffer latches are used to protect in-memory pages in the buffer pool and I/O latches are used to protect pages not yet loaded into the buffer pool. Whenever data is written to or read from a page in the buffer pool a worker thread needs to acquire a buffer latch for the page first. Whenever a worker thread attempts to access a page that is not already available in the in-memory buffer pool, I/O request is made to load the required information from the storage indicating a more severe form of performance degradation.

Contention on the page latches occurs when multiple threads concurrently attempt to acquire latches on the same in-memory structure introducing an increased wait time to query execution. In case of pagelatch I/O contention when data needs to be accessed from storage, this wait time is even larger and it can considerably affect workload performance. Pagelatch contention is the most common scenario of threads waiting on each other and competing for resources on multiple CPU systems.

### Troubleshooting

Diagnostics log outputs the pagelatch contention details that can be used as a basis of troubleshooting the issue.

As a pagelatch is an internal control mechanism of Azure SQL Database, it automatically determines when to use them. Application decisions, including schema design can affect the pagelatch behavior due to the deterministic behavior of latches.
One method for handling latch contention is to replace a sequential index key with a non-sequential key to evenly distribute inserts across an index range. Typically this is done by having a leading column in the index that distributes the workload proportionally. Another method to consider is table partitioning. Creating a hash partitioning scheme with a computed column on a partitioned table is a common approach for mitigating excessive latch contention. In the case of pagelatch I/O contention introducing indexes is recommended as beneficial in mitigating this performance issue. For more information, see [Diagnosing and Resolving Latch Contention on SQL Server](http://download.microsoft.com/download/B/9/E/B9EDF2CD-1DBF-4954-B81E-82522880A2DC/SQLServerLatchContention.pdf) (PDF download).

## Missing index

### What is happening

This performance pattern indicates the current database workload performance degradation compared to the past 7-day baseline due to a missing index.

An index is used to speed up the performance of queries. It provides quick access to table data with reducing the number of dataset pages that need to be visited or scanned.

Specific queries that have caused performance degradation are identified through this detection for which creating indexes would be beneficial to the performance.

### Troubleshooting

Diagnostics log outputs query hashes for the queries that have been identified to impact the workload performance. You might want to consider building indexes for these queries. You might also want to consider optimizing or removing these queries if they are not required. It is a good performance practice to avoid querying data that you do not use.

> [!TIP]
> Did you know that Azure built-in intelligence can automatically manage the best performing indexes for your databases?
>
> For continuous performance optimization of Azure SQL Database it is recommended that you enable [Azure SQL Database Automatic Tuning](sql-database-automatic-tuning.md) – a unique feature of Azure SQL built-in intelligence that continuously monitors your Azure SQL database and automatically tunes and creates indexes for your databases.
>

## New query

### What is happening

This detectable performance pattern indicates a new query was detected that is performing poorly and affecting the workload performance compared to the 7-day performance baseline.

Writing a good performing query sometimes can be a challenging task. For more information on writing queries, see [Writing SQL Queries](https://msdn.microsoft.com/library/bb264565.aspx), and in order to optimize existing query performance, see [Query Tuning](https://msdn.microsoft.com/library/ms176005.aspx).

### Troubleshooting

Diagnostics log outputs information up to two (2) new most CPU consuming queries, including their query hashes. As the detected query is impacting the workload performance, you might want to consider optimizing your query. Good practice is not to retrieve data you do not use. Using queries with WHERE clause is also advisable. Simplifying complex queries and breaking up into smaller queries is also recommended. Breaking down large batch queries into smaller batch queries is also a good practice to consider. Introducing indexes for new queries is typically a good practice to mitigate this performance issue.

You might want to consider using [Azure SQL Database Query Performance Insight](sql-database-query-performance.md).

## Unusual wait statistic

### What is happening

This detectable performance pattern indicates a workload performance degradation in which poor performing queries are identified compared to the past 7-days workload baseline.

In this case the system could not classify the poor performing queries under any other standard detectable performance categories, but has detected wait statistic responsible for the regression, and is therefore considering them as queries with &#8220;*unusual wait statistics*&#8221; where the unusual wait statistic responsible for the regression is also exposed. 

### Troubleshooting

Diagnostics log outputs information on unusual wait time details, query hashes of the affected queries and the wait times.

In this case as the system could not successfully identify the root cause for poor performing queries, the diagnostics information on the poor performing queries might serve as a good starting point for manual troubleshooting. You might consider optimizing the performance of these queries. It is typically a good practice not to fetch data you do not use and to simplify and break down complex queries into smaller ones. For more information on optimizing query performance, see [Query Tuning](https://msdn.microsoft.com/library/ms176005.aspx).

## TempDB contention

### What is happening

This detectable performance pattern indicates a database performance condition in which there exists a bottleneck of threads trying to access TempDB resources (this condition is not I/O related). The typical scenario for this performance issue is hundreds of concurrent queries that all create, use, and then drop small TempDB tables, that is TempDB tables. The system has detected that the number of concurrent queries using the same TempDB tables has increased with a statistical significance to affect database performance compared to the last 7-day performance baseline.

### Troubleshooting

Diagnostic log outputs TempDB contention details that can be used as a starting point in troubleshooting performance issues. There are a couple of things you might want to pursue in alleviating this kind of contention and increase the throughput of the overall workload. You might want to stop using the temporary tables. You might also want to consider using memory-optimized tables, see [Introduction to Memory-Optimized Tables](https://docs.microsoft.com/en-us/sql/relational-databases/in-memory-oltp/introduction-to-memory-optimized-tables). 

## Elastic Pool DTU shortage

### What is happening

This detectable performance pattern indicates a degradation in the current database workload performance compared to the last 7-day baseline due to the shortage of available DTUs in the elastic pool of your subscription. 

Resources on Azure SQL Database are typically referred as [DTU resources](sql-database-what-is-a-dtu.md) consisting of a blended measure of CPU and I/O (data and transaction log I/O) resources. [Azure elastic pool resources](sql-database-elastic-pool.md) are used as a pool of available eDTU resources shared between multiple databases for scaling purposes. In the case when available eDTU resources in your elastic pool are not sufficiently large to support all of the databases in the pool, Elastic Pool DTU Shortage performance issue is detected by the system.

### Troubleshooting

Diagnostics log outputs information on the elastic pool, lists out top DTU consuming databases and provides a percentage of the pool’s DTU used by the top consuming database.

As this performance condition is related to multiple databases using the same pool of eDTU’s in the elastic pool, the troubleshooting steps need to be focused on the top DTU consuming databases. You might want to consider reducing the workload on the top consuming databases, including optimization of the top consuming queries on those databases. You might also want to ensure that you are not querying data that you do not use. Another approach is to optimize applications using the top DTU consuming databases and re-distribution of the workload amongst multiple databases.

If reduction and optimization of the current workload on your top DTU consuming databases is not possible, you might want to consider increasing your elastic pool pricing tier. Such increase results in the increase of the available DTU’s in the elastic pool.

## Plan regression

### What is happening

This detectable performance pattern denotes a condition in which Azure SQL Database starts utilizing a sub-optimal query execution plan. The suboptimal plan typically causes increased query execution leading to longer wait times for the current and other queries.

The Azure SQL Database determines the query execution plan with the least cost to a query execution. However, as the type of queries and workloads change, sometimes the existing plans are no longer efficient, or perhaps Azure SQL Database did not make a good assessment. As a matter of correction, query execution plans can be manually forced.

This detectable performance pattern combines three different cases of plan regression: new plan regression, old plan regression and existing plans changed workload. The type of which particular plan regression has occurred are provided in the &#8220;*details*&#8221; property in the diagnostics log.

The new plan regression condition refers to a state in which Azure SQL Database starts executing a new query execution plan that is not as efficient as the old plan. The old plan regression condition refers to the state when Azure SQL Database switches from using a new, more efficient plan, to the old plan which is not as efficient as the new plan. The existing plans changed workload regression refers to the state in which two plans, old plan and the new plan are continuously being alternated, with the balance going more towards the poor performing plan.

For more information plan regressions, see [What is plan regression in SQL server](https://blogs.msdn.microsoft.com/sqlserverstorageengine/2017/06/09/what-is-plan-regression-in-sql-server/). 

### Troubleshooting

Diagnostics log outputs the query hashes, good plan ID, bad plan ID, and query Ids that can be used as a basis for performance troubleshooting of this condition.

You might want to analyze which plan is better performing for your specific queries that you can identify with the query hashes provided. Once you determine which plan works better for your queries, you can manually force it. For more information, see [How SQL Server prevents plan regressions](https://blogs.msdn.microsoft.com/sqlserverstorageengine/2017/04/25/you-shall-not-regress-how-sql-server-2017-prevents-plan-regressions/).

> [!TIP]
> Did you know that Azure built-in intelligence can automatically manage the best performing query execution plans for your databases?
>
> For continuous performance optimization of Azure SQL Database it is recommended that you enable [Azure SQL Database Automatic Tuning](sql-database-automatic-tuning.md) – a unique feature of Azure SQL built-in intelligence that continuously monitors your Azure SQL database and automatically tunes and creates best-performing query execution plans for your databases.
>

## Database scoped configuration value change

### What is happening

This detectable performance pattern indicates a condition in which there has been a change in the database-scoped configuration that is causing performance regression detected compared to the past 7-day database workload behavior. This denotes that recent change made to the database-scoped configuration does not seem to be beneficial to your database performance.

Database scoped configuration change can be set for each individual database. This configuration is used on case by case basis to optimize the individual performance of your database. The following options can be configured for each individual database: MAXDOP, LEGACY_CARDINALITY_ESTIMATION, PARAMETER_SNIFFING, QUERY_OPTIMIZER_HOTFIXES and CLEAR PROCEDURE_CACHE.

### Troubleshooting

The diagnostics log outputs database-scoped configuration changes that were made recently that have caused the performance degradation compared to the previous 7-day workload behavior. You might want to consider reverting the configuration changes to the previous values, or perhaps tuning value by value until the desired performance level is reached. You might also want to consider copying database-scope configuration values from a similar database with satisfactory performance. If unable to troubleshoot the performance, you might want to consider reverting to the default Azure SQL Database default values and attempting to fine-tune starting from this baseline.

For further details on optimizing database-scoped configuration and T-SQL syntax on changing the configuration, see [Alter database scoped configuration (Transact-SQL)](https://msdn.microsoft.com/en-us/library/mt629158.aspx).

## Slow client

### What is happening

This detectable performance pattern indicates a condition in which the client using the Azure SQL Database is not able to consume the output from the database fast enough as the database is able to send the results. As Azure SQL Database is not staring results of the executed queries in a buffer, it is slowing down and waiting for the client to consume the transmitted query outputs before proceeding. This condition could also be related to a slow network that is not able to sufficiently fast transmit outputs from the Azure SQL database to the consuming client.

This condition is generated only if there is a performance regression detected compared to the past 7-day database workload behavior. This ensures that this performance issue is detected only if there has been a statistically significant performance degradation compared to the previous performance behavior.

### Troubleshooting

This detectable performance pattern indicates a client-side condition with troubleshooting required at the client-side application or client-side network. The diagnostics log outputs the query hashes and wait times that seem to be waiting the most for the client to consume them within the past 2hrs of time. These could be used as a basis for your troubleshooting.

You might want to consider optimizing performance of your application for consumption of these queries. You might also want to consider possible network latency issues. As the performance degradation issue was based on change of the last 7-day performance baseline, you might want to investigate if there have been application changes or network condition changes within the recent period that might have caused this performance regression event. 

## Pricing tier downgrade

### What is happening

This detectable performance pattern indicates a condition in which the pricing tier of your Azure SQL Database was downgraded. Because of reduction of resources (DTUs) available to the database, the system has detected a drop in the current database performance measured to the past 7-day baseline.

In addition, there could be a condition in which the pricing tier of your Azure SQL Database subscription was downgraded, and then upgraded to a higher tier within only a short period of time. This indicates a temporary performance degradation detection that is outputted in the details section of the diagnostics log as pricing tier downgrade and upgrade.

### Troubleshooting

If you have reduced your pricing tier, and therefore DTUs available to the Azure SQL Database and are satisfied with the performance there is nothing you need to do at this time. If following the reduction of your pricing tier you are unsatisfied with your Azure SQL Database performance, you might want to consider either reducing your database workloads or consider increasing the pricing tier to a higher level.

## Recommended troubleshooting flow

Please follow the flowchart below for a recommended approach to troubleshoot performance issues using Intelligent Insights.

Access Intelligent Insights through Azure portal by navigating to Azure SQL Analytics. Attempt to locate incoming performance alert and click on it. Identify what is going on the detections page. Observe the provided Root Cause Analysis of the issue, query text, query time trends, and incident evolution. Using the Intelligent Insights recommendation on mitigating the performance issue attempt to resolve it.

![Troubleshooting flowchart](./media/sql-database-intelligent-insights/intelligent-insights-troubleshooting-flowchart.png)

Intelligent Insights usually needs 1hr of time to perform the root cause analysis of the performance issue. In the case you cannot locate your issue in Intelligent Insights (in most cases these are issues less than 1hr old), and if this issue is critical for you, use Query Data Store (QDS) to manually identify the root cause of the performance issue. For more information, see [Monitoring performance by using the Query Store](https://docs.microsoft.com/en-us/sql/relational-databases/performance/monitoring-performance-by-using-the-query-store).

## Next steps
- Learn [Intelligent Insights](sql-database-intelligent-insights.md) concepts
- Use the [Intelligent Insights Azure SQL Database performance diagnostics log](sql-database-intelligent-insights-use-diagnostics-log.md)
- Monitor [Azure SQL Database using Azure SQL Analytics](https://docs.microsoft.com/en-us/azure/log-analytics/log-analytics-azure-sql)
- Learn to [collect and consume log data from your Azure resources](../monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs.md)
