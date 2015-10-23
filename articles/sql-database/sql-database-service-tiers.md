<properties
   pageTitle="SQL Database Service Tiers"
   description="Compare performance and business continuity features of Azure SQL Database service tiers to find the right balance of cost and capability as you scale on demand with no downtime."
   services="sql-database"
   documentationCenter=""
   authors="shontnew"
   manager="jeffreyg"
   editor="monicar"/>

<tags
   ms.service="sql-database"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="data-management"
   ms.date="10/13/2015"
   ms.author="shkurhek"/>

# SQL Database service tiers

## Overview
[Azure SQL Database](sql-database-technical-overview.md) provides multiple service tiers to handle different types of workloads. You have the option of [creating a single database](sql-database-get-started.md) with defined characteristics and pricing. Or you can manage multiple databases by [creating an elastic database pool](sql-database-elastic-pool-portal.md). In both cases, the tiers include **Basic**, **Standard**, and **Premium**. But the characteristics of these tiers vary based on whether you are creating an individual database or a database within an elastic database pool. This article provides an overview of service tiers in both contexts.

## Service tiers
Basic, Standard, and Premium service tiers all have an uptime SLA of 99.99% and offer predictable performance, flexible business continuity options, security features, and hourly billing. The following table provides examples of the tiers best suited for different application workloads.

| Service tier | Target workloads |
|---|---|
| **Basic** | Best suited for a small size database, supporting typically one single active operation at a given time. Examples include databases used for development or testing, or small scale infrequently used applications. |
| **Standard** | The go-to option for most cloud applications, supporting multiple concurrent queries. Examples include workgroup or web applications. |
| **Premium** | Designed for high transactional volume, supporting a large number of concurrent users and requiring the highest level of business continuity capabilities. Examples are databases supporting mission critical applications. |

>[AZURE.NOTE] Web and Business editions are being retired. Find out how to [upgrade Web and Business editions](sql-database-upgrade-new-service-tiers.md). Please read the [Sunset FAQ](http://azure.microsoft.com/pricing/details/sql-database/web-business/) if you plan to continue using Web and Business Editions.

### Service tiers for single databases
For single databases there are multiple performance levels within each service tier, you have the flexibility to choose the level that best meets your workload’s demands. If you need to scale up or down, you can easily change the tiers of your database in the Azure Portal, with zero-downtime for your application. See [Changing Database Service Tiers and Performance Levels](sql-database-scale-up.md) for details.

Performance characteristics listed here apply to databases created using [SQL Database V12](sql-database-v12-whats-new.md). 

[AZURE.INCLUDE [SQL DB service tiers table](../../includes/sql-database-service-tiers-table.md)]

### Service tiers for elastic database pools
In addition to creating and scaling a single database, you also have the option of managing multiple databases within an [elastic database pool](sql-database-elastic-pool.md). All of the databases in an elastic database pool share a common set of resources. The performance characteristics are measured by *elastic Database Transaction Units* (eDTUs). As with single databases, elastic database pools come in three performance tiers: **Basic**, **Standard**, and **Premium**. For elastic databases these three service tiers still define the overall performance limits and several features.  

Elastic database pools allow these databases to share and consume DTU resources without needing to assign a specific performance level to the databases in the pool. For example, a single database in a Standard pool can go from using 0 eDTUs to the maximum database eDTU (either 100 eDTUs defined by the service tier or a custom number that you configure). This allows multiple databases with varying workloads to efficiently use eDTU resources available to the entire pool. 

The following table describes the characteristics of the elastic database pool service tiers.

[AZURE.INCLUDE [SQL DB service tiers table for elastic databases](../../includes/sql-database-service-tiers-table-elastic-db-pools.md)]

>[AZURE.NOTE] Each database within a pool also adheres to the single-database characteristics for that tier. For example, the Basic pool has a limit for max sessions per pool of 2400 – 28800, but an individual database within that pool has a database limit of 300 sessions (the limit for a single Basic database as specified in the previous section).

## Understanding DTUs

[AZURE.INCLUDE [SQL DB DTU description](../../includes/sql-database-understanding-dtus.md)]

## Monitoring performance
Monitoring the performance of a SQL Database starts with monitoring the resource utilization relative to the performance level you chose for your database. This relevant data is exposed in the following ways:

1.	The Microsoft Azure Management Portal.

2.	Dynamic Management Views in the user database, and in the master database of the server that contains the user database.

In the [Azure Preview portal](https://portal.azure.com/), you can monitor a single database’s utilization by selecting your database and clicking the **Monitoring** chart. This brings up a **Metric** window that you can change by clicking the **Edit chart** button. Add the following metrics:

- CPU Percentage
- DTU Percentage
- Data IO Percentage
- Storage Percentage

Once you’ve added these metrics, you can continue to view them in the **Monitoring** chart with more details on the **Metric** window. All four metrics show the average utilization percentage relative to the **DTU** of your database.

![service tier monitoring](./media/sql-database-service-tiers/sqldb_service_tier_monitoring.png)

You can also configure alerts on the performance metrics. Click the **Add alert** button in the **Metric** window. Follow the wizard to configure your alert. You have the option to alert if the metrics exceeds a certain threshold or if the metric falls below a certain threshold.

For example, if you expect the workload on your database to grow, you can choose to configure an email alert whenever your database reaches 80% on any of the performance metrics. You can use this as an early warning to figure out when you might have to switch to the next higher performance level.

The performance metrics can also help you determine if you are able to downgrade to a lower performance level. Assume you are using a Standard S2 database and all performance metrics show that the database on average does not use more than 10% at any given time. It is likely that the database will work well in Standard S1. However, be aware of workloads that spike or fluctuate before making the decision to move to a lower performance level. 

The same metrics that are exposed in the portal are also available through system views: [sys.resource_stats](https://msdn.microsoft.com/library/dn269979.aspx) in the logical master database of your server, and [sys.dm_db_resource_stats](https://msdn.microsoft.com/library/dn800981.aspx) in the user database (**sys.dm_db_resource_stats** is created in each Basic, Standard, and Premium user database. Web and Business edition databases return an empty result set). Use **sys.resource_stats** if you need to monitor less granular data across a longer period of time. Use **sys.dm_db_resource_stats** if you need to monitor more granular data within a smaller timeframe. For more information, see [Azure SQL Database Performance Guidance](https://msdn.microsoft.com/library/azure/dn369873.aspx).

For elastic database pools, you can monitor individual databases in the pool with the techniques described in this section. But you can also monitor the pool as a whole. For information, see [Monitor and manage an elastic database pool](sql-database-elastic-pool-portal.md#monitor-and-manage-an-elastic-database-pool).

## Next steps
Find out more about the pricing for these tiers on [SQL Database Pricing](http://azure.microsoft.com/pricing/details/sql-database/).

If you are interested in managing multiple databases as a group, consider [elastic database pools](sql-database-elastic-pool-guidance.md) along with the associated [price and performance considerations for elastic database pools](sql-database-elastic-pool-guidance.md).

Now that you know about the SQL Database tiers, try them out with a [free trial](http://azure.microsoft.com/pricing/free-trial/) and learn [how to create your first SQL database](sql-database-get-started.md)!
 
