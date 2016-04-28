<properties 
   pageTitle="Azure SQL Database Performance" 
   description="The Azure SQL Database provides performance tools to help you identify areas that can improve current query performance." 
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
   ms.date="04/27/2016"
   ms.author="sstein"/>

# SQL Database Performance

Azure SQL Database provides performance tools to help you identify and improve the performance of your databases by providing intelligent tuning actions and recommendations. 

Browse to your database in the [Azure Portal](http://portal.azure.com) and click **All settings** > **Performance Overview** to open the **Performance** page. 


- Click the **Recommendations** tile to open the [SQL Database Advisor](#sql-database-advisor).
- Click the **Database queries** chart to open [Query Performance Insight](#query-performance-insight).

    ![Performance](./media/sql-database-performance/performance.png)


## SQL Database Advisor


[SQL Database Advisor](sql-database-index-advisor.md) provides recommendations that can help improve your database's performance. 

- Recommendations on which indexes to create or drop (and an option to apply index recommendations automatically without any user interaction and automatically rolling back recommendations that have a negative impact on performance).
- Recommendations when schema issues are identified in the database.
- Recommendations when queries can benefit from parameterized queries.




## Query Performance Insight

[Query Performance Insight](sql-database-query-performance.md) allows you to spend less time troubleshooting database performance by providing:

- Deeper insight into your databases resource (DTU) consumption. 
- The top CPU consuming queries, which can potentially be tuned for improved performance. 
- The ability to drill down into the details of a query. 


## Additional resources

- [Azure SQL Database performance guidance for single databases](sql-database-performance-guidance.md)
- [When should an elastic database pool be used?](sql-database-elastic-pool-guidance.md)