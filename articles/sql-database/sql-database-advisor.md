---
title: Performance recommendations - Azure SQL Database | Microsoft Docs
description: The Azure SQL Database provides recommendations for your SQL Databases that can improve current query performance.
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
ms.workload: data-management
ms.date: 07/05/2017
ms.author: sstein

---
# Performance recommendations

Azure SQL Database learns and adapts with your application and provides customized recommendations enabling you to maximize the performance of your SQL databases. Your performance is continuously assessed by analyzing your SQL Database usage history. The recommendations that are provided are based on a database unique workload pattern and help improve its performance.

> [!NOTE]
> Recommended way of using recommendations is by enabling ‘Automatic tuning’ on your database. For details, see [Automatic tuning](sql-database-automatic-tuning.md).
>

## Create index recommendations
Azure SQL Database continuously monitors the queries being executed and identifies the indexes that could improve the performance. Once enough confidence is built that a certain index is missing, a new **Create index** recommendation will be created. Azure SQL Database builds confidence by estimating performance gain the index would bring through time. Depending on the estimated performance gain, recommendations are categorized as High, Medium,  or Low. 

Indexes created using recommendations are always flagged as auto_created indexes. You can see which indexes are auto_created by looking at sys.indexes view. Auto created indexes don’t block ALTER/RENAME commands. If you try to drop the column that has an auto created index over it, the command passes and the auto created index is dropped with the command as well. Regular indexes would block the ALTER/RENAME command on columns that are indexed.

Once the create index recommendation is applied, Azure SQL Database will compare performance of the queries with the baseline performance. If new index brought improvements in the performance, recommendation will be flagged as successful and impact report will be available. In case the index didn’t bring the benefits, it will be automatically reverted. This way Azure SQL Database ensures that using recommendations will only improve the database performance.

Any **Create index** recommendation has a back off policy that won’t allow applying the recommendation if the database or pool DTU usage was above 80% in last 20 minutes or if the storage is above 90% of usage. In this case, the recommendation will be postponed.

## Drop index recommendations
In addition to detecting a missing index, Azure SQL Database continuously analyzes the performance of existing indexes. If index is not used, Azure SQL Database will recommend dropping it. Dropping an index is recommended in two cases:
* Index is a duplicate of another index (same indexed and included column, partition schema, and filters)
* Index is unused for a prolonged period (93 days)

Drop index recommendations also go through the verification after implementation. If the performance is improved the impact report will be available. In case performance degradation is detected, recommendation will be reverted.


## Parameterize queries recommendations
**Parameterize queries** recommendations appear when you have one or more queries that are constantly being recompiled but end up with the same query execution plan. This condition opens up an opportunity to apply forced parameterization, which will allow query plans to be cached and reused in the future improving performance and reducing resource usage. 

Every query issued against SQL Server initially needs to be compiled to generate an execution plan. Each generated plan is added to the plan cache and subsequent executions of the same query can reuse this plan from the cache, eliminating the need for additional compilation. 

Applications that send queries, which include non-parameterized values, can lead to a performance overhead, where for every such query with different parameter values the execution plan is compiled again. In many cases the same queries with different parameter values generate the same execution plans, but these plans are still separately added to the plan cache. Recompiling execution plans use database resources, increase the query duration time and overflow the plan cache causing plans to be evicted from the cache. This behavior of SQL Server can be altered by setting the forced parameterization option on the database. 

To help you estimate the impact of this recommendation, you are provided with a comparison between the actual CPU usage and the projected CPU usage (as if the recommendation was applied). In addition to CPU savings, your query duration decreases for the time spent in compilation. There will also be much less overhead on plan cache, allowing majority of the plans to stay in cache and be reused. You can apply this recommendation quickly and easily by clicking on the **Apply** command. 

Once you apply this recommendation, it will enable forced parameterization within minutes on your database and it starts the monitoring process which approximately lasts for 24 hours. After this period, you will be able to see the validation report that shows CPU usage of your database 24 hours before and after the recommendation has been applied. SQL Database Advisor has a safety mechanism that automatically reverts the applied recommendation in case a performance regression has been detected.

## Fix schema issues recommendations
**Fix schema issues** recommendations appear when the SQL Database service notices an anomaly in the number of schema-related SQL errors happening on your Azure SQL Database. This recommendation typically appears when your database encounters multiple schema-related errors (invalid column name, invalid object name, etc.) within an hour.

“Schema issues” are a class of syntax errors in SQL Server that happen when the definition of the SQL query and the definition of the database schema are not aligned. For example, one of the columns expected by the query may be missing in the target table, or vice versa. 

“Fix schema issue” recommendation appears when Azure SQL Database service notices an anomaly in the number of schema-related SQL errors happening on your Azure SQL Database. The following table shows the errors that are related to schema issues:

| SQL Error Code | Message |
| --- | --- |
| 201 |Procedure or function '*' expects parameter '*', which was not supplied. |
| 207 |Invalid column name '*'. |
| 208 |Invalid object name '*'. |
| 213 |Column name or number of supplied values does not match table definition. |
| 2812 |Could not find stored procedure '*'. |
| 8144 |Procedure or function * has too many arguments specified. |

## Next steps
Monitor your recommendations and continue to apply them to refine performance. Database workloads are dynamic and change continuously. SQL Database advisor continues to monitor and provide recommendations that can potentially improve your database's performance. 

* See [Performance recommendations in the Azure portal](sql-database-advisor-portal.md) for steps on how to use performance recommendations in the Azure portal.
* See [Query Performance Insights](sql-database-query-performance.md) to learn about and view the performance impact of your top queries.

## Additional resources
* [Query Store](https://msdn.microsoft.com/library/dn817826.aspx)
* [CREATE INDEX](https://msdn.microsoft.com/library/ms188783.aspx)
* [Role-based access control](../active-directory/role-based-access-control-what-is.md)

