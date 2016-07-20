<properties 
   pageTitle="Azure SQL Database Advisor" 
   description="The Azure SQL Database Advisor provides recommendations for your existing SQL Databases that can improve current query performance." 
   services="sql-database" 
   documentationCenter="" 
   authors="stevestein" 
   manager="jhubbard" 
   editor="monicar"/>

<tags
   ms.service="sql-database"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="data-management" 
   ms.date="06/22/2016"
   ms.author="sstein"/>

# SQL Database Advisor

> [AZURE.SELECTOR]
- [SQL Database Advisor Overview](sql-database-advisor.md)
- [Portal](sql-database-advisor-portal.md)

The Azure SQL Database provides recommendations for creating and dropping indexes, parameterizing queries, and fixing schema issues. The SQL Database Advisor assesses performance by analyzing your SQL database's usage history. The recommendations that are best suited for running your database’s typical workload are recommended. 

The following recommendations are available for V12 servers (recommendations are not available for V11 servers). Currently you can set the create and drop index recommendations to be applied automatically, see [Automatic index management](sql-database-advisor-portal.md#enable-automatic-index-management) for details.

## Create Index recommendations 

**Create Index** recommendations appear when the SQL Database service detects a missing index that if created, can benefit your databases workload (non-clustered indexes only).

## Drop Index recommendations

**Drop Index** recommendations appear when the SQL Database service detects duplicate indexes (currently in preview and applies to duplicate indexes only).

## Parameterize queries recommendations

**Parameterize queries** recommendations appear when the SQL Database service detects that you have one or more queries that are constantly being recompiled but end up with the same query execution plan. This opens up an opportunity to apply forced parameterization, which will allow  query plans to be cached and reused in the future improving performance and reducing resource usage. 

Every query issued against SQL Server initially needs to be compiled in order to generate an execution plan that will be used to execute the query. Each generated plan is added to the plan cache and subsequent executions of the same query can reuse this plan from the cache, eliminating the need for additional compilation. 

Applications that send queries which include non-parameterized values can lead to a performance overhead, where for every such query with different parameter values the execution plan is compiled again. In a lot of cases the same queries with different parameter values generate the same execution plans, but these plans are still separately added to the plan cache. These recompiles use database resources, increase the query duration time and overflow the plan cache causing plans to be evicted from the cache. This behavior of SQL Server can be altered by setting the forced parameterization option on the database. 

To help you estimate the impact of this recommendation, you are provided with a comparison between the actual CPU usage and the projected CPU usage (as if the recommendation was applied). In addition to CPU savings, your query duration will decrease for the time spent in compilation. There will also be much less overhead on plan cache, allowing majority of the plans to stay in cache and be reused. You can apply this recommendation quickly and easily by clicking on the “Apply” command. 

Once you apply this recommendation it will enable forced parametrization within minutes on your database and it will start the monitoring process which approximately lasts for 24 hours. After this period you will be able to see the validation report that shows CPU usage of your database 24 hours before and after the recommendation has been applied. SQL Database Advisor has a safety mechanism that will automatically revert the applied recommendation in case a performance regression has been detected.

## Fix schema issues recommendations

**Fix schema issues** recommendations appear when the SQL Database service notices an anomaly in the number of schema related SQL errors happening on your Azure SQL Database. This recommendation typically appears when your database encounters multiple schema-related errors (invalid column name, invalid object name, etc...) within an hour.

“Schema issues” are a class of syntax errors in SQL Server that happen when the definition of the SQL query and the definition of the database schema are not aligned (for example, one of the columns expected by the query may be missing in the target table, or vice versa). 

“Fix schema issue” recommendation appears when Azure SQL Database service notices an anomaly in the number of schema related SQL errors happening on your Azure SQL Database. Table below shows the errors that are related to schema issues:

|SQL Error Code|Message|
|--------------|-------|
|201|Procedure or function '*' expects parameter '*', which was not supplied.|
|207|Invalid column name '*'.|
|208|Invalid object name '*'. |
|213|Column name or number of supplied values does not match table definition. |
|2812|Could not find stored procedure '*'. |
|8144|Procedure or function * has too many arguments specified. |

## Next steps

Monitor your recommendations and continue to apply them to refine performance. Database workloads are dynamic and change continuously. SQL Database advisor will continue to monitor and provide recommendations that can potentially improve your database's performance. 

 - See [SQL Database Advisor in the Azure portal](sql-database-advisor-portal.md) for steps on how to use SQL Database Advisor in the Azure portal.
 - See [Query Performance Insights](sql-database-query-performance.md) to learn about view the performance impact of your top queries.

## Additional resources

- [Query Store](https://msdn.microsoft.com/library/dn817826.aspx)
- [CREATE INDEX](https://msdn.microsoft.com/library/ms188783.aspx)
- [Role-based access control](../active-directory/role-based-access-control-configure.md)



