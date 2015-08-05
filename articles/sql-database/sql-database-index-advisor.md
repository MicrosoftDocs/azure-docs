<properties 
   pageTitle="Azure SQL Database Index Advisor" 
   description="Index recommendations are provided that can easily create indexes that are best suited for running an existing Azure SQL Database’s workload." 
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
   ms.date="06/30/2015"
   ms.author="sstein"/>

# SQL Database Index Advisor

The Azure SQL Database Index Advisor recommends new indexes for your existing SQL Databases that can improve current query performance.

The SQL Database service assesses index performance by analyzing historical resource usage for a SQL Database and the indexes that are best suited for running the database’s typical workload are recommended.

Index advisor makes index management easier by providing recommendations on which indexes to create. For V12 servers, Index advisor can also create and validate indexes with just a few clicks in the [Azure Portal](https://portal.azure.com/). After the index is created, the SQL Database service analyzes performance of the database workload and provides details of the impact of the new index. If the analysis determines that a recommended index has a negative impact on performance, then the index is reverted automatically.

Index advisor allows you to spend less time tuning your database performance.


> [AZURE.NOTE] Index Advisor is currently in preview and is only available in the [Azure Portal](https://portal.azure.com/).


## Preview considerations

The index advisor is currently in preview and has the following limitations:

- Index recommendations can be automatically created and validated for V12 servers only (recommendations and index creation scripts are provided for V12 servers).
- Recommendations and management are available for non-clustered indexes only.

## Prerequisites

To view and create index recommendations, you need the correct [role-based access control](role-based-access-control-configure.md) permissions in Azure. 

- **Reader**, **SQL DB Contributor** permissions are required to view recommendations.
- **Owner**, **SQL DB Contributor** permissions are required to execute any actions; create or drop indexes and cancel index creation.


## Using Index Advisor

Index Advisor is easy to use. To simplify index management for your database follow these guidelines:

- First review the list of index recommendations and decide which indexes to create or ignore. The list of recommendations are sorted and labeled by their estimated performance impact (detailed below). 
- Create or ignore recommended indexes. Automatically create the index by clicking **Create Index** in the portal, or manually create the index by running the index creation script.
- For manually created indexes, you should monitor the creation process and measure the performance impact. For automatically created indexes, monitoring and performance impact analysis is performed automatically by the Azure SQL Database service. 



## Review Recommended Indexes

Index advisor provides a list of index recommendations on the database blade in the [Azure Portal](https://portal.azure.com/). The top selected recommendations are shown for each table in the selected database where creating a new index may provide performance gains.

### To review currently available index recommendations:

1. Sign in to the [Azure Portal](https://portal.azure.com/).
2. Click **BROWSE** in the left menu.
3. Click **SQL databases** in the **Browse** blade.
4. On the **SQL databases** blade, click the database that you want to review recommended indexes for.
5. Click **Index Advisor** to open and view the available **Index recommendations** for the selected database.

> [AZURE.NOTE] To get index recommendations a database needs to have about a week of usage, and within that week there needs to be some activity. There also needs to be some consistent activity as well. The index advisor can more easily optimize for consistent query patterns than it can for random spotty bursts of activity.

![Recommended Indexes][3]

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

If the database is on a V12 server then you can easily create a recommended index by selecting the desired index on the portal and then clicking **Create Index**. 

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



![Recommended Indexes][4]



## Removing an index
You can remove indexes that have been created with the Index Advisor.


1. Select a successfully created index in the list of **Index operations**.
1. Click **Remove index** on the **Index details** blade, or click **View Script** for a DROP INDEX script.



## Summary

Index recommendations provide an automated experience for managing index creation and analysis for each SQL database and recommending the best indexes. Click the **Index Advisor** tile on a database blade to see index recommendations.



## Next steps

Monitor your index recommendations and continue to apply them to refine performance. Database workloads are dynamic and change continuously. Index advisor will continue to monitor and recommend indexes that can potentially improve your database's performance. 


<!--Image references-->
[1]: ./media/sql-database-index-advisor/index-recommendations.png
[2]: ./media/sql-database-index-advisor/index-details.png
[3]: ./media/sql-database-index-advisor/recommended-indexes.png
[4]: ./media/sql-database-index-advisor/index-operations.png



