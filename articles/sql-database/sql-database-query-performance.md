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
   ms.date="07/25/2015"
   ms.author="sstein"/>

# Azure SQL Database Query Performance Insights

> [AZURE.NOTE] Query Performance Insights is currently in preview and is only available in the [preview portal](https://portal.azure.com/).


Query Performance Insights shows the top queries that are consuming DTUs. Identifying resource intensive queries points to areas where there may be opportunities to tune performance of your database. Showing DTU consumption over time helps pinpoint potential issues in some queries.


Managing and tuning the performance of relational databases is a challenging task that requires significant expertise and time investment. Query Performance Insights allows you to spend less time troubleshooting database performance by providing the following:​

- ...where DTUs are consumed (the top most DTU consuming queries).​
- ...which queries can potentially be tuned for increased performance.
- ...the ability to drill down into the details of a query.​



## Prerequisites

- Query performance insights are only available on Azure SQL Database V12 servers only.
- Query Performance Insights requires that Query Store is running. For details, see [Monitoring 
Performance By Using the Query Store](https://msdn.microsoft.com/library/dn817826.aspx).


## Permissions

To view charts and query text, you need the correct [role-based access control](role-based-access-control-configure.md) permissions in Azure. 

- **Reader**, **SQL DB Contributor** permissions are required to view top resource consuming queries and charts.
- **Owner**, **SQL DB Contributor** permissions are required to view query text.


## Using Query Performance Insights

Query Performance Insights is easy to use:

- First review the list of top resource-consuming queries. 
- Select or clear the individual queries in the list to display them in the overall consumption chart.
- Select an individual query to view it's details. 



> [AZURE.NOTE] To provide query performance insight a database needs to have about a week of usage, and within that week there needs to be some activity. There also needs to be some consistent activity as well. 

## Review top DTU consuming queries

In the [preview portal](https://portal.azure.com) do the following:

1. Browse to a SQL database and click **Query Performance Insights** <br>The top queries view opens and the list of top DTU consuming queries are listes. The top line is overall DTU% (all queries), and the bars are DTU% consumed by the selected queries. Select or clear individual queries to include or exclude them from the chart.

    ![Query Performance Insights][1]

1. Click around the chart for details

    ![top queries][2]

1. Optionally, click **Edit chart** to customize how the chart displays data.

## Viewing individual query details

To view query details:

1. Click any query in the list of top queries.<br>The details view opens and the queries DTU consumption is broken down over time. The top line is overall DTU% (all queries), and the bars are DTU% consumed by the selected query.
3. Click around the chart for details.
    
    ![query details][3]

1. Optionally, click **View Script** to see the T-SQL query, and click **Edit chart** to customize how the chart displays data.




## Summary

Query Performance Insights provides an automated experience for identifying and drilling down into the top DTU consuming queries for a SQL database. Click the **Query Performance Insights** tile on a database blade to see the top DTU consuming queries.



## Next steps

Database workloads are dynamic and change continuously. Monitor your queries and continue to fine tune them to refine performance. 

Check out the [Index Advisor](sql-database-index-advisor.md) and [Service Tier Advisor](sql-database-service-tier-advisor.md) for additional recommendations for improving the performance of your SQL database.

<!--Image references-->
[1]: ./media/sql-database-query-performance/tile.png
[2]: ./media/sql-database-query-performance/top-queries.png
[3]: ./media/sql-database-query-performance/query-details.png



