---
title: Monitoring & performance tuning - Azure SQL Database | Microsoft Docs
description: Tips for performance tuning in Azure SQL Database through evaluation and improvement.
services: sql-database
documentationcenter: ''
author: v-shysun
manager: felixwu
editor: ''
keywords: sql performance tuning, database performance tuning, sql performance tuning tips, sql database performance tuning

ms.assetid: eb7b3f66-3b33-4e1b-84fb-424a928a6672
ms.service: sql-database
ms.custom: monitor & tune
ms.workload: data-management
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/13/2017
ms.author: v-shysun

---
# Monitoring and performance tuning

Azure SQL Database is automatically managed and flexible data service where you can easily monitor usage, add or remove resources (CPU, memory, io), find recommendations that can improve performance of your database, or let database adapt to your workload and automatically optimize performance.

This article provides overview of monitoring and performance tuning options that are available in Azure SQL Database.

[!INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## Monitoring and troubleshooting database performance

Azure SQL Database enables you to easily monitor your database usage and identify queries that might cause the performance issues. You can monitor database performance using Azure portal or system views. You have the following options for monitoring and troubleshooting database performance:

1. In the [Azure portal](https://portal.azure.com), click **SQL databases**, select the database, and then use the Monitoring chart to look for resources approaching their maximum. DTU consumption is shown by default. Click **Edit** to change the time range and values shown.
2. Use [Query Performance Insight](sql-database-query-performance.md) to identify the queries that spend the most of resources.
3. You can use dynamic management views (DMVs), Extended Events (`XEvents`), and the Query Store in SSMS to get performance parameters in real time.

See the [performance guidance topic](sql-database-performance-guidance.md) to find techniques that you can use to improve performance of Azure SQL Database if you identify some issue using these reports or views.

> [!IMPORTANT] 
> It is recommended that you always use the latest version of Management Studio to remain synchronized with updates to Microsoft Azure and SQL Database. [Update SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx).
>

## Optimize database to improve performance

Azure SQL Database enables you to identify opportunities to improve and optimize query performance without changing resources by reviewing [performance tuning recommendations](sql-database-advisor.md). Missing indexes and poorly optimized queries are common reasons for poor database performance. You can apply these tuning recommendations to improve performance of your workload.
You can also let Azure SQL database to [automatically optimize performance of your queries](sql-database-automatic-tuning.md) by applying all identified recommendations and verifying that they improve database performance. 
You can use the following options to improve performance of your database:

1. Use [SQL Database Advisor](sql-database-advisor-portal.md) to view recommendations for creating and dropping indexes, parameterizing queries, and fixing schema issues.
2. [Enable automatic tuning](sql-database-automatic-tuning-enable.md) and let Azure SQL database automatically fix identified performance issues.

## Improving database performance with more resources

Finally, if there are no actionable items that can improve performance of your database, you can change the amount of resources available in Azure SQL Database. You can assign more resources by changing the [service tier](sql-database-service-tiers.md) of a standalone database or increase the eDTUs of an elastic pool at any time.
1. For standalone databases, you can [change service tiers](sql-database-service-tiers.md) on-demand to improve database performance.
2. For multiple databases, consider using [elastic pools](sql-database-elastic-pool-guidance.md) to scale resources automatically.

## Tune and refactor application or database code

You can change application code to more optimally use the database, change indexes, force plans, or use hints to manually adapt the database to your workload. Find some guidance and tips for manual tuning and rewriting the code in the [performance guidance topic](sql-database-performance-guidance.md) article.


## Next steps

- To enable automatic tuning in Azure SQL Database and let automatic tuning feature fully manage your workload, see [Enable automatic tuning](sql-database-automatic-tuning-enable.md).
- To use manual tuning, you can review [Tuning recommendations in Azure portal](sql-database-advisor-portal.md) and manually apply the ones that improve performance of your queries.
- Change resources that are available in your database by changing [Azure SQL Database service tiers](sql-database-performance-guidance.md)