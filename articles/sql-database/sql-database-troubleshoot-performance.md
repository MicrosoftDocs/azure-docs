<properties
	pageTitle="Troubleshoot database performance in Azure SQL Database."
	description="Quick steps to troubleshoot database performance."
	services="sql-database"
	documentationCenter=""
	authors="v-shysun"
	manager="msmets"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/28/2016"
	ms.author="v-shysun"/>

# Troubleshoot database performance using Azure SQL Database
You can change the [service tier](sql-database-service-tiers.md) of a single database or increase the eDTUs of an elastic database pool at any time to improve performance, but you may want to identify opportunities to improve and optimize query performance first. Missing indexes and poorly optimized queries are common reasons for poor database performance.

## Steps to evaluate and tune database performance
1.	In the [Azure Portal](https://portal.azure.com), click **SQL databases**, select the database, and then use the Monitoring chart to look for resources approaching their maximum. DTU consumption is shown by default. Click **Edit** to change the time range and values shown.
2.	Use [Query Performance Insight](sql-database-query-performance.md) to evaluate the queries using DTUs, and then use [Index Advisor](sql-database-index-advisor.md) to recommend and create indexes.
3.	You can use dynamic management views (DMVs), Extended Events (Xevents), and the Query Store in SSMS to get performance parameters in real time. See the [performance guidance topic](sql-database-performance-guidance.md) for detailed monitoring and tuning tips.

## Steps to improve database performance with more resources
1.	For single databases, you can [change service tiers](sql-database-scale-up.md) on-demand to improve database performance.
2.	For multiple databases, consider using [elastic database pools](sql-database-elastic-pool-guidance.md) to scale resources automatically.

If performance problems continue, contact support to open a support case.
