<properties
	pageTitle="Azure SQL Database performance guidance for single databases | Microsoft Azure"
	description="This article can help you determine which service tier is right for your application. It also has recommendations for tuning your application to get the most out of Azure SQL Database."
	services="sql-database"
	documentationCenter="na"
	authors="CarlRabeler"
	manager="jhubbard"
	editor="" />


<tags
	ms.service="sql-database"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="data-management"
	ms.date="09/13/2016"
	ms.author="carlrab" />

# Azure SQL Database performance guidance for single databases

## Overview

Azure SQL Database offers three [service tiers](sql-database-service-tiers.md): Basic, Standard, and Premium. Each service tier strictly isolates the resource provided to your Azure SQL Database and guarantees predictable performance. Performance is measured in database throughput units [(DTUs)](sql-database-what-is-a-dtu.md). This article provides guidance in choosing the service tier for your application and provides recommendations for tuning your application to get the most out of your Azure SQL Database.

>[AZURE.NOTE] This article focuses on performance guidance for single databases in Azure SQL Database. For performance guidance related to elastic database pools, see [Price and performance considerations for elastic database pools](sql-database-elastic-pool-guidance.md). Note, however, that many tuning recommendations in this article for a single database can be applied to databases within an elastic database pool with similar performance benefits.

- **Basic**. The Basic service tier offers good performance predictability for each database, hour over hour. The DTU of a Basic database is designed to provide sufficient resources for small databases that don't have multiple concurrent requests to performance nicely.
- **Standard**. The Standard service tier offers improved performance predictability and raises the bar for databases with multiple concurrent requests like workgroup and web applications. When you choose a Standard service tier database, you size your database application based on predictable performance, minute over minute.
- **Premium**. The Premium service tier provides predictable performance, second over second, for each Premium database. When you choose the Premium service tier, you can size your database application based on peak load for that database. The plan removes cases in which performance variance can cause small queries to take longer than expected in latency-sensitive operations. This model can greatly simplify the development and product validation cycles for applications that need to make strong statements about peak resource needs, performance variance, or query latency.

The performance level settings in each service tier give you the flexibility to pay only for the capacity you need. You can adjust capacity [up or down](sql-database-scale-up.md) as a workload changes. For example, if your database workload is busy during the back-to-school shopping season, you might increase the performance level for the database during that time period. You can reduce it when that peak time-window ends. You can minimize what you pay by optimizing your cloud environment to the seasonality of your business. This model also works well for software product release cycles. A test team might allocate capacity while it does test runs, and then release that capacity when they've finished testing. This capacity request fits well with a model in which you pay for capacity as you need it, and avoid spending on dedicated resources that you rarely use.

## Why use service tiers

Although each workload can differ, the purpose of the service tiers is to provide performance predictability at various performance levels. Customers with a large scale of resource requirements for their databases can work in a more dedicated computing environment.

### Basic service tier use cases

- **Getting started with Azure SQL Database**. Applications that are in development often don't need high performance levels. Basic databases provide an ideal environment for database development at a low price point.
- **A database with a single user**. Applications that associate a single user with a database normally don’t have high requirements for concurrency and performance. Applications with these requirements are candidates for the Basic service tier.

### Standard service tier use cases

- **A database with multiple concurrent requests**. Applications that service more than one user at a time usually need higher performance levels. For example, websites with moderate traffic or departmental applications that require more resources are good candidates for the Standard service tier.

### Premium service tier use cases

- **High peak load**. An application that requires a lot of CPU, memory, or I/O to complete its operations requires a dedicated, high performance level. For example, a database operation known to consume several CPU cores for an extended period of time is a candidate for using the Premium service tier.
- **Many concurrent requests**. Some database applications service many concurrent requests, for example, when serving a website with high traffic volume. Basic and Standard service tiers limit the number of concurrent requests per database. Applications that require more connections would need to pick an appropriate reservation size to handle the maximum number of needed requests.
- **Low latency**. Some applications need to guarantee a response from the database in minimal time. If a specific stored procedure is called as part of a broader customer operation, there might be a requirement to return from that call in no more than 20 milliseconds 99% of the time. This kind of application benefits from the Premium service tier to make sure that the required computing power is available.

The exact level you need for your SQL Database service depends on the peak load requirements for each resource dimension. Some applications use a trivial amount of one resource, but have significant requirements for other resources.

## Billing and pricing information

elastic database pools are billed per the following characteristics:

- An elastic database pool is billed when it's created, even when there are no databases in the pool.
- An elastic database pool is billed hourly. This metering frequency is the same metering frequency for performance levels of single databases.
- If an elastic database pool is resized to a new amount of elastic database throughput units (eDTUs), the database pool is not billed according to the new amount of eDTUs until the resizing operation completes. This billing pattern follows the same pattern as changing the performance level of a standalone database.


- The price of an elastic database pool is based on the number of eDTUs of the pool. The price of an elastic database pool does not depend on how much you use the elastic databases within it.
- Price is computed by (number of pool eDTUs) x (unit price per eDTU).

The unit eDTU price for an elastic database pool is higher than the unit DTU price for a standalone database in the same service tier. For details, see [SQL Database pricing](https://azure.microsoft.com/pricing/details/sql-database/).  

## Service tier capabilities and limits
Each service tier and performance level is associated with different limits and performance characteristics. This table describes these characteristics for a single database.

[AZURE.INCLUDE [SQL DB service tiers table](../../includes/sql-database-service-tiers-table.md)]

The next sections have more information about how to view usage related to these limits.

### Max In-Memory OLTP storage

You can use the **sys.dm_db_resource_stats** view to monitor your Azure In-Memory storage use. For more information about monitoring, see [Monitor In-Memory OLTP storage](sql-database-in-memory-oltp-monitoring.md).

>[AZURE.NOTE] Currently, Azure In-Memory online transaction processing (OLTP) preview is supported only for single databases, and not for databases in elastic database pools.

### Max concurrent requests

To see the number of concurrent requests, run this Transact-SQL query on your SQL database:

	SELECT COUNT(*) AS [Concurrent_Requests]
	FROM sys.dm_exec_requests R

To analyze the workload of an on-premises SQL Server database, modify this query to filter on the specific database you want to analyze. For example, if you have an on-premises database named MyDatabase, this Transact-SQL query returns the count of concurrent requests in that database:

	SELECT COUNT(*) AS [Concurrent_Requests]
	FROM sys.dm_exec_requests R
	INNER JOIN sys.databases D ON D.database_id = R.database_id
	AND D.name = 'MyDatabase'

This is just a snapshot at a single point in time. To get a better understanding of your workload, you'll need to collect many samples over time to understand your concurrent request requirements.

### Max concurrent logins

There's no query or DMV that can show you concurrent login counts or history. You can analyze your user and application patterns to get an idea of the frequency of logins. You also could run real-world loads in a test environment to make sure that you're not hitting this or other limits described in this article.

If multiple clients use the same connection string, the service authenticates each login. If 10 users simultaneously connect to a database with the same username and password, there would be 10 concurrent logins. This limit only applies to the duration of the login and authentication. If the same 10 users connect sequentially to the database, the number of concurrent logins would never be higher than 1.

>[AZURE.NOTE] Currently, this limit does not apply to databases in elastic database pools.

### Max sessions

To see your current number of active sessions, run this Transact-SQL query on your SQL database:

	SELECT COUNT(*) AS [Sessions]
	FROM sys.dm_exec_connections

If you're analyzing an on-premises SQL Server workload, modify the query to focus on a specific database. This query helps you determine the possible session needs for that database if you move it to Azure SQL Database.

	SELECT COUNT(*)  AS [Sessions]
	FROM sys.dm_exec_connections C
	INNER JOIN sys.dm_exec_sessions S ON (S.session_id = C.session_id)
	INNER JOIN sys.databases D ON (D.database_id = S.database_id)
	WHERE D.name = 'MyDatabase'

Again, these queries return a point-in-time count, so collecting multiple samples over time gives you the best understanding of your session usage.

For SQL Database analysis, you also can query **sys.resource_stats** to get historical statistics on sessions by using the **active_session_count** column. More information about using this view is in the next section.

## Monitoring resource use
Two views can help you monitor resource usage for a SQL database relative to its service tier:

- [sys.dm_db_resource_stats](https://msdn.microsoft.com/library/dn800981.aspx)
- [sys.resource_stats](https://msdn.microsoft.com/library/dn269979.aspx)

### Using sys.dm_db_resource_stats
The [sys.dm_db_resource_stats](https://msdn.microsoft.com/library/dn800981.aspx) view exists in each SQL database and supplies recent resource utilization data relative to the service tier. Average percentages for CPU, data I/O, log writes, and memory are recorded every 15 seconds and are maintained for 1 hour.

Because this view provides a more granular look at resource use, use **sys.dm_db_resource_stats** first for any current-state analysis or troubleshooting. For example, this query shows the average and the maximum resource use for the current database over the past hour:

	SELECT  
	    AVG(avg_cpu_percent) AS 'Average CPU Utilization In Percent',
	    MAX(avg_cpu_percent) AS 'Maximum CPU Utilization In Percent',
	    AVG(avg_data_io_percent) AS 'Average Data IO In Percent',
	    MAX(avg_data_io_percent) AS 'Maximum Data IO In Percent',
	    AVG(avg_log_write_percent) AS 'Average Log Write Utilization In Percent',
	    MAX(avg_log_write_percent) AS 'Maximum Log Write Utilization In Percent',
	    AVG(avg_memory_usage_percent) AS 'Average Memory Usage In Percent',
	    MAX(avg_memory_usage_percent) AS 'Maximum Memory Usage In Percent'
	FROM sys.dm_db_resource_stats;  

For other queries, see the examples in [sys.dm_db_resource_stats](https://msdn.microsoft.com/library/dn800981.aspx).

### Using sys.resource_stats

The [sys.resource_stats](https://msdn.microsoft.com/library/dn269979.aspx) view in the **master** database provides additional information for monitoring the performance use of your SQL database within its specific service tier and performance level. The data is collected every 5 minutes and maintained for approximately 35 days. This view is more useful for longer-term historical analysis of your SQL database resource utilization.

The following graph shows the CPU resource utilization for a Premium database with the P2 performance level for each hour in a week. This graph starts on a Monday, showing 5 work days and then a weekend, when much less happens on the application.

![SQL database resource utilization](./media/sql-database-performance-guidance/sql_db_resource_utilization.png)

From the data, this database currently has peak CPU load of just over 50% CPU utilization relative to the P2 performance level (midday on Tuesday). If CPU was the dominant factor in the application’s resource profile, then you might decide that the P2 is the right performance level to guarantee that the workload always fits. If you expect an application to grow over time, it makes sense to allow an extra resource buffer so that the application does not ever hit the ceiling. If you increase the performance level, you can help avoid customer-visible errors caused by a database not having enough power to process requests effectively, especially in latency-sensitive environments (like a database that supports an application that paints web pages based on the results of database calls).

It is worth noting that other application types might interpret the same graph differently. For example, if an application tried to process payroll data each day and had the same chart, this kind of "batch job" model might do fine in a P1 performance level. The P1 performance level has 100 DTUs compared to the 200 DTUs of the P2 performance level. That means that the P1 performance level provides half the performance of the P2 performance level. So, 50% of CPU utilization in P2 equals 100% CPU utilization in P1. If the application does not have timeouts, it might not matter if a job takes 2 hours or 2.5 hours to finish, if it gets done today. An application in this category probably can use a P1 performance level. You can take advantage of the fact that there are periods of time during the day when resource usage is lower, so any "big peak" might spill over into one of the troughs later in the day. The P1 performance level might be great for such an application (and save money) as long as the jobs can finish on time each day.

Azure SQL Database exposes consumed resource information for each active database in the **sys.resource_stats** view of the **master** database in each server. The data in the table is aggregated for five-minute intervals. With the Basic, Standard, and Premium service tiers, the data can take more than 5 minutes to appear in the table, so, this data is more useful for historical analysis rather than near-real-time analysis. Query the **sys.resource_stats** view to see the recent history of a database and validate whether the reservation you chose delivered the performance you want when needed.

>[AZURE.NOTE] You must be connected to the **master** database of your logical SQL Database server to query **sys.resource_stats** in the following examples.

This example shows you how the data in this view is exposed:

	SELECT TOP 10 *
	FROM sys.resource_stats
	WHERE database_name = 'resource1'
	ORDER BY start_time DESC

![The sys.resource_stats catalog view](./media/sql-database-performance-guidance/sys_resource_stats.png)

This next example shows you different ways that you can use the **sys.resource_stats** catalog view to get information about how your SQL database uses resources:

1. To look at the past week’s resource use for the database "userdb1", you can run this query:

		SELECT *
		FROM sys.resource_stats
		WHERE database_name = 'userdb1' AND
		      start_time > DATEADD(day, -7, GETDATE())
		ORDER BY start_time DESC;

2. To evaluate how well your workload fits the performance level, you need to drill down at each different aspect of the resource metrics: CPU, reads, write, number of workers, and number of sessions. Here's a revised query using sys.resource_stats to report the average and maximum values of these resource metrics:

		SELECT
		    avg(avg_cpu_percent) AS 'Average CPU Utilization In Percent',
		    max(avg_cpu_percent) AS 'Maximum CPU Utilization In Percent',
		    avg(avg_data_io_percent) AS 'Average Physical Data IO Utilization In Percent',
		    max(avg_data_io_percent) AS 'Maximum Physical Data IO Utilization In Percent',
		    avg(avg_log_write_percent) AS 'Average Log Write Utilization In Percent',
		    max(avg_log_write_percent) AS 'Maximum Log Write Utilization In Percent',
		    avg(max_session_percent) AS 'Average % of Sessions',
		    max(max_session_percent) AS 'Maximum % of Sessions',
		    avg(max_worker_percent) AS 'Average % of Workers',
		    max(max_worker_percent) AS 'Maximum % of Workers'
		FROM sys.resource_stats
		WHERE database_name = 'userdb1' AND start_time > DATEADD(day, -7, GETDATE());

3. With this information about the average and maximum values of each resource metric, you can assess how well your workload fits into the performance level you chose. Usually, average values from **sys.resource_stats** give you a good baseline to use against the target size. It should be your primary measurement stick. For example, if you are using the Standard service tier with S2 performance level, the average utilization percentages for CPU and I/O reads and writes are below 40%; the average number of workers is below 50; and the average number of sessions is below 200, your workload might fit into the S1 performance level. It's easy to see if your database fits within the worker and session limits. To see if a database fits into a lower performance level with regards to CPU, reads, and writes, divide the DTU number of the lower performance level by the DTU number of your current performance level, and then multiply the result by 100:

	**S1 DTU / S2 DTU * 100 = 20 / 50 * 100 = 40**

	The result is the relative performance difference between the two performance levels in percentage. If your utilization doesn't exceed this percentage, your workload might fit into the lower performance level. However, you need to look at all ranges of resource usage values, and determine, by percentage, how often your database workload would fit into the lower performance level. The following query outputs the fit percentage per resource dimension, based on the threshold of 40% we calculated in this example.

		SELECT
		    (COUNT(database_name) - SUM(CASE WHEN avg_cpu_percent >= 40 THEN 1 ELSE 0 END) * 1.0) / COUNT(database_name) AS 'CPU Fit Percent'
		    ,(COUNT(database_name) - SUM(CASE WHEN avg_log_write_percent >= 40 THEN 1 ELSE 0 END) * 1.0) / COUNT(database_name) AS 'Log Write Fit Percent'
		    ,(COUNT(database_name) - SUM(CASE WHEN avg_data_io_percent >= 40 THEN 1 ELSE 0 END) * 1.0) / COUNT(database_name) AS 'Physical Data IO Fit Percent'
		FROM sys.resource_stats
		WHERE database_name = 'userdb1' AND start_time > DATEADD(day, -7, GETDATE());

	Based on your database service level objective (SLO), you can decide if your workload fits into the lower performance level. If your database workload SLO is 99.9% and the preceding query returns values greater than 99.9 for all three resource dimensions, your workload is likely to fit into the lower performance level.

	Looking at the fit percentage also gives you insight into whether you have to move to the next higher performance level to meet your SLO. For example, "userdb1" shows the following utilization for the past week.

	| Average CPU percent | Maximum CPU percent |
	|---|---|
	| 24.5 | 100.00 |

	The average CPU is about a quarter of the limit of the performance level, which would fit well into the performance level of the database. But, the maximum value shows that the database reaches the limit of the performance level. Do you need to move to the next higher performance level? Again, you have to look at how many times your workload reaches 100%, and then compare it to your database workload SLO.

		SELECT
		(COUNT(database_name) - SUM(CASE WHEN avg_cpu_percent >= 100 THEN 1 ELSE 0 END) * 1.0) / COUNT(database_name) AS 'CPU Fit Percent'
		,(COUNT(database_name) - SUM(CASE WHEN avg_log_write_percent >= 100 THEN 1 ELSE 0 END) * 1.0) / COUNT(database_name) AS 'Log Write Fit Percent’
		,(COUNT(database_name) - SUM(CASE WHEN avg_data_io_percent >= 100 THEN 1 ELSE 0 END) * 1.0) / COUNT(database_name) AS 'Physical Data IO Fit Percent'
		FROM sys.resource_stats
		WHERE database_name = 'userdb1' AND start_time > DATEADD(day, -7, GETDATE());

	If this query returns a value less than 99.9% for any of the three resource dimensions, consider either moving to the next higher performance level or use application-tuning techniques to reduce the load on the SQL database.

4. This exercise also considers your projected workload increase in the future.

## Tuning your application

In traditional on-premises SQL Server, the process of initial capacity planning often is separated from the process of running an application in production. Hardware and product licenses are purchased first, and performance tuning is done afterward. When using Azure SQL Database, we recommend (and, because you are billed each month, it's likely to your benefit) to interleave the process of running and tuning an application. With the model of paying for capacity on-demand, you can tune your application to use the minimum resources needed now, instead of massively overprovisioning on hardware based on guesses of the future growth plans for an application. Future database resource growth plans often are incorrect because the organization has to predict so far into the future. Some customers might choose not to tune an application and instead choose to overprovision hardware resources. This approach might make sense when you don't want to change a key application during a busy period. But, tuning an application can minimize resource requirements and lower monthly bills when you use the service tiers in Azure SQL Database.

### Application characteristics

Although Azure SQL Database service tiers are designed to improve performance stability and predictability for an application, some best practices can help you tune your application to better take advantage of the resources at a performance level. Although many applications have significant performance gains simply by switching to a higher performance level or service tier, some applications need additional tuning to benefit from a graduated service. You should consider additional application tuning for applications that have the following characteristics for additional performance improvement when you use Azure SQL Database.

- **Applications that have slow performance because of "chatty" behavior**. Chatty applications make excessive data access operations that are sensitive to network latency. You might need to modify these kinds of applications to reduce the number of data access operations to the SQL database. For example, you might improve application performance by using techniques like batching ad-hoc queries or moving the queries to stored procedures. For more information, 'Batching queries'.
- **Databases with an intensive workload that can't be supported by an entire single machine**. Databases that exceed the resources of the highest Premium performance level are not good candidates. These databases might benefit from scaling out the workload. For more information, see 'Cross-database sharding' and 'Functional partitioning'.
- **Applications that contain nonoptimal queries**. Applications, especially those in the data access layer, that have poorly tuned queries might not benefit from a higher performance level. This includes queries that lack a WHERE clause, have missing indexes, or have outdated statistics. These applications benefit from standard query performance-tuning techniques. For more information, see 'Missing indexes' and 'Query tuning and hinting'.
- **Applications that have nonoptimal data access design**. Applications that have inherent data access concurrency issues, for example deadlocking, might not benefit from a higher performance level. Application developers should consider reducing round trips against the Azure SQL Database by caching data on the client side by using the Azure Caching service or another caching technology. See Application tier caching.

## Tuning techniques
This section explains some techniques that you can use to tune Azure SQL Database to gain the best performance for your application and run it at the lowest possible performance level. Some of these techniques match traditional SQL Server tuning best practices, but some techniques are specific to Azure SQL Database. In some cases, you can examine the consumed resources for a database to find areas to further tune and extend traditional SQL Server techniques to work in Azure SQL Database.

### Query Performance Insight and SQL Database Advisor
You'll find two tools on the Azure portal that can help you analyze and fix performance issues with your SQL database:

- [Query Performance Insight](sql-database-query-performance.md)
- [SQL Database Advisor](sql-database-advisor.md)

The Azure portal has more information about both tools and how to use them. In the next two sections, we look at other ways, missing indexes and query tuning, to manually find and correct performance issues. We recommend that you first try the tools on the Azure portal to most efficiently diagnose and correct problems. Use the manual tuning approaches that we discuss next for special cases.

### Missing indexes
A common problem in OLTP database performance relates to the physical database design. Often, database schemas are designed and shipped without testing at scale (either in load or in data volume). Unfortunately, the performance of a query plan might be acceptable on a small scale but might degrade substantially under production-level data volumes. The most common source of this issue is the lack of appropriate indexes to satisfy filters or other restrictions in a query. Often, missing indexes manifests as a table scan when an index seek could suffice.

In this example, the selected query plan uses a scan when a seek would suffice:

	DROP TABLE dbo.missingindex;
	CREATE TABLE dbo.missingindex (col1 INT IDENTITY PRIMARY KEY, col2 INT);
	DECLARE @a int = 0;
	SET NOCOUNT ON;
	BEGIN TRANSACTION
	WHILE @a < 20000
	BEGIN
	    INSERT INTO dbo.missingindex(col2) VALUES (@a);
	    SET @a += 1;
	END
	COMMIT TRANSACTION;
	GO
	SELECT m1.col1
	FROM dbo.missingindex m1 INNER JOIN dbo.missingindex m2 ON(m1.col1=m2.col1)
	WHERE m1.col2 = 4;

![A query plan with missing indexes](./media/sql-database-performance-guidance/query_plan_missing_indexes.png)

Azure SQL Database can help database administrators find and fix common missing index conditions. Dynamic management views (DMVs) built into Azure SQL Database look at query compilations in which an index would significantly reduce the estimated cost to run a query. During query execution, SQL Database tracks how often each query plan is executed, and at the estimated gap between the executing query plan and the imagined one where that index existed. These DMVs allow a database administrator to quickly guess which physical database design changes might improve the overall workload cost for a given database and its real workload.

You can use this query to evaluate potential missing indexes:

	SELECT CONVERT (varchar, getdate(), 126) AS runtime,
	    mig.index_group_handle, mid.index_handle,
	    CONVERT (decimal (28,1), migs.avg_total_user_cost * migs.avg_user_impact *
	            (migs.user_seeks + migs.user_scans)) AS improvement_measure,
	    'CREATE INDEX missing_index_' + CONVERT (varchar, mig.index_group_handle) + '_' +
	              CONVERT (varchar, mid.index_handle) + ' ON ' + mid.statement + '
	              (' + ISNULL (mid.equality_columns,'')
	              + CASE WHEN mid.equality_columns IS NOT NULL
	                          AND mid.inequality_columns IS NOT NULL
	                     THEN ',' ELSE '' END + ISNULL (mid.inequality_columns, '')
	              + ')'
	              + ISNULL (' INCLUDE (' + mid.included_columns + ')', '') AS create_index_statement,
	    migs.*,
	    mid.database_id,
	    mid.[object_id]
	FROM sys.dm_db_missing_index_groups AS mig
	INNER JOIN sys.dm_db_missing_index_group_stats AS migs
	    ON migs.group_handle = mig.index_group_handle
	INNER JOIN sys.dm_db_missing_index_details AS mid
	    ON mig.index_handle = mid.index_handle
	ORDER BY migs.avg_total_user_cost * migs.avg_user_impact * (migs.user_seeks + migs.user_scans) DESC

In this example, it suggested this index:

	CREATE INDEX missing_index_5006_5005 ON [dbo].[missingindex] ([col2])  

After it's created, that same SELECT statement then picks a different plan, which uses a seek instead of a scan, executing more efficiently:

![A query plan with corrected indexes](./media/sql-database-performance-guidance/query_plan_corrected_indexes.png)

The key insight is that the I/O capacity of a shared, commodity system is more limited than a dedicated server machine. There's a premium on minimizing unnecessary I/O to take maximal advantage of the system within the DTU of each performance level of the Azure SQL Database service tiers. Appropriate physical database design choices can significantly improve the latency for individual queries, improve the throughput of concurrent requests you can handle per scale unit, and minimize the costs required to satisfy the query. For more information about the missing index DMVs, see [sys.dm_db_missing_index_details](https://msdn.microsoft.com/library/ms345434.aspx).

### Query tuning and hinting
The query optimizer in Azure SQL Database is similar to the traditional SQL Server query optimizer. Most of the best practices for tuning queries and learning the reasoning model limitations for the query optimizer also apply to Azure SQL Database. If you tune queries in Azure SQL Database, you might get the additional benefit of reducing the aggregate resource demands. Your application might be able to run at a lower cost than an untuned equivalent because it can run at a lower performance level.

An example that is common in SQL Server and which also applies to Azure SQL Database is how the query optimizer "sniffs" parameters during compilation to try to create a more optimal plan. The query optimizer evaluates the current value of a parameter to determine if it can generate a more optimal query plan. Although this strategy often can lead to a query plan that is significantly faster than a plan compiled without known parameter values, the current SQL Server and Azure SQL Database behavior is imperfect. Sometimes the parameter is not sniffed, and sometimes the parameter is sniffed but the generated plan is suboptimal for the full set of parameter values in a workload. Microsoft includes query hints (directives) so that you can specify intent more deliberately and override the default behavior for parameter sniffing. Often, if you use hints, you can fix cases in which the default SQL Server and Azure SQL Database behavior is imperfect for a specific customer workload.

This next example demonstrates how the query processor can generate a plan that is suboptimal both for performance and for resource requirements. It also shows that if you use a query hint, you can reduce query run time and resource requirements for your SQL database.

	DROP TABLE psptest1;
	CREATE TABLE psptest1(col1 int primary key identity, col2 int, col3 binary(200));

	DECLARE @a int = 0;
	SET NOCOUNT ON;
	BEGIN TRANSACTION
	WHILE @a < 20000
	BEGIN
	    INSERT INTO psptest1(col2) values (1);
	    INSERT INTO psptest1(col2) values (@a);
	    SET @a += 1;
	END
	COMMIT TRANSACTION
	CREATE INDEX i1 on psptest1(col2);
	GO

	CREATE PROCEDURE psp1 (@param1 int)
	AS
	BEGIN
	    INSERT INTO t1 SELECT * FROM psptest1
	    WHERE col2 = @param1
	    ORDER BY col2;
	END
	GO

	CREATE PROCEDURE psp2 (@param2 int)
	AS
	BEGIN
	    INSERT INTO t1 SELECT * FROM psptest1 WHERE col2 = @param2
	    ORDER BY col2
	    OPTION (OPTIMIZE FOR (@param2 UNKNOWN))
	END
	GO

	CREATE TABLE t1 (col1 int primary key, col2 int, col3 binary(200));
	GO

The setup code creates a table that contains skewed data distribution. The optimal query plan differs based on which parameter is selected. Unfortunately, the plan caching behavior does not always recompile the query based on the most common parameter value. So, it's possible for a suboptimal plan to be cached and used for many values, even when a different plan would be a better average plan choice. It then creates two stored procedures that are identical, except that one has a special query hint.

**Example, Part 1**

	-- Prime Procedure Cache with scan plan
	EXEC psp1 @param1=1;
	TRUNCATE TABLE t1;

	-- Iterate multiple times to show the performance difference
	DECLARE @i int = 0;
	WHILE @i < 1000
	BEGIN
	    EXEC psp1 @param1=2;
	    TRUNCATE TABLE t1;
	    SET @i += 1;
	END

**Example, Part 2** (We recommend that you wait at least 10 minutes before you try part 2 of the example so that the results are distinct in the resulting telemetry data.)

	EXEC psp2 @param2=1;
	TRUNCATE TABLE t1;

	DECLARE @i int = 0;
	WHILE @i < 1000
	BEGIN
	    EXEC psp2 @param2=2;
	    TRUNCATE TABLE t1;
	    SET @i += 1;
	END

Each part of this example attempts to run a parameterized insert statement 1,000 times (to generate a sufficient load to use as a test data set). When it executes stored procedures, the query processor examines the parameter value that is passed to the procedure during its first compilation (known as parameter "sniffing"). The processor caches the resulting plan and uses it for later invocations, even if the parameter value is different. As a result, the optimal plan might not be used in all cases. Sometimes customers need to guide the optimizer to pick a plan that is better for the average case rather than the specific case from when the query was first compiled. In this example, the initial plan generates a "scan" plan that reads all rows to find each value that matches the parameter.

![Query tuning by using a scan plan](./media/sql-database-performance-guidance/query_tuning_1.png)

Because we executed the procedure with the value 1, the resulting plan was optimal for the value 1 but was suboptimal for all other values in the table. The result likely isn't what you would want if you were to pick each plan randomly, because the plan performs more slowly and uses more resources.

If you run the test with "SET STATISTICS IO ON," the logical scan work in this example is done behind the scenes. You can see that there are 1,148 reads done by the plan (which is inefficient, if the average case is to return just one row).

![Query tuning by using a logical scan](./media/sql-database-performance-guidance/query_tuning_2.png)

The second part of the example uses a query hint to tell the optimizer to use a specific value during the compilation process. In this case, it forces the query processor to ignore the value that is passed as the parameter, and instead to assume an "UNKNOWN”. This means a value that has the average frequency in the table (ignoring skew). The resulting plan is a seek-based plan that is faster and uses fewer resources, on average, than the plan in part 1 of this example.

![Query tuning by using a query hint](./media/sql-database-performance-guidance/query_tuning_3.png)

You can see the effect in the **sys.resource_stats** table (there is a delay from the time that you execute the test and when the data is populated into the table). For this example, part 1 executed during the 22:25:00 time window, and part 2 was executed at 22:35:00. Note that the earlier time window used more resources in that time window than the later one (because of plan efficiency improvements).

	SELECT TOP 1000 *
	FROM sys.resource_stats
	WHERE database_name = 'resource1'
	ORDER BY start_time DESC

![Query tuning example results](./media/sql-database-performance-guidance/query_tuning_4.png)

>[AZURE.NOTE] Although the example is intentionally small, the effect of suboptimal parameters can be substantial, especially on larger databases. The difference, in extreme cases, can be between seconds for fast cases and hours for slow cases.

You can examine **sys.resource_stats** to determine whether the resource for a given test uses more or fewer resources than another test. When comparing data, separate tests by enough time that they are not grouped in the same five-minute time window in the **sys.resource_stats** view. The goal of the exercise is to minimize the total amount of resources used, and not to minimize the peak resources. Generally, optimizing a piece of code for latency also reduces resource consumption. Make sure that the changes you make to an application are necessary, and that the changes don't negatively affect the experience for anyone using query hints in the application.

If a workload has a set of repeating queries, often it makes sense to capture and validate the optimality of your plan choices because it drives the minimum resource size unit required to host the database. After you validate it, occasionally re-examining the plans can help you make sure that they have not degraded. You can learn more about [query hints (Transact-SQL)](https://msdn.microsoft.com/library/ms181714.aspx).

### Cross-database sharding
Because Azure SQL Database runs on commodity hardware, the capacity limits for a single database are lower than for a traditional on-premises SQL Server installation. Some customers use sharding techniques to spread database operations over multiple databases when the operations don't fit in the limits for a single database in Azure SQL Database. Most customers who use sharding techniques on Azure SQL Database split their data on a single dimension across multiple databases. This approach involves understanding that online transaction processing (OLTP) applications often perform transactions that apply to only one row or to a small group of rows within the schema.

>[AZURE.NOTE] SQL Database now provides a library to assist with sharding. For more information, see [Elastic Database client library overview](sql-database-elastic-database-client-library.md).

For example, if a database contains customer, order, and order details (as in the traditional example Northwind database that ships with SQL Server), you could split this data into multiple databases by grouping a customer with the related order and order detail information. You can guarantee that the customer's data stays within a single database. The application would split different customers across databases, effectively spreading the load across multiple databases. With sharding, customers not only can avoid the maximum database size limit, but Azure SQL Database also can process workloads that are significantly larger than the limits of the different performance levels, as long as each individual database fits into its DTU.

Although database sharding doesn't reduce the aggregate resource capacity for a solution, it's highly effective to support very large solutions that are spread over multiple databases. Each database can run at a different performance level to support very large, "effective" databases with high resource requirements.

### Functional partitioning
SQL Server users often combine many functions within a single database. For example, if an application contains logic to manage inventory for a store, that database might contain logic associated with inventory, tracking purchase orders, stored procedures and indexed or materialized views that manage end-of-month reporting, and other functions. This technique makes it easier to administer the database for operations like backup, but it also requires that you size the hardware to handle the peak load across all functions of an application.

Within a scale-out architecture used within Azure SQL Database, it is beneficial to split different functions of an application into different databases. By using this technique, each application can scale independently. As an application becomes busier (and the load on the database increases), the administrator can choose performance levels independently for each function within an application. In the limit, this architecture allows an application to become larger than a single commodity machine can handle by spreading the load across multiple machines.

### Batching queries
For applications that access data in the fashion of high, frequent ad-hoc querying, a substantial chunk of response time is spent on network communication between the application tier and the Azure SQL Database tier. Even when both the application and Azure SQL Database reside in the same data center, the network latency between the two might be magnified by a high number of data access operations. To reduce the network round trips for these data access operations, the application developer should consider the option to batch the ad-hoc queries, or to compile them as stored procedures. If you batch the ad-hoc queries, you can send multiple queries as one large batch in a single trip to Azure SQL Database. If you compile ad-hoc queries in a stored procedure, you could achieve the same result as batching them. Using a stored procedure also gives you the benefit of increasing the chances of caching the query plans in Azure SQL Database to use the stored procedure again.

Some applications are write-intensive. Sometimes you can reduce the total I/O load on a database by considering how to batch writes together. Often, this is as simple as using explicit transactions instead of auto-commit transactions in stored procedures and ad-hoc batches. For an evaluation of different techniques you can use, see [Batching techniques for SQL Database applications in Azure](https://msdn.microsoft.com/library/windowsazure/dn132615.aspx). Experiment with your own workload to find the right model for batching. Be sure to understand that a model might have slightly different transactional consistency guarantees. Finding the right workload that minimizes resource use requires finding the right combination of consistency and performance trade-offs.

### Application-tier caching
Some database applications contain read-heavy workloads. It's possible to use caching layers to reduce the load on the database and potentially reduce the performance level required to support a database by using Azure SQL Database. With [Azure Redis Cache](https://azure.microsoft.com/services/cache/), if you have a read-heavy workload, you can read the data once (or perhaps once per application-tier machine, depending on how it is configured), and then store that data outside of SQL Database. This provides an ability to reduce database load (CPU and read I/O), but there is an effect on transactional consistency because the data being read from the cache might be out of sync with the data in the database. Although in many applications some amount of inconsistency is acceptable, that's not true for all workloads. You should fully understand any application requirements before you implement an application-tier caching strategy.

## Next steps

- For more information about service tiers, see [service tiers](sql-database-service-tiers.md)
- For more information about elastic database pools, see [elastic database pools](sql-database-elastic-pool.md)
- For information about performance and elastic database pools, see [performance considerations for elastic database pools](sql-database-elastic-pool-guidance.md)
