---
title: Monitoring database performance in Azure SQL Database | Microsoft Docs
description: Learn about the options for monitoring your database with Azure tools and dynamic management views.
keywords: database monitoring, cloud database performance
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: a2e47475-c955-4a8d-a65c-cbef9a6d9b9f
ms.service: sql-database
ms.custom: monitor & tune
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-management
ms.date: 01/10/2017
ms.author: carlrab

---
# Monitoring database performance in Azure SQL Database
Monitoring the performance of a SQL database in Azure starts with monitoring the resource utilization relative to the level of database performance you choose. Monitoring helps you  determine whether your database has excess capacity or is having trouble because resources are maxed out, and then decide whether it's time to adjust the performance level and [service tier](sql-database-service-tiers.md) of your database. You can monitor your database using graphical tools in the [Azure portal](https://portal.azure.com) or using SQL [dynamic management views](https://msdn.microsoft.com/library/ms188754.aspx).

## Monitor databases using the Azure portal
In the [Azure portal](https://portal.azure.com/), you can monitor a single database’s utilization by selecting your database and clicking the **Monitoring** chart. This brings up a **Metric** window that you can change by clicking the **Edit chart** button. Add the following metrics:

* CPU percentage
* DTU percentage
* Data IO percentage
* Database size percentage

Once you’ve added these metrics, you can continue to view them in the **Monitoring** chart with more details on the **Metric** window. All four metrics show the average utilization percentage relative to the **DTU** of your database. See the [service tiers](sql-database-service-tiers.md) article for details about DTUs.

![Service tier monitoring of database performance.](./media/sql-database-service-tiers/sqldb_service_tier_monitoring.png)

You can also configure alerts on the performance metrics. Click the **Add alert** button in the **Metric** window. Follow the wizard to configure your alert. You have the option to alert if the metrics exceed a certain threshold or if the metric falls below a certain threshold.

For example, if you expect the workload on your database to grow, you can choose to configure an email alert whenever your database reaches 80% on any of the performance metrics. You can use this as an early warning to figure out when you might have to switch to the next higher performance level.

The performance metrics can also help you determine if you are able to downgrade to a lower performance level. Assume you are using a Standard S2 database and all performance metrics show that the database on average does not use more than 10% at any given time. It is likely that the database will work well in Standard S1. However, be aware of workloads that spike or fluctuate before making the decision to move to a lower performance level.

## Monitor databases using DMVs
The same metrics that are exposed in the portal are also available through system views: [sys.resource_stats](https://msdn.microsoft.com/library/dn269979.aspx) in the logical **master** database of your server, and [sys.dm_db_resource_stats](https://msdn.microsoft.com/library/dn800981.aspx) in the user database. Use **sys.resource_stats** if you need to monitor less granular data across a longer period of time. Use **sys.dm_db_resource_stats** if you need to monitor more granular data within a smaller time frame. For more information, see [Azure SQL Database Performance Guidance](sql-database-single-database-monitor.md#monitor-resource-use).

> [!NOTE]
> **sys.dm_db_resource_stats** returns an empty result set when used in Web and Business edition databases, which are retired.
>
>

### Monitor resource use

You can monitor resource usage using [SQL Database Query Performance Insight](sql-database-query-performance.md) and [Query Store](https://msdn.microsoft.com/library/dn817826.aspx).

You can also monitor usage using these two views:

* [sys.dm_db_resource_stats](https://msdn.microsoft.com/library/dn800981.aspx)
* [sys.resource_stats](https://msdn.microsoft.com/library/dn269979.aspx)

#### sys.dm_db_resource_stats
You can use the [sys.dm_db_resource_stats](https://msdn.microsoft.com/library/dn800981.aspx) view in every SQL database. The **sys.dm_db_resource_stats** view shows recent resource use data relative to the service tier. Average percentages for CPU, data I/O, log writes, and memory are recorded every 15 seconds and are maintained for 1 hour.

Because this view provides a more granular look at resource use, use **sys.dm_db_resource_stats** first for any current-state analysis or troubleshooting. For example, this query shows the average and maximum resource use for the current database over the past hour:

    SELECT  
        AVG(avg_cpu_percent) AS 'Average CPU use in percent',
        MAX(avg_cpu_percent) AS 'Maximum CPU use in percent',
        AVG(avg_data_io_percent) AS 'Average data I/O in percent',
        MAX(avg_data_io_percent) AS 'Maximum data I/O in percent',
        AVG(avg_log_write_percent) AS 'Average log write use in percent',
        MAX(avg_log_write_percent) AS 'Maximum log write use in percent',
        AVG(avg_memory_usage_percent) AS 'Average memory use in percent',
        MAX(avg_memory_usage_percent) AS 'Maximum memory use in percent'
    FROM sys.dm_db_resource_stats;  

For other queries, see the examples in [sys.dm_db_resource_stats](https://msdn.microsoft.com/library/dn800981.aspx).

#### sys.resource_stats
The [sys.resource_stats](https://msdn.microsoft.com/library/dn269979.aspx) view in the **master** database has additional information that can help you monitor the performance of your SQL database at its specific service tier and performance level. The data is collected every 5 minutes and is maintained for approximately 35 days. This view is useful for a longer-term historical analysis of how your SQL database uses resources.

The following graph shows the CPU resource use for a Premium database with the P2 performance level for each hour in a week. This graph starts on a Monday, shows 5 work days, and then shows a weekend, when much less happens on the application.

![SQL database resource use](./media/sql-database-performance-guidance/sql_db_resource_utilization.png)

From the data, this database currently has a peak CPU load of just over 50 percent CPU use relative to the P2 performance level (midday on Tuesday). If CPU is the dominant factor in the application’s resource profile, then you might decide that P2 is the right performance level to guarantee that the workload always fits. If you expect an application to grow over time, it's a good idea to have an extra resource buffer so that the application doesn't ever reach the performance-level limit. If you increase the performance level, you can help avoid customer-visible errors that might occur when a database doesn't have enough power to process requests effectively, especially in latency-sensitive environments. An example is a database that supports an application that paints webpages based on the results of database calls.

Other application types might interpret the same graph differently. For example, if an application tries to process payroll data each day and has the same chart, this kind of "batch job" model might do fine at a P1 performance level. The P1 performance level has 100 DTUs compared to 200 DTUs at the P2 performance level. The P1 performance level provides half the performance of the P2 performance level. So, 50 percent of CPU use in P2 equals 100 percent CPU use in P1. If the application does not have timeouts, it might not matter if a job takes 2 hours or 2.5 hours to finish, if it gets done today. An application in this category probably can use a P1 performance level. You can take advantage of the fact that there are periods of time during the day when resource use is lower, so that any "big peak" might spill over into one of the troughs later in the day. The P1 performance level might be good for that kind of application (and save money), as long as the jobs can finish on time each day.

Azure SQL Database exposes consumed resource information for each active database in the **sys.resource_stats** view of the **master** database in each server. The data in the table is aggregated for 5-minute intervals. With the Basic, Standard, and Premium service tiers, the data can take more than 5 minutes to appear in the table, so this data is more useful for historical analysis rather than near-real-time analysis. Query the **sys.resource_stats** view to see the recent history of a database and to validate whether the reservation you chose delivered the performance you want when needed.

> [!NOTE]
> You must be connected to the **master** database of your logical SQL database server to query **sys.resource_stats** in the following examples.
> 
> 

This example shows you how the data in this view is exposed:

    SELECT TOP 10 *
    FROM sys.resource_stats
    WHERE database_name = 'resource1'
    ORDER BY start_time DESC

![The sys.resource_stats catalog view](./media/sql-database-performance-guidance/sys_resource_stats.png)

The next example shows you different ways that you can use the **sys.resource_stats** catalog view to get information about how your SQL database uses resources:

1. To look at the past week’s resource use for the database userdb1, you can run this query:
   
        SELECT *
        FROM sys.resource_stats
        WHERE database_name = 'userdb1' AND
              start_time > DATEADD(day, -7, GETDATE())
        ORDER BY start_time DESC;
2. To evaluate how well your workload fits the performance level, you need to drill down into each aspect of the resource metrics: CPU, reads, writes, number of workers, and number of sessions. Here's a revised query using **sys.resource_stats** to report the average and maximum values of these resource metrics:
   
        SELECT
            avg(avg_cpu_percent) AS 'Average CPU use in percent',
            max(avg_cpu_percent) AS 'Maximum CPU use in percent',
            avg(avg_data_io_percent) AS 'Average physical data I/O use in percent',
            max(avg_data_io_percent) AS 'Maximum physical data I/O use in percent',
            avg(avg_log_write_percent) AS 'Average log write use in percent',
            max(avg_log_write_percent) AS 'Maximum log write use in percent',
            avg(max_session_percent) AS 'Average % of sessions',
            max(max_session_percent) AS 'Maximum % of sessions',
            avg(max_worker_percent) AS 'Average % of workers',
            max(max_worker_percent) AS 'Maximum % of workers'
        FROM sys.resource_stats
        WHERE database_name = 'userdb1' AND start_time > DATEADD(day, -7, GETDATE());
3. With this information about the average and maximum values of each resource metric, you can assess how well your workload fits into the performance level you chose. Usually, average values from **sys.resource_stats** give you a good baseline to use against the target size. It should be your primary measurement stick. For an example, you might be using the Standard service tier with S2 performance level. The average use percentages for CPU and I/O reads and writes are below 40 percent, the average number of workers is below 50, and the average number of sessions is below 200. Your workload might fit into the S1 performance level. It's easy to see whether your database fits in the worker and session limits. To see whether a database fits into a lower performance level with regards to CPU, reads, and writes, divide the DTU number of the lower performance level by the DTU number of your current performance level, and then multiply the result by 100:
   
    **S1 DTU / S2 DTU * 100 = 20 / 50 * 100 = 40**
   
    The result is the relative performance difference between the two performance levels in percentage. If your resource use doesn't exceed this amount, your workload might fit into the lower performance level. However, you need to look at all ranges of resource use values, and determine, by percentage, how often your database workload would fit into the lower performance level. The following query outputs the fit percentage per resource dimension, based on the threshold of 40 percent that we calculated in this example:
   
        SELECT
            (COUNT(database_name) - SUM(CASE WHEN avg_cpu_percent >= 40 THEN 1 ELSE 0 END) * 1.0) / COUNT(database_name) AS 'CPU Fit Percent'
            ,(COUNT(database_name) - SUM(CASE WHEN avg_log_write_percent >= 40 THEN 1 ELSE 0 END) * 1.0) / COUNT(database_name) AS 'Log Write Fit Percent'
            ,(COUNT(database_name) - SUM(CASE WHEN avg_data_io_percent >= 40 THEN 1 ELSE 0 END) * 1.0) / COUNT(database_name) AS 'Physical Data IO Fit Percent'
        FROM sys.resource_stats
        WHERE database_name = 'userdb1' AND start_time > DATEADD(day, -7, GETDATE());
   
    Based on your database service level objective (SLO), you can decide whether your workload fits into the lower performance level. If your database workload SLO is 99.9 percent and the preceding query returns values greater than 99.9 percent for all three resource dimensions, your workload likely fits into the lower performance level.
   
    Looking at the fit percentage also gives you insight into whether you should move to the next higher performance level to meet your SLO. For example, userdb1 shows the following CPU use for the past week:
   
   | Average CPU percent | Maximum CPU percent |
   | --- | --- |
   | 24.5 |100.00 |
   
    The average CPU is about a quarter of the limit of the performance level, which would fit well into the performance level of the database. But, the maximum value shows that the database reaches the limit of the performance level. Do you need to move to the next higher performance level? Look at how many times your workload reaches 100 percent, and then compare it to your database workload SLO.
   
        SELECT
        (COUNT(database_name) - SUM(CASE WHEN avg_cpu_percent >= 100 THEN 1 ELSE 0 END) * 1.0) / COUNT(database_name) AS 'CPU fit percent'
        ,(COUNT(database_name) - SUM(CASE WHEN avg_log_write_percent >= 100 THEN 1 ELSE 0 END) * 1.0) / COUNT(database_name) AS 'Log write fit percent'
        ,(COUNT(database_name) - SUM(CASE WHEN avg_data_io_percent >= 100 THEN 1 ELSE 0 END) * 1.0) / COUNT(database_name) AS 'Physical data I/O fit percent'
        FROM sys.resource_stats
        WHERE database_name = 'userdb1' AND start_time > DATEADD(day, -7, GETDATE());
   
    If this query returns a value less than 99.9 percent for any of the three resource dimensions, consider either moving to the next higher performance level or use application-tuning techniques to reduce the load on the SQL database.
4. This exercise also considers your projected workload increase in the future.

For elastic pools, you can monitor individual databases in the pool with the techniques described in this section. But you can also monitor the pool as a whole. For information, see [Monitor and manage an elastic pool](sql-database-elastic-pool-manage-portal.md).


### Maximum concurrent requests
To see the number of concurrent requests, run this Transact-SQL query on your SQL database:

    SELECT COUNT(*) AS [Concurrent_Requests]
    FROM sys.dm_exec_requests R

To analyze the workload of an on-premises SQL Server database, modify this query to filter on the specific database you want to analyze. For example, if you have an on-premises database named MyDatabase, this Transact-SQL query returns the count of concurrent requests in that database:

    SELECT COUNT(*) AS [Concurrent_Requests]
    FROM sys.dm_exec_requests R
    INNER JOIN sys.databases D ON D.database_id = R.database_id
    AND D.name = 'MyDatabase'

This is just a snapshot at a single point in time. To get a better understanding of your workload and concurrent request requirements, you'll need to collect many samples over time.

### Maximum concurrent logins
You can analyze your user and application patterns to get an idea of the frequency of logins. You also can run real-world loads in a test environment to make sure that you're not hitting this or other limits we discuss in this article. There isn’t a single query or dynamic management view (DMV) that can show you concurrent login counts or history.

If multiple clients use the same connection string, the service authenticates each login. If 10 users simultaneously connect to a database by using the same username and password, there would be 10 concurrent logins. This limit applies only to the duration of the login and authentication. If the same 10 users connect to the database sequentially, the number of concurrent logins would never be greater than 1.

> [!NOTE]
> Currently, this limit does not apply to databases in elastic pools.
> 
> 

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
