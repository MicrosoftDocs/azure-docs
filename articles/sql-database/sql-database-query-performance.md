---
title: Query performance insights for Azure SQL Database  | Microsoft Docs
description: Query performance monitoring identifies the most CPU-consuming queries for an Azure SQL Database.
services: sql-database
ms.service: sql-database
ms.subservice: performance
ms.custom:
ms.devlang: 
ms.topic: conceptual
author: danimir
ms.author: danil
ms.reviewer: carlrab
manager: craigg
ms.date: 04/01/2018
---
# Azure SQL Database Query Performance Insight
Managing and tuning the performance of relational databases is a challenging task that requires significant expertise and time investment. Query Performance Insight allows you to spend less time troubleshooting database performance by providing the following:

* Deeper insight into your databases resource (DTU) consumption. 
* The top queries by CPU/Duration/Execution count, which can potentially be tuned for improved performance.
* The ability to drill down into the details of a query, view its text and history of resource utilization. 
* Performance tuning annotations that show actions performed by [SQL Azure Database Advisor](sql-database-advisor.md)  

> [!TIP]
> Query Performance Insights is the recommended method for basic Azure SQL Database performance monitoring needs. Please note product limitations published on this page. [Azure SQL Analytics](../azure-monitor/insights/azure-sql.md) is the recommended method for advanced monitoring of database performance at scale, with built-in intelligence for automated performance troubleshooting. [Automatic tuning](sql-database-automatic-tuning.md) is the recommended method to automatically tune some of the most common database performance issues.
>

## Prerequisites
* Query Performance Insight requires that [Query Store](https://msdn.microsoft.com/library/dn817826.aspx) is active on your database. It is automatically enabled for all Azure SQL Databases by default. In case Query Store is not running for some reason, the portal will prompt you to turn it on.

> [!NOTE]
>Perhaps the most common reason for Query Store to stop running is filling up the available data space. In case this happens, Query Store will be in Read-Only state. To resolve, consider increasing Query Store data space or flushing the existing data collected, see [Optimizing the Query Store configuration](sql-database-query-performance.md#optimizing-the-query-store-configuration-for-query-performance-insight) at the bottom of this article.
>

## Permissions
The following [role-based access control](../role-based-access-control/overview.md) permissions are required to use Query Performance Insight: 

* **Reader**, **Owner**, **Contributor**, **SQL DB Contributor**, or **SQL Server Contributor** permissions are required to view the top resource consuming queries and charts. 
* **Owner**, **Contributor**, **SQL DB Contributor**, or **SQL Server Contributor** permissions are required to view query text.

## Using Query Performance Insight
Query Performance Insight is easy to use:

* Open [Azure portal](https://portal.azure.com/) and find a database that you would like to examine. 
  * From the left-hand side menu, open **Intelligent Performance** > **Query performance insight**
* On the first tab, review the list of top resource-consuming queries.
* Select an individual query to view its details.
* Open **Intelligent Performance** > **Performance recommendations** and check if any performance improvement recommendations are available. For more information on built-in performance recommendations, see [SQL Azure Database Advisor](sql-database-advisor.md).
* Use sliders or zoom icons to change observed interval.

    ![performance dashboard](./media/sql-database-query-performance/performance.png)

> [!NOTE]
> A couple hours of data needs to be captured by Query Store for SQL Database to provide query performance insights. If the database has no activity or Query Store was not active during a certain time period, the charts will be empty when displaying that particular time period. You may enable Query Store at any time if it is not running, see [Best practices with Query Store](https://docs.microsoft.com/en-us/sql/relational-databases/performance/best-practice-with-the-query-store).    
> 

## Review top CPU consuming queries
In Azure portal, perform these steps:

1. Browse to a SQL database and click **Intelligent Performance** > **Query performance insight**. 
   
    ![Query Performance Insight][1]
   
    The top queries view opens and the top CPU consuming queries are listed.
2. Click around the chart for details.<br>The top line shows overall DTU% for the database, while the bars show CPU% consumed by the selected queries during the selected interval (for example, if **Past week** is selected each bar represents one day).
   
    ![top queries][2]
   
    The bottom grid represents aggregated information for the visible queries.
   
   * Query ID - unique identifier of query inside database.
   * CPU per query during observable interval (depends on aggregation function).
   * Duration per query (depends on aggregation function).
   * Total number of executions for a particular query.
     
     Select or clear individual queries to include or exclude them from the chart using checkboxes.
3. If your data becomes stale, click the **Refresh** button.
4. You can use sliders and zoom buttons to change observation interval and investigate spikes:
    ![settings](./media/sql-database-query-performance/zoom.png)
5. Optionally, if you would like to see a different view, you can select **Custom** tab and set:
   
   * Metric (CPU, duration, execution count)
   * Time interval (Last 24 hours, Past week, Past month). 
   * Number of queries.
   * Aggregation function.
     
     ![settings](./media/sql-database-query-performance/custom-tab.png)

> [!IMPORTANT]
>**Product limitation:** It is important to note that Query Performance Insight is limited to displaying a maximum of the top 5 - 20 running queries, depending on your selection. Your database could execute many more queries beyond the top shown and it is important to note that these will not be included on the chart. There could exist a performance degradation case in which lots of smaller queries, beyond the top shown, are executed very frequently and using majority of DTU. Consequently, this could not be seen from the Query Performance Insight chart. For example, a very small query (beyond the top queries shown) could be executed several million of times and consume 99% of your database DTU. This tool is intended to be a basic performance monitoring tool suited for a majority of the most common performance issues, however it is not suited to monitor advanced performance degradations such is this one. To upgrade your monitoring experience for cases such as this one, consider using [Azure SQL Analytics](../azure-monitor/insights/azure-sql) as an advanced database performance monitoring solution.
>

## Viewing individual query details
To view query details:

1. Click any query in the list of top queries.
   
    ![details](./media/sql-database-query-performance/details.png)
2. The details view opens and the queries CPU consumption/Duration/Execution count is broken down over time.
3. Click around the chart for details.
   
   * Top chart shows line with overall database DTU%, and the bars are CPU% consumed by the selected query.
   * Second chart shows total duration by the selected query.
   * Bottom chart shows total number of executions by the selected query.
     
     ![query details][3]
4. Optionally, use sliders, zoom buttons or click **Settings** to customize how query data is displayed, or to pick a different time period.

## Review top queries per duration
In the recent update of Query Performance Insight, we introduced two new metrics that can help you identify potential bottlenecks: duration and execution count.<br>

Long-running queries have the greatest potential for locking resources longer, blocking other users, and limiting scalability. They are also the best candidates for optimization.<br>

To identify long running queries:

1. Open **Custom** tab in Query Performance Insight for selected database
2. Change metrics to be **duration**
3. Select number of queries and observation interval
4. Select aggregation function
   
   * **Sum** adds up all query execution time during whole observation interval.
   * **Max** finds queries which execution time was maximum at whole observation interval.
   * **Avg** finds average execution time of all query executions and show you the top out of these averages. 
     
     ![query duration][4]

## Review top queries per execution count
High number of executions might not be affecting database itself and resources usage can be low, but overall application might get slow.

In some cases, very high execution count may lead to increase of network round trips. Round trips significantly affect performance. They are subject to network latency and to downstream server latency. 

For example, many data-driven Web sites heavily access the database for every user request. While connection pooling helps, the increased network traffic and processing load on the database server can adversely affect performance.  General advice is to keep round trips to an absolute minimum.

To identify frequently executed queries (“chatty”) queries:

1. Open **Custom** tab in Query Performance Insight for selected database
2. Change metrics to be **execution count**
3. Select number of queries and observation interval
   
    ![query execution count][5]

## Understanding performance tuning annotations
While exploring your workload in Query Performance Insight, you might notice icons with vertical line on top of the chart.<br>

These icons are annotations; they represent performance affecting actions performed by [SQL Azure Database Advisor](sql-database-advisor.md). By hovering annotation, you get basic information about the action:

![query annotation][6]

If you want to know more or apply advisor recommendation, click the icon. It will open details of action. If it’s an active recommendation you can apply it straight away using command.

![query annotation details][7]

### Multiple annotations.
It’s possible, that because of zoom level, annotations that are close to each other will get collapsed into one. This will be represented by special icon, clicking it will open new blade where list of grouped annotations will be shown.
Correlating queries and performance tuning actions can help to better understand your workload. 

## Optimizing the Query Store configuration for Query Performance Insight
During your use of Query Performance Insight, you might encounter the following Query Store messages:

* "Query Store is not properly configured on this database. Click here to learn more."
* "Query Store is not properly configured on this database. Click here to change settings." 

These messages usually appear when Query Store is not able to collect new data. 

First case happens when Query Store is in Read-Only state and parameters are set optimally. You can fix this by increasing size of Query Store or clearing Query Store.

![qds button][8]

Second case happens when Query Store is Off or parameters aren’t set optimally. <br>You can change the Retention and Capture policy and enable Query Store by executing commands below or directly from portal:

![qds button][9]

### Recommended retention and capture policy
There are two types of retention policies:

* Size based - if set to AUTO it will clean data automatically when near max size is reached.
* Time based - by default we will set it to 30 days, which means, if Query Store will run out of space, it will delete query information older than 30 days

Capture policy could be set to:

* **All** - Captures all queries.
* **Auto** - Infrequent queries and queries with insignificant compile and execution duration are ignored. Thresholds for execution count, compile and runtime duration are internally determined. This is the default option.
* **None** - Query Store stops capturing new queries, however runtime stats for already captured queries are still collected.

We recommend setting all policies to AUTO and clean policy to 30 days:

    ALTER DATABASE [YourDB] 
    SET QUERY_STORE (SIZE_BASED_CLEANUP_MODE = AUTO);

    ALTER DATABASE [YourDB] 
    SET QUERY_STORE (CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30));

    ALTER DATABASE [YourDB] 
    SET QUERY_STORE (QUERY_CAPTURE_MODE = AUTO);

Increase size of Query Store. This could be performed by connecting to a database and issuing following query:

    ALTER DATABASE [YourDB]
    SET QUERY_STORE (MAX_STORAGE_SIZE_MB = 1024);

Applying these settings will eventually make Query Store collecting new queries, however if you don’t want to wait you can clear Query Store. 

> [!NOTE]
> Executing following query will delete all current information in the Query Store. 
> 
> 

    ALTER DATABASE [YourDB] SET QUERY_STORE CLEAR;


## Summary
Query Performance Insight helps you understand the impact of your query workload and how it relates to database resource consumption. With this feature, you will learn about the top consuming queries, and easily identify the ones to fix before they become a problem.

## Next steps
For additional recommendations about improving the performance of your SQL database, click [Recommendations](sql-database-advisor.md) on the **Query Performance Insight** blade.

![Performance Advisor](./media/sql-database-query-performance/ia.png)

<!--Image references-->
[1]: ./media/sql-database-query-performance/tile.png
[2]: ./media/sql-database-query-performance/top-queries.png
[3]: ./media/sql-database-query-performance/query-details.png
[4]: ./media/sql-database-query-performance/top-duration.png
[5]: ./media/sql-database-query-performance/top-execution.png
[6]: ./media/sql-database-query-performance/annotation.png
[7]: ./media/sql-database-query-performance/annotation-details.png
[8]: ./media/sql-database-query-performance/qds-off.png
[9]: ./media/sql-database-query-performance/qds-button.png

