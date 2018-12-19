---
title: Query Performance Insight for Azure SQL Database  | Microsoft Docs
description: Query performance monitoring identifies the most CPU-consuming queries for an Azure SQL database.
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
# Query Performance Insight for Azure SQL Database
Managing and tuning the performance of relational databases takes significant expertise and time investment. Query Performance Insight is a part of the Azure SQL Database intelligent performance product line. It helps you spend less time troubleshooting database performance by providing:

* Deeper insight into your databases resource (DTU) consumption. 
* Details on top database queries by CPU, duration, and execution count (potential tuning candidates for performance improvements).
* The ability to drill down into details of a query, to view the query text and history of resource utilization. 
* Performance tuning annotations that show [SQL Database Advisor](sql-database-advisor.md) performance recommendations.

![Query Performance Insight](./media/sql-database-query-performance/opening-title.png)

> [!TIP]
> For basic Azure SQL Database performance monitoring, we recommend Query Performance Insight. Note the product limitations published in this article. For advanced monitoring of database performance at scale, we recommend [Azure SQL Analytics](../azure-monitor/insights/azure-sql.md). It has built-in intelligence for automated performance troubleshooting. To automatically tune some of the most common database performance issues, we recommend [Automatic Tuning](sql-database-automatic-tuning.md).
>

## Prerequisites
* Query Performance Insight requires that [Query Store](https://msdn.microsoft.com/library/dn817826.aspx) is active on your database. It's automatically enabled for all Azure SQL databases by default. If Query Store is not running, the Azure portal will prompt you to turn it on.

> [!NOTE]
> If the "Query Store is not properly configured on this database" message appears in the portal, see [Optimizing the Query Store configuration](sql-database-query-performance.md#optimizing-the-query-store-configuration-for-query-performance-insight).
>

## Permissions
The following [role-based access control](../role-based-access-control/overview.md) permissions are required to use Query Performance Insight: 

* **Reader**, **Owner**, **Contributor**, **SQL DB Contributor**, or **SQL Server Contributor** permissions are required to view the top resource-consuming queries and charts. 
* **Owner**, **Contributor**, **SQL DB Contributor**, or **SQL Server Contributor** permissions are required to view query text.

## Use Query Performance Insight
Query Performance Insight is easy to use:

1. Open the [Azure portal](https://portal.azure.com/) and find a database that you want to examine. 
2. From the left-side menu, open **Intelligent Performance** > **Query Performance Insight**.
  
   ![Query Performance Insight on the menu](./media/sql-database-query-performance/tile.png)

2. On the first tab, review the list of top resource-consuming queries.
3. Select an individual query to view its details.
4. Open **Intelligent Performance** > **Performance recommendations** and check if any performance improvement recommendations are available. For more information on built-in performance recommendations, see [SQL Database Advisor](sql-database-advisor.md).
5. Use sliders or zoom icons to change the observed interval.

   ![Performance dashboard](./media/sql-database-query-performance/performance.png)

> [!NOTE]
> For SQL Database to render the information in Query Performance Insight, Query Store needs to capture a couple hours of data. If the database has no activity or Query Store was not active during a certain period, the charts will be empty when Query Performance Insight displays that time range. You can enable Query Store at any time if it's not running. For more information, see [Best practices with Query Store](https://docs.microsoft.com/sql/relational-databases/performance/best-practice-with-the-query-store).    
  > 

## Review top CPU-consuming queries

By default, Query Performance Insight shows the top five CPU-consuming queries when you first open it.

1. Select or clear individual queries to include or exclude them from the chart by using check boxes.

    The top line shows overall DTU percentage for the database. The bars show CPU percentage that the selected queries consume during the selected interval. For example, if "**Past week**" is selected, each bar represents a single day.
   
    ![Top queries](./media/sql-database-query-performance/top-queries.png)

   > [!IMPORTANT]
   > The DTU line shown is aggregated to a maximum consumption value within one-hour periods. It's intended for a high-level comparison only with query executions stats. In some cases, DTU utilization might seem too high compared to executed queries, but this might not be the case.
   >
   > For example, if a query maxed out DTU to 100% for a few minutes only, the DTU line in Query Performance Insight will show the entire hour of consumption as 100% (the consequence of the maximum aggregated value). 
   >
   > For a much finer comparison (up to one minute), consider creating a custom DTU utilization chart:
   >
   > 1. In the Azure portal, select **Azure SQL Database** > **Monitoring**. 
   > 2. Select **Metrics**.
   > 3. Select **+Add chart**.
   > 4. Select DTU percentage on the chart. In addition, select **Last 24 hours** on the upper-left menu and change to one minute. 
   > 
   > Use the custom created DTU chart with a finer level of details to compare with the query execution chart.
   >
   
   The bottom grid represents aggregated information for the visible queries:
   
   * Query ID, which is a unique identifier for the query in the database.
   * CPU per query during observable interval, which depends on the aggregation function.
   * Duration per query, which also depends on the aggregation function.
   * Total number of executions for a specific query.
     
2. If your data becomes stale, select the **Refresh** button.

3. Use sliders and zoom buttons to change the observation interval and investigate consumption spikes:

   ![Sliders and zoom buttons for changing the interval](./media/sql-database-query-performance/zoom.png)

4. Optionally, you can select the **Custom** tab to customize the view for:
   
   * Metric (CPU, duration, execution count).
   * Time interval (last 24 hours, past week, or past month). 
   * Number of queries.
   * Aggregation function.
  
   ![Custom tab](./media/sql-database-query-performance/custom-tab.png)
  
5. Select the **Go >** button to see the customized view.

   > [!IMPORTANT]
   > Query Performance Insight is limited to displaying a maximum of the top 5-20 consuming queries, depending on your selection. Your database can execute many more queries beyond the top shown, and these queries will not be included on the chart. 
   >
   > There might exist a database workload type in which lots of smaller queries, beyond the top shown, are executed very frequently and using the majority of DTU. And these queries can't be seen on the performance chart. 
   >
   > For example, there might be a query that consumed a substantial amount of DTU for a while, although its total consumption within the observed period is less than the other top consuming queries. In such a case, resource utilization of this query would not appear on the chart. 
   >
   > If you need to understand top query executions beyond the limitations of Query Performance Insight, consider using [Azure SQL Analytics](../azure-monitor/insights/azure-sql.md) for advanced database performance monitoring and troubleshooting.
   >

## View individual query details

To view query details:

1. Select any query in the list of the top queries shown.
   
    ![List of top queries](./media/sql-database-query-performance/details.png)

   A detailed view opens. It shows the query CPU consumption, duration, and execution count breakdown over time.

3. Select the chart features for details.
   
   * The top chart shows line with overall database DTU percentage, and the bars are CPU percentage that the selected query consumed.
   * The second chart shows the total duration of the selected query.
   * The bottom chart shows the total number of executions by the selected query.
     
   ![Query details](./media/sql-database-query-performance/query-details.png)
     
4. Optionally, use sliders, use zoom buttons, or select **Settings** to customize how query data is displayed, or to pick a different time range.

   > [!IMPORTANT]
   > Query Performance Insight does not capture any DDL queries. In some cases, it might not capture all ad hoc queries.
   >

## Review top queries per duration
The recent update of Query Performance Insight introduced two new metrics that can help you identify potential bottlenecks: duration and execution count.

Long-running queries have the greatest potential for locking resources longer, blocking other users, and limiting scalability. They're also the best candidates for optimization.

To identify long-running queries:

1. Open the **Custom** tab in Query Performance Insight for the selected database.
2. Change the metrics to **duration**.
3. Select the number of queries and the observation interval.
4. Select the aggregation function:

   * **Sum** adds up all query execution time during the whole observation interval.
   * **Max** finds queries in which execution time was maximum at the whole observation interval.
   * **Avg** finds the average execution time of all query executions and shows you the top out of these averages. 

   ![Query duration](./media/sql-database-query-performance/top-duration.png)

5. Select the **Go >** button to see the customized view.

   > [!IMPORTANT]
   > Adjusting the query view will not update the DTU line. The DTU line will always show the maximum consumption value per the interval of granularity. 
   >
   > To understand database DTU consumption with more detail (up to one minute), consider creating a custom chart in the Azure portal:
   >
   > 1. Select **Azure SQL Database** > **Monitoring**.
   > 2. Select **Metrics**. 
   > 3. Select **+Add chart**.
   > 4. Select the DTU percentage on the chart. In addition, select **Last 24 hours** on the upper-left menu and change to one minute. We recommend that you use the custom-created DTU chart to compare with the query performance chart.
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

* These icons are annotations. They represent performance recommendations provided by [SQL Database Advisor](sql-database-advisor.md). By hovering above an annotation, summarized information on performance recommendation is shown.

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

* Consider enabling [Automatic Tuning](sql-database-automatic-tuning.md) for automated tuning of some of the most common database performance issues.
* Learn how [Intelligent Insights](sql-database-intelligent-insights.md) can help automatically troubleshoot database performance issues.
* Consider using [Azure SQL Analytics]( ../azure-monitor/insights/azure-sql.md) for advanced performance monitoring of a large fleet of SQL Databases, elastic pools and Managed Instances with built-in intelligence.

