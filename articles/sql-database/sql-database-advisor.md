---
title: Performance recommendations - Azure SQL Database | Microsoft Docs
description: Azure SQL Database provides recommendations for your SQL databases that can improve current query performance.
services: sql-database
documentationcenter: ''
author: stevestein
manager: jhubbard
editor: monicar

ms.assetid: 1db441ff-58f5-45da-8d38-b54dc2aa6145
ms.service: sql-database
ms.custom: monitor & tune
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: "On Demand"
ms.date: 09/20/2017
ms.author: sstein

---
# Performance recommendations for SQL Database

Azure SQL Database learns and adapts with your application and provides customized recommendations that enable you to maximize the performance of your SQL databases. Your performance is continuously assessed by analyzing your SQL Database usage history. The recommendations that are provided are based on a database-unique workload pattern that helps improve its performance.

> [!TIP]
> [Automatic tuning](sql-database-automatic-tuning.md) is the recommended method for performance tuning. [Intelligent Insights](sql-database-intelligent-insights.md) is the recommended method for monitoring performance. 
>

## Create index recommendations
SQL Database continuously monitors the queries that are running and identifies the indexes that could improve the performance. After there is enough confidence that a certain index is missing, a new **Create index** recommendation is created.

 Azure SQL Database builds confidence by estimating the performance gain the index would bring through time. Depending on the estimated performance gain, recommendations are categorized as high, medium, or low. 

Indexes that are created using recommendations are always flagged as auto-created indexes. You can see which indexes are auto-created by looking at the sys.indexes view. Auto-created indexes don’t block ALTER/RENAME commands. 

If you try to drop the column that has an auto-created index over it, the command passes and the auto-created index is dropped with the command as well. Regular indexes block the ALTER/RENAME command on columns that are indexed.

After the create index recommendation is applied, Azure SQL Database compares the performance of the queries with the baseline performance. If the new index improved performance, the recommendation is flagged as successful and the impact report is available. If the index didn’t improve performance, it is automatically reverted. This is how SQL Database ensures that recommendations improve database performance.

Any **Create index** recommendation has a back-off policy that doesn't allow applying the recommendation if the resource usage of a database or pool is high. The back-off policy takes into account CPU, Data IO, Log IO, and available storage. 

If CPU, Data IO, or Log IO was higher than 80% in last 30 minutes, create index will be postponed. If the available storage will be below 10% after the index is created, the recommendation goes into an error state. If, after a couple of days, automatic tuning still believes that the index would be beneficial, the process starts again. 

This process repeats until there is enough available storage to create an index, or until the index is not seen as beneficial anymore.

## Drop index recommendations
In addition to detecting a missing index, SQL Database continuously analyzes the performance of existing indexes. If an index is not used, Azure SQL Database recommends dropping it. Dropping an index is recommended in two cases:
* The index is a duplicate of another index (same indexed and included column, partition schema, and filters).
* The index hasn't been used for a prolonged period (93 days).

Drop index recommendations also go through the verification after implementation. If the performance improves, the impact report is available. If performance degrades, the recommendation is reverted.


## Parameterize queries recommendations
*Parameterize queries* recommendations appear when you have one or more queries that are constantly being recompiled but end up with the same query execution plan. This condition creates an opportunity to apply forced parameterization. Forced parameterization, in turn, allows query plans to be cached and reused in the future, thus improving performance and reducing resource usage. 

Every query issued against SQL Server initially needs to be compiled to generate an execution plan. Each generated plan is added to the plan cache and subsequent executions of the same query can reuse this plan from the cache, eliminating the need for additional compilation. 

Applications that send queries, which include non-parameterized values, can lead to a performance overhead, where for every such query with different parameter values, the execution plan is compiled again. In many cases, the same queries with different parameter values generate the same execution plans. These plans, however, are still separately added to the plan cache. 

When you recompile execution plans, it use database resources, increases the query duration time, and overflows the plan cache. This, in turn, causes plans to be evicted from the cache. This behavior of SQL Server can be altered by setting the forced parameterization option on the database. 

To help you estimate the impact of this recommendation, you are provided with a comparison between the actual CPU usage and the projected CPU usage (as if the recommendation were applied). In addition to CPU savings, your query duration decreases for the time spent in compilation. There is also be much less overhead on plan cache, allowing the majority of the plans to stay in cache and be reused. You can apply this recommendation quickly by selecting the **Apply** command. 

After you apply this recommendation, it enables forced parameterization within minutes on your database. It starts the monitoring process, which lasts for approximately 24 hours. After this period, you will be able to see the validation report that shows CPU usage of your database 24 hours before and after the recommendation has been applied. SQL Database Advisor has a safety mechanism that automatically reverts the applied recommendation if performance regression has been detected.

## Fix schema issues recommendations (preview)

> [!IMPORTANT]
> Microsoft is in the process of deprecating "Fix schema issue" recommendations. We recommend that you start using [Intelligent Insights](sql-database-intelligent-insights.md) for automatic monitoring of your database performance issues, which include schema issues that previously "Fix schema issue" recommendations covered.
> 

**Fix schema issues** recommendations appear when the SQL Database service notices an anomaly in the number of schema-related SQL errors that are happening on your Azure SQL Database. This recommendation typically appears when your database encounters multiple schema-related errors (invalid column name, invalid object name, and so on) within an hour.

“Schema issues” are a class of syntax errors in SQL Server that happen when the definition of the SQL query and the definition of the database schema are not aligned. For example, one of the columns expected by the query may be missing in the target table, or vice-versa. 

The “Fix schema issue” recommendation appears when Azure SQL Database service notices an anomaly in the number of schema-related SQL errors that are happening on your Azure SQL Database. The following table shows the errors that are related to schema issues:

| SQL Error Code | Message |
| --- | --- |
| 201 |Procedure or function '*' expects parameter '*', which was not supplied. |
| 207 |Invalid column name '*'. |
| 208 |Invalid object name '*'. |
| 213 |Column name or number of supplied values does not match table definition. |
| 2812 |Could not find stored procedure '*'. |
| 8144 |Procedure or function * has too many arguments specified. |

## Next steps
Monitor your recommendations and continue to apply them to refine performance. Database workloads are dynamic and change continuously. SQL Database Advisor continues to monitor and provide recommendations that can potentially improve your database's performance. 

* See [Azure SQL Database automatic tuning](sql-database-automatic-tuning.md) for more information about automatic tuning of database indexes and query execution plans.
* See [Azure SQL Intelligent Insights](sql-database-intelligent-insights.md) for more information about automatically monitoring database performance with automated diagnostics and root cause analysis of performance issues.
* See [Performance recommendations in the Azure portal](sql-database-advisor-portal.md) for more information about how to use performance recommendations in the Azure portal.
* See [Query Performance Insights](sql-database-query-performance.md) to learn about and view the performance impact of your top queries.


