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

•answer the question “where my DTUs are spent?”/understand the impact of their top queries to the resource consumption of the database over time​

• identify the queries to fix, before (or after) they become a problem ​

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

### Edit Chart

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

> [AZURE.NOTE] To get index recommendations a database needs to have about a week of usage, and within that week there needs to be some activity. There also needs to be some consistent activity as well. The index advisor can more easily optimize for consistent query patterns than it can for random spotty bursts of activity.


Recommendations are sorted by their potential impact on performance into the following 4 categories:

| Impact | Description |
| :--- | :--- |
| High | High impact recommendations should provide the most significant performance impact. |
| Substantial | Substantial impact recommendations should improve performance noticeably. |
| Moderate | Moderate impact recommendations should improve performance, but not substantially. |
| Low | Low impact recommendations should provide better performance than without the index, but improvements might not be significant. 
Use the Impact tag to determine the best candidates for creating new indexes.

### Managing the list of recommended indexes

If your list of recommended indexes contains indexes that you don't think will be beneficial, Index Advisor lets you discard index recommendations (you can add discarded indexes back to the **Recommended indexes** list later if needed).

#### Discard an index recommendation

1. Select the index in the list of **Recommended indexes**.
1. Click **Discard index** on the **Index details** blade.

#### Viewing discarded indexes, and adding them back to the main list

1. On the **Index recommendations** blade click **View discarded index recommendations**.
1. Select a discarded index from the list to view its details.
1. Optionally, click **Undo Discard** to add the index back to the main list of **Index recommendations**.



## Create new indexes

Index Advisor gives you full control over how indexes are created. Each recommendation provides a T-SQL index creation script and you can review exact details of how the index will be created before any action is taken on a database.

Index recommendations are available for all Azure SQL Database servers, but only V12 servers provide automated index creation. Non-V12 servers can still benefit from Index Advisor, but you have to manually create indexes as described below.

For both automatic and manual index creation simply select a recommended index from the **Index recommendations** blade and do the following:

### Automatic index creation (V12 servers only)

If the database is on a V12 server then you can easily create a recommended index by selecting the desired index on the  and then clicking **Create Index**. 

The database remains online during index creation, using Index Advisor to create an index does not take the database offline.

In addition, indexes created with **Create Index** do not require any further performance monitoring. If the index has a negative impact on performance, then the index is reverted automatically. After using Create Index, metrics on the impact of the new index are available in the portal. 


### Manual index creation (all servers)

Select any recommended index in the portal and then click **View Script**. Run this script against your database to create the recommended index. Indexes that are manually created are not monitored and validated for actual performance impact so it is suggested that you monitor these indexes after creation to verify they provide performance gains and adjust or delete them if necessary. For details about creating indexes, see [CREATE INDEX (Transact-SQL)](https://msdn.microsoft.com/library/ms188783.aspx).


### Canceling index creation

Indexes that are in a **Pending** status can be canceled. Indexes that are being created (**Executing** status) cannot be canceled.

1. Select any **Pending** index in the **Index operations** area to open the **Index details** blade.
1. Click **Cancel** to abort the index creation process.

## Monitoring index operations after creating indexes

Creating an index does not happen instantaneously. The portal provides details regarding the status of index operations. When managing indexes the following are possible states that an index can be in:

| Status | Description |
| :--- | :--- |
| Pending | Create index command has been received and the index is scheduled for creation. |
| Executing | The create index command is running and the index is currently being created. |
| Success | The index has successfully been created. |
| Failed | Index has not been created. This can be a transient issue, or possibly a schema change to the table and the script is no longer valid. |
| Reverting | The index creation process has been canceled or has been deemed non-performant and is being automatically reverted. |



![ALT TEXT][4]



## Removing an index
You can remove indexes that have been created with the Index Advisor.


1. Select a successfully created index in the list of **Index operations**.
1. Click **Remove index** on the **Index details** blade, or click **View Script** for a DROP INDEX script.



## Summary

Index recommendations provide an automated experience for managing index creation and analysis for each SQL database and recommending the best indexes. Click the **Index Advisor** tile on a database blade to see index recommendations.



## Next steps

Monitor your index recommendations and continue to apply them to refine performance. Database workloads are dynamic and change continuously. Index advisor will continue to monitor and recommend indexes that can potentially improve your database's performance. 


<!--Image references-->
[1]: ./media/sql-database-query-performance/filename.png
[2]: ./media/sql-database-query-performance/filename.png
[3]: ./media/sql-database-query-performance/filename.png
[4]: ./media/sql-database-query-performance/filename.png



