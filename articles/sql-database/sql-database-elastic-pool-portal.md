<properties
	pageTitle="Create and manage a SQL Database elastic database pool | Microsoft Azure"
	description="Create a single pool of resources to share across a group of Azure SQL Databases."
	services="sql-database"
	documentationCenter=""
	authors="stevestein"
	manager="jeffreyg"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.devlang="NA"
	ms.date="08/25/2015"
	ms.author="sstein"
	ms.workload="data-management"
	ms.topic="article"
	ms.tgt_pltfrm="NA"/>


# Create and manage an Azure SQL Database elastic database pool

> [AZURE.SELECTOR]
- [Azure portal](sql-database-elastic-pool-portal.md)
- [C#](sql-database-client-library.md)
- [PowerShell](sql-database-elastic-pool-powershell.md)

This article shows you how to create an elastic database pool with the [Azure preview portal](https://portal.azure.com).

Elastic database pools simplify the process of creating, maintaining, and managing both performance and cost for large numbers of databases.


> [AZURE.NOTE] Elastic database pools are currently in preview, and only available with SQL Database V12 servers.




## Prerequisites

To create an elastic database pool you need the following:

- An Azure subscription! If you need an Azure subscription simply click **FREE TRIAL** at the top of this page, and then come back to finish this article.
- An Azure SQL Database version 12 server. If you do not have a V12 server, create one following the steps in this article: [Create your first Azure SQL Database](sql-database-get-started.md).



## Create an elastic database pool

Create an elastic database pool by adding a new pool to a server. You can add multiple pools to a server, but only one (1) server can be associated with each pool. Additionally, all or some of the databases on a server can be added to a pool.


1.	Select a SQL Database V12 server that contains the databases you want to add to the pool.
2.	Create the pool by selecting **add pool** at the top of the **SQL Server** blade.

   ![Create Elastic Pool][1]

## Configure an elastic database pool

Configure the pool by setting the pricing tier, adding databases, and configuring the performance characteristics of the pool.

> [AZURE.NOTE] When you select the **Add pool** command you must accept the terms of the preview by selecting **PREVIEW TERMS** and completing the **Preview Terms** blade. You only need to accept the terms once for each subscription.

   ![Configure elastic pool][2]

## Configure pricing tier

An elastic database pool's pricing tier determines the features available to the elastic databases in the pool, and the maximum number of eDTUs (eDTU MAX), and storage (GBs) available to each database. For details, see [eDTU and storage limits for elastic pools and elastic databases](sql-database-elastic-pool-reference.md#edtu-and-storage-limits-for-elastic-pools-and-elastic-databases).

>[AZURE.NOTE] Currently in the preview, you cannot change the pricing tier of an elastic database pool after it is created. To change the pricing tier for an existing elastic pool create a new elastic pool in the desired pricing tier and migrate the elastic databases to this new pool.

   ![Pricing tier][9]


## Elastic database pool pricing tier recommendations

The SQL Database service evaluates utilization history and recommends one or more elastic database pools when it is more cost effective than using single databases. Pricing tiers with a star (![star][10]) are recommended based on your databases workloads.

If more than one pricing tier is recommended it indicates that multiple elastic database pools should be created. Each recommendation is configured with a unique subset of the server's databases that best fit into the pool.

In addition to simply suggesting an elastic database pool pricing tier, each pool recommendation contains the following:

- Pricing tier for the pool (Basic, Standard, or Premium).
- Appropriate amount of pool eDTUs.
- The database min/max eDTU settings.  
- List of recommended databases.

The service takes the last 30 days of telemetry into account when recommending elastic database pools. For  a database to be considered as a candidate for an elastic database pool it must exist for at least 7 days. Databases that are already in an elastic database pool are not considered as candidates for elastic database pool recommendations.

The service evaluates resource needs and cost effectiveness of moving the single databases in each service tier into elastic database pools of the same tier. For example, all Standard databases on a server are assessed for their fit into a Standard Elastic Pool. This means the service does not make cross-tier recommendations such as moving a Standard database into a Premium pool.

>[AZURE.NOTE] Web and Business databases are mapped to one of the new Basic, Standard, or Premium tiers based on their utilization history and database size. Mapping to the new tiers recommends Web and Business databases to the appropriate pool.


### Add databases

At any time, you can select the specific databases you want to be included in the pool. When you create a new pool, Azure recommends the databases that will benefit from being in a pool and marks them for inclusion. You can add all the databases available on the server or you can select or clear databases from the initial list as desired.

   ![Add databases][5]

When you select a database to be added to a pool, the following conditions must be met:

- The pool must have room for the database (cannot already contain the maximum number of databases). More specifically, the pool must have enough available eDTUs to cover the eDTU guarantee per database (for example, if the eDTU guarantee for the group is 400, and the eDTU guarantee for each database is 10, then the maximum number of databases that are allowed in the pool is 40 (400 eDTUs/10 eDTUs guaranteed per DB = 40 Max databases).
- The current features used by the database must be available in the pool.


### Configure performance

You configure the performance of the pool by setting the performance parameters for both the pool, and the elastic databases in the pool. Keep in mind, that the **Elastic database settings** apply to all databases in the pool.

   ![Configure Elastic Pool][3]

There are three parameters you can set that define the performance for the pool: the eDTU Guarantee for the pool, and the eDTU MIN and eDTU MAX for elastic databases in the pool. The following table describes each, and provides some guidance for how to set them. For specific available value settings , see [elastic database pool reference](sql-database-elastic-pool-reference.md).

| Performance parameter | Description |
| :--- | :--- |
| **POOL eDTU** - eDTU guarantee for the pool | The eDTU guarantee for the pool is the guaranteed number of eDTUs available and shared by all databases in the pool. <br> The specific size of the eDTU guarantee for a group should be provisioned by considering the historical eDTU utilization of the group.  Alternatively, this size can be set by the desired eDTU guarantee per database and utilization of concurrently active databases. The eDTU guarantee for the pool also correlates to the amount of storage available for the pool, for every eDTU that you allocate to the pool, you get a fixed amount of database storage. <br> **What should I set the eDTU guarantee of the pool to?** <br>At minimum, you should set the eDTU guarantee of the pool to ([# of databases] x [average DTU utilization per database]). |
| **eDTU MIN** - eDTU guarantee for each database | The eDTU guarantee per database is the number of eDTUs that a single database in the pool is guaranteed. For example, in Standard pools you can set this guarantee to 0, 10, 20, 50, or 100 eDTUs, or you can choose not to provide a guarantee to databases in the group (eDTU MIN=0). <br> **What should I set the eDTU guarantee per database?** <br> Typically, the eDTU guarantee per database (eDTU MIN) is set to anywhere between 0 and the ([average utilization per database]). The eDTU guarantee per database is a global setting that sets the eDTU guarantee for all databases in the pool. |
| **eDTU MAX** - eDTU cap per database | The eDTU MAX per database is the maximum number of eDTUs that a single database in the pool may use. Set the eDTU cap per database high enough to handle max bursts or spikes that your databases may experience. You can set this cap up to the system limit, which depends on the pricing tier of the pool (1000 eDTUs for Premium). The specific size of this cap should accommodate peak utilization patterns of databases within the group.  Some degree of overcommitting the group is expected since the pool generally assumes hot and cold usage patterns for databases where all databases are not simultaneously peaking.<br> **What should I set the eDTU cap per database to?** <br> Set the eDTU MAX or eDTU cap per database, to ([database peak utilization]). For example, suppose the peak utilization per database is 50 DTUs and only 20% of the 100 databases in the group simultaneously spike to the peak.  If the eDTU cap per database is set to 50 eDTUs, then it is reasonable to overcommit the pool by 5x and set the eDTU guarantee for the group (POOL eDTU) to 1,000 eDTUs. Also worth noting, is that the eDTU cap is not a resource guarantee for a database, it is a eDTU ceiling that can be hit if available. |


## Adding databases into a pool, and removing elastic databases from a pool

After the pool is created, you can add or remove databases in and out of the pool by selecting or clearing databases on the **Add Databases** page.

*After creating a pool you can also use Transact-SQL for creating new elastic databases in the pool, and moving existing databases in and out of a pool. For details see, [Elastic database pool reference - Transact-SQL](sql-database-elastic-pool-reference.md#Transact-SQL).*


## Monitor and manage an elastic database pool

After creating an elastic database pool, you can monitor and manage the pool in the portal by browsing to the list of existing pools and selecting the desired pool.

After creating a pool, you can:

- Select **Configure pool** to change the pool eDTU and eDTU per database settings.
- Select **Create job** and manage the databases in the pool by creating elastic jobs. Elastic jobs facilitate running Transact-SQL scripts against any number of databases in the pool. For more information, see [Elastic database jobs overview](sql-database-elastic-jobs-overview.md).
- Select **Manage jobs** to administer existing elastic jobs.



![Monitor elastic pool][8]




![Monitor elastic pool][4]

When you select an existing pool you can see resource utilization of the pool.
Click the **Resource Utilization** chart to open the **Metric** blade where you can customize the chart and setup alerts.


![resource utilization][6]

Click **Edit chart** to add parameters so you can easily view telemetry data for the pool.


![edit chart][7]




## Next steps
After creating an elastic database pool, you can manage the databases in the pool by creating elastic jobs. Elastic jobs facilitate running Transact-SQL scripts against any number of databases in the pool. For more information, see [Elastic database jobs overview](sql-database-elastic-jobs-overview.md).



## Additional resources

- [SQL Database elastic pool](sql-database-elastic-pool.md)
- [Create a SQL Database elastic pool with PowerShell](sql-database-elastic-pool-powershell.md)
- [Create and manage SQL Database with C#](sql-database-client-library.md)
- [Elastic database reference](sql-database-elastic-pool-reference.md)


<!--Image references-->
[1]: ./media/sql-database-elastic-pool-portal/new-elastic-pool.png
[2]: ./media/sql-database-elastic-pool-portal/configure-elastic-pool.png
[3]: ./media/sql-database-elastic-pool-portal/configure-performance.png
[4]: ./media/sql-database-elastic-pool-portal/monitor-elastic-pool.png
[5]: ./media/sql-database-elastic-pool-portal/add-databases.png
[6]: ./media/sql-database-elastic-pool-portal/metric.png
[7]: ./media/sql-database-elastic-pool-portal/edit-chart.png
[8]: ./media/sql-database-elastic-pool-portal/configure-pool.png
[9]: ./media/sql-database-elastic-pool-portal/pricing-tier.png
[10]: ./media/sql-database-elastic-pool-portal/star.png
