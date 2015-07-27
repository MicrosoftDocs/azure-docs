<properties 
   pageTitle="Azure SQL Database Query Performance Insights" 
   description="Query performance monitoring identifies the most DTU-consuming queries in an Azure SQL Database’s workload." 
   services="sql-database" 
   documentationCenter="" 
   authors="stevestein" 
   manager="jeffreyg" 
   editor="monicar"/>

<tags
   ms.service="sql-database"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="data-management" 
   ms.date="07/20/2015"
   ms.author="sstein"/>

# SQL Database Query Performance Insights

Azure SQL Database Query Performance Insights helps you understand and tune performance of your database by showing the resource (DTU) consumption of top resource consuming queries over time, and helps pinpoint the potential issues with additional details for each query.

Query Performance Insights gives tuning hints* for top resource consumers.

Managing and tuning the performance of relational databases is a challenging task that requires significant expertise and time investment from the users. ​

Azure SQL DB Workload Insight is aiming to make DB performance tuning easy and simple by providing a rich set of intelligent and automated experiences that take care of this on users behalf. ​

The goals of Query Performance Insights are to help users:​

- answer the question “where my DTUs are spent?”/understand the impact of their top queries to the resource consumption of the database over time​

- identify the queries to fix, before (or after) they become a problem 

- identify most DTU consuming queries

- drill down into the details of a query​

Query Performance Insights allows the users to spend less time troubleshooting their database performance and focus time and energy on making an impact to the bottom line of their business.​


The SQL Database service assesses query performance by analyzing historical resource usage for a SQL Database and identifies the queries that are consuming the most resources (DTUs).



Query performance insoghts makes index management easier by providing recommendations on which indexes to create. For V12 servers, Index advisor can also create and validate indexes with just a few clicks in the [Azure Portal](https://portal.azure.com/). After the index is created, the SQL Database service analyzes performance of the database workload and provides details of the impact of the new index. If the analysis determines that a recommended index has a negative impact on performance, then the index is reverted automatically.

Index advisor allows you to spend less time tuning your database performance.


> [AZURE.NOTE] Query Performance Insights is currently in preview and is only available in the [Azure Portal](https://portal.azure.com/).


## Preview considerations

The index advisor is currently in preview and has the following limitations:

-
- Recommendations ...

## Prerequisites

-  Query performance insights are only available on Azure SQL Database V12 servers only.

To view and create index recommendations, you need the correct [role-based access control](role-based-access-control-configure.md) permissions in Azure. 

- **Reader**, **SQL DB Contributor** permissions are required to view recommendations.
- **Owner**, **SQL DB Contributor** permissions are required to execute any actions; create or drop indexes and cancel index creation.


## Using Query Performance Insights

Query Performance Insights is easy to use. To simplify performance tuning for your database follow these guidelines:

- First review the list of top resource-consuming queries. 
- Select or clear the individual queries in the list to display them in the overall consumption chart.
- Select an individual query to view it's details. 


### Review the list of top resource consuming queries



Portal
SQL Databases
Select Database
Query Performance Insights tile
 - sign up for preview





## Review Top Consuming Queries

Top consuming queries


## Viewing Query Details

view query details

•User can choose to see details for a single query, including resource consumption over time and query text​


•User can clearly and easily understand how query performance changed over time​


•User can change the period to observe, as well as baseline function


## Edit Chart

## Viewing Optimizing Hints

view hints

•User may see optimization hints for some queries ​

•User may see hints that performance can be improved by creating index (link to Index Advisor) or changing service tier (link to Service Tier Advisor)​

•User may see active hints next to impacted query or on the top of the blade ​


## Security Model


•Open QPI, view charts ->requires SQL DB Read permissions​


•See query text -> requires SQL DB Write permissions​



---
Index advisor provides a list of index recommendations on the database blade in the [Azure Portal](https://portal.azure.com/). The top selected recommendations are shown for each table in the selected database where creating a new index may provide performance gains.

### To review currently available index recommendations:

1. Sign in to the [Azure Portal](https://portal.azure.com/).
2. Click **BROWSE** in the left menu.
3. Click **SQL databases** in the **Browse** blade.
4. On the **SQL databases** blade, click the database that you want to review recommended indexes for.
5. Click **Index Advisor** to open and view the available **Index recommendations** for the selected database.

> [AZURE.NOTE] To provide query performance insight a database needs to have about a week of usage, and within that week there needs to be some activity. There also needs to be some consistent activity as well. 


Recommendations are sorted by their potential impact on performance into the following 4 categories:

| Impact | Description |
| :--- | :--- |
| High | High impact recommendations should provide the most significant performance impact. |
| Substantial | Substantial impact recommendations should improve performance noticeably. |
| Moderate | Moderate impact recommendations should improve performance, but not substantially. |
| Low | Low impact recommendations should provide better performance than without the index, but improvements might not be significant. 
Use the Impact tag to determine the best candidates for creating new indexes.



## Summary

Index recommendations provide an automated experience for managing index creation and analysis for each SQL database and recommending the best indexes. Click the **Index Advisor** tile on a database blade to see index recommendations.



## Next steps

Monitor your index recommendations and continue to apply them to refine performance. Database workloads are dynamic and change continuously. Index advisor will continue to monitor and recommend indexes that can potentially improve your database's performance. 


<!--Image references-->
[1]: ./media/sql-database-query-performance/filename.png
[2]: ./media/sql-database-query-performance/filename.png
[3]: ./media/sql-database-query-performance/filename.png
[4]: ./media/sql-database-query-performance/filename.png



