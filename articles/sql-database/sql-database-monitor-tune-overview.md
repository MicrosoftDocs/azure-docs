---
title: Monitoring & performance tuning - Azure SQL Database | Microsoft Docs
description: Tips for performance tuning in Azure SQL Database through evaluation and improvement.
services: sql-database
author: danimir
manager: craigg
editor: ''
keywords: sql performance tuning, database performance tuning, sql performance tuning tips, sql database performance tuning
ms.service: sql-database
ms.custom: monitor & tune
ms.topic: conceptual
ms.date: 07/16/2018
ms.author: v-daljep
ms.reviewer: carlrab

---
# Monitoring and performance tuning

Azure SQL Database is automatically managed and flexible data service where you can easily monitor usage, add or remove resources (CPU, memory, io), find recommendations that can improve performance of your database, or let database adapt to your workload and automatically optimize performance.

## Overview of monitoring database performance in Azure SQL Database
Monitoring the performance of a SQL database in Azure starts with monitoring the resource utilization relative to the level of database performance you choose. Monitoring helps you  determine whether your database has excess capacity or is having trouble because resources are maxed out, and then decide whether it's time to adjust the compute size and service tiers of your database in the [DTU-based purchasing model](sql-database-service-tiers-dtu.md) or [vCore-based purchasing model](sql-database-service-tiers-vcore.md). You can monitor your database in the [Azure portal](https://portal.azure.com) using the following graphical tools or using SQL [dynamic management views (DMVs)](sql-database-monitoring-with-dmvs.md).

Azure SQL Database enables you to identify opportunities to improve and optimize query performance without changing resources by reviewing [performance tuning recommendations](sql-database-advisor.md). Missing indexes and poorly optimized queries are common reasons for poor database performance. You can apply these tuning recommendations to improve performance of your workload.
You can also let Azure SQL database to [automatically optimize performance of your queries](sql-database-automatic-tuning.md) by applying all identified recommendations and verifying that they improve database performance. You have the following options for monitoring and troubleshooting database performance:

- In the [Azure portal](https://portal.azure.com), click **SQL databases**, select the database, and then use the Monitoring chart to look for resources approaching their maximum. DTU consumption is shown by default. Click **Edit** to change the time range and values shown.
- Use [Query Performance Insight](sql-database-query-performance.md) to identify the queries that spend the most of resources.
- Use [SQL Database Advisor](sql-database-advisor-portal.md) to view recommendations for creating and dropping indexes, parameterizing queries, and fixing schema issues.
- Use [Azure SQL Intelligent Insights](sql-database-intelligent-insights.md) for automatic monitoring of your database performance. Once a performance issue is detected, a diagnostic log is generated with details and Root Cause Analysis (RCA) of the issue. Performance improvement recommendation is provided when possible.
- [Enable automatic tuning](sql-database-automatic-tuning-enable.md) and let Azure SQL database automatically fix identified performance issues.
- You also can use [dynamic management views (DMVs)](sql-database-monitoring-with-dmvs.md), [extended events (`XEvents`)(sql-database/sql-database-xevent-db-diff-from-svr.md), and the [Query Store](https://docs.microsoft.com/sql/relational-databases/performance/monitoring-performance-by-using-the-query-store) to get performance parameters in real time. See [performance guidance](sql-database-performance-guidance.md) to find techniques that you can use to improve performance of Azure SQL Database if you identify some issue using these reports or views.

## Monitor databases using the Azure portal
In the [Azure portal](https://portal.azure.com/), you can monitor a single database’s utilization by selecting your database and clicking the **Monitoring** chart. This brings up a **Metric** window that you can change by clicking the **Edit chart** button. Add the following metrics:

* CPU percentage
* DTU percentage
* Data IO percentage
* Database size percentage

Once you’ve added these metrics, you can continue to view them in the **Monitoring** chart with more information on the **Metric** window. All four metrics show the average utilization percentage relative to the **DTU** of your database. See the [DTU-based purchasing model](sql-database-service-tiers-dtu.md) and [vCore-based purchasing model](sql-database-service-tiers-vcore.md) articles for more information about service tiers.  

![Service tier monitoring of database performance.](./media/sql-database-single-database-monitoring/sqldb_service_tier_monitoring.png)

You can also configure alerts on the performance metrics. Click the **Add alert** button in the **Metric** window. Follow the wizard to configure your alert. You have the option to alert if the metrics exceed a certain threshold or if the metric falls below a certain threshold.

For example, if you expect the workload on your database to grow, you can choose to configure an email alert whenever your database reaches 80% on any of the performance metrics. You can use this as an early warning to figure out when you might have to switch to the next higher compute size.

The performance metrics can also help you determine if you are able to downgrade to a lower compute size. Assume you are using a Standard S2 database and all performance metrics show that the database on average does not use more than 10% at any given time. It is likely that the database will work well in Standard S1. However, be aware of workloads that spike or fluctuate before making the decision to move to a lower compute size.

## Improving database performance with more resources

Finally, if there are no actionable items that can improve performance of your database, you can change the amount of resources available in Azure SQL Database. You can assign more resources by changing the [DTU service tier](sql-database-service-tiers-dtu.md) of a standalone database or increase the eDTUs of an elastic pool at any time. Alternatively, if you're using the [vCore-based purchasing model](sql-database-service-tiers-vcore.md), you can change either the service tier or increase the resources allocated to your database. 
1. For standalone databases, you can [change service tiers](sql-database-service-tiers-dtu.md) or [compute resources](sql-database-service-tiers-vcore.md)on-demand to improve database performance.
2. For multiple databases, consider using [elastic pools](sql-database-elastic-pool-guidance.md) to scale resources automatically.

## Tune and refactor application or database code

You can change application code to more optimally use the database, change indexes, force plans, or use hints to manually adapt the database to your workload. Find some guidance and tips for manual tuning and rewriting the code in the [performance guidance topic](sql-database-performance-guidance.md) article.


## Next steps

- To enable automatic tuning in Azure SQL Database and let automatic tuning feature fully manage your workload, see [Enable automatic tuning](sql-database-automatic-tuning-enable.md).
- To use manual tuning, you can review [Tuning recommendations in Azure portal](sql-database-advisor-portal.md) and manually apply the ones that improve performance of your queries.
- Change resources that are available in your database by changing [Azure SQL Database service tiers](sql-database-performance-guidance.md)
