<properties 
   pageTitle="Azure SQL Database Performance Insight | Microsoft Azure" 
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
   ms.date="07/19/2016"
   ms.author="sstein"/>

# SQL Database Performance Insight

Azure SQL Database provides performance tools to help you identify and improve the performance of your databases by providing intelligent tuning actions and recommendations. 

1. Browse to your database in the [Azure Portal](http://portal.azure.com) and click **All settings** > **Performance ** > **Overview** to open the **Performance** page. 


2. Click **Recommendations** to open the [SQL Database Advisor](#sql-database-advisor), and click **Queries** to open [Query Performance Insight](#query-performance-insight).

    ![View Performance](./media/sql-database-performance/entries.png)



## Performance Overview

Clicking on **Overview** or on the **Performance** tile will take you to the performance dashboard for your database. This view provides a summary of your database performance, and helps you with performance tuning and troubleshooting. 

![Performance](./media/sql-database-performance/performance.png)

- The **Recommendations** tile provides a breakdown of tuning recommendations for your database (top 3 recommendations are shown if there are more). Clicking this tile takes you to **SQL Database Advisor**. 
- The **Tuning activity** tile provides a summary of the ongoing and completed tuning actions for your database, giving you a quick view into the history of tuning activity. Clicking this tile takes you to the full tuning history view for your database.
- The **Auto-tuning** tile shows the auto-tuning configuration for your database (which tuning actions are configured to be automatically applied to your database). Clicking this tile opens the automation configuration dialog.
- The **Database queries** tile shows the summary of the query performance for your database (overall DTU usage and top resource consuming queries). Clicking this tile takes you to **Query Performance Insight**.



## SQL Database Advisor


[SQL Database Advisor](sql-database-advisor.md) provides intelligent tuning recommendations that can help improve your database's performance. 

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