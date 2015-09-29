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
   ms.date="09/29/2015"
   ms.author="sstein"/>

# Azure SQL Database Query Performance Insights


Managing and tuning the performance of relational databases is a challenging task that requires significant expertise and time investment. Query Performance Insights allows you to spend less time troubleshooting database performance by providing the following:​

- Deeper insight into your database's resource (DTU) consumption. 
- The top DTU consuming queries, which can potentially be tuned for improved performance. 
- The ability to drill down into the details of a query.
​

> [AZURE.NOTE] Query Performance Insights is currently in preview and is only available in the [preview portal](https://portal.azure.com/).



## Prerequisites

- Query Performance Insights are only available with Azure SQL Database V12.
- Query Performance Insights requires that [Query Store](https://msdn.microsoft.com/library/dn817826.aspx) is running, so it is enabled automatically when you sign up for Query Performance Insights.
 
 
## Permissions

The following [role-based access control](role-based-access-control-configure.md) permissions are required to use Query Performance Insights: 

- **Reader**, **Owner**, **Contributor**, **SQL DB Contributor** or **SQL Server Contributor** permissions are required to view the top resource consuming queries and charts. 
- **Owner**, **Contributor**, **SQL DB Contributor** or **SQL Server Contributor** permissions are required to view query text.



## Using Query Performance Insights

Query Performance Insights is easy to use:

- Review the list of top resource-consuming queries. 
- Select or clear the individual queries in the list to display them in the overall consumption chart.
- Select an individual query to view it's details.
- **Edit chart** to customize how DTU consumption data is displayed or to show a different time period.



> [AZURE.NOTE] A couple hours of data needs to be captured by Query Store for SQL Database to provide query performance insights. If the database has no activity or Query Store was not active during a certain time period, the charts will be empty when displaying that time period. You may enable Query Store at any time if it is not running.   





## Review top DTU consuming queries

In the [preview portal](https://portal.azure.com) do the following:

1. Browse to a SQL database and click **Query Performance Insights**. 

    ![Query Performance Insights][1]

    The top queries view opens and the list of top DTU consuming queries are listed.

1. Click around the chart for details.<br>The top line shows overall DTU% for the database, while the bars show DTU% consumed by the selected queries. Select or clear individual queries to include or exclude them from the chart.

    ![top queries][2]

1. Optionally, click **Edit chart** to customize how the chart displays data.

## Viewing individual query details

To view query details:

1. Click any query in the list of top queries.<br>The details view opens and the queries DTU consumption is broken down over time. 
3. Click around the chart for details.<br>The top line is overall DTU%, and the bars are DTU% consumed by the selected query.
    
    ![query details][3]

1. Optionally, click **View Script** to see the query text, and click **Edit chart** to customize how the chart displays data.




## Summary

Query Performance Insights helps you understand the impact of your query workload to database resource consumption. With this feature, you will learn about the top consuming queries, and easily identify the ones to fix before they become a problem. Click the **Query Performance Insights** tile on a database blade to see the top resource (DTU) consuming queries. 




## Next steps

Database workloads are dynamic and change continuously. Monitor your queries and continue to fine tune them to refine performance. 

Check out the [Index Advisor](sql-database-index-advisor.md) for additional recommendations for improving the performance of your SQL database.

<!--Image references-->
[1]: ./media/sql-database-query-performance/tile.png
[2]: ./media/sql-database-query-performance/top-queries.png
[3]: ./media/sql-database-query-performance/query-details.png



