---
title: Query performance insights for Azure SQL Database | Microsoft Docs
description: Query performance monitoring identifies the most CPU-consuming queries for an Azure SQL Database.
services: sql-database
ms.service: sql-database
ms.subservice: performance
ms.custom:
ms.devlang: 
ms.topic: conceptual
author: danimir
ms.author: danil
ms.reviewer: jrasnik, carlrab
manager: craigg
ms.date: 04/01/2018
---
# Azure SQL Database Query Performance Insight
Managing and tuning the performance of relational databases is a challenging task that requires significant expertise and time investment. Query Performance Insight is a part of Azure SQL Database intelligent performance product line allowing you to spend less time troubleshooting database performance by providing the following:

* Deeper insight into your databases resource (DTU) consumption. 
* Details on top database queries by CPU, duration, and execution count (potential tuning candidates for performance improvements).
* Ability to drill down into details of a query, view the query text and history of resource utilization. 
* Performance tuning annotations showing [SQL Azure Database Advisor](sql-database-advisor.md) performance recommendations.

![opening](./media/sql-database-query-performance/opening-title.png)

> [!TIP]
> Query Performance Insight is the recommended method for basic Azure SQL Database performance monitoring needs. Please note product limitations published on this page. [Azure SQL Analytics](../azure-monitor/insights/azure-sql.md) is the recommended method for advanced monitoring of database performance at scale, with built-in intelligence for automated performance troubleshooting. [Automatic tuning](sql-database-automatic-tuning.md) is the recommended method to automatically tune some of the most common database performance issues.
>

## Prerequisites
* Query Performance Insight requires that [Query Store](https://msdn.microsoft.com/library/dn817826.aspx) is active on your database. It is automatically enabled for all Azure SQL Databases by default. In case Query Store is not running for some reason, the portal will prompt you to turn it on.

  > [!NOTE]
  > In case of "Query Store is not properly configured on this database." message shown in the portal, see [Optimizing the Query Store configuration](sql-database-query-performance.md#optimizing-the-query-store-configuration-for-query-performance-insight) at the bottom of this page.
  >

## Permissions
The following [role-based access control](../role-based-access-control/overview.md) permissions are required to use Query Performance Insight: 

* **Reader**, **Owner**, **Contributor**, **SQL DB Contributor**, or **SQL Server Contributor** permissions are required to view the top resource consuming queries and charts. 
* **Owner**, **Contributor**, **SQL DB Contributor**, or **SQL Server Contributor** permissions are required to view query text.

## Using Query Performance Insight
Query Performance Insight is easy to use:

* Open [Azure portal](https://portal.azure.com/) and find a database that you would like to examine. 
  * From the left-hand side menu, open **Intelligent Performance** > **Query performance insight**
  
  ![qpi_menu](./media/sql-database-query-performance/tile.png)
* On the first tab, review the list of top resource-consuming queries.
* Select an individual query to view its details.
* Open **Intelligent Performance** > **Performance recommendations** and check if any performance improvement recommendations are available. For more information on built-in performance recommendations, see [SQL Azure Database Advisor](sql-database-advisor.md).
* Use sliders or zoom icons to change the observed interval.

    ![performance dashboard](./media/sql-database-query-performance/performance.png)

  > [!NOTE]
  > A couple hours of data needs to be captured by Query Store for SQL Database to render the information in Query Performance Insight. If the database has no activity or Query Store was not active during a certain period, the charts will be empty when displaying that time range. You may enable Query Store at any time if it is not running, see [Best practices with Query Store](https://docs.microsoft.com/sql/relational-databases/performance/best-practice-with-the-query-store).    
  > 

## Review top CPU consuming queries

Query Performance Insight by default shows the top 5 CPU consuming queries when first accessed.

1. Select or clear individual queries to include or exclude them from the chart using checkboxes.

    The top line shows overall DTU% for the database, while the bars show CPU% consumed by the selected queries during the selected interval (for example, if "**Past week**" is selected, each bar represents a single day).
   
    ![top queries](./media/sql-database-query-performance/top-queries.png)

   > [!IMPORTANT]
   > DTU line shown is aggregated to a maximum consumption value within one-hour periods. It is intended for a high-level comparison only with query executions stats. There might be cases in which DTU utilization might seem too high compared to executed queries, while this perhaps might not be the case.
   > For example, if there was a query that maxed out DTU to 100% for a few minutes only, the DTU line in Query Performance Insight will show the entire hour of consumption as 100% (the consequence of the max. aggregated value). For a much finer comparison (up to one minute), consider creating a custom DTU utilization chart. In Azure portal click on 1. Azure SQL Database > Monitoring, 2. Click on Metrics, 3. Click on +Add chart, 4. select DTU percentage on the chart. In addition, click on “Last 24 hours” on the top left-hand side menu and change to one minute. Use the custom created DTU chart with a finer level of details to compare with the query execution chart.
   >
     
    The bottom grid represents aggregated information for the visible queries.
   
   * Query ID - unique identifier of query inside database.
   * CPU per query during observable interval (depends on aggregation function).
   * Duration per query (depends on aggregation function).
   * Total number of executions for a specific query.
     
2. If your data becomes stale, click the **Refresh** button.

3. Use sliders and zoom buttons to change observation interval and investigate consumption spikes:

   ![settings](./media/sql-database-query-performance/zoom.png)

4. Optionally, you can select **Custom** tab to customize the view for:
   
   * Metric (CPU, duration, execution count)
   * Time interval (Last 24 hours, Past week, Past month). 
   * Number of queries.
   * Aggregation function.
  
     ![settings](./media/sql-database-query-performance/custom-tab.png)
  
5. Click on the "Go >" button to see the customized view.

     > [!IMPORTANT]
     > Query Performance Insight is limited to displaying a maximum of the top 5-20 consuming queries, depending on your selection. Your database could execute many more queries beyond the top shown and these queries will not be included on the chart. There could exist a database workload type in which lots of smaller queries, beyond the top shown, are executed very frequently and using majority of DTU which consequently could not be seen on the performance chart.
     > For example, there could be a query that consumed a substantial amount of DTU for a while, although its total consumption within the observed period is less than the other top consuming queries. In such case, resource utilization of this query would not be shown on the chart.
     > In case you need to understand top query executions beyond the limitations of Query Performance Insight, consider using [Azure SQL Analytics](../azure-monitor/insights/azure-sql.md) for advanced database performance monitoring and troubleshooting.

## Viewing individual query details

To view query details:

1. Click on any query in the list of the top queries shown.
   
    ![details](./media/sql-database-query-performance/details.png)

2. Detailed view opens, and the query CPU consumption, duration and execution count breakdown are shown over time.

3. Click at the chart features for details.
   
   * Top chart shows line with overall database DTU%, and the bars are CPU% consumed by the selected query.
   * Second chart shows total duration by the selected query.
   * Bottom chart shows total number of executions by the selected query.
     
     ![query details](./media/sql-database-query-performance/query-details.png)
     
4. Optionally, use sliders, zoom buttons or click **Settings** to customize how query data is displayed, or to pick a different time range.

   > [!IMPORTANT]
   > Query Performance Insight does not capture any DDL queries, and in some cases may not capture all ad-hoc queries.
   >

## Review top queries per duration
In the recent update of Query Performance Insight, we introduced two new metrics that can help you identify potential bottlenecks: duration and execution count.

Long-running queries have the greatest potential for locking resources longer, blocking other users, and limiting scalability. They are also the best candidates for optimization.

To identify long running queries:

1. Open **Custom** tab in Query Performance Insight for selected database
2. Change metrics to be **duration**
3. Select number of queries and the observation interval.
4. Select aggregation function:

   * **Sum** adds up all query execution time during whole observation interval.
   * **Max** finds queries which execution time was maximum at whole observation interval.
   * **Avg** finds average execution time of all query executions and show you the top out of these averages. 

   ![query_duration](./media/sql-database-query-performance/top-duration.png)

5. Click on the "Go >" button to see the customized view.

   > [!IMPORTANT]
   > Custom adjusting the query view will not update the DTU line. The DTU line will always show maximum consumption value per the interval of granularity. To understand database DTU consumption with more granularity (up to one minute), consider creating a custom chart in Azure portal by clicking on 1. Azure SQL Database > Monitoring, 2. Click on Metrics, 3. Click on +Add chart, 4. select DTU percentage on the chart. In addition, click on “Last 24 hours” on the top left hand side menu and change to one minute. It is recommended that such custom created DTU chart is used to compare with the query performance chart.
   >

## Review top queries per execution count
High number of executions might not be affecting database itself and resources usage can be low, but overall application might get slow.

In some cases, a very high execution count may lead to increase of network round trips. Round trips significantly affect performance. They are subject to network latency and to downstream server latency. 

For example, many data-driven Web sites heavily access the database for every user request. While connection pooling helps, the increased network traffic and processing load on the database server can adversely affect performance.  General advice is to keep round trips to an absolute minimum.

To identify frequently executed (“chatty”) queries:

1. Open **Custom** tab in Query Performance Insight for selected database
2. Change metrics to be **execution count**
3. Select number of queries and observation interval
4. Click on the "Go >" button to see the customized view.

   ![query execution count](./media/sql-database-query-performance/top-execution.png)

## Understanding performance tuning annotations

While exploring your workload in Query Performance Insight, you might notice icons with a vertical line on top of the chart.

* These icons are annotations. They represent performance recommendations provided by [SQL Azure Database Advisor](sql-database-advisor.md). By hovering above an annotation, summarized information on performance recommendation is shown.

   ![query annotation](./media/sql-database-query-performance/annotation.png)

* If you would like to understand more, or apply the advisor recommendation, click on the icon to open details of the recommended action. If this is an active recommendation, you can apply it right away from the portal.

   ![query annotation details](./media/sql-database-query-performance/annotation-details.png)

### Multiple annotations.

In some cases, due to the zoom level it is possible that annotations close one to another are collapsed into a single annotation. This will be represented by a group annotation icon. Clicking on the group annotation icon will open a new blade where list of grouped annotations will be shown.

Correlating queries and performance tuning actions may help you to better understand your workload. 

## Optimizing the Query Store configuration for Query Performance Insight

While using the Query Performance Insight, you might encounter the following Query Store error messages:

* "Query Store is not properly configured on this database. Click here to learn more."
* "Query Store is not properly configured on this database. Click here to change settings." 

These messages usually appear when Query Store is not able to collect new data. 

The first case happens when Query Store is in the Read-Only state and parameters are set optimally. You can fix this by increasing the size of data store, or by clearing Query Store (in this case all previously collected telemetry will be lost). 

   ![qds details](./media/sql-database-query-performance/qds-off.png)

The second case happens when Query Store is Off, or parameters are not set optimally. You can change the Retention and Capture policy, and also enable Query Store by executing commands provided below from [SSMS](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms) tool, or the Azure portal:

### Recommended retention and capture policy
There are two types of retention policies:

* Size based - if set to AUTO it will clean data automatically when near maximum size is reached.
* Time based - by default this is set to 30 days, which means that if Query Store runs out of space, it will delete query information older than 30 days.

Capture policy could be set to:

* **All** - Captures all queries.
* **Auto** - Infrequent queries and queries with insignificant compile and execution duration are ignored. Thresholds for execution count, compile and runtime duration are internally determined. This is the default option.
* **None** - Query Store stops capturing new queries, however runtime stats for already captured queries are still collected.

We recommend setting all policies to AUTO and clean policy to 30 days by executing the following commands from [SSMS](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms), or Azure portal (replace YourDB with database name):

```T-SQL
    ALTER DATABASE [YourDB] 
    SET QUERY_STORE (SIZE_BASED_CLEANUP_MODE = AUTO);

    ALTER DATABASE [YourDB] 
    SET QUERY_STORE (CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30));

    ALTER DATABASE [YourDB] 
    SET QUERY_STORE (QUERY_CAPTURE_MODE = AUTO);
```

Increase size of Query Store. This could be performed by connecting to a database using [SSMS](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms), or Azure portal and executing the following query (replace YourDB with database name):

```T-SQL
    ALTER DATABASE [YourDB]
    SET QUERY_STORE (MAX_STORAGE_SIZE_MB = 1024);
```

Applying these settings will eventually make Query Store collect telemetry for new queries. In case you need Query Store operational right way, you may optionally choose to clear Query Store by execuring the query below using SSMS, or Azure portal (replace YourDB with database name):

> [!NOTE]
> Executing the following query will delete all previously collected monitored telemetry in Query Store. 
> 

```T-SQL
    ALTER DATABASE [YourDB] SET QUERY_STORE CLEAR;
```

## Summary
Query Performance Insight helps you understand the impact of query workload and how it relates to the database resource consumption. With this feature, you will learn about the top consuming queries on your database, and easily identify queries to optimize before they become an issue.

## Next steps

* For database performance recommendations, click on the [Recommendations](sql-database-advisor.md) within the Query Performance Insight navigation blade.

    ![Performance Advisor](./media/sql-database-query-performance/ia.png)

* Consider enabling [Automatic tuning](sql-database-automatic-tuning.md) for automated tuning of some of the most common database performance issues.
* Learn how [Intelligent Insights](sql-database-intelligent-insights.md) can help automatically troubleshoot database performance issues.
* Consider using [Azure SQL Analytics]( ../azure-monitor/insights/azure-sql.md) for advanced performance monitoring of a large fleet of SQL Databases, elastic pools and Managed Instances with built-in intelligence.

